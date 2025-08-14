/**
 * Minimal KPI Rules DSL tokenizer + parser skeleton based on spec.
 * Grammar (subset):
 *   RULE      := 'rule' IDENT '{' CLAUSES '}'
 *   CLAUSES   := (WHEN_CLAUSE ACTION_CLAUSE)
 *   WHEN_CLAUSE := 'when' EXPR
 *   ACTION_CLAUSE := 'then' ACTION
 *   EXPR := IDENT OP NUMBER (basic)
 *   OP := '>' | '<' | '>=' | '<=' | '==' | '!='
 * This is deliberately tiny; future iterations: logical AND/OR, time windows, aggregates.
 */

export type ComparisonOp = '>' | '<' | '>=' | '<=' | '==' | '!=';
export interface DslRule {
  name: string;
  left: string; // metric id
  op: ComparisonOp;
  right: number;
  action: { type: 'emit_event'; eventType: string };
}

interface Token { type: string; value: string }

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const regex = /\s+|([{}])|(rule|when|then)|([><!=]=|[><!=])|([A-Za-z_][A-Za-z0-9_:-]*)|(\d+\.?\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input))) {
    if (m[1]) tokens.push({ type: 'brace', value: m[1] });
    else if (m[2]) tokens.push({ type: 'kw', value: m[2] });
    else if (m[3]) tokens.push({ type: 'op', value: m[3] });
    else if (m[4]) tokens.push({ type: 'ident', value: m[4] });
    else if (m[5]) tokens.push({ type: 'number', value: m[5] });
  }
  return tokens;
}

class Cursor {
  i = 0;
  constructor(private tokens: Token[]) {}
  peek() { return this.tokens[this.i]; }
  consume(type?: string): Token {
    const t = this.tokens[this.i];
    if (!t) throw new Error('Unexpected end of input');
    if (type && t.type !== type) throw new Error(`Expected ${type} got ${t.type}`);
    this.i++; return t;
  }
}

export function parseRule(input: string): DslRule {
  const tokens = tokenize(input);
  const c = new Cursor(tokens);
  c.consume('kw'); // rule
  const name = c.consume('ident').value;
  c.consume('brace'); // {
  c.consume('kw'); // when
  const left = c.consume('ident').value;
  const opToken = c.consume('op').value as ComparisonOp;
  const rightRaw = c.consume('number').value;
  const right = Number(rightRaw);
  c.consume('kw'); // then
  // action simplified: emit_event EVENTTYPE
  const actionType = c.consume('ident').value; // expect emit_event
  if (actionType !== 'emit_event') throw new Error('Only emit_event action supported');
  const eventType = c.consume('ident').value;
  c.consume('brace'); // }
  return { name, left, op: opToken, right, action: { type: 'emit_event', eventType } };
}

export function evaluate(rule: DslRule, metrics: Record<string, number>, emit: (eventType: string, payload: any) => void) {
  const current = metrics[rule.left];
  if (current === undefined) return;
  const pass = compare(current, rule.op, rule.right);
  if (pass) emit(rule.action.eventType, { metric: rule.left, value: current, threshold: rule.right });
}

function compare(a: number, op: ComparisonOp, b: number): boolean {
  switch (op) {
    case '>': return a > b;
    case '<': return a < b;
    case '>=': return a >= b;
    case '<=': return a <= b;
    case '==': return a === b;
    case '!=': return a !== b;
  }
}
