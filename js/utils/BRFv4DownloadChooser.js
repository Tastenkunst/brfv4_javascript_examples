(function() {
	"use strict";

	if(typeof QuickSettings === "undefined") return;

	if(!brfv4Example.gui.downloadChooser) {

		QuickSettings.useExtStyleSheet();

		brfv4Example.gui.downloadChooser = QuickSettings.create(
			2, 270, "Download trial SDKs", brfv4Example.dom.createDiv("_settingsRight"))
			.setWidth(250)
			.addHTML("Info", "The BRFv4 example packages are available on our Github page:<br><br>" +
				"<a href='https://github.com/Tastenkunst/' target='_blank'>Github</a><br/><br/>").hideTitle("Info")
			.addHTML("Other Links", "Other useful links:<br><br>" +
				"<a href='https://tastenkunst.github.io/brfv4_docs/what_can_i_do_with_it.html' target='_blank'>What can I do with it?</a><br/>" +
				"<a href='https://www.beyond-reality-face.com' target='_blank'>Website</a><br/>" +
				"<a href='https://www.facebook.com/BeyondRealityFace' target='_blank'>Facebook</a><br/>" +
				"<a href='https://twitter.com/tastenkunst' target='_blank'>Twitter</a><br/><br/>"
			).hideTitle("Other Links")
		}
})();