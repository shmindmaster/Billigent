import { Router } from 'express';
import fs from 'fs';
import path from 'path';

interface CorpusItem { source:string; url?:string; category?:string; notes?:string; [k:string]:any }

// Naive in-memory corpus + keyword scorer (dev-only, zero security/compliance guarantees)
const corpus: CorpusItem[] = [];
let loaded = false;

function loadCorpusOnce() {
  if (loaded) return;
  const candidatePaths = [
    path.resolve(__dirname, '../../../docs/research/corpus.jsonl'), // src -> backend -> apps -> root/docs
    path.resolve(process.cwd(), 'docs/research/corpus.jsonl')
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(l=>l.trim());
        for (const line of lines) {
          try { corpus.push(JSON.parse(line)); } catch {/* ignore bad line */}
        }
        loaded = true;
        break;
      } catch (e) {
        // ignore
      }
    }
  }
}

loadCorpusOnce();

function score(query:string, item:CorpusItem):number {
  const qTerms = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const text = `${item.source} ${item.category||''} ${item.notes||''}`.toLowerCase();
  let hits = 0;
  for (const t of qTerms) if (text.includes(t)) hits++;
  return hits / (qTerms.length || 1);
}

function search(query:string, k=5) {
  return corpus
    .map(c=>({ item:c, s: score(query,c) }))
    .filter(r=>r.s>0)
    .sort((a,b)=> b.s - a.s)
    .slice(0,k)
    .map(r=>r.item);
}

function synthesizeAnswer(query:string, top:CorpusItem[]):string {
  if (!top.length) return `No in-memory sources matched '${query}'.`;
  const bulletLines = top.map(t=>`- ${t.source}${t.category?` [${t.category}]`:''}: ${t.notes?.slice(0,180)}`);
  return [
    `Query: ${query}`,
    'Top Sources (naive keyword match):',
    ...bulletLines,
    '',
    'Naive Answer:',
    `Based on ${top.length} matching sources, focus on: ${top.map(t=>t.category||t.source).slice(0,3).join(', ')}.`
  ].join('\n');
}

const router = Router();

router.get('/ping', (_req,res)=>{
  res.json({ status:'ok', corpusItems: corpus.length });
});

router.get('/search', (req,res)=>{
  const q = (req.query.q as string)||'';
  if (!q) return res.status(400).json({ error:'q required' });
  const results = search(q, Number(req.query.k)||5);
  res.json({ query:q, count:results.length, results });
});

router.get('/rag', (req,res)=>{
  const q = (req.query.q as string)||'';
  if (!q) return res.status(400).json({ error:'q required' });
  const results = search(q, Number(req.query.k)||5);
  const answer = synthesizeAnswer(q, results);
  res.json({ query:q, answer, sources: results });
});

export default router;
