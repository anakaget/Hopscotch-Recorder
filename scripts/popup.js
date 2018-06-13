chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "something_completed") {
			console.log("something_completed");
            //  To do something
			chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
		   });
        }
    }
); 
 
 function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
	window.close();
   });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("run").addEventListener("click", popup);
});
