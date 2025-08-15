// ==UserScript==
// @name        openguessr-stopwatch
// @namespace   3rd maths
// @match       https://openguessr.com/
// @grant       none
// @version     0.1.5
// @author      rational-gamer
// @description 19/07/2025 13:15:34
// @run-at      document-idle
// @downloadURL https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/openguessr-stopwatch.user.js
// ==/UserScript==

console.debug('⌚OpenGuessr Stopwatch Script Loaded');

/**
 * custom CSS and BANNER
 */
waitForElement('#mapHolder').then(mh => {

  console.debug(' 🇵🇸 custom CSS');
  const style = document.createElement('style');
  style.textContent = DATA.CUSTOM_CSS_STYLE;
  document.head.appendChild(style);

});

/**
 * integrating stopwatch
 */
waitForElement("#confirmButton .helpButton").then(hb => hb.textContent = '⌚');
waitForElement("#confirmButton #guessText").then(gt => {
  console.debug('⌚Binding stopwatch to guess text');
  DATA.stopwatch.start(time => {
    gt.textContent = new Date(time).toISOString().substring(11,21);
  });

  gt.addEventListener('click', e => {
    DATA.stopwatch.stop();
    waitForElement('#nextRound .nextRoundText').then(nrt => {
      nrt.innerHTML = `<strong>⌚${gt.textContent}❗</strong>`;
      nrt.parentElement.addEventListener('click', e => {
        DATA.stopwatch.start();
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

/**
 * resources
 */

const RAW = {

  // palestinian flag (horizontal stretcheable bands)
  PALESTINIAN_FLAG_SVG : 'https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/ps-flag.svg',

  // free palestine banner at psg stands, if only they wont have been blamed for that :-(
  FREE_PALESTINE_BANNER_WEBP: 'https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/fp-banner.webp',

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
      background: url(${RAW.PALESTINIAN_FLAG_SVG}) center/cover no-repeat;
      z-index: 999;
    }
    #mapHolder::before {
      background: url(${RAW.FREE_PALESTINE_BANNER_WEBP}) center/cover no-repeat;
      z-index: 998;
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

  // stopwatch object, holds the current time of the round
  stopwatch: {
    TICK_INTERVAL: 100, // tick interval in ms (0.1 seconds)

    depart: null, // start time of round as epoch ms
    current: null, // current time of round as epoch ms
    interval: null, // interval for stopwatch ticks
    callback: null, // callback for stopwatch ticks

    ticks: () => { // perform stopwatch ticks
      DATA.stopwatch.current = Date.now();
      if (DATA.stopwatch.callback) {
        DATA.stopwatch.callback(DATA.stopwatch.current - DATA.stopwatch.depart);
      }
    },

    start: (callback) => { // start the stopwatch, to tick every TICK_INTERVAL ms
      console.debug('⌚Starting stopwatch');
      if (callback) {
        console.debug('⌚Setting stopwatch callback');
        DATA.stopwatch.callback = callback;
      }
      DATA.stopwatch.depart = Date.now();
      DATA.stopwatch.interval = setInterval(DATA.stopwatch.ticks, DATA.stopwatch.TICK_INTERVAL);
    },

    stop: () => { // stop the stopwatch, with last tick
      console.debug('⌚Stopping stopwatch');
      clearInterval(DATA.stopwatch.interval);
      DATA.stopwatch.ticks();
    },

  },

};
