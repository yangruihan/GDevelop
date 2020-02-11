/*
 * GDevelop JS Platform
 * Copyright 2013-2016 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */

/**
 * The `gdjs` namespace contains all classes and objects of the game engine.
 * @namespace
 */
window.gdjs = {
  objectsTypes: new Hashtable(),
  behaviorsTypes: new Hashtable(),
  /**
   * Contains functions used by events (this is a convention only, functions can actually
   * by anywhere).
   * @namespace
   * @memberOf gdjs
   */
  evtTools: {},
  callbacksRuntimeSceneLoaded: [],
  callbacksRuntimeSceneUnloaded: [],
  callbacksRuntimeScenePaused: [],
  callbacksRuntimeSceneResumed: [],
  callbacksObjectDeletedFromScene: [],
};

/**
 * Convert a rgb color value to a hex string.
 *
 * No "#" or "0x" are added.
 */
gdjs.rgbToHex = function(r, g, b) {
  return '' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Convert a rgb color value to a hex value.
 */
gdjs.rgbToHexNumber = function(r, g, b) {
  return (r << 16) + (g << 8) + b;
};

/**
 * Get a random integer between 0 and max.
 */
gdjs.random = function(max) {
  if (max <= 0) return 0;
  return Math.floor(Math.random() * (max + 1));
};

/**
 * Get a random integer between min and max
 */
gdjs.randomInRange = function(min, max) {
  return min + gdjs.random(max - min); // return min if min >= max
};

/**
 * Get a random float between 0 and max.
 */
gdjs.randomFloat = function(max) {
  if (max <= 0) return 0;
  return Math.random() * max;
};

/**
 * Get a random float between min and max
 */
gdjs.randomFloatInRange = function(min, max) {
  return min + gdjs.randomFloat(max - min); // return min if min >= max
};

/**
 * Get a random number between min and max in steps
 */
gdjs.randomWithStep = function(min, max, step) {
  if (step <= 0) return min + gdjs.random(max - min);
  return min + gdjs.random(Math.floor((max - min) / step)) * step; // return min if min >= max
};

/**
 * Convert an angle in degrees to radians.
 */
gdjs.toRad = function(angleInDegrees) {
  return (angleInDegrees / 180) * 3.14159;
};

/**
 * Convert an angle in radians to degrees.
 */
gdjs.toDegrees = function(angleInRadians) {
  return (angleInRadians * 180) / 3.14159;
};

/**
 * Register a runtime object (class extending {@link gdjs.RuntimeObject}) that can be used in a scene.
 *
 * The name of the type of the object must be complete, with the namespace if any. For
 * example, if you are providing a Text object in the TextObject extension, the full name
 * of the type of the object is "TextObject::Text".
 *
 * @param {string} objectTypeName The name of the type of the Object.
 * @param Ctor The constructor of the Object.
 */
gdjs.registerObject = function(objectTypeName, Ctor) {
  gdjs.objectsTypes.put(objectTypeName, Ctor);
};

/**
 * Register a runtime behavior (class extending {@link gdjs.RuntimeBehavior}) that can be used by a
 * {@link gdjs.RuntimeObject}.
 *
 * The type of the behavior must be complete, with the namespace of the extension. For
 * example, if you are providing a Draggable behavior in the DraggableBehavior extension,
 * the full name of the type of the behavior is "DraggableBehavior::Draggable".
 *
 * @param {string} behaviorTypeName The name of the type of the behavior.
 * @param Ctor The constructor of the Object.
 */
gdjs.registerBehavior = function(behaviorTypeName, Ctor) {
  gdjs.behaviorsTypes.put(behaviorTypeName, Ctor);
};

/**
 * Register a function to be called when a scene is loaded.
 * @param {Function} callback The function to be called.
 */
gdjs.registerRuntimeSceneLoadedCallback = function(callback) {
  gdjs.callbacksRuntimeSceneLoaded.push(callback);
};

/**
 * Register a function to be called when a scene is unloaded.
 * @param {Function} callback The function to be called.
 */
gdjs.registerRuntimeSceneUnloadedCallback = function(callback) {
  gdjs.callbacksRuntimeSceneUnloaded.push(callback);
};

/**
 * Register a function to be called when a scene is paused.
 * @param {Function} callback The function to be called.
 */
gdjs.registerRuntimeScenePausedCallback = function(callback) {
  gdjs.callbacksRuntimeScenePaused.push(callback);
};

/**
 * Register a function to be called when a scene is resumed.
 * @param {Function} callback The function to be called.
 */
gdjs.registerRuntimeSceneResumedCallback = function(callback) {
  gdjs.callbacksRuntimeSceneResumed.push(callback);
};

/**
 * Register a function to be called when an object is deleted from a scene.
 * @param {Function} callback The function to be called.
 */
gdjs.registerObjectDeletedFromSceneCallback = function(callback) {
  gdjs.callbacksObjectDeletedFromScene.push(callback);
};

/**
 * Keep this function until we're sure now client is using it anymore.
 * @deprecated
 * @private
 */
gdjs.registerGlobalCallbacks = function() {
  console.warning(
    "You're calling gdjs.registerGlobalCallbacks. This method is now useless and you must not call it anymore."
  );
};

/**
 * Remove all the global callbacks that were registered previously.
 *
 * Should only be used for testing - this should never be used at runtime.
 */
gdjs.clearGlobalCallbacks = function() {
  gdjs.callbacksRuntimeSceneLoaded = [];
  gdjs.callbacksRuntimeSceneUnloaded = [];
  gdjs.callbacksRuntimeScenePaused = [];
  gdjs.callbacksRuntimeSceneResumed = [];
  gdjs.callbacksObjectDeletedFromScene = [];
};

/**
 * Get the constructor of an object.
 *
 * @param {string} name The name of the type of the object.
 */
gdjs.getObjectConstructor = function(name) {
  if (name !== undefined && gdjs.objectsTypes.containsKey(name))
    return gdjs.objectsTypes.get(name);

  console.warn('Object type "' + name + '" was not found.');
  return gdjs.objectsTypes.get(''); //Create a base empty runtime object.
};

/**
 * Get the constructor of a behavior.
 *
 * @param {string} name The name of the type of the behavior.
 */
gdjs.getBehaviorConstructor = function(name) {
  if (name !== undefined && gdjs.behaviorsTypes.containsKey(name))
    return gdjs.behaviorsTypes.get(name);

  console.warn('Behavior type "' + name + '" was not found.');
  return gdjs.behaviorsTypes.get(''); //Create a base empty runtime behavior.
};

/**
 * Create a static array that won't need a new allocation each time it's used.
 */
gdjs.staticArray = function(owner) {
  owner._staticArray = owner._staticArray || [];
  return owner._staticArray;
};

/**
 * Create a second static array that won't need a new allocation each time it's used.
 */
gdjs.staticArray2 = function(owner) {
  owner._staticArray2 = owner._staticArray2 || [];
  return owner._staticArray2;
};

/**
 * Create a static object that won't need a new allocation each time it's used.
 */
gdjs.staticObject = function(owner) {
  owner._staticObject = owner._staticObject || {};
  return owner._staticObject;
};

/**
 * Return a new array of objects that is the concatenation of all the objects passed
 * as parameters.
 * @param objectsLists
 */
gdjs.objectsListsToArray = function(objectsLists) {
  var lists = gdjs.staticArray(gdjs.objectsListsToArray);
  objectsLists.values(lists);

  var result = [];
  for (var i = 0; i < lists.length; ++i) {
    var arr = lists[i];
    for (var k = 0; k < arr.length; ++k) {
      result.push(arr[k]);
    }
  }
  return result;
};

Array.prototype.remove = function(from) {
  //Adapted from the nice article available at
  //https://www.scirra.com/blog/76/how-to-write-low-garbage-real-time-javascript
  for (var i = from, len = this.length - 1; i < len; i++) this[i] = this[i + 1];

  this.length = len;
};

Array.prototype.createFrom = function(arr) {
  var len = arr.length;
  for (var i = 0; i < len; ++i) {
    this[i] = arr[i];
  }
  this.length = len;
};

//Make sure console.warn and console.error are available.
console.warn = console.warn || console.log;
console.error = console.error || console.log;
