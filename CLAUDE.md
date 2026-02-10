# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome/Chromium browser extension (compatible with Chrome, Brave, Edge, Opera, Vivaldi) that randomly selects a game from a user's Steam library. The extension operates by injecting content scripts into the Steam Community library page and providing an interactive UI for game selection.

## Architecture

### Browser Compatibility

The extension is built with Manifest V3 and supports all Chromium-based browsers:
- **Chrome**: Native support
- **Brave**: Full compatibility
- **Edge**: Full compatibility
- **Opera**: Full compatibility
- **Vivaldi**: Full compatibility
- **Firefox**: Not supported (Manifest V3 service worker incompatibility)

Uses `service_worker` with `scripts/background-chrome.js` for background functionality.

### UI Initialization Flow

The extension initializes UI elements immediately on page load:
1. `initializeUI()` waits for DOM to be ready (DOMContentLoaded or readyState check)
2. Modal HTML and CSS are injected into the page
3. Circular button (🎮) is created and injected
4. Event delegation is set up for button clicks
5. Separate MutationObserver watches for Steam library to load
6. Button persists across page re-renders using smart observer

### Button Persistence Architecture

The button uses a sophisticated persistence mechanism to survive Steam's page re-renders:
- **Event Delegation**: Click handler attached to `document`, not button element
- **Smart Observer**: MutationObserver continuously watches for button removal
- **Auto Re-injection**: `ensureButtonExists()` re-creates button if removed from DOM
- **State Management**: `resetButtonState()` refreshes button reference if stale

This ensures the button remains functional even after page refreshes or Steam's dynamic content updates.

### Button Behavior

- **Default State**: Circular 60px button with 🎮 emoji
- **Hover**: Expands to pill shape showing "Get random game!" text
- **Hover Disabled**: Won't expand when modal is open
- **Position**: Fixed at top: 150px, right: 40px
- **Click**: Resets to emoji state and triggers game randomization

### Game Selection Algorithm

The randomization in `hideAllGamesExceptOne()`:
- Randomly selects a single game from the library container
- Extracts game data including: URL, image, name, playtime, achievements
- Shows modal with selected game information
- Game data is extracted using DOM traversal in `extractGameData()`

### Game Data Extraction

The `extractGameData()` function handles multiple Steam library layouts:
- **With Playtime**: Extracts "TOTAL PLAYED" time and achievements (3rd child)
- **Without Playtime**: Achievements are first child, no playtime shown
- **Achievement Format**: Navigates div > div > 2nd child for achievement count
- Returns: gameUrl, gameImg, gameName, gamePlayed, achievements

### Game Card Layout Handling

Steam has two card heights that must be tracked for proper positioning:
- Standard cards: 150px height
- Cards with "RESUME" button: 206px height

The `arrangeGames()` function repositions visible game cards after hiding games, accounting for both card types.

### Modal System

The extension creates a modal overlay to display the selected game:
- `injectModal()`: Creates the initial modal HTML structure with animations
- `injectCSS()`: Injects styling for the modal and button elements
- `showModal()`: Populates and displays the modal with game data
- Event delegation pattern is used for modal button handlers (Close/Choose Another)
- Modal shows: game image, name, playtime (if available), achievements (if available)

### Modal Flow

1. User clicks button → "looking for a game" text appears
2. After 4 seconds → Text disappears, game info appears with buttons
3. "Close" button → Hides modal, resets state
4. "Choose Another" → Shows "looking for a game" again, selects new game

## Code Style

- Double quotes for strings
- Semicolons required
- Strict equality (`===`) enforced
- Curly braces required for control structures
- Minimal use of `!important` in CSS (only for critical positioning/display properties)
- Event delegation pattern for dynamic content

## DOM Selectors

The extension relies on specific Steam Community DOM structures:
- Page container: `body > div:first-of-type > div > div:nth-of-type(2) > div > div`
- Library wrapper: Second child (children[1]) of page container
- Games list: Last child element of library wrapper (accessed via `libraryElements[libraryElements.length - 1]`)

Steam may change their DOM structure, which would break these selectors.

### Tab Switching Behavior

The extension monitors Steam's library tabs (Recently Played, All Games, Perfect Games) and resets the display when users switch tabs, showing all games again and rearranging the layout.

## Key Features

- **Button Persistence**: Survives page refreshes and Steam re-renders
- **Event Delegation**: Click handlers survive DOM changes
- **Smart Re-injection**: Automatically recovers if button is removed
- **Conditional Display**: Only shows data when available (playtime, achievements)
- **Smooth Animations**: Modal with suspense animation and slide-up effects
- **State Management**: Button resets to emoji when modal opens
