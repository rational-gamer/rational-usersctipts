// ==UserScript==
// @name        tts-friendly-novelbin
// @namespace   3rd maths
// @match       https://novelbin.com/b/my-master-knows-it-all/*
// @run-at      document-idle
// @grant       none
// @version     1.1.7
// @author      -
// @description 25/10/2025 10:22:21
// @downloadURL https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/tts-friendly-novelbin.user.js
// @homepageURL https://github.com/rational-gamer/rational-usersctipts/blob/main/tts-friendly-novelbin.user.js
// @supportURL  https://github.com/rational-gamer/rational-usersctipts
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
  chapterTitle.textContent = chapterTitle.textContent
    .replace(/^\s*C(?:hapter)? ?(\d+) - [0-9 -]*(.*?)(?:_\d+|_part)?\s*$/gui, 'Chapter $1 - $2')
  ;
});

waitForElement("#chr-content").then(x => {
  document.querySelectorAll("#chr-content > *:not(p)").forEach(x => x.remove());
  document.querySelectorAll("#chr-content > p:empty ").forEach(x => x.remove());

  const firstParagraph = document.querySelector("#chr-content > p:first-child");
  console.info(`found first paragraph: '${firstParagraph.textContent}'`);
  firstParagraph.textContent = firstParagraph.textContent.replace(/^\s*(.+_?\d*)\s*\1\s*/, '');

  let previousParagraph = null;
  let previousContent = "";

  document.querySelectorAll("#chr-content p").forEach(paragraph => {
    let content = paragraph.textContent;

    if (/god/i.test(content)) {
      content = content
        .replace(/god\b|goddess\b/gui, 'divinity')
        .replace(/gods\b|goddesses\b/gui, 'divinities')
        .replace(/godly\b/gui, 'divine')
      ;
    }

    if (/cao/i.test(content)) {
      content = content
        .replace(/cao\b/gui, 'Kao')
      ;
    }

    if (/gu/i.test(content)) {
      content = content
        .replace(/gu\b/gui, 'Goo')
      ;
    }

    if (/lv/i.test(content)) {
      content = content
        .replace(/lv\b/gui, 'Ruo')
      ;
    }

    if (/mr/i.test(content)) {
      content = content
        .replace(/mr\./gui, 'mister')
      ;
    }

    if (/pf/i.test(content)) {
      content = content
        .replace(/p+f+t*\b/gui, 'pewft')
      ;
    }

    if (/hm/i.test(content)) {
      content = content
        .replace(/h+m+p+h+\b/gui, 'huumf')
        .replace(/h+m+\b/gui, 'hum')
      ;
    }

    if (/zen/i.test(content)) {
      content = content
        .replace(/zen/gui, 'poop')
      ;
    }

    if (/buddh/i.test(content)) {
      content = content
        .replace(/buddha/gui, 'Dung')
        .replace(/buddhi/gui, 'Dungui')
      ;
    }

    if (/amitabha/i.test(content)) {
      content = content
        .replace(/amitabha/gui, 'amucoustool')
      ;
    }

    if (!/[^/ .]/.test(content)) {
      content = '';
    }

    if (/\w$/.test(previousContent)) {
      previousContent += " " + content;
      previousParagraph.textContent = previousContent;
      paragraph.remove();

    } else if (/^\s*$/.test(content)) {
      paragraph.remove();

    } else {
      paragraph.textContent = content;
      previousContent = content;
      previousParagraph = paragraph;
    }

  });
});

