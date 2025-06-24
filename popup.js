const toggleBtn = document.getElementById('toggle');
const statusText = document.getElementById('status');
const adsBlockedSpan = document.getElementById('adsBlocked');
const moneySavedSpan = document.getElementById('moneySaved');
const ytLossSpan = document.getElementById('ytLoss');

const adRevenuePerView = 0.01; // rough estimate per ad

function updateUI(enabled, adsBlocked = 0) {
  toggleBtn.className = enabled ? "" : "off";
  toggleBtn.textContent = enabled ? "Turn Off Ad Block" : "Turn On Ad Block";
  statusText.textContent = enabled ? "Ad Blocker is ACTIVE" : "Ad Blocker is OFF";
  adsBlockedSpan.textContent = adsBlocked;
  moneySavedSpan.textContent = `$${(adsBlocked * adRevenuePerView).toFixed(2)}`;
  ytLossSpan.textContent = `$${(adsBlocked * adRevenuePerView).toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['enabled', 'adsBlocked'], (data) => {
    const enabled = data.enabled !== false;
    const adsBlocked = data.adsBlocked || 0;
    updateUI(enabled, adsBlocked);
  });

  toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get(['enabled', 'adsBlocked'], (data) => {
      const enabled = data.enabled !== false;
      const adsBlocked = data.adsBlocked || 0;
      const newEnabled = !enabled;

      if (newEnabled) {
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: adBlockRules,
          removeRuleIds: adBlockRules.map(r => r.id)
        });
      } else {
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: [],
          removeRuleIds: adBlockRules.map(r => r.id)
        });
      }

      chrome.storage.local.set({ enabled: newEnabled }, () => {
        updateUI(newEnabled, adsBlocked);
      });
    });
  });
});

const adBlockRules = [
  {
    id: 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: "doubleclick.net", resourceTypes: ["xmlhttprequest", "script"] }
  },
  {
    id: 2,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: "googlesyndication.com", resourceTypes: ["script"] }
  }
];
