"""Build the GitHub Pages copies of the games: docs/index.html (Kite Makers) and docs/flat-tops/index.html (Flat-tops).

Each game file is written for claude.ai artifacts, which add the document
skeleton when published. A plain web host needs that skeleton in the file,
so this wraps the page in one with the same viewport and reset.

Run from the repository root:  python tools/build-pages.py
"""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
PAGES = [("kite-makers.html", "docs/index.html"), ("flat-tops.html", "docs/flat-tops/index.html")]

head = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px system-ui,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>
"""

for src, dst in PAGES:
    page = (root / src).read_text(encoding="utf-8")
    page = page.replace('<meta charset="utf-8">\n', "", 1)
    # The title, font links and stylesheet belong in <head>; the markup and script in <body>.
    split = page.index("</style>") + len("</style>")
    page_head, page_body = page[:split], page[split:]
    out = root / dst
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(head + page_head + "\n</head>\n<body>" + page_body + "\n</body>\n</html>\n", encoding="utf-8", newline="\n")
    print(f"wrote {out.relative_to(root)}")
(root / "docs" / ".nojekyll").write_text("", encoding="utf-8")
