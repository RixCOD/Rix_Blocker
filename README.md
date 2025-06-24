![icon128](https://github.com/user-attachments/assets/5e4b5b9a-e712-42ef-bf17-33394210bd22)
# Rix_Blocker

**Rix_Blocker** is a lightweight and efficient browser extension designed to block intrusive ads and auto-skip YouTube ads. Built using Chrome's Declarative Net Request API and DOM scripting, it enhances your browsing experience by keeping annoying interruptions at bay.

## Features

- 🚫 Blocks requests to common ad networks (like `doubleclick.net`, `googlesyndication.com`)
- ⏩ Automatically skips YouTube video ads and overlay ads
- 📊 Tracks the number of ads blocked locally
- 🧠 Runs in the background with minimal performance impact

---

## How It Works

### 1. DOM Ad Skipping

The function `skipAdsAndTrack()` checks the page every 500ms and:
- Clicks the "Skip Ad" button on YouTube
- Closes overlay ads
- Fast-forwards short unskippable ads (e.g., < 30 seconds)

```js
function skipAdsAndTrack() {
  let skipped = false;

  const skipButton = document.querySelector('.ytp-ad-skip-button');
  if (skipButton) {
    skipButton.click();
    skipped = true;
  }

  const overlay = document.querySelector('.ytp-ad-overlay-close-button');
  if (overlay) {
    overlay.click();
    skipped = true;
  }

  const video = document.querySelector('video');
  if (video && video.duration < 30 && video.currentTime < video.duration) {
    video.currentTime = video.duration;
    skipped = true;
  }

  if (skipped) {
    chrome.storage.local.get('adsBlocked', data => {
      const count = (data.adsBlocked || 0) + 1;
      chrome.storage.local.set({ adsBlocked: count });
    });
  }
}

setInterval(skipAdsAndTrack, 500);
