// Kept separate from storage.ts so the server-rendered layout can use it
// without pulling in client-only React hooks.

export const STORAGE_KEY = "digital-nati:v1";

/**
 * Runs before the first paint (inlined in <head>) so text size and contrast
 * are right immediately, with no flash of the default look.
 */
export const applySettingsScript = `(function(){try{var d=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||"{}");var s=d.settings||{};var h=document.documentElement;h.dataset.textSize=s.textSize||"normal";h.dataset.contrast=s.highContrast?"high":"normal";}catch(e){}})();`;
