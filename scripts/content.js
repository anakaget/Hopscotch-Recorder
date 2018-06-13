jQ = jQuery.noConflict(true);

var prevDOM = null;
var tourSteps = 1;
var contentJSON = [];
var josnData = "";
sessionStorage.tourStarted = false;
MOUSE_VISITED_CLASSNAME = 'ank_mouse_visited';
ANCHOR_MOUSE_VISITED_CLASSNAME = 'ank_anchor_mouse_visited';
IMG_MOUSE_VISITED_CLASSNAME = 'ank_image_mouse_visited';

var theme = "white_and_green_theme";
//setCookie("multipage", false, 1);
var globalTarget = null;

var icons_777777_256x240 = chrome.extension.getURL("img/ui-icons_777777_256x240.png");
var icons_444444_256x240 = chrome.extension.getURL("img/ui-icons_444444_256x240.png");
var icons_555555_256x240 = chrome.extension.getURL("img/ui-icons_555555_256x240.png");
var icons_ffffff_256x240 = chrome.extension.getURL("img/ui-icons_ffffff_256x240.png");
var icons_777620_256x240 = chrome.extension.getURL("img/ui-icons_777620_256x240.png");
var icons_cc0000_256x240 = chrome.extension.getURL("img/ui-icons_cc0000_256x240.png");
var imgLinks = "<style id='ank_dialog_img'>" +
	".ui-button .ui-icon {background-image: url(" + icons_777777_256x240 + ");} " +
	".ui-icon, .ui-widget-content .ui-icon { background-image: url(" + icons_444444_256x240 + ");} " +
	".ui-widget-header .ui-icon { background-image: url(" + icons_444444_256x240 + ");}" +
	".ui-state-hover .ui-icon,.ui-state-focus .ui-icon,.ui-button:hover .ui-icon,.ui-button:focus .ui-icon {background-image: url(" + icons_555555_256x240 + ");} " +
	".ui-state-active .ui-icon, .ui-button:active .ui-icon {background-image: url(" + icons_ffffff_256x240 + "); } " +
	".ui-state-highlight .ui-icon,.ui-button .ui-state-highlight.ui-icon { background-image: url(" + icons_777620_256x240 + "); }" +
	".ui-state-error .ui-icon,.ui-state-error-text .ui-icon { background-image: url(" + icons_cc0000_256x240 + ");} " +
	"</style>";
jQ("head").append(imgLinks);

function applyImageByTheme() {
	var tourImg = chrome.extension.getURL("img/sprite-green.png");
	if (theme == "white_and_green_theme") {
		tourImg = tourImg;
	} else if (theme == "black_and_blue_theme") {
		tourImg = chrome.extension.getURL("img/sprite-blue.png");
	}
	imgLinks = "div.hopscotch-bubble .hopscotch-bubble-close{-webkit-appearance:none;-moz-appearance:none;appearance:none;border:0;color:#000;background:transparent url(" + tourImg + ") -192px -92px no-repeat;display:block;padding:8px;position:absolute;text-decoration:none;text-indent:-9999px;width:8px;height:8px;top:0;right:0} " +
	"div.hopscotch-bubble .hopscotch-bubble-number{background:transparent url(" + tourImg + ") 0 0 no-repeat;  color:#fff; display:block; float:left; font-size:17px; font-weight:700; line-height:31px; padding:0 10px 0 0; text-align:center; width:30px; height:30px} ";
	jQ("#ank_dialog_img").append(imgLinks);
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.message === "start") {
			themeDialog();
		}
	}
);

function themeDialog() {
	jQ('#ank_theme').dialog({
		title: "Hopscotch Recorder",
		height: "auto",
		width: 500,
		modal: true,
		resizable: false,
		dialogClass: 'ank_dialog_style',
		open: function (event, ui) {
			jQ(".ui-widget-overlay").css({
				opacity: 1.0,
				filter: "Alpha(Opacity=100)",
				backgroundColor: "rgba(0,0,0,0.4);",
				zIndex: "9990"
			});
			jQ(".ui-dialog").css({
				zIndex: "9999"
			});
		}
	});
}

var white_and_green_theme = chrome.extension.getURL("img/themes/white_and_green_theme.png");
var black_and_blue_theme = chrome.extension.getURL("img/themes/black_and_blue_theme.png");
var jQthemeDailog = jQ('<div class="ank_theme" id="ank_theme" style="display: none;">' +
	'<div class="ank_dialog_container">' +
	'<div class="ank_theme_menu" style="width: 100%; float: left;">' +
	'<label for="ank_hopscotch_theme" style="float:left;"><b>Select theme for tour</b></label>' +
	'<select name="ank_hopscotch_theme" id="ank_hopscotch_theme">' +
	'<option value="default" selected>Default</option>' +
	'<option value="black_and_blue">Black and Blue</option>' +
	'</select>' +
	'<div style="text-align: center">' +
	'<img id="theme_img"src="' + white_and_green_theme + '">' +
	'</div>' +
	'<button class="ank_fadeIn_btn" style="float: right; margin-top:20px;" id="startTour">Start</button>' +
	'</div>' +
	'</div>' +
	'</div>');
