import os, tempfile, subprocess
from github import Github
GH = Github(os.getenv("ZERO_GITHUB_TOKEN"))
REPO = GH.get_repo("Aurumgrid/Z-n-")

def open_pr(title, patch, rationale):
    branch = f"auto/{int(time.time())}"
    subprocess.run(["git", "checkout", "-b", branch], check=True)
    subprocess.run(["git", "apply"], input=patch.encode(), check=True)
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", f"{title}\n\n{rationale}"], check=True)
    subprocess.run(["git", "push", "origin", branch], check=True)
    pr = REPO.create_pull(title=title, body=rationale, head=branch, base="main")
    return pr.html_url
