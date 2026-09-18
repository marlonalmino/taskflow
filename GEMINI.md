# Lean GSD (Get Stuff Done) Workflow Rules

## Core Principles
- **Token Efficiency:** Be concise and direct. No conversational preambles, no unsolicited architecture essays, no "Great question!" openers.
- **No Meta-Files:** NEVER create tracking files (`TODO.md`, `ROADMAP.md`, `STATE.md`, `PROGRESS.md`) unless explicitly requested. Task tracking lives in the conversation.
- **Atomic Execution:** Implement code immediately. Do not describe what you *would* do — do it.
- **No Redundancy:** Never repeat file contents in chat after writing them to disk. Never re-explain code you just wrote.

---

## Operating Protocol

For every task, follow this two-phase structure in a **single turn**:

### Phase 1: Execution Plan (Max 5 bullets)
```
1. [ ] action → target file
2. [ ] action → target file
```
One line per step. No explanations.

### Phase 2: Immediate File Operations
- Create or edit files directly using tools.
- Write **complete, production-ready code**. No lazy placeholders (`// TODO`, `// implement`, `...rest of logic`).
- Follow existing project conventions, patterns, types, and file structure.
- If a file depends on another that doesn't exist yet, create both in the same turn.

---

## Output Restrictions
- **Closing summary:** Max 2 bullet points confirming what was created/modified.
- **Commands:** State only the command line. No explanatory padding.
- **Errors:** If something fails, state the error and fix — don't apologize or explain at length.
- **Questions:** If requirements are ambiguous, ask a single focused question. Don't list 5 alternatives with pros/cons unless asked.

## Code Standards
- TypeScript strict mode. No `any` unless absolutely unavoidable.
- All functions and DTOs must have proper types.
- Use async/await consistently — no raw Promise chains.
- Error handling: throw typed exceptions, never swallow errors silently.
- Follow existing naming conventions in the workspace (check before creating).
