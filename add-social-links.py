#!/usr/bin/env python3
"""
add-social-links.py — one-time update: adds TikTok and Facebook icon links
to the footer on every page, and links them in a Google-parseable way.

HOW TO USE:
1. Save this file in your project root (same folder as index.html).
2. In VS Code's terminal, from that folder, run: python3 add-social-links.py
3. It prints every file it changes. Check a diff or two in Source Control,
   then commit and push.

Safe to run more than once — already-updated files are skipped.
"""

import os
import re

SOCIAL_HTML = """        <div class="social-links">
          <a href="https://www.tiktok.com/@minibikeklub" target="_blank" rel="noopener" aria-label="Mini Bike Klub on TikTok">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82c-.9-.9-1.4-2.14-1.4-3.42h-3.16v13.6c0 1.62-1.32 2.94-2.94 2.94a2.94 2.94 0 0 1 0-5.88c.28 0 .55.04.8.11V9.98a6.1 6.1 0 0 0-.8-.05A6.11 6.11 0 0 0 3 16.04a6.11 6.11 0 0 0 6.11 6.11 6.11 6.11 0 0 0 6.1-6.11V8.85a8.3 8.3 0 0 0 4.79 1.53V7.22c-1.15 0-2.24-.42-3.4-1.4z"/></svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61552829499384" target="_blank" rel="noopener" aria-label="Mini Bike Klub on Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.7h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.35c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.4-3.9 4V10.3H7.75v3h2.61V21h3.14z"/></svg>
          </a>
        </div>
"""

CSS_ADDITION = """.social-links{
  display:flex;
  gap:14px;
  margin-top:20px;
}
.social-links a{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  border:1px solid var(--border);
  color:var(--text-secondary);
  transition:color .2s var(--ease), border-color .2s var(--ease);
}
.social-links a:hover{
  color:var(--text);
  border-color:var(--text);
}
.social-links svg{
  width:16px;
  height:16px;
}
"""

FOOTER_RE = re.compile(
    r'(<p>High-quality mini bikes and mini drift trikes built for fun, style and performance\.</p>\n)(\s*</div>)'
)


def patch_html_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'class="social-links"' in content:
        print(f"  already updated, skipped: {path}")
        return False

    new_content, n = FOOTER_RE.subn(rf"\1{SOCIAL_HTML}\2", content)
    if n == 0:
        print(f"  WARNING: footer pattern not found in: {path}")
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"  updated: {path}")
    return True


def patch_css_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if ".social-links{" in content:
        print(f"  CSS already updated, skipped: {path}")
        return False

    # Append at the end of the file — safe, doesn't disturb existing rules.
    with open(path, "a", encoding="utf-8") as f:
        f.write("\n" + CSS_ADDITION)
    print(f"  CSS updated: {path}")
    return True


SCHEMA_RE = re.compile(
    r'("areaServed": \{\s*"@type": "Country",\s*"name": "United States"\s*\})(\s*\})'
)

SAME_AS_ADDITION = """,
  "sameAs": [
    "https://www.tiktok.com/@minibikeklub",
    "https://www.facebook.com/profile.php?id=61552829499384"
  ]"""


def patch_homepage_schema(path):
    if not os.path.isfile(path):
        print(f"  WARNING: {path} not found — sameAs schema not added.")
        return False

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if '"sameAs"' in content:
        print(f"  schema already updated, skipped: {path}")
        return False

    new_content, n = SCHEMA_RE.subn(rf"\1{SAME_AS_ADDITION}\2", content)
    if n == 0:
        print(f"  WARNING: Store schema areaServed block not found in: {path}")
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"  schema updated: {path}")
    return True


def main():
    root = os.path.dirname(os.path.abspath(__file__))
    changed = 0

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in (".git", "node_modules")]
        for fname in filenames:
            if fname.endswith(".html"):
                if patch_html_file(os.path.join(dirpath, fname)):
                    changed += 1

    css_path = os.path.join(root, "css", "style.css")
    if os.path.isfile(css_path):
        if patch_css_file(css_path):
            changed += 1
    else:
        print(f"  WARNING: {css_path} not found — social icon styling not added.")

    if patch_homepage_schema(os.path.join(root, "index.html")):
        changed += 1

    print(f"\nDone — {changed} file(s) updated.")


if __name__ == "__main__":
    main()