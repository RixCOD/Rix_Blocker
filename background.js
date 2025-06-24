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

// Enable by default
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: adBlockRules,
    removeRuleIds: adBlockRules.map(r => r.id)
  });
});
