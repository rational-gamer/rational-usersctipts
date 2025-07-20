// ==UserScript==
// @name        openguessr-stopwatch
// @namespace   3rd maths
// @match       https://openguessr.com/
// @grant       none
// @version     0.1.0
// @author      rational-gamer
// @description 19/07/2025 13:15:34
// @run-at      document-idle
// @downloadURL https://github.com/rational-gamer/3rd-maths/releases/latest/download/openguessr-stopwatch.user.js
// ==/UserScript==

const WAIT_INTERVAL = 40;
const TICK_INTERVAL = 100;

/**
 * check if given element is visible on top
 */
function visibleOnTop(el) {
  const cr = el.getBoundingClientRect();
  const elx = cr.x + cr.width  / 2;
  const ely = cr.y + cr.height / 2;
  const tp = document.elementFromPoint(elx, ely);
  return el.isEqualNode(tp);
}


/**
 * wait for an element to exist
 */
function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    const checkInterval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkInterval);
        callback(element);
      }
    }, WAIT_INTERVAL);
  }
}


/**
 *  Round Stopwatch handler
 */
function roundStopwatchHandler(gt) {

  // stopwatch behaviour
  const round = {

    startTime : null, // start time of round as epoch ms
    ticks     : null, // interval for stopwatch ticks
    reset     : null, // interval for stopwatch reset

    // start ticks
    start : () => round.ticks = setInterval(() => {
      gt.textContent = new Date(Date.now() - round.startTime).toISOString().substring(11,21);
    }, TICK_INTERVAL),

    // stop ticks
    stop  : () => clearInterval(round.ticks),

    // begin watching for round start
    watch : () => round.reset = setInterval(() => {
      if (visibleOnTop(gt)) {
        clearInterval(round.reset);
        round.startTime = Date.now();
        round.start();
        gt.style['font-family'] = 'monospace';
      }
    }, WAIT_INTERVAL),

  };

  // watch for first round
  round.watch();


  // finish current round and watch for next
  gt.addEventListener('click', e => {
    round.stop();
    waitForElement('#nextRound .nextRoundText', nrt => {
      nrt.innerHTML = `Round finished in <strong style="font-family: monospace;">⌚${gt.textContent}</strong>❗Continue`;
      round.watch();
    });
  });

}


/**
 * stopwatch on an #guessText
 */
waitForElement('#confirmButton #guessText', gt => roundStopwatchHandler(gt));
waitForElement('#confirmButton .helpButton', hb => hb.textContent = '⌚');
