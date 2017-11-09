(function exampleCode() {
	"use strict";

	brfv4Example.initCurrentExample = function(brfManager, resolution) {
		brfManager.init(resolution, resolution, brfv4Example.appId);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		var faces = brfManager.getFaces(); // default: one face, only one element in that array.

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(		face.state === brfv4.BRFState.FACE_TRACKING_START ||
					face.state === brfv4.BRFState.FACE_TRACKING) {

				// Yawn Detection - Or: How wide open is the mouth?

				setPoint(face.vertices, 39, p1); // left eye inner corner
				setPoint(face.vertices, 42, p0); // right eye outer corner

				var eyeDist = calcDistance(p0, p1);

				setPoint(face.vertices, 62, p0); // mouth upper inner lip
				setPoint(face.vertices, 66, p1); // mouth lower inner lip

				var mouthOpen = calcDistance(p0, p1);
				var yawnFactor = mouthOpen / eyeDist;

				yawnFactor -= 0.35; // remove smiling

				if(yawnFactor < 0) yawnFactor = 0;

				yawnFactor *= 2.0; // scale up a bit

				if(yawnFactor > 1.0) yawnFactor = 1.0;

				if(yawnFactor < 0.0) { yawnFactor = 0.0; }
				if(yawnFactor > 1.0) { yawnFactor = 1.0; }

				// Let the color show you how much you yawn.

				var color =
					(((0xff * (1.0 - yawnFactor) & 0xff) << 16)) +
					(((0xff * yawnFactor) & 0xff) << 8);

				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

				brfv4Example.dom.updateHeadline("BRFv4 - Advanced - A Simple Yawn Detection.\n" +
					"Detects how wide open the mouth is: " + (yawnFactor * 100).toFixed(0) + "%");
			}
		}
	};

	var p0				= new brfv4.Point();
	var p1				= new brfv4.Point();

	var setPoint		= brfv4.BRFv4PointUtils.setPoint;
	var calcDistance	= brfv4.BRFv4PointUtils.calcDistance;

	brfv4Example.dom.updateHeadline("BRFv4 - intermediate - face tracking - simple yawn detection.\n" +
		"Detects how wide open the mouth is.");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();