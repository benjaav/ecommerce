// src/FacebookPixel.js
import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '4077146172601780';
const advancedMatching = {}; 
const options = { autoConfig: true, debug: false };

export function initFacebookPixel() {
  ReactPixel.init(PIXEL_ID, advancedMatching, options);
  ReactPixel.pageView();      // Primer PageView al cargar la app
}

export function trackFacebookEvent(eventName, data) {
  ReactPixel.track(eventName, data);
}
