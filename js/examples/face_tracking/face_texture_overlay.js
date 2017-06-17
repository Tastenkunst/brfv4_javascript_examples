(function exampleCode() {
	"use strict";

	// assets/face_textures.js includes a texture jpg file as data url
	// This texture can be viewed by opening face_texture_overlay.html

	var faceTex = brfv4Example.faceTextures.marcel_0;
	var texture = new Image();
	texture.src = faceTex.tex;

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

				//draw.drawTriangles(face.vertices, face.triangles, false, 1.0, 0x00a0ff, 0.4);
				draw.drawVertices(face.vertices, 2.0, false, 0x00a0ff, 0.4);

				// Now draw the texture onto the vertices/triangles using UV mapping.

				// draw.drawTexture(face.vertices, face.triangles, faceTex.uv, texture);

				// ... or if you want to leave out the inner mouth, remove the last 6 triangles:

				var triangles = face.triangles.concat();

				triangles.splice(triangles.length - 3 * 6, 3 * 6);

				draw.drawTexture(face.vertices, triangles, faceTex.uv, texture);
			}
		}
	};

	brfv4Example.dom.updateHeadline("BRFv4 - advanced - a face texture overlay.\n" +
		"Have fun being Marcel! :D");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();