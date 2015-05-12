function onContextClick() {
  	chrome.runtime.sendMessage({
  		getBackgroundInfo: true
  	});
};

chrome.contextMenus.create({
	"title": 'About this Background',
	"contexts":["page"],
    "onclick": onContextClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});
