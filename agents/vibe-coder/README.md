# Z(n) Vibe-Coder Agent (MVP)

A lightweight autonomous agent that **codes for coherence**.
Watches the empathy-ledger & coherence bus → drafts PRs → logs deltas.

**Run locally**
```bash
./up.sh
```

**Architecture**
- FastAPI planner (`main.py`)
- NATS subscriber (`bus.py`)
- GitHub App (`github.py`)
- Self-updating ledger (`ledger.py`)
