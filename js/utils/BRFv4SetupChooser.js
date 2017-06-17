(function() {
	"use strict";

	if(typeof QuickSettings === "undefined") return;

	var urlMap 	= {
		"Webcam Setup":		"webcam",
		"Picture Setup":	"picture"
	};
	var labels = [];
	for (var key in urlMap) { labels.push(key); } // Fill in the labels.

	function onSetupChosen(data) {
		brfv4Example.init(urlMap[data.value]);
	}

	if(!brfv4Example.gui.setupChooser) {

		QuickSettings.useExtStyleSheet();

		brfv4Example.gui.setupChooser = QuickSettings.create(
			7, 7, "Setup Chooser", brfv4Example.dom.createDiv("_settingsLeft"))
			.setWidth(300)
			.addHTML("Switch between setups", "Choose either webcam or loaded picture.<br/><br/>Make sure you opened the https:// URL. Otherwise the webcam may not start in Chrome.")
			.addDropDown("_setup", labels, onSetupChosen)
			.hideTitle("_setup");
	}
})();