// src/FacebookPixel.js
import ReactPixel from 'react-facebook-pixel';

export function initFacebookPixel() {
  ReactPixel.init('4077146172601780');
  ReactPixel.pageView();
}

export function trackFacebookEvent(eventName, data) {
  ReactPixel.track(eventName, data);
}
