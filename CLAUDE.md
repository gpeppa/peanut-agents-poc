# Orchestrator

This project uses Claude Code agents to implement software requirements
through an automated developer → build → test feedback loop.

## Auto-Start
When this project opens, immediately begin the workflow below without
waiting for user input.

## Workflow

### Step 1 — Read Requirements
Read `requirements.md` to understand the full task.
Run `mkdir -p output` to ensure the output directory exists before any agent writes to it.

### Step 2 — Developer Phase
Read `agents/developer.md` to get the developer agent instructions.
Spawn a sub-agent (Agent tool) with:
- Those instructions as its system prompt
- The full requirements as its task
- `./output/` as its working directory

Collect the developer's summary of what was created.

### Step 3 — Tester Phase
Read `agents/tester.md` to get the tester agent instructions.
Spawn a sub-agent (Agent tool) with:
- Those instructions as its system prompt
- The requirements + developer summary as its task
- `./output/` as its working directory

Collect the tester's output and check for:
- `BUILD: SUCCESS` or `BUILD: FAIL`
- `RESULT: PASS` or `RESULT: FAIL`

### Step 4 — Feedback Loop
- If `RESULT: PASS` → go to Step 5
- If `RESULT: FAIL` or `BUILD: FAIL`:
  - Pass the verbatim failure output back to a new developer sub-agent
  - Then spawn a new tester sub-agent
  - Repeat up to **3 total iterations**
  - If still failing after 3 iterations → go to Step 5 with failure status

### Step 5 — Deploy Phase
Only run this step if `RESULT: PASS`.
Read `agents/deployer.md` to get the deployer agent instructions.
Spawn a sub-agent (Agent tool) with:
- Those instructions as its system prompt
- A brief task: "Commit and push the project. Requirements: <one-line summary>"
- The project root as its working directory

Collect the deployer's output and check for `DEPLOY: SUCCESS`, `DEPLOY: SKIPPED`, or `DEPLOY: FAIL`.

### Step 6 — Final Report
Print a summary covering:
- Whether the task succeeded or failed
- How many iterations were needed
- What files were created in `./output/`
- The final test output
- Deploy status (SUCCESS / SKIPPED / FAIL) and remote URL if deployed

## Rules
- Never write implementation code yourself — always delegate to sub-agents
- Always pass failure output verbatim to the developer — do not paraphrase
- Always re-read `requirements.md` at the start of each run (never rely on memory)
- Keep track of iteration number (max 3)
