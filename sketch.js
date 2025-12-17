// Ephemeral Accumulation for Human Time Scale
// Concept and Programming by Marlon Barrios Solano

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5()


var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;
var direction = SOUTH;

var stepSize = 3;
var minLength = 10;
// var diameter = 1;
var angleCount = 7;
var angle;
var reachedBorder = true;

var posX;
var posY;
var posXcross;
var posYcross;
var frameCount = 0;
var resetFrameInterval = 60; // Will be set to random value between 1-60 seconds (60-3600 frames)

const settings = {
  pixelsPerInch: 300,
  p5: true,
  animate: true,
  dimensions: [512, 512],
  fps: 60,
  title: 'Ephemeral Accumulation for Human Time Scale',
  // Export settings
  exportFormat: 'png',
  // bleed: 1 / 8,
};

canvasSketch(() => {
  // Set the page title
  if (typeof document !== 'undefined') {
    document.title = 'Ephemeral Accumulation for Human Time Scale';
  }
  
  colorMode(HSB, 360, 100, 100, 100);
  background(360);

  function getRandomAngle(currentDirection) {
    var a = (floor(random(-angleCount, angleCount)) + 0.5) * 90 / angleCount;
    if (currentDirection == NORTH) return a - 90;
    if (currentDirection == EAST) return a;
    if (currentDirection == SOUTH) return a + 90;
    if (currentDirection == WEST) return a + 180;
    return 0;
  }

  function resetSketch(width, height) {
    // Reset all variables to start fresh
    direction = SOUTH;
    angle = getRandomAngle(direction);
    posX = floor(random(width));
    posY = 5;
    posXcross = posX;
    posYcross = posY;
    reachedBorder = true; // Set to true so first line draws immediately
  }

  angle = getRandomAngle(direction);
  posX = floor(random(width));
  posY = 5;
  posXcross = posX;
  posYcross = posY;
  frameCount = 0;
  
  // Initialize random reset interval (1 to 60 seconds)
  resetFrameInterval = floor(random(1, 61)) * 60; // Convert seconds to frames at 60fps

  return ({context,
    width,
    height,
    exportFrame
  }) => {
    // Keyboard shortcuts for saving (built into canvas-sketch):
    // - Cmd+S (Mac) or Ctrl+S (Windows) - Save current frame as PNG
    // - Cmd+Shift+S or Ctrl+Shift+S - Save with custom filename
    
    frameCount++;
    
    // Reset at random interval (1-60 seconds)
    if (frameCount >= resetFrameInterval) {
      // Clear canvas using context (more reliable)
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      context.restore();
      
      // Reset all variables
      resetSketch(width, height);
      
      // Generate new random reset interval (1 to 60 seconds)
      resetFrameInterval = floor(random(1, 61)) * 60; // Convert seconds to frames at 60fps
      
      // Reset frameCount to start counting again
      frameCount = 0;
      
      // Ensure drawing settings are reset
      colorMode(HSB, 360, 100, 100, 100);
      strokeWeight(1);
      
      // Reload pixels after clearing
      loadPixels();
    }
    
    var speed = 10;
  for (var i = 0; i <= speed; i++) {

    // ------ draw dot at current position ------
    strokeWeight(1);
    stroke(0);
    point(posX, posY);

    // ------ make step ------
    posX += cos(radians(angle)) * stepSize;
    posY += sin(radians(angle)) * stepSize;

    // ------ check if agent is near one of the display borders ------
    reachedBorder = false;

    if (posY <= 5) {
      direction = SOUTH;
      reachedBorder = true;
    } else if (posX >= width - 5) {
      direction = WEST;
      reachedBorder = true;
    } else if (posY >= height - 5) {
      direction = NORTH;
      reachedBorder = true;
    } else if (posX <= 5) {
      direction = EAST;
      reachedBorder = true;
    }

    // ------ if agent is crossing his path or border was reached ------
    loadPixels();
    var currentPixel = get(floor(posX), floor(posY));
    if (
      reachedBorder ||
      (currentPixel[0] != 255 && currentPixel[1] != 255 && currentPixel[2] != 255)
    ) {
      angle = getRandomAngle(direction);

      var distance = dist(posX, posY, posXcross, posYcross);
      if (distance >= minLength) {
        strokeWeight(1);
        stroke(0, 0, 0);
        line(posX, posY, posXcross, posYcross);
      }
      posXcross = posX;
      posYcross = posY;
    }
  }
  }
}, settings);