jQ("body").append(jQthemeDailog);

jQ("#ank_hopscotch_theme").change(function () {
	var value = jQ(this).val();
	if (value == 'default') {
		theme = "white_and_green_theme";
		jQ("#theme_img").prop("src", white_and_green_theme);
	} else if (value == 'black_and_blue') {
		theme = "black_and_blue_theme";
		jQ("#theme_img").prop("src", black_and_blue_theme);
	}
});

jQ("#startTour").click(function () {
	jQ("#ank_theme").dialog("close");
	chrome.extension.sendRequest({ message: theme });
	applyImageByTheme();
	start();
});

var jqueryScript = chrome.extension.getURL("scripts/jquery.min.js");
var jqueryScriptLink = "<script type='text/javascript' src=" + jqueryScript + "></script>";
//jQ("head").append(jqueryScriptLink);

var tourScript = chrome.extension.getURL("scripts/hopscotch.min.js");
var script = document.createElement("script");
script.type = "text/javascript";
script.src = tourScript;
//jQ("body").append(script);

var close = chrome.extension.getURL("img/icon/close.svg");
var reset = chrome.extension.getURL("img/icon/reset.svg");
var play = chrome.extension.getURL("img/icon/play.svg");
var exportIcon = chrome.extension.getURL("img/icon/export.svg");
var question = chrome.extension.getURL("img/icon/question.svg");

var jQnewdiv1 = jQ('<div class="ank_btn_container" id="ank_btn_container">' +
	'<div class="ank_div_btn ank_tooltip" style="float: left;">' +
	'<span class="ank_tooltiptext">Hide the tour steps</span>' +
	'<span id="hide_content_btn" class="ank_btn" style="background-image: url(' + close + ');">' +
	'</span></div>' +
	'<div class="ank_div_btn ank_tooltip" style="float: left;">' +
	'<span class="ank_tooltiptext">Reset the tour</span>' +
	'<span id="reset_content_btn" class="ank_btn" style="background-image: url(' + reset + ');">' +
	'</span></div>' +
	'<div class="ank_div_btn ank_tooltip" style="float: left;">' +
	'<span class="ank_tooltiptext">Test the tour steps</span>' +
	'<span id="test_tour_btn" class="ank_btn" style="background-image: url(' + play + ');">' +
	'</span></div>' +
	'<div class="ank_div_btn ank_tooltip" style="float: left;">' +
	'<span class="ank_tooltiptext">Export to Hopscotch</span>' +
	'<span id="export_content_btn" class="ank_btn" style="background-image: url(' + exportIcon + ');">' +
	'</span></div>' +
	'<div class="ank_div_btn ank_tooltip" style="float: left;">' +
	'<span class="ank_tooltiptext">Getting issues?</span>' +
	'<span id="question_btn" class="ank_btn" style="background-image: url(' + question + ');">' +
	'</span></div>' +
	'</div>' +
	'<div id="tour_content_div" class="ank_tour_content_div ank_font_family"></div>');
jQ("body").append(jQnewdiv1);

var jQModal = jQ("<div id='tour_step_confirm' style='display: none;'>" +
	"<div class='container'> " +
	"<label for='title'><b>Title</b></label> " +
	"<input type='text' placeholder='Enter title for step' name='title' id='title' required> " +
	"<label for='description'><b>Description</b></label> " +
	"<input type='text' placeholder='Enter description for step' name='description' id='description' required> " +
	"<label for='position'><b>Position</b></label> " +
	"<select name='position' id='position'> " +
	"<option value='top'>Top</option> " +
	"<option value='bottom'>Bottom</option> " +
	"<option value='left'>Left</option> " +
	"<option value='right'>Right</option> " +
	"</select> " +
	"<label for='nextOnTargetClick'><b>Next Step On Target Click</b></label> " +
	"<select name='nextOnTargetClick' id='nextOnTargetClick'> " +
	"<option value='true'>Yes</option>" +
	"<option value='false' selected>No</option>" +
	"</select> " +
	"<button type='submit' id='dialog_submit'><b>Submit</b></button> " +
	"</div>" +
	"</div>");
jQ("body").append(jQModal);

