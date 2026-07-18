#!/usr/bin/env python3
"""Emit the Vercel deploy_to_vercel files[] array as JSON.

Ships only the static site: the six pages, assets/, and the SEO/meta files.
research/, review/, tools/, and the process markdown never deploy. Text files
go as utf-8, binaries as base64.
"""
import base64, json, os, subprocess, sys

EXCLUDE_PREFIX = ("research/", "review/", "tools/")
EXCLUDE_EXACT = {".gitignore", ".vercelignore", "PROGRESS.md", "DELIVERY-NOTES.md",
                 "DESIGN-BRIEF.md", "REVIEW-LOG.md"}
BINARY_EXT = {"woff2", "woff", "png", "jpg", "jpeg", "ico", "gif", "webp", "mp4"}

def main():
    tracked = subprocess.check_output(["git", "ls-files"]).decode().splitlines()
    files = []
    for f in tracked:
        if f.startswith(EXCLUDE_PREFIX) or f in EXCLUDE_EXACT:
            continue
        if f.endswith(".md"):
            continue
        ext = f.rsplit(".", 1)[-1].lower() if "." in f else ""
        if ext in BINARY_EXT:
            with open(f, "rb") as fh:
                files.append({"file": f, "data": base64.b64encode(fh.read()).decode(), "encoding": "base64"})
        else:
            with open(f, "r", encoding="utf-8") as fh:
                files.append({"file": f, "data": fh.read()})
    json.dump(files, sys.stdout)

if __name__ == "__main__":
    main()
