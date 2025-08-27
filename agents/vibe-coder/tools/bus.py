import json, nats
class BusClient:
    async def next_coherence(self):
        nc = await nats.connect("nats://localhost:4222")
        sub = await nc.subscribe("coherence.>")
        msg = await sub.next_msg()
        return json.loads(msg.data)["coherence"]
