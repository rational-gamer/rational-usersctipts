// ==UserScript==
// @name        panorama-banner
// @namespace   3rd maths
// @match       https://www.google.com/maps/embed/v1/streetview
// @grant       GM_addStyle
// @run-at      document-start
// @version     0.0.2
// @author      rational-gamer
// @description 16/08/2025 11:31:25
// @downloadURL https://raw.githubusercontent.com/rational-gamer/rational-usersctipts/refs/heads/main/panorama-banner.user.js
// ==/UserScript==

console.log('🧭 userscript panorama-banner loaded at ' + window.location);


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

  PANORAMA_CSS_STYLE: `
    .gm-style-cc::before,
    div:has(>img[alt='Google'])::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 1.0;

      background: url("${RAW.PALESTINIAN_FLAG_SVG}") center/cover no-repeat;
      z-index: 100;
      color: transparent;
    }
    div:has(>img[alt='Google'])::before {
      height: 22px;
    }
  `,

};


/**
 * custom CSS and BANNER
 */
GM_addStyle(DATA.PANORAMA_CSS_STYLE);