function start() {
	// Mouse listener for any move event on the current document.
	document.addEventListener('mouseover', function (event) {
		event.preventDefault();
		var target = event.target ? event.target : event.srcElement;
		//var srcElement = event.srcElement;

		if (target.id == 'tour_content_div' ||
			target.id == 'ank_btn_container' ||
			target.id == 'hide_content_btn' ||
			target.id == 'reset_content_btn' ||
			target.id == 'test_tour_btn' ||
			target.id == 'export_content_btn' ||
			target.id == 'question_btn' ||
			target.id == 'ank_theme' ||
			target.id == 'ank_hopscotch_theme' ||
			target.id == 'startTour') {
			return;
		}
		if (target.classList.contains('ank_div_btn') ||
			target.classList.contains('ank_tooltip') ||
			target.classList.contains('ank_tooltiptext') ||
			target.classList.contains('ank_btn') ||
			target.classList.contains("step_number") ||
			target.classList.contains("step_title") ||
			target.classList.contains("step_description")) {
			return;
		}

		// Lets check if our underlying elements are listed below only
		if (target.nodeName.toLowerCase() == 'div' ||
			target.nodeName.toLowerCase() == "button" ||
			target.nodeName.toLowerCase() == "a" ||
			target.nodeName.toLowerCase() == "input" ||
			target.nodeName.toLowerCase() == "select" ||
			target.nodeName.toLowerCase() == "textarea" ||
			target.nodeName.toLowerCase() == "img" ||
			target.nodeName.toLowerCase() == "form" ||
			target.nodeName.toLowerCase() == "span") {
			if (prevDOM != null) {
				prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
				prevDOM.classList.remove(ANCHOR_MOUSE_VISITED_CLASSNAME);
				prevDOM.classList.remove(IMG_MOUSE_VISITED_CLASSNAME);
			}
			if (target.tagName.toLowerCase() == 'a') {
				target.classList.add(ANCHOR_MOUSE_VISITED_CLASSNAME);
				prevDOM = target;
			} else if (target.tagName.toLowerCase() == 'img'){
				target.classList.add(IMG_MOUSE_VISITED_CLASSNAME);
				prevDOM = target;
			} else {
				target.classList.add(MOUSE_VISITED_CLASSNAME);
				prevDOM = target;
			}
		}
	}, false);

	// Mouse listener for any move event on the current document.
	document.addEventListener('mouseout', function (event) {
		event.preventDefault();
		var target = event.target ? event.target : event.srcElement;
		//var srcElement = event.srcElement;

		if (target.id == 'tour_content_div' ||
			target.id == 'ank_btn_container' ||
			target.id == 'hide_content_btn' ||
			target.id == 'reset_content_btn' ||
			target.id == 'test_tour_btn' ||
			target.id == 'export_content_btn' ||
			target.id == 'question_btn' ||
			target.id == 'ank_theme' ||
			target.id == 'ank_hopscotch_theme' ||
			target.id == 'startTour') {
			return;
		}

		if (target.classList.contains('ank_div_btn') ||
			target.classList.contains('ank_tooltip') ||
			target.classList.contains('ank_tooltiptext') ||
			target.classList.contains('ank_btn') ||
			target.classList.contains("step_number") ||
			target.classList.contains("step_title") ||
			target.classList.contains("step_description")) {
			return;
		}

		if (target.nodeName.toLowerCase() == 'div' ||
			target.nodeName.toLowerCase() == "button" ||
			target.nodeName.toLowerCase() == "a" ||
			target.nodeName.toLowerCase() == "input" ||
			target.nodeName.toLowerCase() == "select" ||
			target.nodeName.toLowerCase() == "textarea" ||
			target.nodeName.toLowerCase() == "img" ||
			target.nodeName.toLowerCase() == "form" ||
			target.nodeName.toLowerCase() == "span") {
			prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
			prevDOM.classList.remove(ANCHOR_MOUSE_VISITED_CLASSNAME);
			prevDOM.classList.remove(IMG_MOUSE_VISITED_CLASSNAME);
		}
	}, false);

	// Mouse listener for any click event on the current document.
	document.addEventListener('click', function (event) {
		event.preventDefault();
		if (sessionStorage.tourStarted == "true") {
			return;
		}
		event = event || window.event;
		var target = event.target || event.srcElement;
		if (target.className.toLowerCase().trim().includes("ank_mouse_visited_remove")) {
			return;
		}
		if (target.id == 'dialog_submit' ||
			target.id == 'startTour') {
			return;
		}
		globalTarget = target;
		if (target.classList.contains("step_number") ||
			target.classList.contains("step_title") ||
			target.classList.contains("step_description")) {
			return;
		}

		if (target === document.getElementById("hide_content_btn")) {
			jQ("#ank_btn_container").hide();
			jQ("#tour_content_div").hide();
			return;
		}
		if (target === document.getElementById("reset_content_btn")) {
			jQ("#ank_btn_container").hide();
			jQ("#tour_content_div").hide();
			resetTour();
			return;
		}
		if (target === document.getElementById("test_tour_btn")) {
			jQ("#ank_btn_container").hide();
			jQ("#tour_content_div").hide();
			MOUSE_VISITED_CLASSNAME = 'ank_mouse_visited_remove';
			sessionStorage.tourStarted = true;
			createTour();
			return;
		}
		if (target === document.getElementById("tour_content_div")) {
			return;
		}

		if (target.id === "export_content_btn") { 
			exportTourContent();
			return;
		}
		if (target.id === "question_btn") {
			window.open("http://anakage.in/contact-us.html", "_blank");
			return;
		}

		if (target.nodeName.toLowerCase() == "button" ||
			target.nodeName.toLowerCase() == "a" ||
			target.nodeName.toLowerCase() == "input" ||
			target.nodeName.toLowerCase() == "select" ||
			target.nodeName.toLowerCase() == "textarea" ||
			target.nodeName.toLowerCase() == "div" ||
			target.nodeName.toLowerCase() == "img" ||
			target.nodeName.toLowerCase() == "form" ||
			target.nodeName.toLowerCase() == "span") {
			var text = target.textContent.replace(/[^\x20-\x7E]/g, "").trim();

			var title = "";
			var description = "";
			var position = "";
			var nextOnTargetClick = "";

			if (target.nodeName.toLowerCase() == "input") {
				title = 'Input box';
				var placeholder = target.placeholder;
				if (placeholder == null || typeof (placeholder) == 'undefined' || placeholder.length < 1) {
					description = 'Click on input box.';
				} else {
					description = placeholder;
				}
			} else if (target.nodeName.toLowerCase() == "textarea") {
				title = 'Textarea';
				var placeholder = target.placeholder;
				if (placeholder == null || typeof (placeholder) == 'undefined' || placeholder.length < 1) {
					description = 'Click on textarea.';
				} else {
					description = placeholder;
				}
			} else if (target.nodeName.toLowerCase() == "select") {
				title = 'Select field';
				description = 'Click on select field.';
			} else if (target.nodeName.toLowerCase() == "img") {
				title = 'Image';
				description = 'Click on image.';
			} else {
				title = text;
				description = 'Click on ' + text + '.';
			}

			jQ("#title").val(title);
			jQ("#description").val(description);
			jQ("#position").val("top");
			jQ("#nextOnTargetClick").val("false");

			jQ('#tour_step_confirm').dialog({
				title: "Step Confirmation: " + tourSteps,
				height: "auto",
				width: 450,
				modal: true,
				resizable: false,
				dialogClass: 'tour_step_confirm',
				open: function (event, ui) {
					jQ(".ui-widget-overlay").css({
						opacity: 1.0,
						filter: "Alpha(Opacity=100)",
						backgroundColor: "rgba(0,0,0,0.4);",
						zIndex: "9990"
					});
					jQ(".ui-dialog").css({
						zIndex: "9999"
					});
					MOUSE_VISITED_CLASSNAME = 'ank_mouse_visited_remove';
					sessionStorage.tourStarted = true;
					jQ(".ank_mouse_visited").removeClass("ank_mouse_visited");
				},
				close: function (event) {
					MOUSE_VISITED_CLASSNAME = 'ank_mouse_visited';
					sessionStorage.tourStarted = false;
				}
			});
		}
	}, false);
}

