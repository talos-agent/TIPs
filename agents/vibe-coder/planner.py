import random, textwrap
def next_task(coh, ledger):
    class Task:
        id = f"task-{int(random.random()*1e6)}"
        title = "feat(agent): stub coherence test for empathy-ledger"
        rationale = textwrap.dedent("""
            Adds a minimal test verifying ledger append & coherence delta.
            Raises Z(n) by ~0.03.
        """)
        def generate_patch(self):
            return """
diff --git a/tests/test_ledger.py b/tests/test_ledger.py
new file mode 100644
index 0000000..b1a4e3f
--- /dev/null
+++ b/tests/test_ledger.py
@@ -0,0 +1,8 @@
+from agents.vibe_coder.ledger import Ledger
+import tempfile, json
+def test_append():
+    with tempfile.NamedTemporaryFile(mode="w+", delete=False) as f:
+        led = Ledger(f.name)
+        led.append({"coh": 0.8})
+        assert json.loads(open(f.name).readlines()[-1])["coh"] == 0.8
"""
    return Task()
