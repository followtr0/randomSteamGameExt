#!/bin/bash
# Package extension for Chrome Web Store submission

echo "📦 Packaging Random Steam Game extension..."

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
  -x "*package-for-store.sh"

echo "✅ Created random-steam-game.zip"
echo ""
echo "📋 Next steps:"
echo "1. Create all icons (see icons/README.md)"
echo "2. Take screenshots (see store-assets/README.md)"
echo "3. Upload random-steam-game.zip to Chrome Web Store"
echo "4. Fill in store listing details"
echo ""
echo "See PRODUCTION-CHECKLIST.md for complete checklist"
