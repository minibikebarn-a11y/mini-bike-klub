#!/usr/bin/env python3
"""
fix-og-images.py — one-time SEO fix.

Currently every page's og:image / twitter:image points at the homepage
hero photo, even product and blog pages. This makes every link you share
on Facebook/iMessage/Twitter show the same generic photo instead of the
actual product or article. This script patches that — pulls the correct
image for each product page, and a relevant default for blog posts.

HOW TO USE:
1. Save this file directly in your project root (same folder as index.html).
2. In VS Code's terminal, from that folder, run: python3 fix-og-images.py
3. It will print every file it changes. Review the diff in VS Code's
   Source Control tab, then commit and push as usual.

Safe to run more than once — it just overwrites the same two lines each
time, it won't duplicate anything.
"""

import re
import os

# Exact product-id -> image path, pulled directly from the live site.
PRODUCT_IMAGES = {
    "mbk-black-chrome": "/images/bikes/mbk-black-chrome.jpg",
    "mbk-black-fender-set": "/images/parts/mbk-black-fender-set.jpg",
    "mbk-blue-body-kit": "/images/parts/mbk-blue-body-kit.jpg",
    "mbk-blue-flame": "/images/drift-trikes/mbk-blue-flame.jpg",
    "mbk-blue-king": "/images/drift-trikes/mbk-blue-king.jpg",
    "mbk-blue-wheel-set": "/images/parts/mbk-blue-wheel-set.jpg",
    "mbk-emerald": "/images/drift-trikes/mbk-emerald.jpg",
    "mbk-gas-engine": "/images/parts/mbk-gas-engine.jpg",
    "mbk-king": "/images/drift-trikes/mbk-king.jpg",
    "mbk-magenta": "/images/bikes/mbk-magenta.jpg",
    "mbk-neon": "/images/drift-trikes/mbk-neon.jpg",
    "mbk-orange-fury": "/images/drift-trikes/mbk-orange-fury.jpg",
    "mbk-performance-chassis": "/images/parts/mbk-performance-chassis.jpg",
    "mbk-pink": "/images/bikes/mbk-pink.jpg",
    "mbk-raw-frame": "/images/parts/mbk-raw-frame.jpg",
    "mbk-red-rocket": "/images/drift-trikes/mbk-red-rocket.jpg",
    "mbk-redline-bike": "/images/bikes/mbk-redline-bike.jpg",
    "mbk-redline-trike": "/images/drift-trikes/mbk-redline-trike.jpg",
    "mbk-royal": "/images/bikes/mbk-royal.jpg",
    "mbk-stealth": "/images/drift-trikes/mbk-stealth.jpg",
    "mbk-white-king": "/images/drift-trikes/mbk-white-king.jpg",
}

BLOG_IMAGE = "/images/home/home-mini-bike.jpg"
DOMAIN = "https://minibikeklub.com"

OG_RE = re.compile(r'(<meta property="og:image" content=")[^"]*(")')
TW_RE = re.compile(r'(<meta name="twitter:image" content=")[^"]*(")')


def patch_file(path, image_path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_url = DOMAIN + image_path
    new_content, n1 = OG_RE.subn(rf"\g<1>{new_url}\g<2>", content)
    new_content, n2 = TW_RE.subn(rf"\g<1>{new_url}\g<2>", new_content)

    if n1 == 0 and n2 == 0:
        print(f"  skip (no og:image/twitter:image tags found): {path}")
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"  fixed: {path} -> {image_path}")
    return True


def main():
    root = os.path.dirname(os.path.abspath(__file__))
    changed = 0

    products_dir = os.path.join(root, "products")
    if os.path.isdir(products_dir):
        for product_id, image_path in PRODUCT_IMAGES.items():
            file_path = os.path.join(products_dir, product_id + ".html")
            if os.path.isfile(file_path):
                if patch_file(file_path, image_path):
                    changed += 1
            else:
                print(f"  WARNING: expected file not found: {file_path}")

    blog_dir = os.path.join(root, "blog")
    if os.path.isdir(blog_dir):
        for fname in os.listdir(blog_dir):
            if fname.endswith(".html"):
                if patch_file(os.path.join(blog_dir, fname), BLOG_IMAGE):
                    changed += 1

    print(f"\nDone — {changed} file(s) updated.")


if __name__ == "__main__":
    main()