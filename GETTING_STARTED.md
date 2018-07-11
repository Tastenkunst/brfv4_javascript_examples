# Beyond Reality Face SDK - v4.1.0 (BRFv4) - Getting Started ... 

### ... with brfv4_javascript_examples

+ Download or clone this Github repository.
+ Make sure to run the index.html file on a local server, eg. if you open this repo in Webstorm and run the index.html, Webstorm
will automatically create a localhost for you. You could also use MAMP or any other tool to create a local server.

This repo has three entry points. 

BRFDemo.js loaded by index.html creates the same UI as our [online JS Demo](https://tastenkunst.github.io/brfv4_javascript_examples/).

Tools used for this demo:

+ [CreateJS](http://createjs.com/) to draw the everything interesting on a <canvas>,
+ [ThreeJS](https://threejs.org/) to put a 3D model on top of a face,
+ [Quicksettings](https://github.com/bit101/quicksettings) for building the UI and
+ [Highlight.js](https://github.com/isagalaev/highlight.js) for showing the code snippets.

There are also two minimal examples that don't have any dependencies apart from BRFv4:

#### "Minimal Webcam" ([minimalWebcam.html](https://tastenkunst.github.io/brfv4_javascript_examples/minimalWebcam.html)) 

##### DOM

We need a &lt;video&gt; for the webcam playback and a &lt;canvas&gt; to draw the video data to and get the pixel array from.

##### JS

```javascript
function startCamera() {}
function waitForSDK() {}
function initSDK() {}
function trackFaces() {}
```
##### startCamera:

BRFv4 needs to know the dimensions of the image data. So the first thing to do is initializing the webcam.
A camera may or may not be able to deliver the requested resolution. That's why we need to wait for the final video
dimensions before initializing the SDK.

##### waitForSDK:

The SDK itself also needs to initialize its data internally. So after obtaining the dimensions we need to
wait for the SDK to be ready (this usually takes loading time for 9MB .mem file and 3 seconds to initialize) and then ...

##### initSDK:

Dimensions are known and the SDK is ready. So now it's time to call BRFManager.init with the image dimensions.
Then we setup an interval of 30FPS to ...

##### trackFaces:

We want to look into a mirror. That's why the canvas gets transformed, the video gets drawn and the canvas
gets transformed again to draw the results. In this example we draw the 68 landmarks of a face.

#### "Minimal Image" ([minimalImage.html](https://tastenkunst.github.io/brfv4_javascript_examples/minimalImage.html)) 

##### DOM

We need an &lt;img&gt; and a &lt;canvas&gt; to draw the image data to and get the pixel array from.

##### JS

```javascript
function waitForSDK() {}
function initSDK() {}
function trackFaces() {}
```

Since the img tag gets loaded before JS is executed we don't need to wait for the image dimensions and can immediately ...

##### waitForSDK:

The SDK itself needs to initialize its data internally. Once it is ready (this usually takes loading time for 9MB .mem 
file and 3 seconds to initialize) we can ...

##### initSDK:

Dimensions are known and the SDK is ready. So now it's time to call BRFManager.init with the image dimensions.

##### trackFaces:

BRFv4 is made to work on an camera stream. While calling BRFManager.update() once might be alright, it is best 
to make sure that we get a proper result be calling BRFManager.update() a few times in a row (maybe 10 times).




