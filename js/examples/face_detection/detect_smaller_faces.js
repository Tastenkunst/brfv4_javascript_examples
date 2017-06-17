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

		// Face detection:
		//
		// Internally BRFv4 uses a DYNx480 (landscape) or 480xDYN (portrait)
		// image for it's analysis. So 480px is the base size that every other
		// input size compares to (eg. 1280x720 -> 854x480).
		//
		// The minimum detectable face size for the following resolutions are:
		//
		//  640 x  480: 24px ( 480 / 480 = 1.00 * 24 = 24) (base)
		// 1280 x  720: 36px ( 720 / 480 = 1.50 * 24 = 36)
		// 1920 x 1080: 54px (1080 / 480 = 2.25 * 24 = 54)
		//
		// Also: faces (blue) are only detected at step sizes multiple of 12.
		// So the actual face detection layers (sizes) are:
		//
		//  640 x  480: 24, 36,  48,  60,  72, ...,  456,  468,  480
		// 1280 x  720: 36, 54,  72,  90, 108, ...,  684,  702,  720
		// 1920 x 1080: 54, 81, 108, 135, 162, ..., 1026, 1053, 1080
		//
		// Detected faces (blue) get merged (yellow) if they are
		// + roughly placed in the same location,
		// + roughly the same size and
		// + have at least minMergeNeighbors of other rectangle in the same spot (4 in this case).

		// Let's set some small values. To see a result you need to be far away
		// from the webcam or hold an image with a small face in front of your webcam.

		var stepSize	= 12;								// multiple of 12, either: 12, 24, 36 etc.
		var minFaceSize = _faceDetectionRoi.height * 0.10;	// 48 for 480,  72 for 720, 108 for 1080
		var maxFaceSize = minFaceSize + stepSize * 2;		// 72 for 480, 108 for 720, 162 for 1080

		brfManager.setFaceDetectionParams(minFaceSize, maxFaceSize, stepSize, 4);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		// Drawing the results:

		draw.clear();

		// Show the region of interest (green).

		draw.drawRect(_faceDetectionRoi,					false, 2.0, 0x8aff00, 0.5);

		// Then draw all detected faces (blue).

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);

		// In the end add the merged detected faces that have at least 4 detected faces
		// in a certain area (yellow).

		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		// Now print the face sizes:

		printSize(brfManager.getMergedDetectedFaces(), true);
	};

	function printSize(rects, printAlwaysMinMax) {

		var maxWidth	= 0;
		var minWidth	= 9999;

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

			brfv4Example.dom.updateHeadline("BRFv4 - basic - face detection - detect small faces\n" +
				"Limit the maxFaceSize and minFaceSize to detect small faces. " + str);
		}
	}

	brfv4Example.dom.updateHeadline("BRFv4 - basic - face detection - detect small faces\n" +
		"Limit the maxFaceSize and minFaceSize to detect small faces. ");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();