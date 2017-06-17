(function() {
	"use strict";

	if(typeof QuickSettings === "undefined") return;

	var urlMap 	= {
		"Choose": [],
		"HTML5 - Javascript":					"https://www.dropbox.com/s/a55rjdm1snh39gv/170609_BRFv4_JS_TK090617_v4.0RC1_trial.zip?dl=0",
		"iOS - ObjectiveC/C++":					"https://www.dropbox.com/s/5mq3gvfkpaou6nx/170609_BRFv4_IOS_TK090617_v4.0RC1_trial.zip?dl=0",
		"Android - Java":						"https://www.dropbox.com/s/xgcn9rin9oupaj5/170609_BRFv4_ANDROID_TK090617_v4.0RC1_trial.zip?dl=0",
		"macOS - OpenCV C++":					"https://www.dropbox.com/s/g9vbft55ukped4k/170609_BRFv4_MAC_TK090617_v4.0RC1_trial.zip?dl=0",
		"Windows - OpenCV C++":					"https://www.dropbox.com/s/etv9zcb5oe8d9xi/170609_BRFv4_WIN_TK090617_v4.0RC1_trial.zip?dl=0",
		"Adobe AIR ANE - Actionscript 3":		"https://www.dropbox.com/s/nvr9119nxh77vju/170609_BRFv4_ANE_TK090617_v4.0RC1_trial.zip?dl=0"
	};
	var labels = [];
	for (var key in urlMap) { labels.push(key); } // Fill in the labels.

	function onExampleDownload(data) {

		var url = urlMap[data.value];

		if(url) {
			if(typeof url === "string") {
				window.open([url]);
			}
		}
	}

	function onClick(e) {
		window.open("http://www.tastenkunst.com/#/contact");
	}

	if(!brfv4Example.gui.downloadChooser) {

		QuickSettings.useExtStyleSheet();

		brfv4Example.gui.downloadChooser = QuickSettings.create(
			7, 225, "Download trial SDKs (beta)", brfv4Example.dom.createDiv("_settingsLeft"))
			.setWidth(200)
			.addHTML("Disclaimer", "Notice that these examples may change.<br/><br/>" +
				"The packages for macOS (Xcode project) and Windows (Visual Studio project) " +
				"need an installed OpenCV 3.2. for the camera handling.<br/><br/>" +
				"Contact us for a license at:")
			.addButton("www.tastenkunst.com/#/contact", onClick)
			.addDropDown("_download", labels, onExampleDownload)
			.hideTitle("_download");
	}
})();