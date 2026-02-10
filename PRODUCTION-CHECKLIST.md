# Production Checklist for Chrome Web Store

## Before Submission:

### 1. Icons ✅ (Setup, needs creation)
- [ ] Create icon16.png (16x16)
- [ ] Create icon32.png (32x32)
- [ ] Create icon48.png (48x48)
- [ ] Create icon128.png (128x128)
- [ ] Place all in `icons/` folder

### 2. Store Assets (needs creation)
- [ ] Take screenshot 1 - Button on library page (1280x800)
- [ ] Take screenshot 2 - Modal with game (1280x800)
- [ ] Take screenshot 3 - Optional additional screenshots
- [ ] Optional: Create small promo tile (440x280)
- [ ] Optional: Create marquee tile (1400x560)

### 3. Code Review ✅
- [x] Remove all console.log statements
- [x] Remove debug code
- [x] Test on fresh Chrome install
- [x] Test on Steam library page
- [x] Test button persistence after refresh
- [x] Test modal functionality
- [x] Test "Choose Another" button
- [x] Test with games that have no playtime
- [x] Test with games that have achievements

### 4. Manifest Check ✅
- [x] Version number (1.0.0)
- [x] Description (clear and compelling)
- [x] Permissions (minimal - only what's needed)
- [x] Icon paths correct
- [x] Content script matches correct URLs
- [x] Background service worker path correct

### 5. Chrome Web Store Listing (to do on store)
- [ ] **Name:** Random Steam Game
- [ ] **Summary:** Pick a random game from your Steam library with one click
- [ ] **Description:** Write detailed description (see below)
- [ ] **Category:** Fun or Productivity
- [ ] **Language:** English (or your preference)
- [ ] **Upload screenshots**
- [ ] **Upload promotional tiles** (optional)

### 6. Legal/Privacy
- [ ] **Privacy Policy:** Required if collecting data (you're not, but may need simple statement)
- [ ] **Terms of Service:** Optional
- [ ] Verify no copyright issues with name/description
- [ ] Verify Steam trademark usage is acceptable (you're enhancing their platform)

### 7. Developer Account
- [ ] Register Chrome Web Store developer account ($5 one-time)
- [ ] Verify email
- [ ] Complete developer profile

### 8. Testing
- [ ] Test in Chrome
- [ ] Test in Brave (optional but recommended)
- [ ] Test in Edge (optional but recommended)
- [ ] Have someone else test it

### 9. Submission
- [ ] Zip the extension folder (exclude .git, node_modules, etc.)
- [ ] Upload to Chrome Web Store Developer Dashboard
- [ ] Fill in all required fields
- [ ] Submit for review

### 10. Post-Launch
- [ ] Monitor reviews
- [ ] Respond to user feedback
- [ ] Fix any reported bugs
- [ ] Consider feature requests

---

## Suggested Store Description:

**Short Description (132 chars max):**
Pick a random game from your Steam library instantly. No more decision paralysis - just click and play!

**Detailed Description:**
Can't decide what to play from your massive Steam library? Random Steam Game picks one for you!

**Features:**
• 🎮 One-click random game selection
• ⚡ Instant results with smooth animations
• 📊 Shows game info: playtime, achievements
• 🎯 Works directly on your Steam library page
• 🔄 "Choose Another" if you want a different game
• 💨 No setup required - just install and use

**How it works:**
1. Open your Steam library in Chrome
2. Click the game controller button that appears
3. Watch the animation as it finds your game
4. Click the game image to open its Steam page
5. Not feeling it? Click "Choose Another" for a new pick

Perfect for:
- Beating analysis paralysis
- Discovering forgotten games in your library
- Quick game selection when you just want to play
- Streamers looking for variety

**Privacy:**
No data collection. No tracking. No ads. Just a simple, useful tool for Steam users.

---

## Privacy Policy (if required):

**Random Steam Game - Privacy Policy**

Last updated: [DATE]

This extension does not collect, store, or transmit any personal data.

**What we access:**
- Your Steam library page (read-only) to display game information
- No login credentials
- No personal information
- No browsing history

**What we store:**
- Nothing. All functionality is local to your browser.

**Third parties:**
- No data shared with third parties
- No analytics or tracking

**Questions:**
Contact: [YOUR EMAIL]

---

## What to Exclude from ZIP:

When zipping for upload, exclude:
- `.git/`
- `.DS_Store`
- `node_modules/` (if you add any)
- `.idea/` (IDE files)
- `CLAUDE.md` (development docs)
- `PRODUCTION-CHECKLIST.md` (this file)
- `README.md` (unless you want it included)
- `store-assets/` (uploaded separately)
- Any other dev-only files

**Include only:**
- `manifest.json`
- `icons/` folder with all PNGs
- `scripts/` folder
- `LICENSE` (optional but good practice)
