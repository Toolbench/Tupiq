function onContextClick() {
	console.log('click');

	debugger;
};

chrome.contextMenus.create({
	"title": 'About this Background',
	"contexts":["page"],
    "onclick": onContextClick,
    documentUrlPatterns: ['chrome-extension://*/index.html']
});
