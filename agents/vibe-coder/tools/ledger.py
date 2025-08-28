import json, os, time
class Ledger:
    def __init__(self, path):
        self.path = path
        self.path.parent.mkdir(exist_ok=True, parents=True)
    def append(self, payload):
        payload["ts"] = int(time.time())
        with open(self.path, "a") as f:
            f.write(json.dumps(payload) + "\n")
