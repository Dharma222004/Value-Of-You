# Project Agent Rules & Karpathy Guidelines

Behavioral guidelines derived from Andrej Karpathy's observations on LLM coding pitfalls (`CLAUDE.md` / `karpathy-guidelines`).

## 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
- State assumptions explicitly before implementing. If uncertain, ask.
- If multiple interpretations exist, present them rather than picking silently.
- If a simpler approach exists, suggest it and push back when warranted.
- If something is unclear, stop, name what is confusing, and ask for clarification.

## 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- Implement no features beyond what was explicitly asked.
- Avoid abstractions for single-use code.
- Avoid unrequested "flexibility" or "configurability".
- Avoid error handling for impossible scenarios.
- If 200 lines could be written in 50 lines, rewrite and simplify.
- Ask: *"Would a senior engineer say this is overcomplicated?"* If yes, simplify.

## 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**
- Do not "improve" adjacent code, comments, or formatting unnecessarily.
- Do not refactor code that isn't broken.
- Match existing style strictly.
- If unrelated dead code is noticed, mention it without deleting it.
- Remove imports/variables/functions orphaned by your own changes.

## 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**
- Transform tasks into verifiable goals with explicit test or verification steps.
- For multi-step tasks, outline a concise plan with check points.
- Verify all changes before declaring completion.
