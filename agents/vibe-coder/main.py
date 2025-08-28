import asyncio, json, os, time
from pathlib import Path
from fastapi import FastAPI
from tools.bus import BusClient
from tools.ledger import Ledger
from tools.github import open_pr
from planner import next_task

app = FastAPI()
ROOT = Path(__file__).parent.parent.parent
LEDGER_FILE = ROOT / "data" / "empathy-ledger.jsonl"

@app.on_event("startup")
async def start_loop():
    bus = BusClient()
    ledger = Ledger(LEDGER_FILE)
    while True:
        coh = await bus.next_coherence()
        task = next_task(coh, ledger)
        patch = task.generate_patch()
        pr = open_pr(task.title, patch, task.rationale)
        ledger.append({"coh": coh, "task": task.id, "pr": pr})
