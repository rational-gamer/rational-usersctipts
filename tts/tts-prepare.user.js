// ==UserScript==
// @name         tts-prepare
// @namespace    3rd.maths
// @version      0.3.0
// @modified     20250703_230700
// @description  prepare content for tts
// @author       rational-gamer
// @created      20250202_172131
// @include      *
// @grant        none
// ==/UserScript==

/** RELEASES NOTES
 * 20250703_230700 0.3.0  tts-prepare isolated in its own user script
 * 20250531_011000 0.2.04 force version update
 * 20250530_150424        double quotes "" or '' reduction
 * 20250530_103338        spaces around _*_
 * 20250529_165139 0.2.01 remove /.
 * 20250529_151248        banner wrapped
 * 20250526_235454 0.1.07 plural exists
 * 20250526_223612 0.1.06 banner remover
 * 20250526_223519        ellipses tts pause
 * 20250526_162318 0.1.05 nav clone deep
 * 20250526_162100 0.1.04 nav clone
 * 20250526_161838 0.1.03 nav access
 * 20250526_151711 0.1.02 mr. without dot
 * 20250526_151315 0.1.01 mr. without dot
 * 20250526_145455 0.1.00 split paragraph merging 
 * 20250522_175000 0.0.08 Gu to Goo for pronunciation
 * 20250514_214851 0.0.07 correction www.lightnovelworld.com
 * 20250514_214005 0.0.06 include lightnovelworld.com
 * 20250202_182648 0.0.05 use of querySelectorAll
 * 20250202_175446 0.0.04 missing gui
 * 20250202_175221 0.0.03 hmph => humpf
 * 20250202_173907 0.0.02 \b not working before \*
 * 20250202_172131 0.0.01 initial version
 */


(function() {
  /**
   * paragraphs tts-preparation
   */

  const firstParagraphs = document.querySelectorAll('p:first-of-type')

  


  const ttsContainer = getTtsContainer();
  const paragraphs = ttsContainer.querySelectorAll("> p");

  let previousParagraph = null;
  let previousContent = "";

  paragraphs.forEach(paragraph => {
    let content = paragraph.textContent;


    if (/["']/.test(content)) {
      content = content
        .replace(/""+/, '"')
        .replace(/''+/, "'")
        .replace(/^\s*"\s*/, '"')
        .replace(/\s*"\s*$/, '"')
        .replace(/^\s*'\s*/, "'")
        .replace(/\s*'\s*$/, "'")
      ;
    }

    if (/\*/i.test(content)) {
      content = content
        .replace(/(?<=\w)\s*\*+\s*(?=\w)/, '*')
        .replace(/(?<=\ba)\*+(?=s\b)/gui, 's')
        .replace(/\*+(?=ss)\b/gui, 'a')
        .replace(/(?<=\bb)\*+(?=stard)/gui, 'a')
        .replace(/(?<=\bb)\*+(?=tch\b)/gui, 'i')
        .replace(/(?<=\bcr)\*+(?=p\b)/gui, 'a')
        .replace(/(?<=\bd)\*+(?=mn)/gui, 'a')
        .replace(/(?<=\bf)\*+(?=ck)/gui, 'u')
        .replace(/(?<=\bf)\*+(?=k)/gui, 'uc')
        .replace(/(?<=\bsh)\*+(?=t)/gui, 'i')
      ;
    }

    if (/hm/i.test(content)) {
      content = content
        .replace(/h+m+p+h+/gui, 'humpf')
        .replace(/h+m+/gui, 'hmm')
      ;
    }

    if (/gu/i.test(content)) {
      content = content
        .replace(/gu\b/gui, 'Goo')
      ;
    }

    if (/mr/i.test(content)) {
      content = content
        .replace(/mr\./gui, 'Mr')
      ;
    }

    if (/\.{3}|…/u.test(content)) {
      content = content
        .replace(/\s*(\.{3,}|…+)\s*/gu, ' ... ')
        .replace(/\s*(\.{3,}|…+)\s*$/u, ' ...')
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

})();
