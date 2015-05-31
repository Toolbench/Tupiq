function onAboutBackgroundClick() {
  	chrome.runtime.sendMessage({
  		getBackgroundInfo: true
  	});
};

function onMinimiseClick() {
  	chrome.runtime.sendMessage({
  		minimisePanel: true
  	});
};

chrome.contextMenus.create({
	"title": 'About this Background',
	"contexts":["page"],
    "onclick": onAboutBackgroundClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});

chrome.contextMenus.create({
	"title": 'Toggle Panel',
	"contexts":["page"],
    "onclick": onMinimiseClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});
