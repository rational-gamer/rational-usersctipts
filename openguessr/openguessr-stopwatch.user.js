// ==UserScript==
// @name        openguessr-stopwatch
// @namespace   3rd maths
// @match       https://openguessr.com/
// @grant       GM_addStyle
// @run-at      document-start
// @version     0.1.8
// @author      rational-gamer
// @description 19/07/2025 13:15:34
// @downloadURL https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/openguessr/openguessr-stopwatch.user.js
// ==/UserScript==

console.log('⌚ userscript openguessr-stopwatch loaded at ' + window.location);


/**
 * resources
 */

const RAW = {

  // palestinian flag (horizontal stretcheable bands)
  PALESTINIAN_FLAG_SVG : 'https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/openguessr/ps-flag.svg',

  // free palestine banner at psg stands, if only they wont have been blamed for that :-(
  FREE_PALESTINE_BANNER_WEBP: 'https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/openguessr/fp-banner.webp',

};

const DATA = {

  // custom css
  CUSTOM_CSS_STYLE: `
    #guessText,
    .nextRoundText strong {
      font-family: monospace;
    }
    #mapHolder::before,
    .logoLeft::before,
    .mapAttributionLogo::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 1.0;
    }
    .logoLeft::before,
    .mapAttributionDataBox p,
    .mapAttributionLogo::before {
      background: url("${RAW.PALESTINIAN_FLAG_SVG}") center/cover no-repeat;
      z-index: 100;
    }
    #mapHolder::before {
      background: url("${RAW.FREE_PALESTINE_BANNER_WEBP}") center/100% 100% no-repeat;
      z-index: 10;
      transition: opacity .280s ease-in;
    }
    #mapHolder:hover::before {
      opacity: 0.0;
    }
    .mapAttributionDataBox p,
    .mapAttributionDataBox p a {
      color: transparent !important;
    }
    .logoLeft::before {
      top: 15px;
      left : 15px;
      height: 56px;
    }
  `,

};


/**
 * custom CSS and BANNER
 */
GM_addStyle(DATA.CUSTOM_CSS_STYLE);


/**
 * stopwatch object, holds the current time of the round
 */
const stopwatch = {
  TICK_INTERVAL: 100, // tick interval in ms (0.1 seconds)

  depart: null, // start time of round as epoch ms
  current: null, // current time of round as epoch ms
  interval: null, // interval for stopwatch ticks
  callback: null, // callback for stopwatch ticks

  ticks: () => { // perform stopwatch ticks
    stopwatch.current = Date.now();
    if (stopwatch.callback) {
      stopwatch.callback(stopwatch.current - stopwatch.depart);
    }
  },

  start: (callback) => { // start the stopwatch, to tick every TICK_INTERVAL ms
    console.debug('⌚Starting stopwatch');
    if (callback) {
      console.debug('⌚Setting stopwatch callback');
      stopwatch.callback = callback;
    }
    stopwatch.depart = Date.now();
    stopwatch.interval = setInterval(stopwatch.ticks, stopwatch.TICK_INTERVAL);
  },

  stop: () => { // stop the stopwatch, with last tick
    console.debug('⌚Stopping stopwatch');
    clearInterval(stopwatch.interval);
    stopwatch.ticks();
  },

};


/**
 * integrating stopwatch
 */
waitForElement("#confirmButton .helpButton").then(hb => hb.textContent = '⌚');
waitForElement("#confirmButton #guessText").then(gt => {
  console.debug('⌚Binding stopwatch to guess text');
  stopwatch.start(time => {
    gt.textContent = new Date(time).toISOString().substring(11,21);
  });

  gt.addEventListener('click', e => {
    stopwatch.stop();
    waitForElement('#nextRound .nextRoundText').then(nrt => {
      nrt.innerHTML = `<strong>⌚${gt.textContent}❗</strong>`;
      nrt.parentElement.addEventListener('click', e => {
        stopwatch.start();
      });
    });
  });
});


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
