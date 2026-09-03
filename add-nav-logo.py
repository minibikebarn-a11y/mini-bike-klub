#!/usr/bin/env python3
"""
add-nav-logo.py — one-time update: adds the logo image beside "MINI BIKE
KLUB" in the header nav bar on every page. Only touches the header (first
occurrence in each file) — the footer brand link stays text-only.

HOW TO USE:
1. Save mbk-logo.jpg (provided separately) into your assets/ folder.
2. Save this script in your project root (same folder as index.html).
3. In VS Code's terminal, from that folder, run: python3 add-nav-logo.py
4. It prints every file it changes. Review a couple of diffs in Source
   Control, then commit and push.

Safe to run only once per file — running it twice on an already-updated
file will simply report "already updated, skipped" and leave it alone.
"""

import os
import re

# Matches the header brand link regardless of how many ../ prefixes it has
# (root pages use "index.html", pages one folder deep use "../index.html").
BRAND_RE = re.compile(
    r'<a href="((?:\.\./)*index\.html)" class="brand">MINI BIKE KLUB</a>'
)


def patch_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'class="brand-logo"' in content:
        print(f"  already updated, skipped: {path}")
        return False

    match = BRAND_RE.search(content)
    if not match:
        print(f"  WARNING: no brand link pattern found in: {path}")
        return False

    href = match.group(1)
    # href is like "index.html" or "../index.html" — assets/ sits at the
    # same relative depth.
    prefix = href[: -len("index.html")]
    replacement = (
        f'<a href="{href}" class="brand">\n'
        f'      <img src="{prefix}assets/mbk-logo.jpg" alt="Mini Bike Klub" class="brand-logo">\n'
        f'      MINI BIKE KLUB\n'
        f'    </a>'
    )

    # Replace only the FIRST match (the header nav) — leaves the footer's
    # identical-looking brand link untouched.
    new_content = content[: match.start()] + replacement + content[match.end():]

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"  updated: {path}")
    return True


def main():
    root = os.path.dirname(os.path.abspath(__file__))
    changed = 0
    skipped_no_logo = False

    logo_path = os.path.join(root, "assets", "mbk-logo.jpg")
    if not os.path.isfile(logo_path):
        print("WARNING: assets/mbk-logo.jpg not found. Save the logo there")
        print("first, or the image will show broken on every page even")
        print("after this script runs.\n")

    for dirpath, dirnames, filenames in os.walk(root):
        # skip node_modules-style noise if present
        dirnames[:] = [d for d in dirnames if d not in (".git", "node_modules")]
        for fname in filenames:
            if fname.endswith(".html"):
                if patch_file(os.path.join(dirpath, fname)):
                    changed += 1

    print(f"\nDone — {changed} file(s) updated.")


if __name__ == "__main__":
    main()