"""Regenerate the woff2 subset of Dancing Script used for the brand wordmark.
   pip install fonttools brotli && python scripts/subset-font.py
   Add any new characters the wordmark needs to TEXT."""
from fontTools import subset
SRC = "fonts/dancing-script/DancingScript-VariableFont_wght.ttf"
OUT = "fonts/dancing-script/DancingScript-subset.woff2"
TEXT = "Angelova Car Rental & Taxi Services Scan me!0123456789.-'"
opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["*"]
font = subset.load_font(SRC, opts)
s = subset.Subsetter(opts); s.populate(text=TEXT); s.subset(font)
subset.save_font(font, OUT, opts)
print("wrote", OUT)
