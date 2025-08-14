# Billigent UX & Branding Guidelines

**Version:** 0.1  
**Date:** 2025-08-14  
**Owner:** Design & Product  
**Status:** Draft  

> Defines design principles, interaction models, accessibility commitments (WCAG 2.2 AA), information architecture, visual system tokens, and narrative tone to ensure a coherent, inclusive experience. Built with accessibility in mind; manual audits & user testing still required.

## 1. Design Principles
1. **Evidence-First Transparency** – Always show the provenance: facts, codes, regulations, attribution weights.  
2. **Progressive Disclosure** – Surface top-line risk / opportunity; allow drill-down into granular spans & bundle checksum.  
3. **Trust Through Explainability** – Visualize attribution weights (bar / chip UI) with checksum verified state.  
4. **Operational Velocity** – Min 2-click path from alert → action (query, re-code, draft appeal).  
5. **Consistency Over Novelty** – Reuse established layout patterns (left nav, modular panels, right detail rail).  

## 2. Interaction Model (Core Loop)
| Step | User Goal | System Surface | Key Accessibility Considerations |
|------|-----------|---------------|----------------------------------|
| 1. Risk Signal | Identify high-impact case | Worklist (sortable, filterable) | ARIA table roles; visible focus ring; skip link |
| 2. Evidence Review | Validate recommendation | Evidence panel (facts + codes + regs) | Semantic headings per section; lists for facts |
| 3. Attribution Inspect | Understand reasoning | Attribution modal (spans + weights) | Role=dialog, trap focus, ESC close |
| 4. Action Trigger | Draft appeal / query | Action bar (buttons) | Button labels include visual text in accessible name |
| 5. Feedback Loop | Confirm outcome logging | Event timeline | Live region for new events (aria-live=polite) |

## 3. Accessibility Commitments (WCAG 2.2 AA)
| Area | Guideline | Implementation Notes |
|------|-----------|----------------------|
| Keyboard | 2.1.1 / 2.1.2 | Roving tabindex in navigation; no keyboard traps |
| Color Contrast | 1.4.3 / 1.4.11 | Base text contrast ≥ 4.5:1; interactive states ≥ 3:1 outline |
| Structure | 1.3.1 | Landmarks: header, nav, main, complementary, footer |
| Focus Visible | 2.4.7 | 2px outline offset + color token `focus-ring` |
| Bypass Blocks | 2.4.1 | Skip-to-main link first in DOM, visible on focus |
| Error Identification | 3.3.1 | Inline text + icon; aria-describedby binding |
| Name/Role/Value | 4.1.2 | Native controls prioritized over ARIA custom widgets |
| Motion Reduction | 2.3.3 | Respect `prefers-reduced-motion` for transitions |
| Target Size | 2.5.8 | Min 44x44 click targets for primary actions |

## 4. Information Architecture
| Surface | Purpose | Primary Components | Notes |
|---------|---------|--------------------|-------|
| Dashboard | Global KPIs & trends | KPI cards, trend charts, alert stream | Cards use semantic headings (h2/h3) |
| Worklist | Prioritized cases | Table, filters, bulk actions | Virtualized rows for performance |
| Case Detail | Deep evidence view | Facts panel, Codes panel, Regulations panel, Attribution | Tabs managed with roving tabindex |
| Appeal Draft | Draft review & edit | Narrative editor, citation list, checksum badge | Editor announces changes to screen readers |
| Administration | Configuration & rules | Rule DSL editor, KPI thresholds, user management | DSL editor provides line numbers with aria-label |

## 5. Visual System Tokens (Draft)
| Token | Role | Value (Initial) | Contrast Rationale |
|-------|------|-----------------|--------------------|
| `color-bg-base` | Background | #FFFFFF | High contrast with text tokens |
| `color-bg-alt` | Section Alt | #F5F7FA | Distinguish grouped panels |
| `color-text-primary` | Primary Text | #1A1F29 | 15:1 vs white |
| `color-text-secondary` | Secondary Text | #4A5568 | 7:1 vs white |
| `color-accent` | Accent / Links | #0F62FE | 4.5:1 vs white at normal weight |
| `color-danger` | Errors | #D12727 | 4.7:1 vs white |
| `color-warning` | Warnings | #B35C00 | ≥ 4.5:1 with white text |
| `color-success` | Success | #1B7F4B | ≥ 4.5:1 with white text |
| `focus-ring` | Focus Outline | #FFBF47 | Distinct from semantic status colors |

## 6. Content & Tone Guidelines
| Context | Tone Traits | Example |
|---------|------------|---------|
| KPI Card | Crisp, quantitative | "Initial Denial Rate: 8.5% (↓0.4 pp)" |
| Recommendation Tooltip | Neutral, explanatory | "Missing CC/MCC: Consider evaluating acute systolic heart failure documentation." |
| Appeal Narrative | Formal, evidence-led | "Clinical documentation supports ICD-10 I50.21 with explicit systolic dysfunction referenced." |
| Attribution Explanation | Transparent, instructional | "Weights reflect normalized contribution of each fact and code; total = 1.0." |
| Error Message | Direct, actionable | "Rule syntax error: expected operator after metric identifier." |

## 7. Component Accessibility Patterns (Key)
| Component | Pattern | Notes |
|-----------|---------|-------|
| Navigation Menu | Roving tabindex + Arrow key nav | `aria-expanded` toggled on disclosure buttons |
| Data Table | Native table + th scopes | Sticky column headers for long scroll |
| Modal Dialog | Focus trap + ESC close | Return focus to trigger on close |
| Tabs | Button list + `aria-selected` | Manage with roving tabindex or `aria-activedescendant` |
| Toast / Alert | `role=alert` or live region | Avoid disruptive focus stealing |
| DSL Editor | Textarea + inline error list | Errors linked via `aria-describedby` |

## 8. Open Design Questions
1. Optimal visualization for attribution span weights (stacked bar vs heat map)?  
2. Should checksum badge include copy-to-clipboard functionality by default?  
3. Degree of inline vs side-panel editing for appeal draft modifications?  
4. Approach to theming for dark mode while retaining ≥4.5:1 contrast?  

## 9. Sources
- Accessibility & contrast ratios grounded in WCAG 2.2 AA guidelines (internal reference to a11y instructions).  
- Clinical & denial context sources: see corpus references (e.g., Change Healthcare, HFMA, HIPAA safeguards).  

---
*Generated with accessibility in mind; manual WCAG verification & assistive tech testing recommended.*
