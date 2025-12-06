// ==UserScript==
// @name         scroll-marker
// @namespace    3rd.maths
// @version      0.3.1
// @modified     20250703_222100
// @description  shows a marker line at 65vh, scrolls to it on click
// @author       rational-gamer
// @created      20250202_172131
// @include      *
// @grant        none
// ==/UserScript==

/** RELEASES NOTES
 * 20250703_222100 0.3.1  scroll marker isolated in its own user script
 * 20250531_011000 0.2.04 force version update
 * 20250531_010657 0.2.03 page scroll should be before snapping marker
 * 20250531_005729 0.2.02 limit scroll to chapternav bottom
 * 20250531_004656        scroll to snapping marker on click
 * 20250531_003915        snapping marker and smooth scrolling
 * 20250530_152037        scroll by .65vh in chapter-content only
 * 20250529_151600 0.2.00 simple scroll on click
 * 20250202_172131 0.0.01 initial version
 */


(function() {
  /**
   * scroll page to snapped marker on click
   */
  window.addEventListener('load', function() {
    // remove all crap listeners
    const oldChapterContent = document.querySelector(".chapter-content");
    const newChapterContent = oldChapterContent.cloneNode(true);
    oldChapterContent.parentNode.replaceChild(newChapterContent, oldChapterContent);

    // add scroller
    newChapterContent.addEventListener("click", function(e) {
      // Find the marker line
      const markerLine = newChapterContent.querySelector('.tts-marker-line');
      const chapternav = document.querySelector('.chapternav');
      let maxScroll = null;
      if (chapternav) {
        const navRect = chapternav.getBoundingClientRect();
        const navBottom = navRect.bottom + window.scrollY;
        maxScroll = navBottom - window.innerHeight;
      }
      if (markerLine) {
        // Get marker's position relative to viewport
        const markerRect = markerLine.getBoundingClientRect();
        let scrollTarget = window.scrollY + markerRect.top;
        if (maxScroll !== null && scrollTarget > maxScroll) {
          scrollTarget = maxScroll;
        }
        window.scrollTo({top: scrollTarget, behavior: "smooth"});
      } else {
        // fallback: scroll by .65*window.innerHeight, but not past chapternav
        let scrollTarget = window.scrollY + .65*window.innerHeight;
        if (maxScroll !== null && scrollTarget > maxScroll) {
          scrollTarget = maxScroll;
        }
        window.scrollTo({top: scrollTarget, behavior: "smooth"});
      }
    }, false);
  }, false);
})();


(function() {
  /**
   * Marker line at 65vh, constrained within chapter-content
   */

  let markerLine = null;
  let chapterContent = null;

  function updateMarker(smooth = false) {
    if (!chapterContent) return;
    const paragraphs = Array.from(chapterContent.querySelectorAll('p'));
    const vh = window.innerHeight;
    const markerY = 0.65 * vh;
    const rect = chapterContent.getBoundingClientRect();
    let targetTop = null;
    // Find the first paragraph whose top is below markerY
    for (const p of paragraphs) {
      const pRect = p.getBoundingClientRect();
      if (pRect.top > markerY) {
        targetTop = pRect.top - rect.top + chapterContent.scrollTop;
        break;
      }
    }
    if (targetTop === null) {
      // If no paragraph below markerY, look for next line with dot or comma
      const walker = document.createTreeWalker(chapterContent, NodeFilter.SHOW_TEXT, null);
      let bestNode = null;
      let bestNodeTop = Infinity;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const nodeRect = range.getBoundingClientRect();
        if (nodeRect.top > markerY && nodeRect.top < bestNodeTop) {
          if (node.textContent.includes('.')) {
            bestNode = node;
            bestNodeTop = nodeRect.top;
            break;
          } else if (!bestNode && node.textContent.includes(',')) {
            bestNode = node;
            bestNodeTop = nodeRect.top;
          } else if (!bestNode) {
            bestNode = node;
            bestNodeTop = nodeRect.top;
          }
        }
      }
      if (bestNode) {
        targetTop = bestNodeTop - rect.top + chapterContent.scrollTop;
      } else {
        // Fallback: keep marker at 0.65vh
        targetTop = markerY + chapterContent.scrollTop - rect.top;
      }
    }
    // Only apply transition if smooth is true
    markerLine.style.transition = smooth ? 'top 0.4s cubic-bezier(0.4,0,0.2,1)' : 'none';
    markerLine.style.top = `${targetTop}px`;
  }

  // Helper to sync marker with scroll animation
  let scrollTimeout = null;
  function onScrollWithAnimation() {
    updateMarker(false); // No transition during scroll
    if (scrollTimeout) clearTimeout(scrollTimeout);
    // After scroll ends, snap with smooth transition
    scrollTimeout = setTimeout(() => updateMarker(true), 80);
  }

  window.addEventListener('load', function () {
    markerLine = document.createElement('div');
    markerLine.style.position = 'absolute';
    markerLine.style.left = '0';
    markerLine.style.right = '0';
    markerLine.style.height = '1px';
    markerLine.style.background = 'rgba(169, 17, 1, 0.75)'; // More dimmed, semi-transparent
    markerLine.style.pointerEvents = 'none';
    markerLine.style.zIndex = '0'; // Behind text
    markerLine.className = 'tts-marker-line';

    chapterContent = document.querySelector('.chapter-content');
    chapterContent.style.overflow = 'hidden';
    chapterContent.style.position = 'relative';

    chapterContent.appendChild(markerLine);
    updateMarker();
  });
  window.addEventListener('scroll', onScrollWithAnimation);
  window.addEventListener('resize', () => updateMarker(true));
})();


(function() {
  /**
   * navigation ease of access
   */

  const navLogo = document.querySelector(".nav-logo");
  
  const previousChapter = document.querySelector(".prevchap");
  navLogo.before(previousChapter.cloneNode(true));

  const nextChapter = document.querySelector(".nextchap");
  navLogo.after(nextChapter.cloneNode(true));

})();


(function() {
  /**
   * paragraphs tts-preparation
   */

  const paragraphs = document.querySelectorAll("div#chapter-container p");
  console.log(`before tts-prepare: ${paragraphs.length} paragraphs`);

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

    if (/MYB[0O]XN[0O]VEL/i.test(content)) {
      content = content
        .replace(/[/ ]*(please\s*)?(keep\s*)?(reading\s*)?(on\s*)?MYB[0O]XN[0O]VEL.*?C[0O]M[. ]*/gui, '')
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

  const remainingParagraphs = document.querySelectorAll("div#chapter-container p");
  console.log(`after tts-prepare: ${remainingParagraphs.length} paragraphs`);

})();
