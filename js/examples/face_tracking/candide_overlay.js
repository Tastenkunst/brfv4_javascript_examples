(function exampleCode() {
	"use strict";

	brfv4Example.initCurrentExample = function(brfManager, resolution) {

		// By default everything necessary for a single face tracking app
		// is set up for you in brfManager.init. There is actually no
		// need to configure much more for a jump start.

		brfManager.init(resolution, resolution, brfv4Example.appId);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		// In a webcam example imageData is the mirrored webcam video feed.
		// In an image example imageData is the (not mirrored) image content.

		brfManager.update(imageData);

		// Drawing the results:

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		// Get all faces. The default setup only tracks one face.

		var faces = brfManager.getFaces();

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(	face.state === brfv4.BRFState.FACE_TRACKING) {

				// Instead of drawing the 68 landmarks this time we draw the Candide3 model shape (yellow).

				draw.drawTriangles(	face.candideVertices, face.candideTriangles, false, 1.0, 0xffd200, 0.4);
				draw.drawVertices(	face.candideVertices, 2.0, false, 0xffd200, 0.4);

				// And for a reference also draw the 68 landmarks (blue).

				draw.drawVertices(	face.vertices, 2.0, false, 0x00a1ff, 0.4);
			}
		}
	};

	brfv4Example.dom.updateHeadline("BRFv4 - basic - face tracking - candide shape overlay\n" +
		"The Candide 3 model is calculated from the 68 landmarks.");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();