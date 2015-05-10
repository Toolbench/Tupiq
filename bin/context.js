function onContextClick() {
	var url = JSON.parse(localStorage.getItem('LOCAL_BACKGROUND_IMAGE')).post_url;

	chrome.tabs.create({
  		url: url
  	});
};

chrome.contextMenus.create({
	"title": 'About this Background',
	"contexts":["page"],
    "onclick": onContextClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});
