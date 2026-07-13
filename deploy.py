#!/usr/bin/env python3
"""Deploy the static site to GitHub via REST API (Contents API).

Why Contents API (not Git Database API):
  The Git Database endpoints (/git/blobs, /git/trees, ...) return HTTP 409
  "Git Repository is empty" on a brand-new empty repo. The Contents API
  (PUT /repos/{owner}/{repo}/contents/{path}) auto-creates the default branch
  and commits per file, which is robust for first-time pushes.

All network goes through `gh api` (proxied, authenticated). No token handling here.
Target repo: sueryue/subnautica2-guide (the REAL name; remote had a stray leading hyphen).
"""
import subprocess, base64, json, os, sys, tempfile, time

REPO = "sueryue/subnautica2-guide"
BRANCH = "main"
ROOT = os.path.dirname(os.path.abspath(__file__))
EXTRA_FILES = [".nojekyll"]  # not tracked by git, add explicitly

def gh_api(method, path, body=None):
    cmd = ["gh", "api", "-X", method, path]
    tf_name = None
    if body is not None:
        tf = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8")
        json.dump(body, tf)
        tf.close()
        tf_name = tf.name
        cmd += ["--input", tf.name]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True)
    finally:
        if tf_name is not None:
            try: os.unlink(tf_name)
            except: pass
    if r.returncode != 0:
        sys.exit(f"FAILED {method} {path}\n{r.stderr.strip()}\n{r.stdout.strip()}")
    out = r.stdout.strip()
    return json.loads(out) if out else {}

# 1. collect files
files = []
ls = subprocess.run(["git","ls-files"], cwd=ROOT, capture_output=True, text=True).stdout.splitlines()
files += [f for f in ls if f not in (".tok", ".nojekyll")]
files += EXTRA_FILES
files = [f for f in files if os.path.isfile(os.path.join(ROOT, f))]
print(f"Deploying {len(files)} files to {REPO} (branch {BRANCH})")

# 2. push each file via Contents API (auto-creates branch + commit)
def put_file(f, b64, attempt=0):
    body = {"message": f"Update {f}", "content": b64, "branch": BRANCH}
    # If the file already exists on the repo, supply its sha (update required).
    try:
        cur = gh_api("GET", f"/repos/{REPO}/contents/{f}")
        if isinstance(cur, dict) and cur.get("sha"):
            body["sha"] = cur["sha"]
    except SystemExit:
        pass  # 404 -> file is new; create without sha
    try:
        gh_api("PUT", f"/repos/{REPO}/contents/{f}", body)
    except SystemExit as e:
        # Transient GET miss on an existing file -> "sha wasn't supplied".
        # Refetch the sha and retry a few times before giving up.
        if "sha" in str(e) and "sha" not in body and attempt < 3:
            time.sleep(1.5)
            return put_file(f, b64, attempt + 1)
        raise

for f in files:
    p = os.path.join(ROOT, f)
    with open(p, "rb") as fh:
        b64 = base64.b64encode(fh.read()).decode("ascii")
    put_file(f, b64)
    print(f"  + {f}")

# 3. enable Pages (main / root)
try:
    gh_api("POST", f"/repos/{REPO}/pages", {"source": {"branch": BRANCH, "path": "/"}})
    print("Pages enabled (branch=main, path=/)")
except SystemExit as e:
    print(f"Pages enable note: {e}")

print(f"DONE. Live at https://sueryue.github.io/{REPO.split('/')[1]}/")
