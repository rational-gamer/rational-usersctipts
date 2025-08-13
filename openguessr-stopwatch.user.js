// ==UserScript==
// @name        openguessr-stopwatch
// @namespace   3rd maths
// @match       https://openguessr.com/
// @grant       none
// @version     0.1.2
// @author      rational-gamer
// @description 19/07/2025 13:15:34
// @run-at      document-idle
// @downloadURL https://github.com/rational-gamer/rational-usersctipts/raw/refs/heads/main/openguessr-stopwatch.user.js
// ==/UserScript==

console.debug('⌚OpenGuessr Stopwatch Script Loaded');

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
 * wait for an element to exist
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

waitForElement('#mapHolder').then(mh => {
  // create a style element to hold the CSS
  const style = document.createElement('style');
  style.textContent = `
    #confirmButton #guessText {
      font-family: monospace;
    }
    #nextRound .nextRoundText strong {
      font-family: monospace;
    }
  `;
  // append the style element to the head
  document.head.appendChild(style);
});

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

waitForElement(".logoLeft > .image").then(logo => {
  console.debug(' 🇵🇸 custom logo');

  const data = `
    <svg xmlns="http://www.w3.org/2000/svg">

      <svg x="0" y="0" viewBox="0 0 1 3" preserveAspectRatio="none">
        <rect fill="#000000" x="0" y="0" width="1" height="3"/>
        <rect fill="#FFFFFF" x="0" y="1" width="1" height="3"/>
        <rect fill="#009639" x="0" y="2" width="1" height="3"/>
      </svg>

      <svg x="0" y="0" viewBox="0 0 4 6" preserveAspectRatio="xMinYMid meet">
        <path fill="#ED2E38" d="M0 0 L4 3 L0 6 Z"/>
      </svg>

    </svg>`
  .replace(/\n\s*/g, '');

  logo.setAttribute('alt', 'palestine');
  logo.setAttribute('src', 'data:image/svg+xml;'+encodeURIComponent(data));
  logo.setAttribute('style', 'height: 56px; padding-top: 15px;');
});