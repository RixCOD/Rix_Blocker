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