jQ("#dialog_submit").click(function () {
	//console.log("submit called");
	MOUSE_VISITED_CLASSNAME = 'ank_mouse_visited';
	sessionStorage.tourStarted = false;
	title = jQ("#title").val();
	description = jQ("#description").val();
	position = jQ("#position").val();
	nextOnTargetClick = jQ("#nextOnTargetClick").val();
	jQ("#tour_step_confirm").dialog("close");
	addStepToJson(globalTarget, title, description, position, nextOnTargetClick);
});

function showTourContent() {
	jQ("#tour_content_div").show(500);
	setTimeout(function () {
		jQ("#ank_btn_container").show();
	}, 800)
}

function createTour() {
	jQ("#tour_script").remove();
	josnData = "";
	for (var i = 0; i < contentJSON.length; i++) {
		if (contentJSON[i]["target"].includes("document.querySelector")) {
			josnData += "{target:" + contentJSON[i]["target"] + ",";
		} else {
			josnData += "{target:\"" + contentJSON[i]["target"] + "\",";
		}
		josnData += "title:\"" + contentJSON[i]["title"] + "\",";
		josnData += "content:\"" + contentJSON[i]["content"] + "\",";
		josnData += "placement:\"" + contentJSON[i]["placement"] + "\",";
		josnData += "nextOnTargetClick:\"" + contentJSON[i]["nextOnTargetClick"] + "\"},";
	}
	josnData = josnData.substring(0, josnData.length - 1);
	var tourContent = "var tour ={ id: 'anakage-hopscotch-tour',steps: [" + josnData + "], fixedElement: true, showPrevButton: true, onEnd: function() { var data = { type:'FROM_PAGE', text: 'tour ended!' };window.postMessage(data, '*'); } };";
	var jQtourScript = jQ("<script id='tour_script'>" + tourContent + " hopscotch.endTour(true); hopscotch.getState(); hopscotch.startTour(tour); </script>");
	jQ("body").append(jQtourScript);
}

function resetTour() {
	josnData = "";
	contentJSON = [];
	tourSteps = 1;
	jQ("#tour_content_div").empty();
	jQ("#tour_script").remove();
}

function exportTourContent() { 
	var isTourContentPresent = document.querySelector("#tour_script");
	//console.log(isTourContentPresent);
	if (isTourContentPresent != null) {
		var html = "Add hopscotch css(hopscotch.min.css) and js(hopscotch.min.js) file to your project.<br> "+
					"Download <a href='https://github.com/linkedin/hopscotch' traget='_blank'><b>hopscotch</b></a> "+ 
					"or learn more about <a href='http://linkedin.github.io/hopscotch/' target='_blank'><b>hopscotch</b></a> framework. <br> "
		html += jQ("#tour_script").html();
		jQ(window.open().document.body).html(html);
	} else {
		var html = "Please run tour before export.";
		jQ(window.open().document.body).html(html);
	}
}

