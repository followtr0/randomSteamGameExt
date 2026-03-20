#!/bin/bash
# Package extension for Chrome Web Store submission

echo "📦 Packaging Random Steam Game extension..."

# Minify JS files
echo "Minifying JS files..."
npx --yes terser scripts/content.js -c -m -o scripts/content.min.js
npx --yes terser scripts/background-chrome.js -c -m -o scripts/background-chrome.min.js

# Swap minified files in place for packaging
mv scripts/content.js scripts/content.dev.js
mv scripts/background-chrome.js scripts/background-chrome.dev.js
mv scripts/content.min.js scripts/content.js
mv scripts/background-chrome.min.js scripts/background-chrome.js

# Create zip excluding dev files
zip -r random-steam-game.zip \
  manifest.json \
  icons/ \
  scripts/ \
  LICENSE \
  -x "*.DS_Store" \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.idea*" \
  -x "*CLAUDE.md" \
  -x "*README.md" \
  -x "*PRODUCTION-CHECKLIST.md" \
  -x "*store-assets*" \
  -x "*package-for-store.sh" \
  -x "*scripts/*.dev.js"

# Restore original files
mv scripts/content.dev.js scripts/content.js
mv scripts/background-chrome.dev.js scripts/background-chrome.js

echo "✅ Created random-steam-game.zip (with minified JS)"
echo ""
echo "📋 Next steps:"
echo "1. Create all icons (see icons/README.md)"
echo "2. Take screenshots (see store-assets/README.md)"
echo "3. Upload random-steam-game.zip to Chrome Web Store"
echo "4. Fill in store listing details"
echo ""
echo "See PRODUCTION-CHECKLIST.md for complete checklist"
