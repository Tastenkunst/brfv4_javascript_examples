(function exampleCode() {
	"use strict";

	var numFacesToTrack	= 2;				// Set the number of faces to detect and track.

	brfv4Example.initCurrentExample = function(brfManager, resolution, draw) {

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

		// Load all image masks for quick switching.

		prepareImages(draw);

		// Add a click event to cycle through the image overlays.

		draw.clickArea.addEventListener("click", onClicked);
		draw.clickArea.mouseEnabled = true;
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		// Get all faces. The default setup only tracks one face.

		var faces = brfManager.getFaces();

		// If no face was tracked: hide the image overlays.

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];			// get face
			var baseNode = _baseNodes[i];	// get image container

			if(		face.state === brfv4.BRFState.FACE_TRACKING_START ||
					face.state === brfv4.BRFState.FACE_TRACKING) {

				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, 0x00a0ff, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, 0x00a0ff, 0.4);

				// Set position to be nose top and calculate rotation.

				baseNode.x			= face.points[27].x;
				baseNode.y			= face.points[27].y;

				baseNode.scaleX		= (face.scale / 480) * (1 - toDegree(Math.abs(face.rotationY)) / 110.0);
				baseNode.scaleY		= (face.scale / 480) * (1 - toDegree(Math.abs(face.rotationX)) / 110.0);
				baseNode.rotation	= toDegree(face.rotationZ);

				baseNode.alpha		= 1.0;

			} else {

				baseNode.alpha		= 0.0;
			}
		}
	};

	function onClicked(event) {
		var i = _images.indexOf(_image) + 1;

		if(i === _images.length) {
			i = 0;
		}

		_image = _images[i];
		changeImage(_image, i);
	}

	function changeImage(bitmap, index) {

		bitmap.scaleX = _imageScales[index];
		bitmap.scaleY = _imageScales[index];

		bitmap.x = -parseInt(bitmap.getBounds().width  * bitmap.scaleX * 0.50);
		bitmap.y = -parseInt(bitmap.getBounds().height * bitmap.scaleY * 0.45);

		for(var i = 0; i < numFacesToTrack; i++) {

			var baseNode = _baseNodes[i];
			baseNode.removeAllChildren();

			if(i === 0) {
				baseNode.addChild(bitmap);
			} else {
				baseNode.addChild(bitmap.clone());
			}
		}
	}

	function prepareImages(draw) {

		draw.imageContainer.removeAllChildren();

		var i = 0;
		var l = 0;

		for(i = 0, l = numFacesToTrack; i < l; i++) {
			var baseNode = new createjs.Container();
			draw.imageContainer.addChild(baseNode);
			_baseNodes.push(baseNode);
		}

		for(i = 0, l = _imageURLs.length; i < l; i++) {
			_images[i] = new createjs.Bitmap(_imageURLs[i]);

			if(i === 0) {
				_image = _images[i];
				_image.image.onload = function() {
					changeImage(_image, 0);
				}
			}
		}
	}

	var _imageURLs		= ["assets/brfv4_lion.png",  "assets/brfv4_img_glasses.png"];
	var _imageScales	= [3.3, 1.0];

	var _images			= [];
	var _image			= null;

	var _baseNodes		= [];

	var toDegree		= brfv4.BRFv4PointUtils.toDegree;

	brfv4Example.dom.updateHeadline("BRFv4 - advanced - face tracking - PNG/mask image overlay.\n" +
		"Click to cycle through images.");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();