window.addEventListener("message", function (event) {
	// We only accept messages from ourselves
	if (event.source != window) {
		return;
	}
	if (event.data.type && (event.data.type == "FROM_PAGE")) {
		console.log("Content script received message: " + event.data.text);
		sessionStorage.tourStarted = false;
		showTourContent();
		MOUSE_VISITED_CLASSNAME = 'ank_mouse_visited';
	}
	if (event.data.type && (event.data.type == "QUERY_SELECTOR")) {
		console.log("Content script received message: " + event.data.value);
	}
});

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function addStepToJson(target, title, description, position, nextOnTargetClick) {
	var id = target.id.trim();
	var classList = target.className.trim();
	classList = classList.replace('ank_mouse_visited', '').trim();
	var tagName = target.tagName.trim();
	var innerText = target.innerHTML.trim();
	var parent1Tag = target.parentNode.tagName;
	var parent2Tag = target.parentNode.parentNode.tagName;
	var parent3Tag = target.parentNode.parentNode.parentNode.tagName;

	// if it is an image [img] tag
	var src = target.src;
	if (typeof (src) == 'undefined' || src == null || src == '' || src.length < 1) {
		src = '';
	}
	// if it is an anchor [a] tag
	var href = target.href;
	if (typeof (href) == 'undefined' || href == null || href == '' || href.length < 1) {
		href = '';
	}

	if (tagName.toLowerCase() == 'a') {
		handleAnchorTag(target, title, description, position, nextOnTargetClick);
	}

	if (tagName.toLowerCase() == 'img') {
		handleImageTag(target, title, description, position, nextOnTargetClick);
	}

	if (tagName.toLowerCase() == 'input' || tagName.toLowerCase() == 'textarea') {
		handleInputTag(target, title, description, position, nextOnTargetClick);
	}

	if (tagName.toLowerCase() == 'button') {
		handleButtonTag(target, title, description, position, nextOnTargetClick);
	}

	if (tagName.toLowerCase() == 'div' || tagName.toLowerCase() == 'span') {
		handleCommonTag(target, title, description, position, nextOnTargetClick);
	}
}

function displayAddedStep(title, description) {
	var jQdiv = jQ('#tour_content_div');
	jQdiv.append('<span class="step_number ank_font_family">step <b>' + tourSteps++ + '</b></span><br>' +
		'<span class="step_title ank_font_family">Title : ' + title + '</span> <br>' +
		'<span class="step_description ank_font_family">Description : ' + description + '</span> <hr style=\'margin: 15px 0px;\'>');
	showTourContent();

}

