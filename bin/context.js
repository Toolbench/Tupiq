function onMinimiseClick() {
  	chrome.runtime.sendMessage({
  		minimisePanel: true
  	});
};

function onAboutBackgroundClick() {
  	chrome.runtime.sendMessage({
  		getBackgroundInfo: true
  	});
};

function onResetClick() {
  	chrome.runtime.sendMessage({
  		reset: true
  	});
};

chrome.contextMenus.create({
	"title": 'Toggle Panel',
	"contexts":["page"],
    "onclick": onMinimiseClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});

chrome.contextMenus.create({
	"title": 'About this Background',
	"contexts":["page"],
    "onclick": onAboutBackgroundClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});

chrome.contextMenus.create({
	"title": 'Reset',
	"contexts":["page"],
    "onclick": onResetClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});
