(function exampleCode() {
	"use strict";

	var t3d = brfv4Example.drawing3d.t3d;
	var numFacesToTrack = 1;

	function loadModels() {

		if(t3d) {

			// Remove all models and load new ones.

			t3d.removeAll();
			t3d.loadOcclusionHead("assets/brfv4_occlusion_head.json", numFacesToTrack);
			t3d.loadModel("assets/brfv4_model.json", numFacesToTrack);
		}
	}

	brfv4Example.initCurrentExample = function(brfManager, resolution) {

		brfManager.init(resolution, resolution, brfv4Example.appId);
		brfManager.setNumFacesToTrack(numFacesToTrack);

		// Relax starting conditions to eventually find more faces.

		var maxFaceSize = resolution.height;

		if(resolution.width < resolution.height) {
			maxFaceSize = resolution.width;
		}

		brfManager.setFaceDetectionParams(		maxFaceSize * 0.20, maxFaceSize * 1.00, 12, 8);
		brfManager.setFaceTrackingStartParams(	maxFaceSize * 0.20, maxFaceSize * 1.00, 32, 35, 32);
		brfManager.setFaceTrackingResetParams(	maxFaceSize * 0.15, maxFaceSize * 1.00, 40, 55, 32);

		loadModels();
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		if(t3d) t3d.hideAll(); // Hide 3d models. Only show them on top of tracked faces.

		draw.clear();

		var faces = brfManager.getFaces();

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(face.state === brfv4.BRFState.FACE_TRACKING) {

				// Draw the 68 facial feature points as reference.

				draw.drawVertices(face.vertices, 2.0, false, 0x00a0ff, 0.4);

				// Set the 3D model according to the tracked results.

				if(t3d) t3d.update(i, face, true);
			}
		}

		if(t3d) { t3d.render(); }
	};

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");

	brfv4Example.dom.updateHeadline("BRFv4 - advanced - face_tracking - ThreeJS example.\n" +
		"Tracks up to " + numFacesToTrack + " faces and puts glasses on them.");
})();