function handleAnchorTag(target, title, description, position, nextOnTargetClick) {
	var id = target.id.trim();
	var classList = target.className.trim();
	classList = classList.replace('ank_mouse_visited', '').trim();
	var innerText = target.innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
	var parent1Tag = target.parentNode.tagName;
	var parent2Tag = target.parentNode.parentNode.tagName;
	var parent3Tag = target.parentNode.parentNode.parentNode.tagName;
	var href = target.href;
	var parentTags = getParentTags(parent1Tag, parent2Tag, parent3Tag);

	try {
		if (typeof (id) == 'undefined' || id == null || id == "" || id.length < 1) {
			if (typeof (href) == 'undefined' || href == null || href == "" || href.length < 1) {
				if (typeof (classList) == 'undefined' || classList == null || classList == "" || classList.length < 1) {
					var element = document.querySelectorAll('' + parentTags + ' a');
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == innerText) {
							break;
						}
						i++;
					}
					if (i >= element.length) {
						contentJSON.push({
							target: "document.querySelectorAll('" + parentTags + " a')[0]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					} else {
						contentJSON.push({
							target: "document.querySelectorAll('" + parentTags + " a')[" + i + "]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					}
				} else {
					if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
						var element = document.querySelectorAll(" " + parentTags + " a[class=\"" + classList + "\"]");
						var i = 0;
						while (i < element.length) {
							var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
							if (tempText == innerText) {
								break;
							}
							i++;
						}
						contentJSON.push({
							target: "document.querySelectorAll('" + parentTags + " a[class=\"" + classList + "\"]')[" + i + "]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					} else {
						contentJSON.push({
							target: "document.querySelector('" + parentTags + " a[class=\"" + classList + "\"]')",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					}
				}
			} else {
				// Remove href conflict with website name
				var siteName = window.top.location.origin;
				var hashValue = href.substring((href.length - 1), href.length);
				if (hashValue == "#") {
					href = "#";
				} else {
					var selecter1 = document.querySelector('a[href=\"' + href + '\"]');
					if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
						href = "/" + href.replace(siteName, '');
						selecter1 = document.querySelector('a[href=\"' + href + '\"]');
						if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
							href = href.replace(siteName, '');
							selecter1 = document.querySelector('a[href=\"' + href + '\"]');
							if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
								href = href.substring(1, href.length);
								selecter1 = document.querySelector('a[href=\"' + href + '\"]');
								if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
									href = href.substring(1, href.length);
									selecter1 = document.querySelector('a[href=\"' + href + '\"]');
								}
							}
						}
					}
				}

				if (parentTags != null || typeof (parentTags) != 'undefined' || parentTags.length < 1) {
					if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
						var element = document.querySelectorAll("" + parentTags + " a[href=\"" + href + "\"]");
						var i = 0;
						while (i < element.length) {
							var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
							if (tempText == innerText) {
								break;
							}
							i++;
						}
						contentJSON.push({
							target: "document.querySelectorAll('" + parentTags + " a[href=\"" + href + "\"]')[" + i + "]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						})
					} else {
						contentJSON.push({
							target: "document.querySelector('" + parentTags + " a[href=\"" + href + "\"]')",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						})
					}
				} else {
					if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
						var element = document.querySelectorAll("a[href=\"" + href + "\"]");
						var i = 0;
						while (i < element.length) {
							var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
							if (tempText == innerText) {
								break;
							}
							i++;
						}
						contentJSON.push({
							target: "document.querySelectorAll('a[href=\"" + href + "\"')[" + i + "]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					} else {
						contentJSON.push({
							target: "document.querySelector('a[href=\"" + href + "\"]')",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					}
				}
			}
		} else {
			if (parentTags != null || typeof (parentTags) != 'undefined' || parentTags.length < 1) {
				if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
					var element = document.querySelectorAll('' + parentTags + '#' + id + '');
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == innerText) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('" + parentTags + "#" + id + "')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					contentJSON.push({
						target: "document.querySelector('" + parentTags + "#" + id + "')",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				}
			} else {
				if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
					var element = document.querySelectorAll('#' + id + '');
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == innerText) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('#" + id + "')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					contentJSON.push({
						target: '#' + id,
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				}
			}
		}
		displayAddedStep(title, description);
	} catch (error) {
		alert("Unable to select the target please try with another way.");
		console.error("Anchor handle event " + error.message);
	}
}

function handleImageTag(target, title, description, position, nextOnTargetClick) {
	var id = target.id.trim();
	var classList = target.className.trim();
	classList = classList.replace('ank_mouse_visited', '').trim();
	var parent1Tag = target.parentNode.tagName;
	var parent2Tag = target.parentNode.parentNode.tagName;
	var parent3Tag = target.parentNode.parentNode.parentNode.tagName;
	var src = target.src;
	var alt = target.alt;
	var parentTags = getParentTags(parent1Tag, parent2Tag, parent3Tag);

	try {
		if (typeof (id) == 'undefined' || id == null || id == "" || id.length < 1) {
			if (typeof (src) == 'undefined' || src == null || src == "" || src.length < 1) {
				if (typeof (classList) == 'undefined' || classList == null || classList == "" || classList.length < 1) {
					var element = document.querySelectorAll('' + parentTags + 'img');
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].alt.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == alt) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('" + parentTags + "img')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					if (alt != null || typeof (alt) != 'undefined' || alt.length < 1) {
						var element = document.querySelectorAll(" " + parentTags + " img[class=\"" + classList + "\"]");
						var i = 0;
						while (i < element.length) {
							var tempText = element[i].alt.replace(/[^\x20-\x7E]/g, "").trim();
							if (tempText == alt) {
								break;
							}
							i++;
						}
						contentJSON.push({
							target: "document.querySelectorAll(' " + parentTags + " a[class=\"" + classList + "\"]')[" + i + "]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					} else {
						contentJSON.push({
							target: "document.querySelector(' " + parentTags + " img[class=\"" + classList + "\"]')",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					}
				}
			} else {
				var siteName = window.top.location.origin;
				var selecter1 = document.querySelector('' + parentTags + ' img[src=\"' + src + '\"]');
				if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
					src = "/" + src.replace(siteName, '');
					selecter1 = document.querySelector('' + parentTags + ' img[src=\"' + src + '\"]');
					if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
						src = src.replace(siteName, '');
						selecter1 = document.querySelector('' + parentTags + ' img[src=\"' + src + '\"]');
						if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
							src = src.substring(1, src.length);
							selecter1 = document.querySelector('' + parentTags + ' img[src=\"' + src + '\"]');
							if (selecter1 == null || typeof (selecter1) == 'undefined' || selecter1.length < 1) {
								src = src.substring(1, src.length);
							}
						}
					}
				}

				if (alt != null || typeof (alt) != 'undefined' || alt.length < 1) {
					var element = document.querySelectorAll("" + parentTags + " img[src=\"" + src + "\"]");
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].alt.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == alt) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('" + parentTags + "img[src=\"" + src + "\"]')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					contentJSON.push({
						target: "document.querySelector('" + parentTags + "img[src=\"" + src + "\"]')",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					})
				}
			}
		} else {
			if (alt != null || typeof (alt) != 'undefined' || alt.length < 1) {
				var element = document.querySelectorAll('' + parentTags + '#' + id + '');
				var i = 0;
				while (i < element.length) {
					var tempText = element[i].alt.replace(/[^\x20-\x7E]/g, "").trim();
					if (tempText == alt) {
						break;
					}
					i++;
				}
				contentJSON.push({
					target: "document.querySelectorAll('" + parentTags + "#" + id + "')[" + i + "]",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			} else {
				contentJSON.push({
					target: "document.querySelector('" + parentTags + "#" + id + "')",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			}
		}
		displayAddedStep(title, description);
	} catch (error) {
		alert("Unable to select the target please try with another way.");
		console.error("Image handle event " + error.message);
	}
}

function handleInputTag(target, title, description, position, nextOnTargetClick) {
	var id = target.id.trim();
	var classList = target.className.trim();
	classList = classList.replace('ank_mouse_visited', '').trim();
	var tagName = target.tagName.toLowerCase();
	var parent1Tag = target.parentNode.tagName;
	var parent2Tag = target.parentNode.parentNode.tagName;
	var parent3Tag = target.parentNode.parentNode.parentNode.tagName;
	var name = target.name;
	var placeholder = target.placeholder;
	var parentTags = getParentTags(parent1Tag, parent2Tag, parent3Tag);
	try {
		if (typeof (id) == 'undefined' || id == null || id == "" || id.length < 1) {
			if (typeof (name) == 'undefined' || name == null || name == "" || name.length < 1) {
				if (typeof (classList) == 'undefined' || classList == null || classList == "" || classList.length < 1) {
					var element = document.querySelectorAll('' + parentTags + ' ' + tagName + '');
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].placeholder.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == placeholder) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('" + parentTags + " " + tagName + "')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					if (placeholder != null || typeof (placeholder) != 'undefined' || placeholder.length < 1) {
						var element = document.querySelectorAll(" " + parentTags + " " + tagName + "[class=\"" + classList + "\"]");
						var i = 0;
						while (i < element.length) {
							var tempText = element[i].placeholder.replace(/[^\x20-\x7E]/g, "").trim();
							if (tempText == placeholder) {
								break;
							}
							i++;
						}
						contentJSON.push({
							target: "document.querySelectorAll(' " + parentTags + " " + tagName + "[class=\"" + classList + "\"]')[" + i + "]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					} else {
						contentJSON.push({
							target: "document.querySelector(' " + parentTags + " " + tagName + "[class=\"" + classList + "\"]')",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					}
				}
			} else {

				if (placeholder != null || typeof (placeholder) != 'undefined' || placeholder.length < 1) {
					var element = document.querySelectorAll("" + parentTags + " " + tagName + "[name=\"" + name + "\"]");
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].placeholder.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == placeholder) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('" + parentTags + " " + tagName + "[name=\"" + name + "\"]')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					contentJSON.push({
						target: "document.querySelector('" + parentTags + " " + tagName + "[name=\"" + name + "\"]')",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					})
				}
			}
		} else {
			if (placeholder != null || typeof (placeholder) != 'undefined' || placeholder.length < 1) {
				var element = document.querySelectorAll('' + parentTags + '#' + id + '');
				var i = 0;
				while (i < element.length) {
					var tempText = element[i].placeholder.replace(/[^\x20-\x7E]/g, "").trim();
					if (tempText == placeholder) {
						break;
					}
					i++;
				}
				contentJSON.push({
					target: "document.querySelectorAll('" + parentTags + "#" + id + "')[" + i + "]",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			} else {
				contentJSON.push({
					target: "document.querySelector('" + parentTags + "#" + id + "')",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			}
		}
		displayAddedStep(title, description);
	} catch (error) {
		alert("Unable to select the target please try with another way.");
		console.error("Input handle event " + error.message);
	}
}

function handleButtonTag(target, title, description, position, nextOnTargetClick) {
	var id = target.id.trim();
	var classList = target.className.trim();
	classList = classList.replace('ank_mouse_visited', '').trim();
	var tagName = target.tagName.toLowerCase();
	var parent1Tag = target.parentNode.tagName;
	var parent2Tag = target.parentNode.parentNode.tagName;
	var parent3Tag = target.parentNode.parentNode.parentNode.tagName;
	var name = target.name;
	var innerText = target.innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
	var parentTags = getParentTags(parent1Tag, parent2Tag, parent3Tag);

	try {
		if (typeof (id) == 'undefined' || id == null || id == "" || id.length < 1) {
			if (typeof (name) == 'undefined' || name == null || name == "" || name.length < 1) {
				if (typeof (classList) == 'undefined' || classList == null || classList == "" || classList.length < 1) {
					var element = document.querySelectorAll('' + parentTags + ' ' + tagName + '');
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == innerText) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('" + parentTags + " " + tagName + "')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
						var element = document.querySelectorAll(" " + parentTags + " " + tagName + "[class=\"" + classList + "\"]");
						var i = 0;
						while (i < element.length) {
							var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
							if (tempText == innerText) {
								break;
							}
							i++;
						}
						contentJSON.push({
							target: "document.querySelectorAll(' " + parentTags + " " + tagName + "[class=\"" + classList + "\"]')[" + i + "]",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					} else {
						contentJSON.push({
							target: "document.querySelector(' " + parentTags + " " + tagName + "[class=\"" + classList + "\"]')",
							title: title,
							content: description,
							placement: position,
							nextOnTargetClick: nextOnTargetClick
						});
					}
				}
			} else {
				if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
					var element = document.querySelectorAll("" + parentTags + " " + tagName + "[name=\"" + name + "\"]");
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == innerText) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll('" + parentTags + " " + tagName + "[name=\"" + name + "\"]')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					contentJSON.push({
						target: "document.querySelector('" + parentTags + " " + tagName + "[name=\"" + name + "\"]')",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					})
				}
			}
		} else {
			if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
				var element = document.querySelectorAll('' + parentTags + '#' + id + '');
				var i = 0;
				while (i < element.length) {
					var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
					if (tempText == innerText) {
						break;
					}
					i++;
				}
				contentJSON.push({
					target: "document.querySelectorAll('" + parentTags + "#" + id + "')[" + i + "]",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			} else {
				contentJSON.push({
					target: "document.querySelector('" + parentTags + "#" + id + "')",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			}
		}
		displayAddedStep(title, description);
	} catch (error) {
		alert("Unable to select the target please try with another way.");
		console.error("button handle event " + error.message);
	}

}

function handleCommonTag(target, title, description, position, nextOnTargetClick) {
	var id = target.id.trim();
	var classList = target.className.trim();
	classList = classList.replace('ank_mouse_visited', '').trim();
	var tagName = target.tagName.toLowerCase();
	var parent1Tag = target.parentNode.tagName;
	var parent2Tag = target.parentNode.parentNode.tagName;
	var parent3Tag = target.parentNode.parentNode.parentNode.tagName;
	var name = target.name;
	var innerText = target.innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
	var parentTags = getParentTags(parent1Tag, parent2Tag, parent3Tag);

	try {
		if (typeof (id) == 'undefined' || id == null || id == "" || id.length < 1) {
			if (typeof (classList) == 'undefined' || classList == null || classList == "" || classList.length < 1) {
				var element = document.querySelectorAll('' + parentTags + ' ' + tagName + '');
				var i = 0;
				while (i < element.length) {
					var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
					if (tempText == innerText) {
						break;
					}
					i++;
				}
				contentJSON.push({
					target: "document.querySelectorAll('" + parentTags + " " + tagName + "')[" + i + "]",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			} else {
				if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
					var element = document.querySelectorAll(" " + parentTags + " " + tagName + "[class=\"" + classList + "\"]");
					var i = 0;
					while (i < element.length) {
						var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
						if (tempText == innerText) {
							break;
						}
						i++;
					}
					contentJSON.push({
						target: "document.querySelectorAll(' " + parentTags + " " + tagName + "[class=\"" + classList + "\"]')[" + i + "]",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				} else {
					contentJSON.push({
						target: "document.querySelector(' " + parentTags + " " + tagName + "[class=\"" + classList + "\"]')",
						title: title,
						content: description,
						placement: position,
						nextOnTargetClick: nextOnTargetClick
					});
				}
			}
		} else {
			if (innerText != null || typeof (innerText) != 'undefined' || innerText.length < 1) {
				var element = document.querySelectorAll('' + parentTags + '#' + id + '');
				var i = 0;
				while (i < element.length) {
					var tempText = element[i].innerHTML.replace(/[^\x20-\x7E]/g, "").trim();
					if (tempText == innerText) {
						break;
					}
					i++;
				}
				contentJSON.push({
					target: "document.querySelectorAll('" + parentTags + "#" + id + "')[" + i + "]",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			} else {
				contentJSON.push({
					target: "document.querySelector('" + parentTags + "#" + id + "')",
					title: title,
					content: description,
					placement: position,
					nextOnTargetClick: nextOnTargetClick
				});
			}
		}
		displayAddedStep(title, description);
	} catch (error) {
		alert("Unable to select the target please try with another way.");
		console.error("common handle event " + error.message);
	}
}

function getParentTags(parent1Tag, parent2Tag, parent3Tag) {
	var parentTags = "";
	try {
		if (parent1Tag != null || typeof (parent1Tag) != 'undefined' || parent1Tag.length < 1) {
			parentTags = parent1Tag.toLowerCase();
			if (parent2Tag != null || typeof (parent2Tag) != 'undefined' || parent2Tag.length < 1) {
				parentTags = parent2Tag.toLowerCase() + " " + parent1Tag.toLowerCase();
				if (parent3Tag != null || typeof (parent3Tag) != 'undefined' || parent3Tag.length < 1) {
					parentTags = parent3Tag.toLowerCase() + " " + parent2Tag.toLowerCase() + " " + parent1Tag.toLowerCase() + " ";
				}
			}
		}
	} catch (error) {
		console.error("Parent Tag event " + error.message);
	}
	return parentTags;
}