// Even for a minimal example there are several functions that are commonly used by all minimal examples, eg. adding
// the correct script (wasm or asm.js), starting the webcam etc.

// Once we know whether wasm is supported we add the correct library script and initialize the example.

var _isWebAssemblySupported = (function() {

  function testSafariWebAssemblyBug() {

    var bin   = new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,127,1,127,3,2,1,0,5,3,1,0,1,7,8,1,4,116,101,115,116,0,0,10,16,1,14,0,32,0,65,1,54,2,0,32,0,40,2,0,11]);
    var mod   = new WebAssembly.Module(bin);
    var inst  = new WebAssembly.Instance(mod, {});

    // test storing to and loading from a non-zero location via a parameter.
    // Safari on iOS 11.2.5 returns 0 unexpectedly at non-zero locations

    return (inst.exports.test(4) !== 0);
  }

  var isWebAssemblySupported = (typeof WebAssembly === 'object');

  if(isWebAssemblySupported && !testSafariWebAssemblyBug()) {
    isWebAssemblySupported = false;
  }

  return isWebAssemblySupported;
})();

function readWASMBinary(url, onload, onerror, onprogress) {

  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function xhr_onload() {
    if (xhr.status === 200 || xhr.status === 0 && xhr.response) {
      onload(xhr.response);
      return;
    }
    onerror()
  };
  xhr.onerror = onerror;
  xhr.onprogress = onprogress;
  xhr.send(null);
}

function addBRFScript() {

  var script = document.createElement("script");

  script.setAttribute("type", "text/javascript");
  script.setAttribute("async", true);
  script.setAttribute("src", brfv4BaseURL + brfv4SDKName + ".js");

  document.getElementsByTagName("head")[0].appendChild(script);
}

// Some necessary global vars... (will need to refactor Stats for BRFv5.)

var brfv4Example = { stats: {} };
var brfv4BaseURL = _isWebAssemblySupported ? "js/libs/brf_wasm/" : "js/libs/brf_asmjs/";
var brfv4SDKName = "BRFv4_JS_TK110718_v4.1.0_trial"; // the currently available library
var brfv4WASMBuffer = null;

var handleTrackingResults = function(brfv4, faces, imageDataCtx) {

  // Overwrite this function in your minimal example HTML file.

  for(var i = 0; i < faces.length; i++) {

    var face = faces[i];

    if(face.state === brfv4.BRFState.FACE_TRACKING_START ||
      face.state === brfv4.BRFState.FACE_TRACKING) {

      imageDataCtx.strokeStyle="#00a0ff";

      for(var k = 0; k < face.vertices.length; k += 2) {
        imageDataCtx.beginPath();
        imageDataCtx.arc(face.vertices[k], face.vertices[k + 1], 2, 0, 2 * Math.PI);
        imageDataCtx.stroke();
      }
    }
  }
};

var onResize = function() {
  // implement this function in your minimal example, eg. fill the whole browser.
};

function initExample() {

  // This function is called after the BRFv4 script was added.

  // BRFv4 needs the correct input image data size for initialization.
  // That's why we need to get the img and its dimension first

  // Once the dimension of the img is known we need to wait for
  // BRFv4 to be ready to be initialized (waitForSDK, initSDK)

  // Once BRFv4 was initialized, we can track faces (trackFaces)

  var image         = document.getElementById("_image");      // our analyzed image
  var imageData     = document.getElementById("_imageData");  // image data for BRFv4
  var imageDataCtx  = null;                                   // only fetch the context once

  var brfv4         = null; // the library namespace
  var brfManager    = null; // the API
  var resolution    = null; // the image size

  handleImageInput();

  function handleImageInput() {

    console.log("handleImageInput");

    // Resize the canvas to match the img size.
    imageData.width   = image.width;
    imageData.height  = image.height;
    imageDataCtx      = imageData.getContext("2d");

    window.addEventListener("resize", onResize);
    onResize();

    waitForSDK();
  }

  function waitForSDK() {

    if(brfv4 === null && window.hasOwnProperty("initializeBRF")) {

      // Set up the namespace and initialize BRFv4.
      // locateFile tells the asm.js version where to find the .mem file.
      // wasmBinary gets the preloaded .wasm file.

      brfv4 = {
        locateFile: function(fileName) { return brfv4BaseURL + fileName; },
        wasmBinary: brfv4WASMBuffer // Add loaded WASM file to Module
      };

      initializeBRF(brfv4);
    }

    if(brfv4 && brfv4.sdkReady) {

      initSDK();

    } else {

      setTimeout(waitForSDK, 250); // wait a bit...
    }
  }

  function initSDK() {

    // The brfv4 namespace is now filled with the API classes and objects.
    // We can now initialize the BRFManager and the tracking API.

    resolution = new brfv4.Rectangle(0, 0, imageData.width, imageData.height);
    brfManager = new brfv4.BRFManager();
    brfManager.init(resolution, resolution, "com.tastenkunst.brfv4.js.examples.minimal.image");

    trackFaces();
  }

  function trackFaces() {

    if(brfv4Example.stats.start) brfv4Example.stats.start();

    imageDataCtx.drawImage(image, 0, 0, resolution.width, resolution.height);

    var data = imageDataCtx.getImageData(0, 0, resolution.width, resolution.height).data;

    // BRFv4 is meant to be used with a webcam stream.
    // A single image should be updated multiple times.

    for(var i = 0; i < 10; i++) {
      brfManager.update(data);
    }

    handleTrackingResults(brfv4, brfManager.getFaces(), imageDataCtx);

    if(brfv4Example.stats.end) brfv4Example.stats.end();

    requestAnimationFrame(trackFaces);
  }
}

(function() {

  // detect WebAssembly support and load either WASM or ASM version of BRFv4

  console.log("Checking support of WebAssembly: " +
    _isWebAssemblySupported + " " + (_isWebAssemblySupported ? "loading WASM (not ASM)." : "loading ASM (not WASM)."));

  if(_isWebAssemblySupported) {

    readWASMBinary(brfv4BaseURL + brfv4SDKName + ".wasm",
      function(r) {

        brfv4WASMBuffer = r; // see function waitForSDK. The ArrayBuffer needs to be added to the module object.

        addBRFScript();
        initExample();

      },
      function (e) { console.error(e); },
      function (p) { console.log(p); }
    );

  } else {

    addBRFScript();
    initExample();
  }

})();