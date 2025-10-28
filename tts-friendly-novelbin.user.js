// ==UserScript==
// @name        tts-friendly-novelbin
// @namespace   3rd maths
// @match       https://novelbin.com/b/my-master-knows-it-all/*
// @run-at      document-idle
// @grant       none
// @version     1.0.4
// @author      -
// @description 25/10/2025 10:22:21
// @downloadURL https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/tts-friendly-novelbin.user.js
// ==/UserScript==


/**
 * wait for an element to exist (hoisted function declaration)
 */
function waitForElement(selector) {
  return new Promise(resolve => {
    const existing = document.querySelector(selector);
    if (existing) {
      console.debug(`⌚Element found for selector: ${selector}`);
      resolve(existing);
    } else {
      console.debug(`⌚Waiting for element with selector: ${selector}`);
      new MutationObserver((mutations, observer) => {
        const element = document.querySelector(selector);
        if (element) {
          console.debug(`⌚Element mutated for selector: ${selector}`);
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

waitForElement("#chapter .chr-title span.chr-text").then(chapterTitle => {
  console.info(`found chapter title: '${chapterTitle.textContent}'`);
  chapterTitle.textContent = chapterTitle.textContent.replace(/^\s*C(?:hapter)? ?(\d+) - [0-9 ]*(.*)_\d+\s*$/, 'Chapter $1 - $2')
});

waitForElement("#chr-content").then(x => {
  document.querySelectorAll("#chr-content > *:not(p)").forEach(x => x.remove());
  document.querySelectorAll("#chr-content > p:empty ").forEach(x => x.remove());

  const firstParagraph = document.querySelector("#chr-content > p:first-child");
  console.info(`found first paragraph: '${firstParagraph.textContent}'`);
  firstParagraph.textContent = firstParagraph.textContent.replace(/^\s*(.*_\d)\s*\1\s*/, '');

  document.querySelectorAll("#chr-content p").forEach(p => {
    p.textContent = p.textContent
      .replace(/\bCao\b/g, 'Kao')
      .replace(/\bGu\b/g, 'Goo')
      .replace(/\bgod\b/ig, 'divinity')
      .replace(/\bgodly\b/ig, 'divine')
    ;
  });
});

