(function exampleCode() {
	"use strict";

	var _extendedShape = new brfv4.BRFv4ExtendedFace();

	brfv4Example.initCurrentExample = function(brfManager, resolution) {
		brfManager.init(resolution, resolution, brfv4Example.appId);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		// Get all faces. The default setup only tracks one face.

		var faces = brfManager.getFaces();

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(		face.state === brfv4.BRFState.FACE_TRACKING_START ||
					face.state === brfv4.BRFState.FACE_TRACKING) {

				// The extended face shape is calculated from the usual 68 facial features.
				// The additional landmarks are just estimated, they are not actually tracked.

				_extendedShape.update(face);

				// Then we draw all 74 landmarks of the _extendedShape.

				draw.drawTriangles(	_extendedShape.vertices, _extendedShape.triangles,
					false, 1.0, 0x00a0ff, 0.4);
				draw.drawVertices(	_extendedShape.vertices, 2.0, false, 0x00a0ff, 0.4);
			}
		}
	};

	brfv4Example.dom.updateHeadline("BRFv4 - basic - face tracking - extended face shape\n" +
		"There are 6 more landmarks for the forehead calculated from the 68 landmarks.");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();