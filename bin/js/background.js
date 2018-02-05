/* eslint-disable */
chrome.alarms.create('getBackgroundImage', { delayInMinutes: 0.1, periodInMinutes: 0.1 });

chrome.alarms.onAlarm.addListener(function(alarm) {
  /*
  var  persistedState = localStorage.getItem('state');
  var  serializedState = (persistedState) ? JSON.parse(LZString.decompressFromUTF16(persistedState)) : undefined;

  if (serializedState.backgrounds && serializedState.backgrounds.current && serializedState.backgrounds.current.dataURL) {

  }
  */
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension');
  
  if (request.type === 'GimmeImage') {
    sendResponse({ image: 'fauxImage' });
  }
});