import React from 'react';
import ReactPixel from 'react-facebook-pixel';

const options = {
  autoConfig: true,
  debug: false,
};

const pixelId = '4077146172601780'; // Tu Facebook Pixel ID

export const initFacebookPixel = () => {
  ReactPixel.init(pixelId, undefined, options);
  ReactPixel.pageView();
};

export const trackEvent = (eventName, data) => {
  ReactPixel.track(eventName, data);
};
