chrome.webNavigation.onCommitted.addListener(function(e) {
        chrome.tabs.executeScript(e.tabId, {
			file: "scripts/hopscotch.min.js"
		});
	}
);

chrome.extension.onRequest.addListener(function(request, sender)
{
	console.log(request.message);
	//returnMessage(request.message);
	if (request.message == "white_and_green_theme") {
		chrome.tabs.insertCSS(null, {file:"css/hopscotch.min.css"});
	} else if (request.message == "black_and_blue_theme") {
		chrome.tabs.insertCSS(null, {file:"css/hopscotch.black_blue.min.css"});
	}
});


// console.log(chrome.sessions);
// console.log(window.navigator.userAgent);
// console.log(Request.UserHostName);
// console.log(chrome.fileSystem);

