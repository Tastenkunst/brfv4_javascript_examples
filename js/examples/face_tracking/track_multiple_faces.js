(function exampleCode() {
	"use strict";

	var numFacesToTrack = 2; // Set the number of faces to detect and track.

	brfv4Example.initCurrentExample = function(brfManager, resolution) {

		// By default everything necessary for a single face tracking app
		// is set up for you in brfManager.init.

		brfManager.init(resolution, resolution, brfv4Example.appId);

		// But here we tell BRFv4 to track multiple faces. In this case two.

		// While the first face is getting tracked the face detection
		// is performed in parallel and is looking for a second face.

		brfManager.setNumFacesToTrack(numFacesToTrack);

		// Relax starting conditions to eventually find more faces.

		var maxFaceSize = resolution.height;

		if(resolution.width < resolution.height) {
			maxFaceSize = resolution.width;
		}

		brfManager.setFaceDetectionParams(		maxFaceSize * 0.20, maxFaceSize * 1.00, 12, 8);
		brfManager.setFaceTrackingStartParams(	maxFaceSize * 0.20, maxFaceSize * 1.00, 32, 35, 32);
		brfManager.setFaceTrackingResetParams(	maxFaceSize * 0.15, maxFaceSize * 1.00, 40, 55, 32);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		// Drawing the results:

		draw.clear();

		// Get all faces. We get numFacesToTrack faces in that array.

		var faces = brfManager.getFaces();

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			// Every face has it's own states.
			// While the first face might already be tracking,
			// the second face might just try to detect a face.

			if(face.state === brfv4.BRFState.FACE_DETECTION) {

				// Face detection results: a rough rectangle used to start the face tracking.

				draw.drawRects(brfManager.getMergedDetectedFaces(), false, 2.0, 0xffd200, 1.0);

			} else if(	face.state === brfv4.BRFState.FACE_TRACKING_START ||
						face.state === brfv4.BRFState.FACE_TRACKING) {

				// Face tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, 0x00a0ff, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, 0x00a0ff, 0.4);
			}
		}
	};

	brfv4Example.dom.updateHeadline("BRFv4 - basic - face tracking - track multiple faces\n" +
		"Detect and track " + numFacesToTrack + " faces and draw their 68 facial landmarks.");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");

})();