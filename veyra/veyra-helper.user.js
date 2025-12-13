// ==UserScript==
// @name        veyra-helper
// @namespace   3rd maths
// @match       https://demonicscans.org/active_wave.php
// @grant       GM_addStyle
// @run-at      document-end
// @version     0.0.3
// @author      rational-gamer
// @description 2025-12-05 23:53:12
// @downloadURL https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/veyra/veyra-helper.user.js
// ==/UserScript==

const TAG = '👹 veyra-helper:';
console.log(`${TAG} userscript loaded at ${window.location}`);

/**
 * wait for an element to exist (hoisted function declaration)
 */
function waitForElement(selector) {
  return new Promise(resolve => {
    const existing = document.querySelector(selector);
    if (existing) {
      console.debug(`${TAG} Element found for selector: ${selector}`);
      resolve(existing);
    } else {
      console.debug(`${TAG} Waiting for element with selector: ${selector}`);
      new MutationObserver((mutations, observer) => {
        const element = document.querySelector(selector);
        if (element) {
          console.debug(`${TAG} Element mutated for selector: ${selector}`);
          observer.disconnect();
          resolve(element);
        }
      }).observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  });
}

/**
 * ∮𝐄∙d𝓁 = -∬𝜕𝐁/𝜕t∙d𝒮
 */

// remove gate info
waitForElement(".gate-info").then(gi => gi.remove());

waitForElement(".monster-container").then(mc => {

  // remove death timers
  mc.querySelectorAll(".death-timer").forEach(dt => dt.remove());

  // sort monsters by HP ascending
  mc.querySelectorAll(":scope > .monster-card").forEach(m => {
    const statValue = m.querySelector(".stat-value").textContent.replace(/[^\d\/]/g,'');
    const continueBtn = m.querySelector(".continue-btn") ? -1 : +1;
    m.style.order = continueBtn * parseInt(statValue);
  });
});
