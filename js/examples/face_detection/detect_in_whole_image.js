(function exampleCode() {
	"use strict";

	var _faceDetectionRoi = new brfv4.Rectangle();

	brfv4Example.initCurrentExample = function(brfManager, resolution) {

		brfManager.init(resolution, resolution, brfv4Example.appId);

		// We explicitly set the mode to run in: BRFMode.FACE_DETECTION.

		brfManager.setMode(brfv4.BRFMode.FACE_DETECTION);

		// Then we set the face detection region of interest to be
		// most/all of the overall analysed image (green rectangle, 100%).

		_faceDetectionRoi.setTo(
			resolution.width * 0.00, resolution.height * 0.00,
			resolution.width * 1.00, resolution.height * 1.00
		);
		brfManager.setFaceDetectionRoi(_faceDetectionRoi);

		// We can have either a landscape area (desktop), then choose height or
		// we can have a portrait area (mobile), then choose width as max face size.

		var maxFaceSize = _faceDetectionRoi.height;

		if(_faceDetectionRoi.width < _faceDetectionRoi.height) {
			maxFaceSize = _faceDetectionRoi.width;
		}

		// Merged faces (yellow) will only show up if they are at least 30% of maxFaceSize.
		// Move away from the camera to see the merged detected faces (yellow) disappear.

		// Btw. the following settings are the default settings set by BRFv4 on init.

		brfManager.setFaceDetectionParams(maxFaceSize * 0.30, maxFaceSize * 1.00, 12, 8);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		// Drawing the results:

		draw.clear();

		// Show the region of interest (green).

		draw.drawRect(_faceDetectionRoi,					false, 4.0, 0x8aff00, 0.5);

		// Then draw all detected faces (blue).

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);

		// In the end add the merged detected faces that have at least 12 detected faces
		// in a certain area (yellow).

		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		// Now print the face sizes:

		printSize(brfManager.getMergedDetectedFaces(), false);
	};

	function printSize(rects, printAlwaysMinMax) {

		var maxWidth = 0;
		var minWidth = 9999;

		for(var i = 0, l = rects.length; i < l; i++) {

			if(rects[i].width < minWidth) {
				minWidth = rects[i].width;
			}

			if(rects[i].width > maxWidth) {
				maxWidth = rects[i].width;
			}
		}

		if(maxWidth > 0) {

			var str = "";

			// One face or same size: name it size, otherwise name it min/max.

			if(minWidth === maxWidth && !printAlwaysMinMax) {
				str = "size: " + maxWidth.toFixed(0);
			} else {
				str = "min: " + minWidth.toFixed(0) + " max: " + maxWidth.toFixed(0);
			}

			brfv4Example.dom.updateHeadline("BRFv4 - basic - face detection - detect faces in " +
				"the whole image\nSet most of the/the whole image as detection area. " + str);
		}
	}

	brfv4Example.dom.updateHeadline("BRFv4 - basic - face detection - detect faces in the " +
		"whole image\nSet most of the/the whole image as detection area (region of interest).");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();