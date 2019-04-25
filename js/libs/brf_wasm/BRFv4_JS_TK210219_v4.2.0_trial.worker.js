var brfv4       = null;
var brfManager  = null;
var resolution  = null;

var window      = window || self;
var document    = document || self;

importScripts("BRFv4_JS_TK210219_v4.2.0_trial.js");

self.addEventListener('message', function(e) {

  if(e.data === "waitForSDK") {

    waitForSDK();

  } else {

    var dataBuffer = new Int32Array(e.data);

    if(dataBuffer.length === 4) {

      // "initBRFv4Manager"

      resolution = new brfv4.Rectangle(dataBuffer[0], dataBuffer[1], dataBuffer[2], dataBuffer[3]);

      brfManager = new brfv4.BRFManager();
      brfManager.init(resolution, resolution, "com.tastenkunst.brfv4.js.examples.minimal.webworker");

      self.postMessage("onInitBRFv4Manager");

    } else if(resolution !== null && dataBuffer.length === resolution.width * resolution.height) {

      // track

      dataBuffer = new Uint8ClampedArray(e.data);

      brfManager.update(dataBuffer);

      var faces = brfManager.getFaces();
      var vertices = new Float32Array(68 * 2);

      if(faces.length > 0) {

        var face = faces[0];

        for(var k = 0; k < face.vertices.length; k++) {

          vertices[k] = face.vertices[k];
        }
      }

      self.postMessage(vertices);
    }
  }

}, false);

function initializeSDK() {

  if(brfv4 === null) {

    brfv4 = {

      locateFile: function(fileName) {

        return fileName;
      },

      ENVIRONMENT: "WORKER"
    };

    initializeBRF(brfv4);
  }
}

initializeSDK();

function waitForSDK() {

  if(!!brfv4 && brfv4.sdkReady) {

    self.postMessage("initSDK");

  } else {

    setTimeout(waitForSDK, 100);
  }
}