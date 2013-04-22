/**
 * @fileOverview Contains the core classes for EyeDraw
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 1.2
 *
 * Modification date: 28th March 2012
 * Copyright 2011 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
var ED = new Object();

/**
 * Radius of inner handle displayed with selected doodle
 * @constant
 */
ED.handleRadius = 15;

/**
 * Distance in doodle plane moved by pressing an arrow key
 * @constant
 */
ED.arrowDelta = 4;

/**
 * SquiggleWidth
 */
ED.squiggleWidth = {
    Thin: 4,
    Medium: 8,
    Thick: 12
}

/**
 * SquiggleStyle
 */
ED.squiggleStyle = {
    Outline: 0,
    Solid: 1
}

/**
 * Flag to detect double clicks
 */
ED.recentClick = false;

/**
 * Eye (Some doodles behave differently according to side)
 */
ED.eye = {
    Right: 0,
    Left: 1
}

/**
 * Draw function mode (Canvas pointInPath function requires a path)
 */
ED.drawFunctionMode = {
    Draw: 0,
    HitTest: 1
}

/**
 * Mouse dragging mode
 */
ED.Mode = {
    None: 0,
    Move: 1,
    Scale: 2,
    Arc: 3,
    Rotate: 4,
    Apex: 5,
    Handles: 6,
    Draw: 7,
    Select: 8
}

/**
 * Handle ring
 */
ED.handleRing = {
    Inner: 0,
    Outer: 1
}

/**
 * Flag to indicate when the drawing has been modified
 */
ED.modified = false;

/*
 * Chris Raettig's function for getting accurate mouse position in all browsers
 *
 * @param {Object} obj Object to get offset for, usually canvas object
 * @returns {Object} x and y values of offset
 */
ED.findOffset = function(obj, curleft, curtop) {
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            left: curleft,
            top: curtop
        };
    }
}

ED.findPosition = function(obj, event) {
    if (typeof jQuery != 'undefined') {
        var offset = jQuery(obj).offset();
    } else {
        var offset = ED.findOffset(obj, 0, 0);
    }
    return {
        x: event.pageX - offset.left,
        y: event.pageY - offset.top
    };
}

/*
 * Function to test whether a Javascript object is empty
 *
 * @param {Object} _object Object to apply test to
 * @returns {Bool} Indicates whether object is empty or not
 */
ED.objectIsEmpty = function(_object) {
    for (var property in _object) {
        if (_object.hasOwnProperty(property)) return false;
    }

    return true;
}

/*
 * Returns true if browser is firefox
 *
 * @returns {Bool} True is browser is firefox
 */
ED.isFirefox = function() {
    var index = 0;
    var ua = window.navigator.userAgent;
    index = ua.indexOf("Firefox");

    if (index > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Returns 'true' remainder of a number divided by a modulus (i.e. always positive, unlike x%y)
 *
 * @param {Float} _x number
 * @param {Float} _y modulus
 * @returns {Float} True modulus of _x/_y
 */
ED.Mod = function Mod(_x, _y) {
    return _x - Math.floor(_x / _y) * _y;
}

/**
 * Converts an angle (positive or negative) into a positive angle (ie a bearing)
 *
 * @param {Float} _angle Angle in radians
 * @returns {Float} Positive angle between 0 and 2 * Pi
 */
ED.positiveAngle = function(_angle) {
    var circle = 2 * Math.PI;

    // First make it positive
    while (_angle < 0) {
        _angle += circle;
    }

    // Return remainder
    return _angle % circle;
}

/**
 * Error handler
 *
 * @param {String} _class Class
 * @param {String} _method Method
 * @param {String} _message Error message
 */
ED.errorHandler = function(_class, _method, _message) {
    console.log('EYEDRAW ERROR! class: [' + _class + '] method: [' + _method + '] message: [' + _message + ']');
}

/**
 * Array of 200 random numbers
 */
ED.randomArray = [0.6570, 0.2886, 0.7388, 0.1621, 0.9896, 0.0434, 0.1695, 0.9099, 0.1948, 0.4433, 0.1580, 0.7392, 0.8730, 0.2165, 0.7138, 0.6316, 0.3425, 0.2838, 0.4551, 0.4153, 0.7421, 0.3364, 0.6087, 0.1986, 0.5764, 0.1952, 0.6179, 0.6699, 0.0903, 0.2968, 0.2684, 0.9383, 0.2488, 0.4579, 0.2921, 0.9085, 0.7951, 0.4500, 0.2255, 0.3366, 0.6670, 0.7300, 0.5511, 0.5623, 0.1376, 0.5553, 0.9898, 0.4317, 0.5922, 0.6452, 0.5008, 0.7077, 0.0704, 0.2293, 0.5697, 0.7415, 0.1557, 0.2944, 0.4566, 0.4129, 0.2449, 0.5620, 0.4105, 0.5486, 0.8917, 0.9346, 0.0921, 0.7998, 0.7717, 0.0357, 0.1179, 0.0168, 0.1520, 0.5187, 0.3466, 0.1663, 0.5935, 0.7524, 0.8410, 0.1859, 0.6012, 0.8171, 0.9272, 0.3367, 0.8133, 0.4868, 0.3665, 0.9625, 0.7839, 0.3052, 0.1651, 0.6414, 0.7361, 0.0065, 0.3267, 0.0554, 0.3389, 0.8967, 0.8777, 0.0557, 0.9201, 0.6015, 0.2676, 0.3365, 0.2606, 0.0989, 0.2085, 0.3526, 0.8476, 0.0146, 0.0190, 0.6896, 0.5198, 0.9871, 0.0288, 0.8037, 0.6741, 0.2148, 0.2584, 0.8447, 0.8480, 0.5557, 0.2480, 0.4736, 0.8869, 0.1867, 0.3869, 0.6871, 0.1011, 0.7561, 0.7340, 0.1525, 0.9968, 0.8179, 0.7103, 0.5462, 0.4150, 0.4187, 0.0478, 0.6511, 0.0386, 0.5243, 0.7271, 0.9093, 0.4461, 0.1264, 0.0756, 0.9405, 0.7287, 0.0684, 0.2820, 0.4059, 0.3694, 0.7641, 0.4188, 0.0498, 0.7841, 0.9136, 0.6210, 0.2249, 0.9935, 0.9709, 0.0741, 0.6218, 0.3166, 0.2237, 0.7754, 0.4191, 0.2195, 0.2935, 0.4529, 0.9112, 0.9183, 0.3275, 0.1856, 0.8345, 0.0442, 0.6297, 0.9030, 0.4689, 0.9512, 0.2219, 0.9993, 0.8981, 0.1018, 0.9362, 0.6426, 0.4563, 0.1267, 0.7889, 0.5057, 0.8588, 0.4669, 0.0687, 0.6623, 0.3681, 0.8152, 0.9004, 0.0822, 0.3652];

/**
 * A Drawing consists of one canvas element displaying one or more doodles;
 * Doodles are drawn in the 'doodle plane' consisting of a (nominal) 1001 pixel square grid -500 to 500) with central origin, and negative Y upwards
 * Affine transforms are used to convert points in the doodle plane to the canvas plane, the plane of the canvas element;
 * Each doodle contains additional transforms to handle individual position, rotation, and scale.
 * 
 * @class Drawing
 * @property {Canvas} canvas A canvas element used to edit and display the drawing
 * @property {Eye} eye Right or left eye (some doodles display differently according to side)
 * @property {Bool} isEditable Flag indicating whether canvas is editable or not
 * @property {Context} context The 2d context of the canvas element
 * @property {Array} doodleArray Array of doodles in the drawing
 * @property {AffineTransform} transform Transform converts doodle plane -> canvas plane
 * @property {AffineTransform} inverseTransform Inverse transform converts canvas plane -> doodle plane
 * @property {Doodle} selectedDoodle The currently selected doodle, null if no selection
 * @property {Bool} mouseDown Flag indicating whether mouse is down in canvas
 * @property {Mode} mode The current mouse dragging mode
 * @property {Point} lastMousePosition Last position of mouse in canvas coordinates
 * @property {Image} image Optional background image
 * @property {Int} doubleClickMilliSeconds Duration of double click
 * @property {Bool} newPointOnClick Flag indicating whether a mouse click will create a new PointInLine doodle
 * @property {Bool} completeLine Flag indicating whether to draw an additional line to the first PointInLine doodle
 * @property {Float} scale Scaling of transformation from canvas to doodle planes, preserving aspect ratio and maximising doodle plnae
 * @property {Float} globalScaleFactor Factor used to scale all added doodles to this drawing, defaults to 1
 * @property {Int} scrollValue Current value of scrollFactor
 * @property {Int} lastDoodleId id of last doodle to be added
 * @property {Bool} isActive Flag indicating that the mouse is interacting with the drawing
 * @property {Bool} isNew Flag indicating that the drawing is new (false after doodles loaded from an input string)
 * @property {String} squiggleColour Colour of line for freehand drawing
 * @property {Int} squiggleWidth Width of line for freehand drawing
 * @property {Int} squiggleStyle Style of freehand drawing (solid or outline)
 * @property {Float} scaleOn Options for setting scale to either width or height
 * @param {Canvas} _canvas Canvas element
 * @param {Eye} _eye Right or left eye
 * @param {String} _IDSuffix String suffix to identify HTML elements related to this drawing
 * @param {Bool} _isEditable Flag indicating whether canvas is editable or not
 * @param {Array} _options Associative array of optional parameters
 */
//ED.Drawing = function(_canvas, _eye, _IDSuffix, _isEditable, _offsetX, _offsetY, _toImage)
ED.Drawing = function(_canvas, _eye, _IDSuffix, _isEditable, _options) {
    // Defaults for optional parameters
    var offsetX = 0;
    var offsetY = 0;
    var toImage = false;
    this.controllerFunctionName = 'eyeDrawController';
    this.graphicsPath = 'img/';
    this.scaleOn = 'height';

    // If optional parameters exist, use them instead
    if (typeof(_options) != 'undefined') {
        if (_options['offsetX']) offsetX = _options['offsetX'];
        if (_options['offsetY']) offsetY = _options['offsetY'];
        if (_options['toImage']) toImage = _options['toImage'];
        if (_options['controllerFunctionName']) this.controllerFunctionName = _options['controllerFunctionName'];
        if (_options['graphicsPath']) this.graphicsPath = _options['graphicsPath'];
        if (_options['scaleOn']) this.scaleOn = _options['scaleOn'];
    }

    // Initialise properties
    this.canvas = _canvas;
    this.eye = _eye;
    this.IDSuffix = _IDSuffix;
    this.isEditable = _isEditable;
    this.hoverTimer = null;
    this.convertToImage = (toImage && !this.isEditable) ? true : false;
    this.context = this.canvas.getContext('2d');
    this.doodleArray = new Array();
    this.bindingArray = new Array();
    this.listenerArray = new Array();
    this.transform = new ED.AffineTransform();
    this.inverseTransform = new ED.AffineTransform();
    this.selectedDoodle = null;
    this.mouseDown = false;
    this.doubleClick = false;
    this.mode = ED.Mode.None;
    this.lastMousePosition = new ED.Point(0, 0);
    this.doubleClickMilliSeconds = 250;
    this.readyNotificationSent = false;
    this.newPointOnClick = false;
    this.completeLine = false;
    this.globalScaleFactor = 1;
    this.scrollValue = 0;
    this.lastDoodleId = 0;
    this.isActive = false;
    this.isNew = true;

    // Freehand drawing properties
    this.squiggleColour = '00FF00';
    this.squiggleWidth = ED.squiggleWidth.Medium;
    this.squiggleStyle = ED.squiggleStyle.Outline;

    // Put settings into display canvas
    this.refreshSquiggleSettings();

    // Associative array of bound element no doodle values (ie value associated with deleted doodle)
    this.boundElementDeleteValueArray = new Array();

    // Grab the canvas parent element
    this.canvasParent = this.canvas.parentElement;

    // Array of objects requesting notifications
    this.notificationArray = new Array();

    // Optional tooltip (this property will be null if a span element with this id not found
    this.canvasTooltip = document.getElementById(this.canvas.id + 'Tooltip');

    // Make sure doodle plane fits within canvas (Height priority)
    if (this.scaleOn == 'height') {
        this.scale = this.canvas.height / 1001;
    } else {
        this.scale = this.canvas.width / 1001;
    }

    // Calculate dimensions of doodle plane
    this.doodlePlaneWidth = this.canvas.width / this.scale;
    this.doodlePlaneHeight = this.canvas.height / this.scale;

    // Array of images to be preloaded
    this.imageArray = new Array();
    this.imageArray['LatticePattern'] = new Image();
    this.imageArray['CribriformPattern'] = new Image();
    this.imageArray['CribriformPatternSmall'] = new Image();
    this.imageArray['CryoPattern'] = new Image();
    this.imageArray['AntPVRPattern'] = new Image();
    this.imageArray['LaserPattern'] = new Image();
    this.imageArray['FuchsPattern'] = new Image();
    this.imageArray['PSCPattern'] = new Image();
    this.imageArray['MeshworkPatternLight'] = new Image();
    this.imageArray['MeshworkPatternMedium'] = new Image();
    this.imageArray['MeshworkPatternHeavy'] = new Image();
    this.imageArray['NewVesselPattern'] = new Image();

    // Set transform to map from doodle to canvas plane
    this.transform.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.transform.scale(this.scale, this.scale);

    // Set inverse transform to map the other way
    this.inverseTransform = this.transform.createInverse();

    // Initialise canvas context transform by calling clear() method	
    this.clear();

    // Get reference to button elements
    this.moveToFrontButton = document.getElementById('moveToFront' + this.IDSuffix);
    this.moveToBackButton = document.getElementById('moveToBack' + this.IDSuffix);
    this.flipVerButton = document.getElementById('flipVer' + this.IDSuffix);
    this.flipHorButton = document.getElementById('flipHor' + this.IDSuffix);
    this.deleteSelectedDoodleButton = document.getElementById('deleteSelectedDoodle' + this.IDSuffix);
    this.lockButton = document.getElementById('lock' + this.IDSuffix);
    this.unlockButton = document.getElementById('unlock' + this.IDSuffix);
    this.squiggleSpan = document.getElementById('squiggleSpan' + this.IDSuffix);
    this.colourPreview = document.getElementById('colourPreview' + this.IDSuffix);
    this.fillRadio = document.getElementById('fillRadio' + this.IDSuffix);
    this.thickness = document.getElementById('thicknessSelect' + this.IDSuffix);

    // Selection rectangle
    this.selectionRectangleIsBeingDragged = false;
    this.selectionRectangleStart = new ED.Point(0, 0);
    this.selectionRectangleEnd = new ED.Point(0, 0);

    // Add event listeners (NB within the event listener 'this' refers to the canvas, NOT the drawing instance)
    if (this.isEditable) {
        var drawing = this;

        // Mouse listeners
        this.canvas.addEventListener('mousedown', function(e) {
            var position = ED.findPosition(this, e);
            var point = new ED.Point(position.x, position.y);
            drawing.mousedown(point);
        }, false);

        this.canvas.addEventListener('mouseup', function(e) {
            var position = ED.findPosition(this, e);
            var point = new ED.Point(position.x, position.y);
            drawing.mouseup(point);
        }, false);

        this.canvas.addEventListener('mousemove', function(e) {
            var position = ED.findPosition(this, e);
            var point = new ED.Point(position.x, position.y);
            drawing.mousemove(point);
        }, false);

        this.canvas.addEventListener('mouseover', function(e) {
            var position = ED.findPosition(this, e);
            var point = new ED.Point(position.x, position.y);
            drawing.mouseover(point);
        }, false);

        this.canvas.addEventListener('mouseout', function(e) {
            var position = ED.findPosition(this, e);
            var point = new ED.Point(position.x, position.y);
            drawing.mouseout(point);
        }, false);

        //        this.canvas.addEventListener('mousewheel', function(e) {
        //                                     e.preventDefault();
        //                                     drawing.selectNextDoodle(e.wheelDelta);
        //                                     }, false);

        // iOS listeners
        this.canvas.addEventListener('touchstart', function(e) {
            if (e.targetTouches[0] !== undefined) {
                var point = new ED.Point(e.targetTouches[0].pageX - this.offsetLeft, e.targetTouches[0].pageY - this.offsetTop);
                e.preventDefault();
            }
            drawing.mousedown(point);
        }, false);

        this.canvas.addEventListener('touchend', function(e) {
            if (e.targetTouches[0] !== undefined) {
                var point = new ED.Point(e.targetTouches[0].pageX - this.offsetLeft, e.targetTouches[0].pageY - this.offsetTop);
                drawing.mouseup(point);
            }
        }, false);

        this.canvas.addEventListener('touchmove', function(e) {
            if (e.targetTouches[0] !== undefined) {
                var point = new ED.Point(e.targetTouches[0].pageX - this.offsetLeft, e.targetTouches[0].pageY - this.offsetTop);
                drawing.mousemove(point);
            }
        }, false);

        // Keyboard listener
        window.addEventListener('keydown', function(e) {
            if (document.activeElement && document.activeElement.tagName == 'CANVAS') drawing.keydown(e);
        }, true);


        // Stop browser stealing double click to select text
        this.canvas.onselectstart = function() {
            return false;
        }
    }
}

/**
 * Carries out initialisation of drawing (called after a controller has been instantiated to ensure notification)
 */
ED.Drawing.prototype.init = function() {
    // Start loading of texture images (will send ready notification when ready)
    this.preLoadImagesFrom(this.graphicsPath);
}

/**
 * Replaces the canvas element inline with a PNG image, useful for printing
 */
ED.Drawing.prototype.replaceWithImage = function() {
    // Create a new image element
    var img = document.createElement("img");

    // Base64 encoded PNG version of the canvas element
    img.setAttribute('src', this.canvas.toDataURL('image/png'));

    // Removes canvas and hidden input element (+ any other children) as they will be replaced with an image
    if (this.canvasParent.hasChildNodes()) {
        while (this.canvasParent.childNodes.length >= 1) {
            this.canvasParent.removeChild(this.canvasParent.firstChild);
        }
    }

    this.canvasParent.appendChild(img);
}

/**
 * Preloads image files
 *
 * @param {String} Relative path to directory where images are stored
 */
ED.Drawing.prototype.preLoadImagesFrom = function(_path) {
    var drawing = this;
    var ready = false;

    // Iterate through array loading each image, calling checking function from onload event
    for (var key in this.imageArray) {
        // This line picked up by javadoc toolkit - @ignore does not work
        this.imageArray[key].onload = function() {
            drawing.checkAllLoaded();
        }

        // Error handling
        this.imageArray[key].onerror = function() {
            ED.errorHandler('ED.Drawing', 'preLoadImagesFrom', 'Error loading image files from directory: ' + _path);
        }

        // Attempt to load image file
        this.imageArray[key].src = _path + key + '.gif';
    }
}

/**
 * Checks all images are loaded then sends a notification
 */
ED.Drawing.prototype.checkAllLoaded = function() {
    // Set flag to check loading
    var allLoaded = true;

    // Iterate through array loading each image, checking all are loaded
    for (var key in this.imageArray) {
        var imageLoaded = false;
        if (this.imageArray[key].width > 0) imageLoaded = true;

        // Check all are loaded
        allLoaded = allLoaded && imageLoaded;
    }

    // If all are loaded, send notification
    if (allLoaded) {
        if (!this.readyNotificationSent) {
            //this.onready();
            this.readyNotificationSent = true;

            // Notify
            this.notify("ready");
        }
    }
}

/**
 * Registers an object to receive notifications
 *
 * @param {Object} _object The object requesting notification
 * @param {String} _methodName The method in the receiving object which is called for a notification. Defaults to 'notificationHandler'
 * @param {Array} _notificationList Array of strings listing the notifications the object is interested in. If empty, receives all.
 */
ED.Drawing.prototype.registerForNotifications = function(_object, _methodName, _notificationList) {
    // Put in default values for optional parameters
    if (typeof(_methodName) == 'undefined') {
        _methodName = 'notificationHandler';
    }
    if (typeof(_notificationList) == 'undefined') {
        _notificationList = new Array();
    }

    // Add object and details to notification array
    this.notificationArray[this.notificationArray.length] = {
        object: _object,
        methodName: _methodName,
        notificationList: _notificationList
    };
}

/**
 * Unregisters an object for notifications  ***TODO*** Need method of identifying objects for this to work
 *
 * @param {object} _object The object requesting notification
 */
ED.Drawing.prototype.unRegisterForNotifications = function(_object) {
    // Get index of object in array
    var index = this.notificationArray.indexOf(_object);

    // If its there, remove it
    if (index >= 0) {
        this.notificationArray.splice(index, 1);
    }
}

/**
 * Send notifications to all registered objects
 *
 * @param {String} _eventName Name of event
 * @param {Object} _object An optional object which may accompany an event containing additional information
 */
ED.Drawing.prototype.notify = function(_eventName, _object) {
    //console.log("Notifying for event: " + _eventName);

    // Create array containing useful information
    var messageArray = {
        eventName: _eventName,
        selectedDoodle: this.selectedDoodle,
        object: _object
    };

    // Call method on each registered object
    for (var i = 0; i < this.notificationArray.length; i++) {
        // Assign to variables to make code easier to read
        var list = this.notificationArray[i]['notificationList'];
        var object = this.notificationArray[i]['object'];
        var methodName = this.notificationArray[i]['methodName'];

        // Check that event is in notification list for this object, or array is empty implying all notifications 
        if (list.length == 0 || list.indexOf(_eventName) >= 0) {
            // Check method exists
            if (typeof(object[methodName]) != 'undefined') {
                // Call registered object using specified method, and passing message array
                object[methodName].apply(object, [messageArray]);
            } else {
                ED.errorHandler('ED.Drawing', 'notify', 'Attempt to call undefined notification handler method');
            }
        }
    }
}

/**
 * Loads doodles from an HTML element
 *
 * @param {string} _id Id of HTML input element containing JSON data
 */
ED.Drawing.prototype.loadDoodles = function(_id) {
    // Get element containing JSON string
    var sourceElement = document.getElementById(_id);

    // If it exists and contains something, load it
    if (sourceElement && sourceElement.value.length > 0) {
        var doodleSet = window.JSON.parse(sourceElement.value);
        this.load(doodleSet);

        // Set isNew flag
        this.isNew = false;

        // Notify
        this.notify("doodlesLoaded");
    }
}

/**
 * Loads doodles from passed set in JSON format into doodleArray
 *
 * @param {Set} _doodleSet Set of doodles from server
 */
ED.Drawing.prototype.load = function(_doodleSet) {
    // Iterate through set of doodles and load into doodle array
    for (var i = 0; i < _doodleSet.length; i++) {
        if (ED[_doodleSet[i].subclass] === undefined) {
            ED.errorHandler('ED.Drawing', 'load', 'Unrecognised doodle: ' + _doodleSet[i].subclass);
            break;
        }

        // Instantiate a new doodle object with parameters from doodle set
        this.doodleArray[i] = new ED[_doodleSet[i].subclass]
        (
            this,
            _doodleSet[i].originX,
            _doodleSet[i].originY,
            _doodleSet[i].radius,
            _doodleSet[i].apexX,
            _doodleSet[i].apexY,
            _doodleSet[i].scaleX,
            _doodleSet[i].scaleY,
            _doodleSet[i].arc,
            _doodleSet[i].rotation,
            _doodleSet[i].order);

        this.doodleArray[i].id = i;

        // Squiggle array
        if (typeof(_doodleSet[i].squiggleArray) != 'undefined') {
            for (var j = 0; j < _doodleSet[i].squiggleArray.length; j++) {
                // Get parameters and create squiggle
                var colour = _doodleSet[i].squiggleArray[j].colour;
                var thickness = _doodleSet[i].squiggleArray[j].thickness;
                var filled = _doodleSet[i].squiggleArray[j].filled;
                var squiggle = new ED.Squiggle(this.doodleArray[i], colour, thickness, filled);

                // Add points to squiggle and complete it
                var pointsArray = _doodleSet[i].squiggleArray[j].pointsArray;
                for (var k = 0; k < pointsArray.length; k++) {
                    var point = new ED.Point(pointsArray[k].x, pointsArray[k].y);
                    squiggle.addPoint(point);
                }
                squiggle.complete = true;

                // Add squiggle to doodle's squiggle array
                this.doodleArray[i].squiggleArray.push(squiggle);
            }
        }

        // Saved parameters
        if (typeof(_doodleSet[i].params) != 'undefined') {
            for (var j = 0; j < _doodleSet[i].params.length; j++) {
                var param_name = _doodleSet[i].params[j].name;
                var param_value = _doodleSet[i].params[j].value;
                this.doodleArray[i].setParameterFromString(param_name, param_value);
            }
        }
    }

    // Sort array by order (puts back doodle first)
    this.doodleArray.sort(function(a, b) {
        return a.order - b.order
    });
}

/**
 * Creates string containing drawing data in JSON format with surrounding square brackets
 *
 * @returns {String} Serialized data in JSON format with surrounding square brackets
 */
ED.Drawing.prototype.save = function() {
    // Store current data in textArea
    return '[' + this.json() + ']';
}

/**
 * Creates string containing drawing data in JSON format
 *
 * @returns {String} Serialized data in JSON format
 */
ED.Drawing.prototype.json = function() {
    var s = "";

    // Go through each member of doodle array, encoding it
    for (var i = 0; i < this.doodleArray.length; i++) {
        var doodle = this.doodleArray[i];
        if (doodle.isSaveable) {
            s = s + doodle.json() + ",";
        }
    }

    // Remove last comma
    s = s.substring(0, s.length - 1);

    return s;
}

/**
 * Draws all doodles for this drawing
 */
ED.Drawing.prototype.drawAllDoodles = function() {
    // Draw any connecting lines
    var ctx = this.context;
    ctx.beginPath();
    var started = false;
    var startPoint;

    for (var i = 0; i < this.doodleArray.length; i++) {
        if (this.doodleArray[i].isPointInLine) {
            // Start or draw line
            if (!started) {
                ctx.moveTo(this.doodleArray[i].originX, this.doodleArray[i].originY);
                started = true;
                startPoint = new ED.Point(this.doodleArray[i].originX, this.doodleArray[i].originY);
            } else {
                ctx.lineTo(this.doodleArray[i].originX, this.doodleArray[i].originY);
            }
        }
    }

    // Optionally add line to start
    if (this.completeLine && typeof(startPoint) != 'undefined') {
        ctx.lineTo(startPoint.x, startPoint.y);
    }

    // Draw lines
    if (started) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(20,20,20,1)";
        ctx.stroke();
    }


    // Draw doodles
    for (var i = 0; i < this.doodleArray.length; i++) {
        // Save context (draw method of each doodle may alter it)
        this.context.save();

        // Draw doodle
        this.doodleArray[i].draw();

        // Restore context
        this.context.restore();
    }
}


/**
 * Responds to mouse down event in canvas, cycles through doodles from front to back.
 * Selected doodle is first selectable doodle to have click within boundary path.
 * Double clicking on a selected doodle promotes it to drawing mode (if is drawable)
 *
 * @event
 * @param {Point} _point Coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mousedown = function(_point) {
    // Set flag to indicate dragging can now take place
    this.mouseDown = true;

    // Detect double click
    if (ED.recentClick) this.doubleClick = true;
    ED.recentClick = true;
    var t = setTimeout("ED.recentClick = false;", this.doubleClickMilliSeconds);

    // Set flag to indicate success
    var found = false;
    this.selectedDoodle = null;

    // Cycle through doodles from front to back doing hit test
    for (var i = this.doodleArray.length - 1; i > -1; i--) {
        if (!found) {
            // Save context (draw method of each doodle may alter it)
            this.context.save();

            // Successful hit test?
            if (this.doodleArray[i].draw(_point)) {
                if (this.doodleArray[i].isSelectable && !this.doodleArray[i].isLocked) {
                    // If double clicked, go into drawing mode
                    if (this.doubleClick && this.doodleArray[i].isSelected && this.doodleArray[i].isDrawable) {
                        this.doodleArray[i].isForDrawing = true;
                    }

                    this.doodleArray[i].isSelected = true;
                    this.selectedDoodle = this.doodleArray[i];
                    found = true;

                    // Notify
                    this.notify("doodleSelected");

                    // If for drawing, mouse down starts a new squiggle
                    if (!this.doubleClick && this.doodleArray[i].isForDrawing) {
                        // Add new squiggle
                        this.doodleArray[i].addSquiggle();
                    }
                }
            }
            // Ensure that unselected doodles are marked as such
            else {
                this.doodleArray[i].isSelected = false;
                this.doodleArray[i].isForDrawing = false;
            }

            // Restore context
            this.context.restore();
        } else {
            this.doodleArray[i].isSelected = false;
            this.doodleArray[i].isForDrawing = false;
        }

        // Ensure drag flagged is off for each doodle
        this.doodleArray[i].isBeingDragged = false;
    }

    // Drawing
    if (this.newPointOnClick && !found) {
        var mousePosDoodlePlane = this.inverseTransform.transformPoint(_point);

        var newPointInLine = this.addDoodle('PointInLine');
        newPointInLine.originX = mousePosDoodlePlane.x;
        newPointInLine.originY = mousePosDoodlePlane.y;
    }

    // Multiple Selecting
    /*
    if (!found)
    {
        this.mode = ED.Mode.Select;
        this.selectionRectangleStart = this.inverseTransform.transformPoint(_point);
    }
     */

    // Repaint
    this.repaint();

    // Notify
    this.notify("mousedown", {
        drawing: this,
        point: _point
    });
}

/**
 * Responds to mouse move event in canvas according to the drawing mode
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mousemove = function(_point) {
    // Notify
    this.notify("mousemove", {
        drawing: this,
        point: _point
    });

    // Draw selection rectangle
    /*
    if (this.mode == ED.Mode.Select)
    {
        if (!this.selectionRectangleIsBeingDragged)
        {
            this.selectionRectangleIsBeingDragged = true;
        }
        
        this.selectionRectangleEnd = this.inverseTransform.transformPoint(_point);
        this.repaint();
    }
    */

    // Store action for notification
    var action = "";

    // Start the hover timer (also resets it)
    this.startHoverTimer(_point);

    // Get selected doodle
    var doodle = this.selectedDoodle;

    // Only drag if mouse already down and a doodle selected
    if (this.mouseDown && doodle != null) {
        // Dragging not started
        if (!doodle.isBeingDragged) {
            // Flag start of dragging manoeuvre
            doodle.isBeingDragged = true;
        }
        // Dragging in progress
        else {
            // Get mouse position in doodle plane
            var mousePosDoodlePlane = this.inverseTransform.transformPoint(_point);
            var lastMousePosDoodlePlane = this.inverseTransform.transformPoint(this.lastMousePosition);

            // Get mouse positions in selected doodle's plane
            var mousePosSelectedDoodlePlane = doodle.inverseTransform.transformPoint(_point);
            var lastMousePosSelectedDoodlePlane = doodle.inverseTransform.transformPoint(this.lastMousePosition);

            // Get mouse positions in canvas plane relative to centre
            var mousePosRelCanvasCentre = new ED.Point(_point.x - this.canvas.width / 2, _point.y - this.canvas.height / 2);
            var lastMousePosRelCanvasCentre = new ED.Point(this.lastMousePosition.x - this.canvas.width / 2, this.lastMousePosition.y - this.canvas.height / 2);

            // Get position of centre of display (canvas plane relative to centre) and of an arbitrary point vertically above
            var canvasCentre = new ED.Point(0, 0);
            var canvasTop = new ED.Point(0, -100);

            // Get coordinates of origin of doodle in doodle plane
            var doodleOrigin = new ED.Point(doodle.originX, doodle.originY);

            // Get position of point vertically above doodle origin in doodle plane
            var doodleTop = new ED.Point(doodle.originX, doodle.originY - 100);

            // Effect of dragging depends on mode
            switch (this.mode) {
                case ED.Mode.None:
                    break;

                case ED.Mode.Move:
                    // If isMoveable is true, move doodle
                    if (doodle.isMoveable) {
                        // Initialise new values to stop doodle getting 'trapped' at origin due to failure of non-zero test in snapToQuadrant
                        var newOriginX = doodle.originX;
                        var newOriginY = doodle.originY;

                        // Enforce snap to grid
                        if (doodle.snapToGrid) {
                            // Calculate mouse position and work out nearest position of a grid line
                            var testX = mousePosDoodlePlane.x - doodle.gridDisplacementX;
                            var gridSquaresX = Math.floor(testX / doodle.gridSpacing);
                            var gridRemainderX = ED.Mod(testX, doodle.gridSpacing);
                            newOriginX = doodle.gridDisplacementX + doodle.gridSpacing * (gridSquaresX + Math.round(gridRemainderX / doodle.gridSpacing));

                            // Repeat for Y axis
                            var testY = mousePosDoodlePlane.y - doodle.gridDisplacementY;
                            var gridSquaresY = Math.floor(testY / doodle.gridSpacing);
                            var gridRemainderY = ED.Mod(testY, doodle.gridSpacing);
                            newOriginY = doodle.gridDisplacementY + doodle.gridSpacing * (gridSquaresY + Math.round(gridRemainderY / doodle.gridSpacing));

                            // Doodle's move method notifies and also sets orientation
                            doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
                        }
                        // Enforce snap to quadrant
                        else if (doodle.snapToQuadrant) {
                            if (mousePosDoodlePlane.x != 0) {
                                newOriginX = doodle.quadrantPoint.x * mousePosDoodlePlane.x / Math.abs(mousePosDoodlePlane.x);
                            }
                            if (mousePosDoodlePlane.y != 0) {
                                newOriginY = doodle.quadrantPoint.y * mousePosDoodlePlane.y / Math.abs(mousePosDoodlePlane.y);
                            }

                            // Doodle's move method notifies and also sets orientation
                            doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
                        }
                        // Enforce snap to points
                        else if (doodle.snapToPoints) {
                            newOriginX = doodle.nearestPointTo(mousePosDoodlePlane).x;
                            newOriginY = doodle.nearestPointTo(mousePosDoodlePlane).y;

                            // Doodle's move method notifies and also sets orientation
                            doodle.move(newOriginX - doodle.originX, newOriginY - doodle.originY);
                        }
                        // Normal move
                        else {
                            doodle.move(mousePosDoodlePlane.x - lastMousePosDoodlePlane.x, mousePosDoodlePlane.y - lastMousePosDoodlePlane.y);
                        }

                        action = 'move';
                    }
                    // Otherwise rotate it (if isRotatable)
                    else {
                        if (doodle.isRotatable) {
                            // Calculate angles from centre to mouse positions relative to north
                            var oldAngle = this.innerAngle(canvasTop, canvasCentre, lastMousePosRelCanvasCentre);
                            var newAngle = this.innerAngle(canvasTop, canvasCentre, mousePosRelCanvasCentre);

                            // Work out difference, and change doodle's angle of rotation by this amount
                            var angleDelta = newAngle - oldAngle;

                            // Calculate new value of rotation                            
                            if (doodle.snapToAngles) {
                                var newRotation = doodle.nearestAngleTo(newAngle);
                            } else {
                                var newRotation = ED.Mod(doodle.rotation + angleDelta, 2 * Math.PI);
                            }

                            // Restrict to allowable range
                            doodle.setSimpleParameter('rotation', doodle.parameterValidationArray['rotation']['range'].constrainToAngularRange(newRotation, false));

                            // Update dependencies
                            doodle.updateDependentParameters('rotation');

                            // Adjust radius property
                            var oldRadius = Math.sqrt(lastMousePosDoodlePlane.x * lastMousePosDoodlePlane.x + lastMousePosDoodlePlane.y * lastMousePosDoodlePlane.y);
                            var newRadius = Math.sqrt(mousePosDoodlePlane.x * mousePosDoodlePlane.x + mousePosDoodlePlane.y * mousePosDoodlePlane.y);
                            var radiusDelta = doodle.radius + (newRadius - oldRadius);

                            // Keep within bounds
                            doodle.setSimpleParameter('radius', doodle.parameterValidationArray['radius']['range'].constrain(radiusDelta));

                            // Update dependencies
                            doodle.updateDependentParameters('radius');
                        }
                    }
                    break;
                case ED.Mode.Scale:
                    if (doodle.isScaleable) {
                        // Get sign of scale (negative scales create horizontal and vertical flips)
                        var signX = doodle.scaleX / Math.abs(doodle.scaleX);
                        var signY = doodle.scaleY / Math.abs(doodle.scaleY);

                        // Calculate change in scale (sign change indicates mouse has moved across central axis)
                        var changeX = mousePosSelectedDoodlePlane.x / lastMousePosSelectedDoodlePlane.x;
                        var changeY = mousePosSelectedDoodlePlane.y / lastMousePosSelectedDoodlePlane.y;

                        // Ensure scale change is same if not squeezable
                        if (!doodle.isSqueezable) {
                            if (changeX > changeY) changeY = changeX;
                            else changeY = changeX;
                        }

                        // Check that mouse has not moved from one quadrant to another 
                        if (changeX > 0 && changeY > 0) {
                            // Now do scaling
                            newScaleX = doodle.scaleX * changeX;
                            newScaleY = doodle.scaleY * changeY;

                            // Constrain scale
                            newScaleX = doodle.parameterValidationArray['scaleX']['range'].constrain(Math.abs(newScaleX));
                            newScaleY = doodle.parameterValidationArray['scaleY']['range'].constrain(Math.abs(newScaleY));

                            doodle.setSimpleParameter('scaleX', newScaleX * signX);
                            doodle.setSimpleParameter('scaleY', newScaleY * signY);

                            // Update dependencies
                            doodle.updateDependentParameters('scaleX');
                            doodle.updateDependentParameters('scaleY');
                        } else {
                            this.mode = ED.Mode.None;
                        }
                    }
                    break;

                case ED.Mode.Arc:

                    // Calculate angles from centre to mouse positions relative to north
                    var newAngle = this.innerAngle(doodleTop, doodleOrigin, mousePosSelectedDoodlePlane);
                    var oldAngle = this.innerAngle(doodleTop, doodleOrigin, lastMousePosSelectedDoodlePlane);

                    // Work out difference, and sign of rotation correction
                    var deltaAngle = newAngle - oldAngle;
                    if (doodle.isArcSymmetrical) deltaAngle = 2 * deltaAngle;
                    rotationCorrection = 1;

                    // Arc left or right depending on which handle is dragging
                    if (doodle.draggingHandleIndex < 2) {
                        deltaAngle = -deltaAngle;
                        rotationCorrection = -1;
                    }

                    // Check for permitted range and stop dragging if exceeded
                    if (doodle.parameterValidationArray['arc']['range'].isBelow(doodle.arc + deltaAngle)) {
                        deltaAngle = doodle.parameterValidationArray['arc']['range'].min - doodle.arc;
                        doodle.setSimpleParameter('arc', doodle.parameterValidationArray['arc']['range'].min);
                        this.mode = ED.Mode.None;
                    } else if (doodle.parameterValidationArray['arc']['range'].isAbove(doodle.arc + deltaAngle)) {

                        deltaAngle = doodle.parameterValidationArray['arc']['range'].max - doodle.arc;
                        //doodle.arc = doodle.parameterValidationArray['arc']['range'].max;
                        doodle.setSimpleParameter('arc', doodle.parameterValidationArray['arc']['range'].max);
                        this.mode = ED.Mode.None;
                    } else {
                        doodle.setSimpleParameter('arc', doodle.arc + deltaAngle);
                    }

                    // Update dependencies
                    doodle.updateDependentParameters('arc');

                    // Correct rotation with counter-rotation
                    if (!doodle.isArcSymmetrical) {
                        rotationCorrection = rotationCorrection * deltaAngle / 2;
                        doodle.setSimpleParameter('rotation', doodle.rotation + rotationCorrection);

                        // Update dependencies
                        doodle.updateDependentParameters('rotation');
                    }

                    break;

                case ED.Mode.Rotate:
                    if (doodle.isRotatable) {
                        // Calculate angles from centre to mouse positions relative to north
                        var oldAngle = this.innerAngle(doodleTop, doodleOrigin, lastMousePosDoodlePlane);
                        var newAngle = this.innerAngle(doodleTop, doodleOrigin, mousePosDoodlePlane);

                        // Work out difference, and change doodle's angle of rotation by this amount
                        var deltaAngle = newAngle - oldAngle;
                        //deltaAngle = ED.positiveAngle(deltaAngle);
                        var newRotation = doodle.rotation + deltaAngle;
                        newRotation = ED.positiveAngle(newRotation);

                        // Restrict to allowable range
                        doodle.setSimpleParameter('rotation', doodle.parameterValidationArray['rotation']['range'].constrainToAngularRange(newRotation, false));

                        // Update dependencies
                        doodle.updateDependentParameters('rotation');
                    }
                    break;

                case ED.Mode.Apex:
                    // Move apex to new position
                    var newApexX = doodle.apexX + (mousePosSelectedDoodlePlane.x - lastMousePosSelectedDoodlePlane.x);
                    var newApexY = doodle.apexY + (mousePosSelectedDoodlePlane.y - lastMousePosSelectedDoodlePlane.y);

                    // Enforce bounds
                    doodle.setSimpleParameter('apexX', doodle.parameterValidationArray['apexX']['range'].constrain(newApexX));
                    doodle.setSimpleParameter('apexY', doodle.parameterValidationArray['apexY']['range'].constrain(newApexY));

                    // Update dependencies
                    doodle.updateDependentParameters('apexX');
                    doodle.updateDependentParameters('apexY');
                    break;

                case ED.Mode.Handles:
                    // Move handles to new position (Stored in a squiggle)
                    var index = doodle.draggingHandleIndex;

                    // Get new position into a point object
                    var newPosition = new ED.Point(0, 0);
                    newPosition.x = doodle.squiggleArray[0].pointsArray[index].x + (mousePosSelectedDoodlePlane.x - lastMousePosSelectedDoodlePlane.x);
                    newPosition.y = doodle.squiggleArray[0].pointsArray[index].y + (mousePosSelectedDoodlePlane.y - lastMousePosSelectedDoodlePlane.y);

                    // Constraining coordinates handle with optional range array (set in a subclass)
                    if (typeof(doodle.handleCoordinateRangeArray) != 'undefined') {
                        newPosition.x = doodle.handleCoordinateRangeArray[index]['x'].constrain(newPosition.x);
                        newPosition.y = doodle.handleCoordinateRangeArray[index]['y'].constrain(newPosition.y);
                    }

                    // Constraining radius and angle of handle with optional range array (set in a subclass)
                    if (typeof(doodle.handleVectorRangeArray) != 'undefined') {
                        var length = doodle.handleVectorRangeArray[index]['length'].constrain(newPosition.length());
                        var angle = doodle.handleVectorRangeArray[index]['angle'].constrainToAngularRange(newPosition.direction(), false);
                        newPosition.setWithPolars(length, angle);
                    }

                    // Set new position for handle
                    doodle.squiggleArray[0].pointsArray[index].x = newPosition.x;
                    doodle.squiggleArray[0].pointsArray[index].y = newPosition.y;

                    // Update dependencies (NB handles is not stricly a parameter, but this will call the appropriate doodle methods)
                    doodle.updateDependentParameters('handles');
                    break;

                case ED.Mode.Draw:
                    var p = new ED.Point(mousePosSelectedDoodlePlane.x, mousePosSelectedDoodlePlane.y);
                    doodle.addPointToSquiggle(p);
                    break;

                case ED.Mode.Select:
                    var p = new ED.Point(mousePosSelectedDoodlePlane.x, mousePosSelectedDoodlePlane.y);
                    console.log('Selecting ', p.x, p.y);
                    break;

                default:
                    break;
            }

            // Update any bindings NB temporarilly moved to updateDependentParameters method which SHOULD be called for all relevant changes in this method
            //this.updateBindings();
        }

        // Store mouse position
        this.lastMousePosition = _point;

        // Notify
        this.notify("mousedragged", {
            point: _point,
            action: action
        });

        // Refresh
        this.repaint();
    }
}

/**
 * Responds to mouse up event in canvas
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mouseup = function(_point) {
    // Multiselect - Go through doodles seeing which are within dragging rectangle
    /*
    for (var i = 0; i < this.doodleArray.length; i++)
	{
        var doodle = this.doodleArray[i];
        var origin = new ED.Point(doodle.originX, doodle.originY);

        var p = this.transform.transformPoint(origin);

        // If doodle origin is in selection rectangle, select it
        if(this.selectionRectangleIsBeingDragged && this.context.isPointInPath(p.x, p.y))
        {
            doodle.isSelected = true;
        }
	}

    // TEMP - this is needed to ensure delete button is activated
    if (doodle) this.selectedDoodle = doodle;
     */

    // Reset flags and mode
    this.mouseDown = false;
    this.doubleClick = false;
    this.mode = ED.Mode.None;
    this.selectionRectangleIsBeingDragged = false;

    // Reset selected doodle's dragging flag
    if (this.selectedDoodle != null) {
        this.selectedDoodle.isBeingDragged = false;

        // Optionally complete squiggle
        if (this.selectedDoodle.isDrawable) {
            this.selectedDoodle.completeSquiggle();
            this.drawAllDoodles();
        }

        // Remove selection from some doodles
        if (!this.selectedDoodle.willStaySelected) {
            this.selectedDoodle.isSelected = false;
            this.selectedDoodle = null;
        }
    }

    // Redraw to get rid of select rectangle
    this.repaint();

    // Notify
    this.notify("mouseup", _point);
}

/**
 * Responds to mouse out event in canvas, stopping dragging operation
 *
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mouseover = function(_point) {
    // Make drawing active
    this.isActive = true;

    // Notify
    this.notify("mouseover", _point);
}

/**
 * Responds to mouse out event in canvas, stopping dragging operation
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.mouseout = function(_point) {
    // Make drawing inactive
    this.isActive = false;

    // Stop the hover timer
    this.stopHoverTimer();

    // Reset flag and mode
    this.mouseDown = false;
    this.mode = ED.Mode.None;

    // Reset selected doodle's dragging flag
    if (this.selectedDoodle != null) {
        this.selectedDoodle.isBeingDragged = false;

        // Optionally complete squiggle
        if (this.selectedDoodle.isDrawable) {
            this.selectedDoodle.completeSquiggle();
            this.drawAllDoodles();
        }
    }

    // Notify
    this.notify("mouseout", _point);
}

/**
 * Responds to key down event in canvas
 *
 * @event
 * @param {event} e Keyboard event
 */
ED.Drawing.prototype.keydown = function(e) {
    //console.log(e.keyCode);
    // Keyboard action works on selected doodle
    if (this.selectedDoodle != null) {
        // Delete or move doodle
        switch (e.keyCode) {
            case 8:
                // Backspace
                if (this.selectedDoodle.className != "Label") this.deleteSelectedDoodle();
                break;
            case 37:
                // Left arrow
                this.selectedDoodle.move(-ED.arrowDelta, 0);
                break;
            case 38:
                // Up arrow
                this.selectedDoodle.move(0, -ED.arrowDelta);
                break;
            case 39:
                // Right arrow
                this.selectedDoodle.move(ED.arrowDelta, 0);
                break;
            case 40:
                // Down arrow
                this.selectedDoodle.move(0, ED.arrowDelta);
                break;
            default:
                break;
        }

        // If alphanumeric, send to Lable doodle
        var code = 0;

        // Shift key has code 16
        if (e.keyCode != 16) {
            // Alphabetic
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                if (e.shiftKey) {
                    code = e.keyCode;
                } else {
                    code = e.keyCode + 32;
                }
            }
            // Space or numeric
            else if (e.keyCode == 32 || (e.keyCode > 47 && e.keyCode < 58)) {
                code = e.keyCode;
            }
            // Apostrophes
            else if (e.keyCode == 222) {
                if (e.shiftKey) {
                    code = 34;
                } else {
                    code = 39;
                }
            }
            // Colon and semicolon
            else if (e.keyCode == 186) {
                if (e.shiftKey) {
                    code = 58;
                } else {
                    code = 59;
                }
            }
            // Other punctuation
            else if (e.keyCode == 188 || e.keyCode == 190) {
                if (e.keyCode == 188) code = 44;
                if (e.keyCode == 190) code = 46;
            }
            // Backspace
            else if (e.keyCode == 8) {
                if (this.selectedDoodle.className == "Label") code = e.keyCode;
            }
            // Carriage return
            else if (e.keyCode == 13) {
                code = 13;
            }
        }

        // Carriage return stops editing
        if (code == 13) {
            this.deselectDoodles();
        }
        // Currently only doodles of Lable class accept alphanumeric input
        else if (code > 0 && this.selectedDoodle.className == "Label") {
            this.selectedDoodle.addLetter(code);
        }

        // Refresh canvas
        this.repaint();

        // Prevent key stroke bubbling up (***TODO*** may need cross browser handling)
        e.stopPropagation();
        e.preventDefault();

        this.notify("keydown", e.keyCode);
    }
}

/**
 * Starts a timer to display a tooltip simulating hover. Called from the mousemove event
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.startHoverTimer = function(_point) {
    // Only show tooltips for editable drawings with a span element of id 'canvasTooltip'
    if (this.isEditable && this.canvasTooltip != null) {
        // Stop any existing timer
        this.stopHoverTimer();

        // Restart it 
        var drawing = this;
        this.hoverTimer = setTimeout(function() {
            drawing.hover(_point);
        }, 1000);
    }
}

/**
 * Stops the timer. Called by the mouseout event, and from the start of the startHoverTimer method
 *
 * @event
 */
ED.Drawing.prototype.stopHoverTimer = function() {
    if (this.canvasTooltip != null) {
        // Reset any existing timer
        clearTimeout(this.hoverTimer);

        // Clear text
        this.canvasTooltip.innerHTML = "";

        // Hide hover
        this.hideTooltip();
    }
}

/**
 * Triggered by the hover timer
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.hover = function(_point) {
    this.showTooltip(_point);

    // Notify
    this.notify("hover", _point);
}

/**
 * Shows a tooltip if present
 *
 * @event
 * @param {Point} _point coordinates of mouse in canvas plane
 */
ED.Drawing.prototype.showTooltip = function(_point) {
    // Get coordinates of mouse
    var xAbs = _point.x;
    var yAbs = _point.y;
    if (this.canvas.offsetParent) {
        var obj = this.canvas;
        var keepGoing;

        // The tooltip <span> has an absolute position (relative to the 1st parent element that has a position other than static)
        do {
            // ***TODO*** is this a reliable way of getting the position attribute?
            var position = document.defaultView.getComputedStyle(obj, null).getPropertyValue('position');

            // Flag to continue going up the tree
            keepGoing = false;

            // Assign x and y values
            if (position != null) {
                if (position == 'static') {
                    keepGoing = true;
                    xAbs += obj.offsetLeft;
                    yAbs += obj.offsetTop;
                }
            }

            // Does parent exist, or is origin for absolute positioning
            var keepGoing = keepGoing && (obj = obj.offsetParent);

        }
        while (keepGoing);
    }

    // Adjust coodinates of tooltip
    this.canvasTooltip.style.left = xAbs + "px";
    this.canvasTooltip.style.top = (yAbs + 18) + "px";

    // Set flag to indicate success
    var found = false;

    // Cycle through doodles from front to back doing hit test
    for (var i = this.doodleArray.length - 1; i > -1; i--) {
        if (!found) {
            // Save context (draw method of each doodle may alter it)
            this.context.save();

            // Successful hit test?
            if (this.doodleArray[i].draw(_point)) {
                this.canvasTooltip.innerHTML = this.doodleArray[i].tooltip();
                found = true;
            }

            // Restore context
            this.context.restore();
        }
    }

    // Display tooltip
    if (this.canvasTooltip.innerHTML.length > 0) {
        this.canvasTooltip.style.display = 'block';
    }
}

/**
 * Hides a tooltip
 *
 * @event
 */
ED.Drawing.prototype.hideTooltip = function() {
    this.canvasTooltip.style.display = 'none';
}

/**
 * Moves selected doodle to front
 */
ED.Drawing.prototype.moveToFront = function() {
    // Should only be called if a doodle is selected, but check anyway
    if (this.selectedDoodle != null) {
        // Assign large number to selected doodle
        this.selectedDoodle.order = 1000;

        // Sort array by order (puts back doodle first)
        this.doodleArray.sort(function(a, b) {
            return a.order - b.order
        });

        // Re-assign ordinal numbers to array
        for (var i = 0; i < this.doodleArray.length; i++) {
            this.doodleArray[i].order = i;
        }

        // Refresh canvas
        this.repaint();
    }

    // Notify
    this.notify("moveToFront");
}

/**
 * Moves selected doodle to back
 */
ED.Drawing.prototype.moveToBack = function() {
    // Should only be called if a doodle is selected, but check anyway
    if (this.selectedDoodle != null) {
        // Assign negative order to selected doodle
        this.selectedDoodle.order = -1;

        // Sort array by order (puts back doodle first)
        this.doodleArray.sort(function(a, b) {
            return a.order - b.order
        });

        // Re-assign ordinal numbers to array
        for (var i = 0; i < this.doodleArray.length; i++) {
            this.doodleArray[i].order = i;
        }

        // Refresh canvas
        this.repaint();
    }

    // Notify
    this.notify("moveToBack");
}

/**
 * Moves a doodle next to the first doodle of the passed class name
 *
 * @param {Doodle} _doodle The doodle to move
 * @param {String} _className Classname of doodle to move next to
 * @param {Bool} _inFront True if doodle placed in front, otherwise behind
 */
ED.Drawing.prototype.moveNextTo = function(_doodle, _className, _inFront) {
    // Check that _className has an instance
    if (this.hasDoodleOfClass(_className)) {
        // Don't assume that _doodle is in front, so start by putting it there, and reorder
        _doodle.order = 1000;
        this.doodleArray.sort(function(a, b) {
            return a.order - b.order
        });
        for (var i = 0; i < this.doodleArray.length; i++) {
            this.doodleArray[i].order = i;
        }

        // Interate through doodle array altering order
        var offset = 0;
        for (var i = 0; i < this.doodleArray.length - 1; i++) {
            this.doodleArray[i].order = i + offset;

            // Look for doodle of passed classname (will definitely be found first)
            if (this.doodleArray[i].className == _className) {
                offset = 1;
                if (_inFront) {
                    _doodle.order = i + 1;
                } else {
                    _doodle.order = i;
                    this.doodleArray[i].order = i + 1;
                }
            }
        }

        // Sort array by order (puts back doodle first)
        this.doodleArray.sort(function(a, b) {
            return a.order - b.order
        });
    }
}

/**
 * Flips the doodle around a vertical axis
 */
ED.Drawing.prototype.flipVer = function() {
    // Should only be called if a doodle is selected, but check anyway
    if (this.selectedDoodle != null) {
        // Vertical axis involved altering sign of scale y
        this.selectedDoodle.scaleY = this.selectedDoodle.scaleY * -1;

        // Refresh canvas
        this.repaint();
    }

    // Notify
    this.notify("flipVer");
}

/**
 * Flips the doodle around a horizontal axis
 */
ED.Drawing.prototype.flipHor = function() {
    // Should only be called if a doodle is selected, but check anyway
    if (this.selectedDoodle != null) {
        // Horizontal axis involved altering sign of scale x
        this.selectedDoodle.scaleX = this.selectedDoodle.scaleX * -1;

        // Refresh canvas
        this.repaint();
    }

    // Notify
    this.notify("flipHor");
}

/**
 * Deletes a doodle
 *
 * @param {Doodle} The doodle to be deleted
 */
ED.Drawing.prototype.deleteDoodle = function(_doodle) {
    // Class name and flag for successful deletion
    var deletedClassName = false;

    var errorMessage = 'Attempt to delete a doodle that does not exist';

    // Check that doodle will delete
    if (_doodle.willDelete()) {
        // Iterate through doodle array looking for doodle
        for (var i = 0; i < this.doodleArray.length; i++) {
            if (this.doodleArray[i].id == _doodle.id) {
                if (this.doodleArray[i].isDeletable) {
                    deletedClassName = _doodle.className;

                    // If its selected, deselect it
                    if (this.selectedDoodle != null && this.selectedDoodle.id == _doodle.id) {
                        this.selectedDoodle = null;
                    }

                    // Remove bindings and reset values of bound elements
                    for (var parameter in _doodle.bindingArray) {
                        var elementId = _doodle.bindingArray[parameter]['id'];
                        var attribute = _doodle.bindingArray[parameter]['attribute'];

                        var element = document.getElementById(elementId);
                        var value = this.boundElementDeleteValueArray[elementId];

                        // If available, set the value of the bound element to the appropriate value
                        if (element != null && typeof(value) != 'undefined') {
                            // Set the element according to the value
                            switch (element.type) {
                                case 'checkbox':
                                    if (attribute) {
                                        ED.errorHandler('ED.Drawing', 'deleteDoodle', 'Binding to a checkbox with a non-standard attribute not yet supported');
                                    } else {
                                        if (value == "true") {
                                            element.setAttribute('checked', 'checked');
                                        } else {
                                            element.removeAttribute('checked');
                                        }
                                    }
                                    break;

                                case 'select-one':
                                    if (attribute) {
                                        for (var j = 0; j < element.length; j++) {
                                            if (element.options[j].getAttribute(attribute) == value) {
                                                element.value = element.options[j].value;
                                                break;
                                            }
                                        }
                                    } else {
                                        element.value = value;
                                    }
                                    break;

                                default:
                                    if (attribute) {
                                        element.setAttribute(attribute, value);
                                    } else {
                                        element.value = value;
                                    }
                                    break;
                            }
                        }

                        // Remove binding from doodle (also removes event listener from element)
                        _doodle.removeBinding(parameter);
                    }

                    // Remove it from array
                    this.doodleArray.splice(i, 1);
                } else {
                    errorMessage = 'Attempt to delete a doodle that is not deletable, className: ' + _doodle.className;
                }
            }
        }
    } else {
        errorMessage = 'Doodle refused permission to be deleted, className: ' + _doodle.className;
    }

    // If successfully deleted, tidy up
    if (deletedClassName) {
        // Re-assign ordinal numbers within array
        for (var i = 0; i < this.doodleArray.length; i++) {
            this.doodleArray[i].order = i;
        }

        // Refresh canvas
        this.repaint();

        // Notify
        this.notify("doodleDeleted", deletedClassName);
    } else {
        ED.errorHandler('ED.Drawing', 'deleteDoodle', errorMessage);
    }
}


/**
 * Deletes currently selected doodle
 */
ED.Drawing.prototype.deleteSelectedDoodle = function() {
    // Should only be called if a doodle is selected, but check anyway
    if (this.selectedDoodle != null) {
        this.deleteDoodle(this.selectedDoodle);
    } else {
        ED.errorHandler('ED.Drawing', 'deleteSelectedDoodle', 'Attempt to delete selected doodle, when none selected');
    }

    // Multiple select
    /*
    for (var i = 0; i < this.doodleArray.length; i++)
    {
        if (this.doodleArray[i].isSelected)
        {
            this.deleteDoodle(this.doodleArray[i]);
        }
    }
     */
}

/**
 * Sets a property on currently selected doodle NB currently only supports boolean properties
 *
 * @param {Object} _element An HTML element which called this function
 * @param {String} _property The name of the property to switch
 */
ED.Drawing.prototype.setSelectedDoodle = function(_element, _property) {
    // Get value of check box
    var value = _element.checked ? "true" : "false";

    // Should only be called if a doodle is selected, but check anyway
    if (this.selectedDoodle != null) {
        this.selectedDoodle.setParameterFromString(_property, value);
    } else {
        ED.errorHandler('ED.Drawing', 'setSelectedDoodle', 'Attempt to set a property on the selected doodle, when none selected');
    }

    //    if (_element.checked)
    //    {
    //        console.log('YES');
    //    }
    //    else
    //    {
    //        console.log('NO');        
    //    }
}

/**
 * Deletes doodle with selected id
 */
ED.Drawing.prototype.deleteDoodleOfId = function(_id) {
    var doodle = this.doodleOfId(_id);

    if (doodle) {
        this.deleteDoodle(doodle);
    } else {
        ED.errorHandler('ED.Drawing', 'deleteDoodleOfId', 'Attempt to delete doodle with invalid id');
    }
}

/**
 * Locks selected doodle
 */
ED.Drawing.prototype.lock = function() {
    // Should only be called if a doodle is selected, but check anyway
    if (this.selectedDoodle != null) {
        // Go through doodles locking any that are selected
        for (var i = 0; i < this.doodleArray.length; i++) {
            if (this.doodleArray[i].isSelected) {
                this.doodleArray[i].isLocked = true;
                this.doodleArray[i].isSelected = false;
                this.selectedDoodle = null;
            }
        }

        // Refresh canvas
        this.repaint();
    }
}

/**
 * Unlocks all doodles
 */
ED.Drawing.prototype.unlock = function() {
    // Go through doodles unlocking all
    for (var i = 0; i < this.doodleArray.length; i++) {
        this.doodleArray[i].isLocked = false;
    }

    // Refresh canvas
    this.repaint();
}

/**
 * Deselect any selected doodles
 */
ED.Drawing.prototype.deselectDoodles = function() {
    // Deselect all doodles
    for (var i = 0; i < this.doodleArray.length; i++) {
        this.doodleArray[i].isSelected = false;
    }

    this.selectedDoodle = null;

    // Refresh drawing
    this.repaint();
}

/**
 * Use scroll to select next doodle in array (From an idea of Adrian Duke)
 *
 * @param {Int} _value Value of scroll wheel
 */
ED.Drawing.prototype.selectNextDoodle = function(_value) {
    // Increment current scrollValue
    this.scrollValue += _value;

    // Scroll direction
    var up = _value > 0 ? true : false;

    // 'Damp' scroll speed by waiting for larger increments
    var dampValue = 96;

    if (this.scrollValue > dampValue || this.scrollValue < -dampValue) {
        // Reset scrollValue
        this.scrollValue = 0;

        // Index of selected doodle
        var selectedIndex = -1;

        // Iterate through doodles
        for (var i = 0; i < this.doodleArray.length; i++) {
            if (this.doodleArray[i].isSelected) {
                selectedIndex = i;

                // Deselected currently selected doodle
                this.doodleArray[i].isSelected = false;
            }
        }

        // If there is a selection, change it
        if (selectedIndex >= 0) {
            // Change index
            if (up) {
                selectedIndex++;
                if (selectedIndex == this.doodleArray.length) selectedIndex = 0;
            } else {
                selectedIndex--;
                if (selectedIndex < 0) selectedIndex = this.doodleArray.length - 1;
            }

            // Wrap
            if (selectedIndex == this.doodleArray.length) {

            }

            this.doodleArray[selectedIndex].isSelected = true;
            this.selectedDoodle = this.doodleArray[selectedIndex];
        }

        // Refresh drawing
        this.repaint();
    }
}

/**
 * Marks the doodle as 'unmodified' so we can catch an event when it gets modified by the user
 */
ED.Drawing.prototype.isReady = function() {
    this.modified = false;
    if (this.convertToImage) {
        this.replaceWithImage();
    }
}

/**
 * Adds a doodle to the array
 *
 * @param {String} _className Class name of doodle
 * @param {Array} _parameterDefaults Array of key value pairs containing default values or parameters
 * @param {Array} _parameterBindings Array of key value pairs. Key is element id, value is parameter to bind to
 * @returns {Doodle} The newly added doodle
 */
ED.Drawing.prototype.addDoodle = function(_className, _parameterDefaults, _parameterBindings) {
    // Set flag to indicate whether a doodle of this className already exists
    var doodleExists = this.hasDoodleOfClass(_className);

    // Check that class exists, and create a new doodle
    if (ED.hasOwnProperty(_className)) {
        // Create new doodle of class
        var newDoodle = new ED[_className](this);

        // Create an instance of the parent if it does not already exist
        /*
        if (newDoodle.parentClass.length > 0)
        {
            if (!this.hasDoodleOfClass(newDoodle.parentClass))
            {
                this.addDoodle(newDoodle.parentClass);
            }
        }
        */
    } else {
        ED.errorHandler('ED.Drawing', 'addDoodle', 'Unable to find definition for subclass ' + _className);
        return null;
    }

    // Check if one is already there if unique)
    if (!(newDoodle.isUnique && this.hasDoodleOfClass(_className))) {
        // Ensure no other doodles are selected
        for (var i = 0; i < this.doodleArray.length; i++) {
            this.doodleArray[i].isSelected = false;
        }

        // Set parameters for this doodle
        if (typeof(_parameterDefaults) != 'undefined') {
            for (var key in _parameterDefaults) {
                var res = newDoodle.validateParameter(key, _parameterDefaults[key]);
                if (res.valid) {
                    newDoodle.setParameterFromString(key, res.value);
                } else {
                    ED.errorHandler('ED.Drawing', 'addDoodle', 'ParameterDefaults array contains an invalid value for parameter ' + key);
                }
            }
        }

        // New doodles are selected by default
        this.selectedDoodle = newDoodle;

        // Apply global scale factor
        newDoodle.scaleX = newDoodle.scaleX * this.globalScaleFactor;
        newDoodle.scaleY = newDoodle.scaleY * this.globalScaleFactor;

        // If drawable, also go into drawing mode
        if (newDoodle.isDrawable) {
            newDoodle.isForDrawing = true;
        }

        // Add to array
        this.doodleArray[this.doodleArray.length] = newDoodle;

        // Pre-existing binding
        if (!doodleExists) {
            for (var parameter in this.bindingArray[_className]) {
                var elementId = this.bindingArray[_className][parameter]['id'];
                var attribute = this.bindingArray[_className][parameter]['attribute'];
                var element = document.getElementById(elementId);

                // Get the value of the element
                var value;

                // Set the value to the value of the element
                switch (element.type) {
                    case 'checkbox':
                        if (attribute) {
                            ED.errorHandler('ED.Drawing', 'addDoodle', 'Binding to a checkbox with a non-standard attribute not yet supported');
                        } else {
                            value = element.checked.toString();
                        }
                        break;

                    case 'select-one':
                        if (attribute) {
                            if (element.selectedIndex > -1) {
                                value = element.options[element.selectedIndex].getAttribute(attribute);
                            }
                        } else {
                            value = element.value;
                        }
                        break;

                    default:
                        if (attribute) {
                            value = element.getAttribute(attribute);
                        } else {
                            value = element.value;
                        }
                        break;
                }

                // If the element value is equal to the delete value, use the default value of the doodle instead
                if (value == this.boundElementDeleteValueArray[elementId]) {
                    value = newDoodle[parameter];
                }

                // Check validity of new value
                var validityArray = newDoodle.validateParameter(parameter, value);

                // If new value is valid, set it, otherwise use default value of doodle
                if (validityArray.valid) {
                    newDoodle.setParameterFromString(parameter, validityArray.value);
                    //newDoodle.setSimpleParameter(parameter, validityArray.value);
                    newDoodle.updateDependentParameters(parameter);
                    //newDoodle.setParameterWithAnimation(parameter, validityArray.value);
                } else {
                    value = newDoodle[parameter];
                    ED.errorHandler('ED.Drawing', 'addDoodle', 'Invalid value for parameter: ' + parameter);
                }

                // Add binding to the doodle (NB this will set value of new doodle to the value of the element)
                newDoodle.addBinding(parameter, this.bindingArray[_className][parameter]);

                // Trigger binding by setting parameter
                //newDoodle.setSimpleParameter(parameter, value);
                newDoodle.setParameterFromString(parameter, validityArray.value);
                newDoodle.updateDependentParameters(parameter);
                this.updateBindings(newDoodle);
            }
        }

        // Binding passed as an argument to this method
        if (typeof(_parameterBindings) != 'undefined') {
            for (var key in _parameterBindings) {
                // Add binding to the doodle
                newDoodle.addBinding(key, _parameterBindings[key]);
            }
        }

        // Place doodle and refresh drawing
        if (newDoodle.addAtBack) {
            // This method also calls the repaint method
            this.moveToBack();
        } else {
            // Refresh drawing
            this.repaint();
        }

        // Notify
        this.notify("doodleAdded", newDoodle);

        // Return doodle
        return newDoodle;
    } else {
        ED.errorHandler('ED.Drawing', 'addDoodle', 'Attempt to add a second unique doodle of class ' + _className);
        return null;
    }
}

/**
 * Takes array of bindings, and adds them to the corresponding doodles. Adds an event listener to create a doodle if it does not exist
 *
 * @param {Array} _bindingArray Associative array. Key is className, and each value is an array with key: parameter name, value: elementId
 */
ED.Drawing.prototype.addBindings = function(_bindingArray) {
    // Store binding array as part of drawing object in order to restore bindings to doodles that are deleted and added again
    this.bindingArray = _bindingArray;

    // Get reference to this drawing object (for inner function)
    var drawing = this;

    // Iterate through classNames
    for (var className in _bindingArray) {
        // Look for the first doodle of this class to bind to
        var doodle = this.firstDoodleOfClass(className);

        // Iterate through bindings for this className
        for (var parameter in _bindingArray[className]) {
            // Get reference to element
            var elementId = _bindingArray[className][parameter]['id'];
            var element = document.getElementById(elementId);

            if (element) {
                // Add an event listener to the element to create a bound doodle on change, if it does not exist
                element.addEventListener('change', function(event) {
                    // Cannot use external variable className because of closure
                    for (var classNm in drawing.bindingArray) {
                        for (var param in drawing.bindingArray[classNm]) {
                            if (this.id == _bindingArray[classNm][param]['id']) {
                                if (!drawing.hasDoodleOfClass(classNm)) {
                                    drawing.addDoodle(classNm);
                                    drawing.deselectDoodles();
                                }
                            }
                        }
                    }
                }, false);

                // Add binding to doodle if it exists
                if (doodle) {
                    doodle.addBinding(parameter, _bindingArray[className][parameter]);
                }
            } else {
                ED.errorHandler('ED.Drawing', 'addBindings', 'Attempt to add binding for an element that does not exist for parameter: ' + parameter);
            }
        }
    }
}

/**
 * Takes an array of key value pairs and adds them to the boundElementDeleteValueArray
 *
 * @param {Array} _deleteValuesArray Associative array. Key is elementId, and value the value corresponding to an absent doodle
 */
ED.Drawing.prototype.addDeleteValues = function(_deleteValuesArray) {
    for (elementId in _deleteValuesArray) {
        this.boundElementDeleteValueArray[elementId] = _deleteValuesArray[elementId];
    }
}

/**
 * Called by events attached to HTML elements such as <input>
 *
 * @param {String} _type Type of event, only onchange is currently implemented
 * @param {Int} _doodleId The id of the doodle containing the binding
 * @param {String} _className The class name of the doodle containing the binding (for recreation if deleted)
 * @param {String} _elementId The id attribute of the element
 * @returns {Value} The current value of the element
 */
ED.Drawing.prototype.eventHandler = function(_type, _doodleId, _className, _elementId, _value) {
    //console.log("Event: " + _type + " doodleId: " + _doodleId + " doodleClass: " + _className + " elementId: " + _elementId + " value: " + _value);

    //var value;
    switch (_type) {
        // Onchange event
        case 'onchange':
            // Get reference to associated doodle
            var doodle = this.doodleOfId(_doodleId);

            // Process event
            if (doodle) {
                // Look for value in boundElementDeleteValueArray
                if (this.boundElementDeleteValueArray[_elementId] == _value) {
                    this.deleteDoodleOfId(_doodleId);
                } else {
                    // Set state of drawing to be active to allow synchronisation to work when changed by bound element
                    doodle.drawing.isActive = true;

                    // Find key associated with the element id
                    var parameter;
                    for (var key in doodle.bindingArray) {
                        if (doodle.bindingArray[key]['id'] == _elementId) {
                            parameter = key;
                        }
                    }

                    // Check validity of new value
                    var validityArray = doodle.validateParameter(parameter, _value);

                    // If new value is valid, set it
                    if (validityArray.valid) {
                        doodle.setParameterWithAnimation(parameter, validityArray.value);
                    } else {
                        ED.errorHandler('ED.Drawing', 'eventHandler', 'Attempt to change HTML element value to an invalid value for parameter ' + parameter);
                    }

                    // Apply new value to element if necessary
                    if (_value != validityArray.value) {
                        var element = document.getElementById(_elementId);
                        var attribute = doodle.bindingArray[parameter]['attribute'];

                        // Set the element according to the value
                        switch (element.type) {
                            case 'checkbox':
                                if (attribute) {
                                    ED.errorHandler('ED.Drawing', 'eventHandler', 'Binding to a checkbox with a non-standard attribute not yet supported');
                                } else {
                                    console.log('setting checkbox - needs testing with a suitable doodle');
                                    if (value == "true") {
                                        element.setAttribute('checked', 'checked');
                                    } else {
                                        element.removeAttribute('checked');
                                    }
                                }
                                break;

                            case 'select-one':
                                if (attribute) {
                                    for (var i = 0; i < element.length; i++) {
                                        if (element.options[i].getAttribute(attribute) == validityArray.value) {
                                            element.value = element.options[i].value;
                                            break;
                                        }
                                    }
                                } else {
                                    element.value = validityArray.value;
                                }
                                break;

                            default:
                                if (attribute) {
                                    element.setAttribute(attribute, validityArray.value);
                                } else {
                                    element.value = validityArray.value;
                                }
                                break;
                        }
                    }


                    // ***TODO*** Need to reset state of drawing elsewhere, since this gets called before animation finished.
                    //doodle.drawing.isActive = false;
                }
            } else {
                ED.errorHandler('ED.Drawing', 'eventHandler', 'Doodle of id: ' + _doodleId + ' no longer exists');
            }
            break;
        default:
            break;
    }
}

// Checks that the value is numeric http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
ED.isNumeric = function(_value) {
    return (_value - 0) == _value && _value.length > 0;
}

/**
 * Updates value of bound elements to the selected doodle. Called by methods which change parameter values
 *
 * @param {ED.Doodle} _doodle Optional doodle object to update drawings without a selected doodle
 */
ED.Drawing.prototype.updateBindings = function(_doodle) {
    var doodle = _doodle;

    // Check for an argument, otherwise take selected doodle for this drawing
    if (typeof(doodle) == 'undefined') {
        doodle = this.selectedDoodle;
    }

    // Update bindings for this doodle
    if (doodle != null) {
        // Iterate through this doodle's bindings array and alter value of HTML element
        for (var parameter in doodle.bindingArray) {
            var element = document.getElementById(doodle.bindingArray[parameter]['id']);
            var attribute = doodle.bindingArray[parameter]['attribute'];
            var value = doodle.getParameter(parameter);

            // Modify value of element according to type
            switch (element.type) {
                case 'checkbox':
                    if (attribute) {
                        ED.errorHandler('ED.Drawing', 'updateBindings', 'Binding to a checkbox with a non-standard attribute not yet supported');
                    } else {
                        if (value == "true") {
                            element.setAttribute('checked', 'checked');
                        } else {
                            element.removeAttribute('checked');
                        }
                    }
                    break;

                case 'select-one':
                    if (attribute) {
                        for (var i = 0; i < element.length; i++) {
                            if (element.options[i].getAttribute(attribute) == value) {
                                element.value = element.options[i].value;
                                break;
                            }
                        }
                    } else {
                        element.value = value;
                    }
                    break;

                default:
                    if (attribute) {
                        element.setAttribute(attribute, value);
                    } else {
                        element.value = value;
                    }
                    break;
            }
        }
    } else {
        // Since moving updateBindings method, this is no longer an error
        //ED.errorHandler('ED.Drawing', 'updateBindings', 'Attempt to update bindings on null doodle');
    }
}

/**
 * Test if doodle of a class exists in drawing
 *
 * @param {String} _className Classname of doodle
 * @returns {Bool} True is a doodle of the class exists, otherwise false
 */
ED.Drawing.prototype.hasDoodleOfClass = function(_className) {
    var returnValue = false;

    // Go through doodle array looking for doodles of passed className
    for (var i = 0; i < this.doodleArray.length; i++) {
        if (this.doodleArray[i].className == _className) {
            returnValue = true;
        }
    }

    return returnValue;
}

/** Counts number of doodles of passed class
 *
 * @param {String} _className Classname of doodle
 * @returns {Int} Number of doodles of the class
 */
ED.Drawing.prototype.numberOfDoodlesOfClass = function(_className) {
    var returnValue = 0;

    // Go through doodle array looking for doodles of passed className
    for (var i = 0; i < this.doodleArray.length; i++) {
        if (this.doodleArray[i].className == _className) {
            returnValue++;
        }
    }

    return returnValue;
}

/**
 * Returns first doodle of the passed className, or false if does not exist
 *
 * @param {String} _className Classname of doodle
 * @returns {Doodle} The first doodle of the passed className
 */
ED.Drawing.prototype.firstDoodleOfClass = function(_className) {
    var returnValue = false;

    // Go through doodle array looking for doodles of passed className
    for (var i = 0; i < this.doodleArray.length; i++) {
        if (this.doodleArray[i].className == _className) {
            returnValue = this.doodleArray[i];
            break;
        }
    }

    return returnValue;
}


/**
 * Returns last doodle of the passed className, or false if does not exist
 *
 * @param {String} _className Classname of doodle
 * @returns {Doodle} The last doodle of the passed className
 */
ED.Drawing.prototype.lastDoodleOfClass = function(_className) {
    var returnValue = false;

    // Go through doodle array backwards looking for doodles of passed className
    for (var i = this.doodleArray.length - 1; i >= 0; i--) {
        if (this.doodleArray[i].className == _className) {
            returnValue = this.doodleArray[i];
            break;
        }
    }

    return returnValue;
}

/**
 * Returns all doodles of the passed className
 *
 * @param {String} _className Classname of doodle
 * @returns {Doodle} The last doodle of the passed className
 */
ED.Drawing.prototype.allDoodlesOfClass = function(_className) {
    var returnValue = [];

    // Go through doodle array backwards looking for doodles of passed className
    for (var i = this.doodleArray.length - 1; i >= 0; i--) {
        if (this.doodleArray[i].className == _className) {
            returnValue.push(this.doodleArray[i]);
        }
    }

    return returnValue;
}

/**
 * Sets a parameter value for all doodles of this class
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _className Classname of doodle
 * @param {String} _value New value of parameter
 */
ED.Drawing.prototype.setParameterValueForClass = function(_parameter, _value, _className) {
    // Go through doodle array (backwards because of splice function) looking for doodles of passed className
    for (var i = this.doodleArray.length - 1; i >= 0; i--) {
        // Find doodles of given class name
        if (this.doodleArray[i].className == _className) {
            var doodle = this.doodleArray[i];

            // Set parameter
            doodle.setParameterWithAnimation(_parameter, _value);
        }
    }

    // Refresh drawing
    this.repaint();
}

/**
 * Returns the doodle with the corresponding id
 *
 * @param {Int} Id Id of doodle
 * @returns {Doodle} The doodle with the passed id
 */
ED.Drawing.prototype.doodleOfId = function(_id) {
    var doodle = false;

    // Go through doodle array looking for the corresponding doodle
    for (var i = 0; i < this.doodleArray.length; i++) {
        if (this.doodleArray[i].id == _id) {
            doodle = this.doodleArray[i];
            break;
        }
    }

    return doodle;
}

/**
 * Deletes all doodles that are deletable
 */
ED.Drawing.prototype.deleteAllDoodles = function() {
    // Go through doodle array (backwards because of splice function)
    for (var i = this.doodleArray.length - 1; i >= 0; i--) {
        // Only delete deletable ones
        if (this.doodleArray[i].isDeletable) {
            this.deleteDoodle(this.doodleArray[i]);
        }
    }
}

/**
 * Deletes doodles of one class from the drawing
 *
 * @param {String} _className Classname of doodle
 */
ED.Drawing.prototype.deleteDoodlesOfClass = function(_className) {
    // Go through doodle array (backwards because of splice function) looking for doodles of passed className
    for (var i = this.doodleArray.length - 1; i >= 0; i--) {
        // Find doodles of given class name
        if (this.doodleArray[i].className == _className) {
            this.deleteDoodle(this.doodleArray[i]);
        }
    }
}

/**
 * Updates a doodle with a new value of a parameter ***TODO** These two methods need updating with new notification system
 *
 * @param {Doodle} _doodle The doodle to be updated
 * @param {String} _parameter Name of the parameter
 * @param {Any} _value New value of the parameter
 */
ED.Drawing.prototype.setParameterForDoodle = function(_doodle, _parameter, _value) {
    // Determine whether doodle exists
    if (typeof(_doodle[_parameter]) != 'undefined') {
        _doodle[_parameter] = +_value;
    } else {
        _doodle.setParameterFromString(_parameter, _value);
    }

    // Save to hidden input, if exists, and refresh drawing
    if (typeof(this.saveToInputElement) != 'undefined') this.saveToInputElement();
    this.repaint();
}

/**
 * Updates a doodle of class with a vew value of a parameter. Use if only one member of a class exists
 *
 * @param {String} _className The name of the doodle class to be updated
 * @param {String} _parameter Name of the parameter
 * @param {Any} _value New value of the parameter
 */
ED.Drawing.prototype.setParameterForDoodleOfClass = function(_className, _parameter, _value) {
    // Get pointer to doodle
    var doodle = this.firstDoodleOfClass(_className);

    // Set parameter for the doodle
    doodle.setParameterWithAnimation(_parameter, _value);

    // Save to hidden input, if exists, and refresh drawing
    if (typeof(this.saveToInputElement) != 'undefined') this.saveToInputElement();
    this.repaint();
}

/**
 * Returns the total extent in degrees covered by doodles of the passed class
 *
 * @param {String} _class Class of the doodle to be updated
 * @returns {Int} Total extent in degrees, with maximum of 360
 */
ED.Drawing.prototype.totalDegreesExtent = function(_class) {
    var degrees = 0;

    // Calculate total for all doodles of this class
    for (var i = 0; i < this.doodleArray.length; i++) {
        // Find doodles of given class name
        if (this.doodleArray[i].className == _class) {
            degrees += this.doodleArray[i].degreesExtent();
        }
    }

    // Overlapping doodles do not increase total beyond 360 degrees
    if (degrees > 360) degrees = 360;

    return degrees;
}

/**
 * Suppresses reporting for all doodles currently in drawing.
 */
ED.Drawing.prototype.suppressReports = function() {
    // Iterate through all doodles
    for (var i = 0; i < this.doodleArray.length; i++) {
        this.doodleArray[i].willReport = false;
    }
}

/**
 * Returns a string containing a description of the drawing
 *
 * @returns {String} Description of the drawing
 */
ED.Drawing.prototype.report = function() {
    var returnString = "";
    var groupArray = new Array();
    var groupEndArray = new Array();

    // Go through every doodle
    for (var i = 0; i < this.doodleArray.length; i++) {
        var doodle = this.doodleArray[i];

        // Reporting can be switched off with willReport flag
        if (doodle.willReport) {
            // Check for a group description
            if (doodle.groupDescription().length > 0) {
                // Create an array entry for it or add to existing
                if (typeof(groupArray[doodle.className]) == 'undefined') {
                    groupArray[doodle.className] = doodle.groupDescription();
                    groupArray[doodle.className] += doodle.description();
                } else {
                    // Only add additional detail if supplied by description method
                    if (doodle.description().length > 0) {
                        groupArray[doodle.className] += ", ";
                        groupArray[doodle.className] += doodle.description();
                    }
                }

                // Check if there is a corresponding end description
                if (doodle.groupDescriptionEnd().length > 0) {
                    if (typeof(groupEndArray[doodle.className]) == 'undefined') {
                        groupEndArray[doodle.className] = doodle.groupDescriptionEnd();
                    }
                }
            } else {
                // Get description
                var description = doodle.description();

                // If its not an empty string, add to the return
                if (description.length > 0) {
                    // If text there already, make it lower case and add a comma before
                    if (returnString.length == 0) {
                        returnString += description;
                    } else {
                        returnString = returnString + ", " + description.firstLetterToLowerCase();
                    }
                }
            }
        }
    }

    // Go through group array adding descriptions
    for (className in groupArray) {
        // Get description
        var description = groupArray[className];

        // Get end description
        var endDescription = "";
        if (typeof(groupEndArray[className]) != 'undefined') {
            endDescription = groupEndArray[className];
        }

        // Replace last comma with a comma and 'and'
        description = description.addAndAfterLastComma() + endDescription;

        // If its not an empty string, add to the return
        if (description.length > 0) {
            // If text there already, make it lower case and add a comma before
            if (returnString.length == 0) {
                returnString += description;
            } else {
                returnString = returnString + ", " + description.firstLetterToLowerCase();
            }
        }
    }

    // Return result
    return returnString;
}


/**
 * Returns a SNOMED diagnostic code derived from the drawing, returns zero if no code
 *
 * @returns {Int} SnoMed code of doodle with highest postion in hierarchy
 */
ED.Drawing.prototype.diagnosis = function() {
    var positionInHierarchy = 0;
    var returnCode = 0;

    // Loop through doodles with diagnoses, taking one highest in hierarchy
    for (var i = 0; i < this.doodleArray.length; i++) {
        var doodle = this.doodleArray[i];
        var code = doodle.snomedCode();
        if (code > 0) {
            var codePosition = doodle.diagnosticHierarchy();
            if (codePosition > positionInHierarchy) {
                positionInHierarchy = codePosition;
                returnCode = code;
            }
        }
    }

    return returnCode;
}

/**
 * Changes value of eye
 *
 * @param {String} _eye Eye to change to
 */
ED.Drawing.prototype.setEye = function(_eye) {
    // Change eye
    if (_eye == "Right") this.eye = ED.eye.Right;
    if (_eye == "Left") this.eye = ED.eye.Left;

    // Refresh drawing
    this.repaint();
}

/**
 * Clears canvas and sets context
 */
ED.Drawing.prototype.clear = function() {
    // Resetting a dimension attribute clears the canvas and resets the context
    this.canvas.width = this.canvas.width;

    // But, might not clear canvas, so do it explicitly
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set context transform to map from doodle plane to canvas plane	
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.scale(this.scale, this.scale);
}

/**
 * Clears canvas and draws all doodles
 */
ED.Drawing.prototype.repaint = function() {
    // Clear canvas
    this.clear();

    // Draw background image (In doodle space because of transform)
    if (typeof(this.image) != 'undefined') {
        if (this.image.width >= this.image.height) {
            var height = 1000 * this.image.height / this.image.width;
            this.context.drawImage(this.image, -500, -height / 2, 1000, height);
        } else {
            var width = 1000 * this.image.width / this.image.height;
            this.context.drawImage(this.image, -width / 2, -500, width, 1000);
        }
    }

    // Redraw all doodles
    this.drawAllDoodles();

    // Go through doodles unsetting and then setting property display
    for (var i = 0; i < this.doodleArray.length; i++) {
        this.doodleArray[i].setDisplayOfParameterControls(false);
    }
    if (this.selectedDoodle != null) {
        this.selectedDoodle.setDisplayOfParameterControls(true);
    }

    // Enable or disable buttons which work on selected doodle
    if (this.selectedDoodle != null) {
        if (this.moveToFrontButton !== null) this.moveToFrontButton.disabled = false;
        if (this.moveToBackButton !== null) this.moveToBackButton.disabled = false;
        if (this.flipVerButton !== null) this.flipVerButton.disabled = false;
        if (this.flipHorButton !== null) this.flipHorButton.disabled = false;
        if (this.deleteSelectedDoodleButton !== null && this.selectedDoodle.isDeletable) this.deleteSelectedDoodleButton.disabled = false;
        if (this.lockButton !== null) this.lockButton.disabled = false;
        if (this.squiggleSpan !== null && this.selectedDoodle.isDrawable) this.squiggleSpan.style.display = "inline-block";
    } else {
        if (this.moveToFrontButton !== null) this.moveToFrontButton.disabled = true;
        if (this.moveToBackButton !== null) this.moveToBackButton.disabled = true;
        if (this.flipVerButton !== null) this.flipVerButton.disabled = true;
        if (this.flipHorButton !== null) this.flipHorButton.disabled = true;
        if (this.deleteSelectedDoodleButton !== null) this.deleteSelectedDoodleButton.disabled = true;
        if (this.lockButton !== null) this.lockButton.disabled = true;
        if (this.squiggleSpan !== null) this.squiggleSpan.style.display = "none";
    }

    // Go through doodles looking for any that are locked and enable/disable unlock button
    if (this.unlockButton != null) {
        this.unlockButton.disabled = true;
        for (var i = 0; i < this.doodleArray.length; i++) {
            if (this.doodleArray[i].isLocked) {
                this.unlockButton.disabled = false;
                break;
            }
        }
    }

    // Get reference to doodle toolbar
    var doodleToolbar = document.getElementById(this.canvas.id + 'doodleToolbar');
    if (doodleToolbar) {
        // Iterate through all buttons activating them
        var buttonArray = doodleToolbar.getElementsByTagName('button');
        for (var i = 0; i < buttonArray.length; i++) {
            buttonArray[i].disabled = false;
        }

        // Go through doodles looking for any that unique, and disable the corresponding add button
        for (var i = 0; i < this.doodleArray.length; i++) {
            // Button ID is concatenation of class name and id suffix
            var addButton = document.getElementById(this.doodleArray[i].className + this.IDSuffix);
            if (addButton) {
                addButton.disabled = this.doodleArray[i].isUnique;
            }
        }
    }

    // ***TODO*** ask Mark what this code is for
    if (!this.modified) {
        this.modified = true;
    }

    // Draw selection frame
    if (this.selectionRectangleIsBeingDragged) {
        // Get context
        var ctx = this.context;

        // Boundary path
        ctx.beginPath();

        // Square
        ctx.moveTo(this.selectionRectangleStart.x, this.selectionRectangleStart.y);
        ctx.lineTo(this.selectionRectangleEnd.x, this.selectionRectangleStart.y);
        ctx.lineTo(this.selectionRectangleEnd.x, this.selectionRectangleEnd.y);
        ctx.lineTo(this.selectionRectangleStart.x, this.selectionRectangleEnd.y);

        // Close path
        ctx.closePath();

        // Set line attributes
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gray";

        ctx.stroke();
    }
}

/**
 * Calculates angle between three points (clockwise from _pointA to _pointB in radians)
 *
 * @param {Point} _pointA First point
 * @param {Point} _pointM Mid point
 * @param {Point} _pointB Last point
 * @returns {Float} Angle between three points in radians (clockwise)
 */
ED.Drawing.prototype.innerAngle = function(_pointA, _pointM, _pointB) {
    // Get vectors from midpoint to A and B
    var a = new ED.Point(_pointA.x - _pointM.x, _pointA.y - _pointM.y);
    var b = new ED.Point(_pointB.x - _pointM.x, _pointB.y - _pointM.y);

    return a.clockwiseAngleTo(b);
}

/**
 * Toggles drawing state for drawing points in line
 */
ED.Drawing.prototype.togglePointInLine = function() {
    if (this.newPointOnClick) {
        this.newPointOnClick = false;
        this.completeLine = true;
        this.deselectDoodles();
        this.repaint();
    } else {
        this.newPointOnClick = true;
        this.completeLine = false;
    }
}

/**
 * Generates a numeric id guaranteed to be unique for the lifetime of the drawing object
 * (Index of doodleArray can be repeated if a doodle is deleted before adding another)
 * 
 * @returns {Int} Id of next doodle
 */
ED.Drawing.prototype.nextDoodleId = function() {
    return this.lastDoodleId++;
}

/**
 * Changes the drawing colour of freehand drawing
 *
 * @returns {String} _hexColour A string describing the colour to use for freehand drawing
 */
ED.Drawing.prototype.setSquiggleColour = function(_hexColour) {
    this.squiggleColour = _hexColour;

    this.refreshSquiggleSettings()
}

/**
 * Changes the line width for freehand drawing
 *
 * @returns {Int} _hexColour A number describing the width
 */
ED.Drawing.prototype.setSquiggleWidth = function(_width) {
    this.squiggleWidth = _width;

    this.refreshSquiggleSettings()
}

/**
 * Changes the line width for freehand drawing
 *
 * @returns {int} _style A string describing the style to use for freehand drawing
 */
ED.Drawing.prototype.setSquiggleStyle = function(_style) {
    this.squiggleStyle = _style;

    this.refreshSquiggleSettings()
}

/**
 * Refreshes the display of settings for freehand drawing
 *
 * @returns {String} _hexColour A string describing the colour to use for freehand drawing
 */
ED.Drawing.prototype.refreshSquiggleSettings = function() {
    // Get reference to canvas
    var displayCanvas = document.getElementById("squiggleSettings" + this.IDSuffix);

    if (displayCanvas) {
        // Get context
        var ctx = displayCanvas.getContext('2d');

        // Reset canvas
        displayCanvas.width = displayCanvas.width;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Set colours
        ctx.strokeStyle = "#" + this.squiggleColour;
        ctx.fillStyle = "#" + this.squiggleColour;

        // Line width
        ctx.beginPath();
        ctx.moveTo(3, 8);
        ctx.lineTo(20, 8);
        ctx.lineWidth = this.squiggleWidth / 2;
        ctx.stroke();

        // Outline or solid
        ctx.beginPath();
        ctx.rect(5, 19, 13, 8);
        ctx.lineWidth = 3;
        ctx.stroke();
        if (this.squiggleStyle == ED.squiggleStyle.Solid) {
            ctx.fill();
        }
    }
}

/**
 * An object of the Report class is used to extract data for the Royal College of Ophthalmologists retinal detachment dataset.
 * The object analyses an EyeDraw drawing, and sets the value of HTML elements on the page accordingly.
 *
 * @class Report
 * @property {Canvas} canvas A canvas element used to edit and display the drawing
 * @property {Int} breaksInAttached The number of retinal breaks in attached retina
 * @property {Int} breaksInDetached The number of retinal breaks in detached retina
 * @property {String} largestBreakType The type of the largest retinal break
 * @property {Int} largestBreakSize The size in clock hours of the largest retinal break
 * @property {Int} lowestBreakPosition The lowest position of any break in clock hours
 * @property {String} pvrType The type of PVR
 * @property {Int} pvrCClockHours The number of clock hours of posterior PVR type C
 * @property {Int} antPvrClockHours The number of clock hours of anterior PVR
 * @param Drawing _drawing The drawing object to be analysed
 */
ED.Report = function(_drawing) {
    // Properties
    this.drawing = _drawing;
    this.breaksInAttached = 0;
    this.breaksInDetached = 0;
    this.largestBreakType = 'Not found';
    this.largestBreakSize = 0;
    this.lowestBreakPosition = 12;
    this.pvrType = 'None';
    this.pvrCClockHours = 0;
    this.antPvrClockHours = 0;

    // Variables
    var pvrCDegrees = 0;
    var AntPvrDegrees = 0;
    var minDegreesFromSix = 180;

    // Create array of doodle classes which are retinal breaks
    var breakClassArray = new Array();
    breakClassArray["UTear"] = "U tear";
    breakClassArray["RoundHole"] = "Round hole";
    breakClassArray["Dialysis"] = "Dialysis";
    breakClassArray["GRT"] = "GRT";
    breakClassArray["MacularHole"] = "Macular hole";
    breakClassArray["OuterLeafBreak"] = "Outer Leaf Break";

    // Array of RRD doodles
    this.rrdArray = new Array();

    // First iteration to create array of retinal detachments
    var i, doodle;
    for (i = 0; i < this.drawing.doodleArray.length; i++) {
        doodle = this.drawing.doodleArray[i];

        // If its a RRD, add to RRD array
        if (doodle.className == "RRD") {
            this.rrdArray.push(doodle);
        }
    }

    // Second iteration for other doodles
    for (i = 0; i < this.drawing.doodleArray.length; i++) {
        doodle = this.drawing.doodleArray[i];

        // Star fold - PVR C
        if (doodle.className == "StarFold") {
            this.pvrType = 'C';
            pvrCDegrees += doodle.arc * 180 / Math.PI;
        }
        // Anterior PVR
        else if (doodle.className == "AntPVR") {
            this.pvrType = 'C';
            AntPvrDegrees += doodle.arc * 180 / Math.PI;
        }
        // Retinal breaks
        else if (doodle.className in breakClassArray) {
            // Bearing of break is calculated in two different ways
            var breakBearing = 0;
            if (doodle.className == "UTear" || doodle.className == "RoundHole" || doodle.className == "OuterLeafBreak") {
                breakBearing = (Math.round(Math.atan2(doodle.originX, -doodle.originY) * 180 / Math.PI) + 360) % 360;
            } else {
                breakBearing = (Math.round(doodle.rotation * 180 / Math.PI + 360)) % 360;
            }

            // Bool if break is in detached retina
            var inDetached = this.inDetachment(breakBearing);

            // Increment totals
            if (inDetached) {
                this.breaksInDetached++;
            } else {
                this.breaksInAttached++;
            }

            // Get largest break in radians
            if (inDetached && doodle.arc > this.largestBreakSize) {
                this.largestBreakSize = doodle.arc;
                this.largestBreakType = breakClassArray[doodle.className];
            }

            // Get lowest break
            var degreesFromSix = Math.abs(breakBearing - 180);

            if (inDetached && degreesFromSix < minDegreesFromSix) {
                minDegreesFromSix = degreesFromSix;

                // convert to clock hours
                var bearing = breakBearing + 15;
                remainder = bearing % 30;
                this.lowestBreakPosition = Math.floor((bearing - remainder) / 30);
                if (this.lowestBreakPosition == 0) this.lowestBreakPosition = 12;
            }
        }
    }

    // Star folds integer result (round up to one clock hour)
    pvrCDegrees += 25;
    var remainder = pvrCDegrees % 30;
    this.pvrCClockHours = Math.floor((pvrCDegrees - remainder) / 30);

    // Anterior PVR clock hours
    AntPvrDegrees += 25;
    remainder = AntPvrDegrees % 30;
    this.antPvrClockHours = Math.floor((AntPvrDegrees - remainder) / 30);

    // Convert largest break size to clockhours
    var size = this.largestBreakSize * 180 / Math.PI + 25;
    var remainder = size % 30;
    this.largestBreakSize = Math.floor((size - remainder) / 30);
}

/**
 * Accepts a bearing in degrees (0 is at 12 o'clock) and returns true if it is in an area of detachment
 *
 * @param {Float} _angle Bearing in degrees
 * @returns {Bool} True is the bearing intersects with an area of retinal deatchment
 */
ED.Report.prototype.inDetachment = function(_angle) {
    var returnValue = false;

    // Iterate through retinal detachments
    for (key in this.rrdArray) {
        var rrd = this.rrdArray[key];

        // Get start and finish bearings of detachment in degrees
        var min = (rrd.rotation - rrd.arc / 2) * 180 / Math.PI;
        var max = (rrd.rotation + rrd.arc / 2) * 180 / Math.PI;

        // Convert to positive numbers
        var min = (min + 360) % 360;
        var max = (max + 360) % 360;

        // Handle according to whether RRD straddles 12 o'clock
        if (max < min) {
            if ((0 <= _angle && _angle <= max) || (min <= _angle && _angle <= 360)) {
                returnValue = true;
            }
        } else if (max == min) // Case if detachment is total
        {
            return true;
        } else {
            if (min <= _angle && _angle <= max) {
                returnValue = true;
            }
        }
    }

    return returnValue;
}

/**
 * Extent of RRD in clock hours
 *
 * @returns {Array} An array of extents (1 to 3 clock hours) for each quadrant
 */
ED.Report.prototype.extent = function() {
    // Array of extents by quadrant
    var extentArray = new Array();
    if (this.drawing.eye == ED.eye.Right) {
        extentArray["SN"] = 0;
        extentArray["IN"] = 0;
        extentArray["IT"] = 0;
        extentArray["ST"] = 0;
    } else {
        extentArray["ST"] = 0;
        extentArray["IT"] = 0;
        extentArray["IN"] = 0;
        extentArray["SN"] = 0;
    }

    // get middle of first hour in degrees
    var midHour = 15;

    // Go through each quadrant counting extent of detachment
    for (quadrant in extentArray) {
        for (var i = 0; i < 3; i++) {
            var addition = this.inDetachment(midHour) ? 1 : 0;
            extentArray[quadrant] = extentArray[quadrant] + addition;
            midHour = midHour + 30;
        }
    }

    return extentArray;
}

/**
 * Returns true if the macular is off
 *
 * @returns {Bool} True if the macula is off
 */
ED.Report.prototype.isMacOff = function() {
    var result = false;

    // Iterate through each detachment, one macoff is enough
    for (key in this.rrdArray) {
        var rrd = this.rrdArray[key];
        if (rrd.isMacOff()) result = true;
    }

    return result;
}

/**
 * Doodles are components of drawings which have built in knowledge of what they represent, and how to behave when manipulated;
 * Doodles are drawn in the 'doodle plane' consisting of 1001 pixel square grid with central origin (ie -500 to 500) and
 * are rendered in a canvas element using a combination of the affine transform of the host drawing, and the doodle's own transform. 
 *
 * @class Doodle
 * @property {Drawing} drawing Drawing to which this doodle belongs
 * @property {Int} originX X coordinate of origin in doodle plane
 * @property {Int} originY Y coordinate of origin in doodle plane
 * @property {Float} radius of doodle from origin (used for some rotatable doodles that are fixed at origin)
 * @property {Int} apexX X coordinate of apex in doodle plane
 * @property {Int} apexY Y coordinate of apex in doodle plane
 * @property {Float} scaleX Scale of doodle along X axis
 * @property {Float} scaleY Scale of doodle along Y axis
 * @property {Float} arc Angle of arc for doodles that extend in a circular fashion
 * @property {Float} rotation Angle of rotation from 12 o'clock
 * @property {Int} order Order in which doodle is drawn (0 first ie backmost layer)
 * @property {Array} squiggleArray Array containing squiggles (freehand drawings)
 * @property {AffineTransform} transform Affine transform which handles the doodle's position, scale and rotation
 * @property {AffineTransform} inverseTransform The inverse of transform
 * @property {Bool} isLocked True if doodle is locked (temporarily unselectable) 
 * @property {Bool} isSelectable True if doodle is non-selectable
 * @property {Bool} isShowHighlight True if doodle shows a highlight when selected
 * @property {Bool} willStaySelected True if selection persists on mouseup
 * @property {Bool} isDeletable True if doodle can be deleted
 * @property {Bool} isSaveable Flag indicating whether doodle will be included in saved JSON string
 * @property {Bool} isOrientated True if doodle should always point to the centre (default = false)
 * @property {Bool} isScaleable True if doodle can be scaled. If false, doodle increases its arc angle
 * @property {Bool} isSqueezable True if scaleX and scaleY can be independently modifed (ie no fixed aspect ratio)
 * @property {Bool} isMoveable True if doodle can be moved. When combined with isOrientated allows automatic rotation.
 * @property {Bool} isRotatable True if doodle can be rotated
 * @property {Bool} isDrawable True if doodle accepts freehand drawings
 * @property {Bool} isUnique True if only one doodle of this class allowed in a drawing
 * @property {Bool} isArcSymmetrical True if changing arc does not change rotation
 * @property {Bool} addAtBack True if new doodles are added to the back of the drawing (ie first in array)
 * @property {Bool} isPointInLine True if centre of all doodles with this property should be connected by a line segment
 * @property {Bool} snapToGrid True if doodle should snap to a grid in doodle plane
 * @property {Bool} snapToQuadrant True if doodle should snap to a specific position in quadrant (defined in subclass)
 * @property {Bool} snapToPoints True if doodle should snap to one of a set of specific points
 * @property {Bool} snapToAngles True if doodle should snap to one of a set of specific rotation values
 * @property {Array} pointsArray Array of points to snap to
 * @property {Array} anglesArray Array of angles to snap to
 * @property {Bool} willReport True if doodle responds to a report request (can be used to suppress reports when not needed)
 * @property {Bool} willSync Flag used to indicate whether doodle will synchronise with another doodle
 * @property {Float} radius Distance from centre of doodle space, calculated for doodles with isRotable true
 * @property {Bool} isSelected True if doodle is currently selected
 * @property {Bool} isBeingDragged Flag indicating doodle is being dragged
 * @property {Int} draggingHandleIndex index of handle being dragged
 * @property {Range} draggingHandleRing Inner or outer ring of dragging handle
 * @property {Bool} isClicked Hit test flag
 * @property {Enum} drawFunctionMode Mode for boundary path
 * @property {Bool} isFilled True if boundary path is filled as well as stroked
 * @property {Int} frameCounter Keeps track of how many animation frames have been drawn
 * @property {Array} handleArray Array containing handles to be rendered
 * @property {Point} leftExtremity Point at left most extremity of doodle (used to calculate arc)
 * @property {Point} rightExtremity Point at right most extremity of doodle (used to calculate arc)
 * @property {Int} gridSpacing Separation of grid elements
 * @property {Int} gridDisplacementX Displacement of grid matrix from origin along x axis
 * @property {Int} gridDisplacementY Displacement of grid matrix from origin along y axis
 * @property {Float} version Version of doodle
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Doodle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
    // Function called as part of prototype assignment has no parameters passed
    if (typeof(_drawing) != 'undefined') {
        // Drawing containing this doodle
        this.drawing = _drawing;

        // Unique ID of doodle within this drawing
        this.id = this.drawing.nextDoodleId();

        // Optional rray of squiggles
        this.squiggleArray = new Array();

        // Transform used to draw doodle (includes additional transforms specific to the doodle)
        this.transform = new ED.AffineTransform();
        this.inverseTransform = new ED.AffineTransform();

        // Dragging defaults - set individual values in subclasses
        this.isLocked = false;
        this.isSelectable = true;
        this.isShowHighlight = true;
        this.willStaySelected = true;
        this.isDeletable = true;
        this.isSaveable = true;
        this.isOrientated = false;
        this.isScaleable = true;
        this.isSqueezable = false;
        this.isMoveable = true;
        this.isRotatable = true;
        this.isDrawable = false;
        this.isUnique = false;
        this.isArcSymmetrical = false;
        this.addAtBack = false;
        this.isPointInLine = false;
        this.snapToGrid = false;
        this.snapToQuadrant = false;
        this.snapToPoints = false;
        this.snapToAngles = false;
        this.willReport = true;
        this.willSync = true;

        // Calculate maximum range of origin:
        var halfWidth = Math.round(this.drawing.doodlePlaneWidth / 2);
        var halfHeight = Math.round(this.drawing.doodlePlaneHeight / 2);

        // Parameter validation array
        this.parameterValidationArray = {
            originX: {
                kind: 'simple',
                type: 'int',
                range: new ED.Range(-halfWidth, +halfWidth),
                delta: 15
            },
            originY: {
                kind: 'simple',
                type: 'int',
                range: new ED.Range(-halfHeight, +halfHeight),
                delta: 15
            },
            radius: {
                kind: 'simple',
                type: 'float',
                range: new ED.Range(+100, +450),
                precision: 6,
                delta: 15
            },
            apexX: {
                kind: 'simple',
                type: 'int',
                range: new ED.Range(-500, +500),
                delta: 15
            },
            apexY: {
                kind: 'simple',
                type: 'int',
                range: new ED.Range(-500, +500),
                delta: 15
            },
            scaleX: {
                kind: 'simple',
                type: 'float',
                range: new ED.Range(+0.5, +4.0),
                precision: 6,
                delta: 0.1
            },
            scaleY: {
                kind: 'simple',
                type: 'float',
                range: new ED.Range(+0.5, +4.0),
                precision: 6,
                delta: 0.1
            },
            arc: {
                kind: 'simple',
                type: 'float',
                range: new ED.Range(Math.PI / 12, Math.PI * 2),
                precision: 6,
                delta: 0.1
            },
            rotation: {
                kind: 'simple',
                type: 'float',
                range: new ED.Range(0, 2 * Math.PI),
                precision: 6,
                delta: 0.2
            },
        };

        // Grid properties
        this.gridSpacing = 200;
        this.gridDisplacementX = 0;
        this.gridDisplacementY = 0;

        // Flags and other properties
        this.isBeingDragged = false;
        this.draggingHandleIndex = null;
        this.draggingHandleRing = null;
        this.isClicked = false;
        this.drawFunctionMode = ED.drawFunctionMode.Draw;
        this.isFilled = true;
        this.derivedParametersArray = new Array(); // Array relating special parameters to corresponding common parameter
        this.animationFrameRate = 30; // Frames per second
        this.animationDataArray = new Array(); // Associative array, key = parameter name, value = array with animation info
        this.parentClass = ""; // Class of parent that a doodle is dependent on (parent auto-created)
        this.inFrontOfClassArray = new Array(); // Array of classes to put this doodle in front of (in order)

        // Array of points to snap to
        this.pointsArray = new Array();
        this.anglesArray = new Array();
        this.quadrantPoint = new ED.Point(200, 200);

        // Bindings to HTML element values. Associative array with parameter name as key
        this.bindingArray = new Array();
        this.drawing.listenerArray[this.id] = new Array();

        // Array of 5 handles
        this.handleArray = new Array();
        this.handleArray[0] = new ED.Handle(new ED.Point(-50, 50), false, ED.Mode.Scale, false);
        this.handleArray[1] = new ED.Handle(new ED.Point(-50, -50), false, ED.Mode.Scale, false);
        this.handleArray[2] = new ED.Handle(new ED.Point(50, -50), false, ED.Mode.Scale, false);
        this.handleArray[3] = new ED.Handle(new ED.Point(50, 50), false, ED.Mode.Scale, false);
        this.handleArray[4] = new ED.Handle(new ED.Point(this.apexX, this.apexY), false, ED.Mode.Apex, false);
        this.setHandles();

        // Extremities
        this.leftExtremity = new ED.Point(-100, -100);
        this.rightExtremity = new ED.Point(0, -100);

        // Version
        this.version = +1.0;

        // Set dragging default settings
        this.setPropertyDefaults();

        // New doodle (constructor called with _drawing parameter only)
        if (typeof(_originX) == 'undefined') {
            // Default set of parameters (Note use of unary + operator to type convert to numbers)
            this.originX = +0;
            this.originY = +0;
            this.radius = +100;
            this.apexX = +0;
            this.apexY = +0;
            this.scaleX = +1;
            this.scaleY = +1;
            this.arc = Math.PI;
            this.rotation = +0;
            this.order = this.drawing.doodleArray.length;

            this.setParameterDefaults();

            // Newly added doodles are selected
            this.isSelected = true;
        }
        // Doodle with passed parameters
        else {
            // Parameters
            this.originX = +_originX;
            this.originY = +_originY;
            this.radius = +_radius;
            this.apexX = +_apexX;
            this.apexY = +_apexY;
            this.scaleX = +_scaleX;
            this.scaleY = +_scaleY;
            this.arc = _arc * Math.PI / 180;
            this.rotation = _rotation * Math.PI / 180;
            this.order = +_order;

            // Update any derived parameters
            for (var parameter in this.parameterValidationArray) {
                var validation = this.parameterValidationArray[parameter];
                if (validation.kind == 'simple') {
                    this.updateDependentParameters(parameter);
                }
            }

            // Loaded doodles are not selected
            this.isSelected = false;
            this.isForDrawing = false;
        }
    }
}

/**
 * Sets default handle attributes (overridden by subclasses)
 */
ED.Doodle.prototype.setHandles = function() {}

/**
 * Sets default properties (overridden by subclasses)
 */
ED.Doodle.prototype.setPropertyDefaults = function() {}

/**
 * Sets default parameters (overridden by subclasses)
 */
ED.Doodle.prototype.setParameterDefaults = function() {}

/**
 * Sets position in array relative to other relevant doodles (overridden by subclasses)
 */
ED.Doodle.prototype.position = function() {}

/**
 * Called on attempt to delete doodle, and returns permission (overridden by subclasses)
 *
 * @returns {Bool} True if OK to delete
 */
ED.Doodle.prototype.willDelete = function() {
    return true;
}

/**
 * Moves doodle and adjusts rotation as appropriate
 *
 * @param {Float} _x Distance to move along x axis in doodle plane
 * @param {Float} _y Distance to move along y axis in doodle plane
 */
ED.Doodle.prototype.move = function(_x, _y) {
    // Ensure parameters are integers
    var x = Math.round(+_x);
    var y = Math.round(+_y);

    // Get position of centre of display (canvas plane relative to centre) and of an arbitrary point vertically above
    var canvasCentre = new ED.Point(0, 0);
    var canvasTop = new ED.Point(0, -100);

    if (this.isMoveable) {
        // Enforce bounds
        var newOriginX = this.parameterValidationArray['originX']['range'].constrain(this.originX + x);
        var newOriginY = this.parameterValidationArray['originY']['range'].constrain(this.originY + y);

        // Move doodle to new position
        if (x != 0) this.setSimpleParameter('originX', newOriginX);
        if (y != 0) this.setSimpleParameter('originY', newOriginY);

        // Update dependencies
        this.updateDependentParameters('originX');
        this.updateDependentParameters('originY');

        // Only need to change rotation if doodle has moved
        if (x != 0 || y != 0) {
            // If doodle isOriented is true, rotate doodle around centre of canvas (eg makes 'U' tears point to centre)
            if (this.isOrientated) {
                // New position of doodle
                var newDoodleOrigin = new ED.Point(this.originX, this.originY);

                // Calculate angle to current position from centre relative to north
                var angle = this.drawing.innerAngle(canvasTop, canvasCentre, newDoodleOrigin);

                // Alter orientation of doodle
                this.setSimpleParameter('rotation', angle);

                // Update dependencies
                this.updateDependentParameters('rotation');
            }
        }

        // Notify (NB pass doodle in message array, since this is not necessarily selected)
        this.drawing.notify("doodleMoved", {
            doodle: this
        });
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Doodle.prototype.draw = function(_point) {
    // Determine function mode
    if (typeof(_point) != 'undefined') {
        this.drawFunctionMode = ED.drawFunctionMode.HitTest;
    } else {
        this.drawFunctionMode = ED.drawFunctionMode.Draw;
    }

    // Get context
    var ctx = this.drawing.context;

    // Augment transform with properties of this doodle
    ctx.translate(this.originX, this.originY);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);

    // Mirror with internal transform
    this.transform.setToTransform(this.drawing.transform);
    this.transform.translate(this.originX, this.originY);
    this.transform.rotate(this.rotation);
    this.transform.scale(this.scaleX, this.scaleY);

    // Update inverse transform
    this.inverseTransform = this.transform.createInverse();

    // Reset hit test flag
    this.isClicked = false;
}

/**
 * Draws selection handles and sets dragging mode which is determined by which handle and part of handle is selected
 * Function either performs a hit test or draws the handles depending on whether a valid Point object is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Doodle.prototype.drawHandles = function(_point) {
    // Reset handle index and selected ring
    if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
        this.draggingHandleIndex = null;
        this.draggingHandleRing = null;
    }

    // Get context
    var ctx = this.drawing.context;

    // Save context to stack
    ctx.save();

    // Reset context transform to identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Dimensions and colour of handles
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.fillStyle = "yellow";

    // Draw corner handles
    var arc = Math.PI * 2;

    for (var i = 0; i < this.handleArray.length; i++) {
        var handle = this.handleArray[i];

        if (handle.isVisible) {
            // Path for inner ring
            ctx.beginPath();
            ctx.arc(handle.location.x, handle.location.y, ED.handleRadius / 2, 0, arc, true);

            // Hit testing for inner ring
            if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
                if (ctx.isPointInPath(_point.x, _point.y)) {
                    this.draggingHandleIndex = i;
                    this.draggingHandleRing = ED.handleRing.Inner;
                    this.drawing.mode = handle.mode;
                    this.isClicked = true;
                }
            }

            // Path for optional outer ring
            if (this.isRotatable && handle.isRotatable) {
                ctx.moveTo(handle.location.x + ED.handleRadius, handle.location.y);
                ctx.arc(handle.location.x, handle.location.y, ED.handleRadius, 0, arc, true);

                // Hit testing for outer ring
                if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
                    if (ctx.isPointInPath(_point.x, _point.y)) {
                        this.draggingHandleIndex = i;
                        if (this.draggingHandleRing == null) {
                            this.draggingHandleRing = ED.handleRing.Outer;
                            this.drawing.mode = ED.Mode.Rotate;
                        }
                        this.isClicked = true;
                    }
                }
            }

            // Draw handles
            if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
                ctx.fill();
                ctx.stroke();
            }
        }
    }

    // Restore context
    ctx.restore();
}

/**
 * Draws the boundary path or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Doodle.prototype.drawBoundary = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // HitTest
    if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
        // Workaround for Mozilla bug 405300 https://bugzilla.mozilla.org/show_bug.cgi?id=405300
        if (ED.isFirefox()) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            var hitTest = ctx.isPointInPath(_point.x, _point.y);
            ctx.restore();
        } else {
            var hitTest = ctx.isPointInPath(_point.x, _point.y);
        }

        if (hitTest) {
            // Set dragging mode
            if (this.isDrawable && this.isForDrawing) {
                this.drawing.mode = ED.Mode.Draw;
            } else {
                this.drawing.mode = ED.Mode.Move;
            }

            // Set flag indicating positive hit test
            this.isClicked = true;
        }
    }
    // Drawing
    else {
        // Specify highlight attributes
        if (this.isSelected && this.isShowHighlight) {
            ctx.shadowColor = "gray";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 20;
        }

        // Specify highlight attributes
        if (this.isForDrawing) {
            ctx.shadowColor = "blue";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 20;
        }

        // Fill path and draw it
        if (this.isFilled) {
            ctx.fill();
        }
        ctx.stroke();

        // Reset so shadow only on boundary
        ctx.shadowBlur = 0;

        // Draw any additional highlight items
        if (this.isSelected && this.isShowHighlight) {
            this.drawHighlightExtras();
        }
    }
}

/**
 * Draws extra items if the doodle is highlighted
 */
ED.Doodle.prototype.drawHighlightExtras = function() {}

/**
 * Shows doodle parameter controls. Doodle must set display:true in parameterValidationArray
 *
 * @param {Bool} _flag Flag determining whether display is shown or not shown
 */
ED.Doodle.prototype.setDisplayOfParameterControls = function(_flag) {
    for (var parameter in this.parameterValidationArray) {
        var validation = this.parameterValidationArray[parameter];
        if (validation.display) {
            // Construct id of element
            var id = parameter + this.className + this.drawing.IDSuffix;

            // Look for corresponding element and toggle display
            var element = document.getElementById(id);
            if (element) {
                // Get parent label
                var label = element.parentNode;
                if (_flag) {
                    label.style.display = 'inline';
                } else {
                    label.style.display = 'none';
                }

                // Ensure value of checkbox matches value of property
                element.checked = this[parameter];
            }
        }
    }
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Doodle.prototype.groupDescription = function() {
    return "";
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Doodle.prototype.description = function() {
    return "";
}

/**
 * Returns a String which, if not empty, determines the suffix following a group description
 *
 * @returns {String} Group description end
 */
ED.Doodle.prototype.groupDescriptionEnd = function() {
    return "";
}

/**
 * Returns a string containing a text description of the doodle. String taken from language specific ED_Tooltips.js
 *
 * @returns {String} Tool tip text
 */
ED.Doodle.prototype.tooltip = function() {
    var tip = ED.trans[this.className];
    if (typeof(tip) != 'undefined') {
        return tip;
    } else {
        return "";
    }
}

/**
 * Returns the SnoMed code of the doodle (overridden by subclasses)
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Doodle.prototype.snomedCode = function() {
    return 0;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest) (overridden by subclasses)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Doodle.prototype.diagnosticHierarchy = function() {
    return 0;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Doodle.prototype.dependentParameterValues = function(_parameter, _value) {
    return new Array();
}

/**
 * Updates dependent parameters
 *
 * @param {String} _parameter Name of parameter for which dependent parameters will be updated
 */
ED.Doodle.prototype.updateDependentParameters = function(_parameter) {
    // Retrieve list of dependent parameters and set them
    var valueArray = this.dependentParameterValues(_parameter, this[_parameter]);
    for (var parameter in valueArray) {
        this.setSimpleParameter(parameter, valueArray[parameter]);
    }

    // Update bindings
    this.drawing.updateBindings(this);
}

/**
 * Validates the value of a parameter, and returns it in appropriate format
 * If value is invalid, returns a constrained value or the original value
 * Called by event handlers of HTML elements
 *
 * @param {String} _parameter Name of the parameter
 * @param {Undefined} _value Value of the parameter to validate
 * @returns {Array} Array containing a bool indicating validity, and the correctly formatted value of the parameter
 */
ED.Doodle.prototype.validateParameter = function(_parameter, _value) {
    // Retrieve validation object for this doodle
    var validation = this.parameterValidationArray[_parameter];

    // Set return value;
    var value = "";

    if (validation) {
        // Validity flag
        var valid = false;

        // Enforce string type and trim it
        value = _value.toString().trim();

        switch (validation.type) {
            case 'string':

                // Check that its in list of valid values
                if (validation.list.indexOf(value) >= 0) {
                    valid = true;
                }
                break;

            case 'float':

                // Test that value is a number
                if (ED.isNumeric(value)) {
                    // Convert string to float value
                    value = parseFloat(value);

                    // Constrain value to allowable range
                    value = validation.range.constrain(value);

                    // Convert back to string, applying any formatting
                    value = value.toFixed(validation.precision);

                    valid = true;
                }
                break;

            case 'int':

                // Test that value is a number, and if not reset to current value of doodle
                if (ED.isNumeric(value)) {
                    // Convert string to float value
                    value = parseInt(value);

                    // Constrain value to allowable range
                    value = validation.range.constrain(value);

                    // Convert back to string, applying any formatting
                    value = value.toFixed(0);

                    valid = true;
                }
                break;

            case 'mod':

                // Test that value is a number, and if not reset to current value of doodle
                if (ED.isNumeric(value)) {
                    // Convert string to float value
                    value = parseInt(value);

                    // Constrain value to allowable range
                    value = validation.range.constrain(value);

                    // Deal with crossover
                    if (validation.clock == 'top') {
                        if (value == validation.range.min) value = validation.range.max;
                    } else if (validation.clock == 'bottom') {
                        if (value == validation.range.max) value = validation.range.min;
                    }

                    // Convert back to string, applying any formatting
                    value = value.toFixed(0);

                    valid = true;
                }
                break;

            case 'bool':

                // Event handler detects check box type and returns checked attribute
                if (_value == 'true' || _value == 'false') {
                    // Convert to string for compatibility with setParameterFromString method
                    value = _value;
                    valid = true;
                }
                break;

            default:
                ED.errorHandler('ED.Drawing', 'eventHandler', 'Illegal validation type');
                break;
        }
    } else {
        ED.errorHandler('ED.Doodle', 'validateParameter', 'Unknown parameter name');
    }

    // If not valid, get current value of parameter
    if (!valid) {
        value = this.getParameter(_parameter);
        ED.errorHandler('ED.Doodle', 'validateParameter', 'Validation failure for parameter: ' + _parameter + ' with value: ' + _value);
    }

    // Return validity and value
    var returnArray = new Array();
    returnArray['valid'] = valid;
    returnArray['value'] = value;
    return returnArray;
}

/**
 * Attempts to animate a change in value of a parameter
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Doodle.prototype.setParameterWithAnimation = function(_parameter, _value) {
    // Can doodle animate this parameter?
    if (this.parameterValidationArray[_parameter]['animate']) {
        var valueArray = this.dependentParameterValues(_parameter, _value);
        for (var parameter in valueArray) {
            // Read delta in units per frame
            var delta = this.parameterValidationArray[parameter]['delta'];

            // Calculate 'distance' to go
            var distance = valueArray[parameter] - this[parameter];

            // Calculate sign and apply to delta
            if (parameter == 'rotation') {
                // This formula works out correct distance and direction on a radians 'clock face' (ie the shortest way round)
                var sign = ((Math.PI - Math.abs(distance)) * distance) < 0 ? -1 : 1;
                distance = distance * sign;

                // Make distance positive
                if (distance < 0) distance += 2 * Math.PI;

                // Test for roughly half way
                if (distance > 3.141) {
                    if (this.rotation < Math.PI) sign = -sign;
                }
            } else {
                var sign = distance < 0 ? -1 : 1;
            }
            delta = delta * sign;

            // Calculate number of frames to animate
            var frames = Math.abs(Math.floor(distance / delta));

            // Put results into an associative array for this parameter
            var array = {
                timer: null,
                delta: delta,
                frames: frames,
                frameCounter: 0
            };
            this.animationDataArray[parameter] = array;

            // Call animation method
            if (frames > 0) {
                this.increment(parameter, valueArray[parameter]);
            }
            // Increment may be too small to animate, but still needs setting
            else {
                // Set  parameter to exact value
                this.setSimpleParameter(parameter, valueArray[parameter]);

                // Update dependencies
                this.updateDependentParameters(parameter);

                // Refresh drawing
                this.drawing.repaint();
            }
        }

    }
    // Otherwise just set it directly
    else {
        this.setParameterFromString(_parameter, _value.toString());
    }
}

/**
 * Set the value of a doodle's parameter directly, and triggers a notification
 *
 * @param {String} _parameter Name of parameter
 * @param {Undefined} _value New value of parameter
 */
ED.Doodle.prototype.setSimpleParameter = function(_parameter, _value) {
    // Create notification message var messageArray = {eventName:_eventName, selectedDoodle:this.selectedDoodle, object:_object};
    var object = new Object;
    object.doodle = this;
    object.parameter = _parameter;
    object.value = _value;
    object.oldValue = this[_parameter];

    // Set parameter
    this[_parameter] = _value;

    // Trigger notification
    this.drawing.notify('parameterChanged', object);
}

/**
 * Set the value of a doodle's parameter from a string format following validation
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Doodle.prototype.setParameterFromString = function(_parameter, _value) {
    // Check type of passed value variable
    var type = typeof(_value);
    if (type != 'string') {
        ED.errorHandler('ED.Doodle', 'setParameterFromString', '_value parameter should be of type string, not ' + type);
    }

    // Retrieve validation object for this doodle
    var validation = this.parameterValidationArray[_parameter];

    if (validation) {
        // Set value according to type of parameter
        switch (validation.type) {
            case 'string':
                this[_parameter] = _value;
                break;

            case 'float':
                this[_parameter] = parseFloat(_value);
                break;

            case 'int':
                this[_parameter] = parseInt(_value);
                break;

            case 'mod':
                this[_parameter] = parseInt(_value);
                break;

            case 'bool':
                this[_parameter] = (_value == 'true');
                break;

            default:
                ED.errorHandler('ED.Doodle', 'setParameterFromString', 'Illegal validation type: ' + validation.type);
                break;
        }

        // Update dependencies
        this.updateDependentParameters(_parameter);

        // Update child dependencies of any derived parameters
        if (this.parameterValidationArray[_parameter]['kind'] == 'derived') {
            var valueArray = this.dependentParameterValues(_parameter, _value);
            for (var parameter in valueArray) {
                // Update dependencies
                this.updateDependentParameters(parameter);
            }
        }
    } else {
        ED.errorHandler('ED.Doodle', 'setParameterFromString', 'No item in parameterValidationArray corresponding to parameter: ' + _parameter);
    }

    // Refresh drawing
    this.drawing.repaint();
}

/**
 * Set the value of a doodle's origin to avoid overlapping other doodles
 *
 * @param {String} _first Displacement of first doodle
 * @param {String} _next Displacement of subsequent doodles
 */
ED.Doodle.prototype.setOriginWithDisplacements = function(_first, _next) {
    this.originX = this.drawing.eye == ED.eye.Right ? -_first : _first;
    this.originY = -_first;

    // Get last doodle to be added
    if (this.addAtBack) {
        var doodle = this.drawing.firstDoodleOfClass(this.className);
    } else {
        var doodle = this.drawing.lastDoodleOfClass(this.className);
    }

    // If there is one, make position relative to it
    if (doodle) {
        var newOriginX = doodle.originX - _next;
        var newOriginY = doodle.originY - _next;

        this.originX = this.parameterValidationArray['originX']['range'].constrain(newOriginX);
        this.originY = this.parameterValidationArray['originY']['range'].constrain(newOriginY);
    }
}

/**
 * Set the value of a doodle's rotation to avoid overlapping other doodles
 *
 * @param {Int} _first Rotation in degrees of first doodle anticlockwise right eye, clockwise left eye
 * @param {Int} _next Additional rotation of subsequent doodles
 */
ED.Doodle.prototype.setRotationWithDisplacements = function(_first, _next) {
    var direction = this.drawing.eye == ED.eye.Right ? -1 : 1;
    var newRotation;

    // Get last doodle to be added
    if (this.addAtBack) {
        var doodle = this.drawing.firstDoodleOfClass(this.className);
    } else {
        var doodle = this.drawing.lastDoodleOfClass(this.className);
    }

    // If there is one, make rotation relative to it
    if (doodle) {
        newRotation = ((doodle.rotation * 180 / Math.PI + direction * _next + 360) % 360) * Math.PI / 180;
    } else {
        newRotation = ((direction * _first + 360) % 360) * Math.PI / 180;
    }

    this.rotation = this.parameterValidationArray['rotation']['range'].constrain(newRotation);
}

/**
 * Deselects doodle
 */
ED.Doodle.prototype.deselect = function() {
    // Deselect
    this.isSelected = false;
    this.drawing.selectedDoodle = null;

    // Refresh drawing
    this.drawing.repaint();
}

/**
 * Returns parameter values in validated string format
 *
 * @param {String} _parameter Name of parameter
 * @returns {String} Value of parameter
 */
ED.Doodle.prototype.getParameter = function(_parameter) {
    // Retrieve validation object for this doodle
    var validation = this.parameterValidationArray[_parameter];

    // Set return value;
    var value = "";

    if (validation) {
        switch (validation.type) {
            case 'string':
                value = this[_parameter];
                break;

            case 'float':
                // Convert to string, applying any formatting
                value = this[_parameter].toFixed(validation.precision);
                break;

            case 'int':
                // Convert to string, applying any formatting
                value = this[_parameter].toFixed(0);
                break;

            case 'mod':
                // Round to integer applying any formatting
                value = Math.round(this[_parameter]);

                // Deal with crossover
                if (validation.clock == 'top') {
                    if (value == validation.range.min) value = validation.range.max;
                } else if (validation.clock == 'bottom') {
                    if (value == validation.range.max) value = validation.range.min;
                }

                // Convert to string
                value = value.toFixed(0);
                break;

            case 'bool':
                value = this[_parameter].toString();
                break;

            default:
                ED.errorHandler('ED.Doodle', 'getParameter', 'Illegal validation type');
                break;
        }
    } else {
        ED.errorHandler('ED.Doodle', 'getParameter', 'No entry in parameterValidationArray corresponding to parameter: ' + _parameter);
    }

    // Return value
    return value;
}

/**
 * Uses a timeout to call itself and produce the animation
 *
 * @param {String} _parameter Name of parameter
 * @param {String} _value New value of parameter
 */
ED.Doodle.prototype.increment = function(_parameter, _value) {
    // Increment parameter and framecounter
    var currentValue = this[_parameter];
    this.animationDataArray[_parameter]['frameCounter']++;

    // Calculate interval between frames in milliseconds
    var interval = 1000 / this.animationFrameRate;

    // Complete or continue animation
    if (this.animationDataArray[_parameter]['frameCounter'] == this.animationDataArray[_parameter]['frames']) {
        // Set  parameter to exact value
        this.setSimpleParameter(_parameter, _value);

        // Update dependencies
        this.updateDependentParameters(_parameter);

        // Stop timer
        clearTimeout(this.animationDataArray[_parameter]['timer']);
    } else {
        // Set parameter to new value
        this.setSimpleParameter(_parameter, currentValue + this.animationDataArray[_parameter]['delta']);

        // Update dependencies
        this.updateDependentParameters(_parameter);

        // Start timer and set to call this function again after interval
        var doodle = this;
        this.animationDataArray[_parameter]['timer'] = setTimeout(function() {
            doodle.increment(_parameter, _value);
        }, interval);
    }

    // Refresh drawing
    this.drawing.repaint();
}

/**
 * Adds a binding to the doodle. Only derived parameters can be bound
 *
 * @param {String} _parameter Name of parameter to be bound
 * @param {String} _fieldParameters Details of bound HTML element
 */
ED.Doodle.prototype.addBinding = function(_parameter, _fieldParameters) {
    var elementId = _fieldParameters['id'];
    var attribute = _fieldParameters['attribute'];

    // Check that doodle has a parameter of this name
    if (typeof(this[_parameter]) != 'undefined') {
        // Get reference to HTML element
        var element = document.getElementById(elementId);

        // Check element exists
        if (element != null) {
            // Add binding to array
            this.bindingArray[_parameter] = {
                'id': elementId,
                'attribute': attribute
            };

            // Attach onchange event of element with a function which calls the drawing event handler
            var drawing = this.drawing;
            var id = this.id;
            var className = this.className;
            var listener;

            // Set the parameter to the value of the element, and attach a listener
            switch (element.type) {
                case 'checkbox':
                    if (attribute) {
                        ED.errorHandler('ED.Doodle', 'addBinding', 'Binding to a checkbox with a non-standard attribute not yet supported');
                    } else {
                        this.setParameterFromString(_parameter, element.checked.toString());
                        element.addEventListener('change', listener = function(event) {
                            drawing.eventHandler('onchange', id, className, this.id, this.checked.toString());
                        }, false);
                    }
                    break;

                case 'select-one':
                    if (attribute) {
                        if (element.selectedIndex > -1) {
                            this.setParameterFromString(_parameter, element.options[element.selectedIndex].getAttribute(attribute));
                        }
                        element.addEventListener('change', listener = function(event) {
                            drawing.eventHandler('onchange', id, className, this.id, this.options[this.selectedIndex].getAttribute(attribute));
                        }, false);
                    } else {
                        this.setParameterFromString(_parameter, element.value);
                        element.addEventListener('change', listener = function(event) {
                            drawing.eventHandler('onchange', id, className, this.id, this.value);
                        }, false);
                    }
                    break;

                default:
                    if (attribute) {
                        this.setParameterFromString(_parameter, element.getAttribute(attribute));
                        element.addEventListener('change', listener = function(event) {
                            drawing.eventHandler('onchange', id, className, this.id, this.getAttribute(attribute));
                        }, false);
                    } else {
                        this.setParameterFromString(_parameter, element.value);
                        element.addEventListener('change', listener = function(event) {
                            drawing.eventHandler('onchange', id, className, this.id, this.value);
                        }, false);
                    }
                    break;
            }

            // Add listener to array
            this.drawing.listenerArray[this.id][_parameter] = listener;
        } else {
            ED.errorHandler('ED.Doodle', 'addBinding', 'Failed to add binding. DOM has no element with id: ' + elementId);
        }
    } else {
        ED.errorHandler('ED.Doodle', 'addBinding', 'Failed to add binding. Doodle of class: ' + this.className + ' has no parameter of name: ' + _parameter);
    }
}

/**
 * Removes a binding from a doodle
 *
 * @param {String} _parameter Name of parameter whosse binding is to be removed
 */
ED.Doodle.prototype.removeBinding = function(_parameter) {
    // Get id of corresponding element
    var elementId;
    for (var parameter in this.bindingArray) {
        if (parameter == _parameter) {
            elementId = this.bindingArray[_parameter]['id'];
        }
    }

    // Remove entry in binding array
    delete this.bindingArray[_parameter];

    // Remove event listener
    var element = document.getElementById(elementId);
    element.removeEventListener('change', this.drawing.listenerArray[this.id][_parameter], false);

    // Remove entry in listener array
    delete this.drawing.listenerArray[this.id][_parameter];
}

/**
 * Returns the position converted to clock hours
 *
 * @returns {Int} Clock hour from 1 to 12
 */
ED.Doodle.prototype.clockHour = function() {
    var clockHour;

    if (this.isRotatable && !this.isMoveable) {
        clockHour = ((this.rotation * 6 / Math.PI) + 12) % 12;
    } else {
        var twelvePoint = new ED.Point(0, -100);
        var thisPoint = new ED.Point(this.originX, this.originY);
        var clockHour = ((twelvePoint.clockwiseAngleTo(thisPoint) * 6 / Math.PI) + 12) % 12;
    }

    clockHour = clockHour.toFixed(0);
    if (clockHour == 0) clockHour = 12;
    return clockHour
}

/**
 * Returns the quadrant of a doodle based on origin coordinates
 *
 * @returns {String} Description of quadrant
 */
ED.Doodle.prototype.quadrant = function() {
    var returnString = "";

    // Use trigonometry on rotation field to determine quadrant
    returnString += this.originY < 0 ? "supero" : "infero";
    if (this.drawing.eye == ED.eye.Right) {
        returnString += this.originX < 0 ? "temporal" : "nasal";
    } else {
        returnString += this.originX < 0 ? "nasal" : "temporal";
    }

    returnString += " quadrant";

    return returnString;
}

/**
 * Returns the rotation converted to degrees
 *
 * @returns {Int} Degrees from 0 to 360
 */
ED.Doodle.prototype.degrees = function() {
    var degrees;

    if (this.isRotatable && !this.isMoveable) {
        degrees = ((this.rotation * 180 / Math.PI) + 360) % 360;
    } else {
        var twelvePoint = new ED.Point(0, -100);
        var thisPoint = new ED.Point(this.originX, this.originY);
        degrees = ((twelvePoint.clockwiseAngleTo(thisPoint) * 180 / Math.PI) + 360) % 360;
    }

    degrees = degrees.toFixed(0);
    if (degrees == 0) degrees = 0;
    return degrees;
}

/**
 * Returns the extent converted to clock hours
 *
 * @returns {Int} Clock hour from 1 to 12
 */
ED.Doodle.prototype.clockHourExtent = function() {
    var clockHourStart;
    var clockHourEnd;

    if (this.isRotatable && !this.isMoveable) {
        clockHourStart = (((this.rotation - this.arc / 2) * 6 / Math.PI) + 12) % 12;
        clockHourEnd = (((this.rotation + this.arc / 2) * 6 / Math.PI) + 12) % 12;
    } else {
        var twelvePoint = new ED.Point(0, -100);
        var thisPoint = new ED.Point(this.originX, this.originY);
        var clockHour = ((twelvePoint.clockwiseAngleTo(thisPoint) * 6 / Math.PI) + 12) % 12;
    }

    clockHourStart = clockHourStart.toFixed(0);
    if (clockHourStart == 0) clockHourStart = 12;
    clockHourEnd = clockHourEnd.toFixed(0);
    if (clockHourEnd == 0) clockHourEnd = 12;
    return "from " + clockHourStart + " to " + clockHourEnd;
}

/**
 * Returns the extent converted to degrees
 *
 * @returns {Int} Extent 0 to 360 degrees
 */
ED.Doodle.prototype.degreesExtent = function() {
    var degrees = this.arc * 180 / Math.PI;
    var intDegrees = Math.round(degrees);
    return intDegrees;
}

/**
 * Returns the location relative to the disc
 *
 * @returns {String} Text description of location
 */
ED.Doodle.prototype.locationRelativeToDisc = function() {
    var locationString = "";

    // Right eye
    if (this.drawing.eye == ED.eye.Right) {
        if (this.originX > 180 && this.originX < 420 && this.originY > -120 && this.originY < 120) {
            locationString = "at the disc";
        } else {
            locationString += this.originY <= 0 ? "supero" : "infero";
            locationString += this.originX <= 300 ? "temporally" : "nasally";
        }
    }
    // Left eye
    else {
        if (this.originX < -180 && this.originX > -420 && this.originY > -120 && this.originY < 120) {
            locationString = "at the disc";
        } else {
            locationString += this.originY <= 0 ? "supero" : "infero";
            locationString += this.originX >= -300 ? "temporally" : "nasally";
        }
    }

    return locationString;
}

/**
 * Returns the location relative to the fovea
 *
 * @returns {String} Text description of location
 */
ED.Doodle.prototype.locationRelativeToFovea = function() {
    var locationString = "";

    // Right eye
    if (this.drawing.eye == ED.eye.Right) {
        if (this.originX > -10 && this.originX < 10 && this.originY > -10 && this.originY < 10) {
            locationString = "at the fovea";
        } else {
            locationString += this.originY <= 0 ? "supero" : "infero";
            locationString += this.originX <= 0 ? "temporal" : "nasal";
            locationString += " to the fovea";
        }
    }
    // Left eye
    else {
        if (this.originX > -10 && this.originX < 10 && this.originY > -10 && this.originY < 10) {
            locationString = "at the fovea";
        } else {
            locationString += this.originY <= 0 ? "supero" : "infero";
            locationString += this.originX >= 0 ? "temporally" : "nasally";
            locationString += " to the fovea";
        }
    }
    return locationString;
}

/**
 * Adds a new squiggle to the doodle's squiggle array
 */
ED.Doodle.prototype.addSquiggle = function() {
    // Get preview colour (returned as rgba(r,g,b))
    //var colourString = this.drawing.squiggleColour;

    // Use regular expression to extract rgb values from returned value
    //var colourArray = colourString.match(/\d+/g);

    // True if solid
    var filled = this.drawing.squiggleStyle == ED.squiggleStyle.Solid;

    // Create new squiggle of selected colour
    var squiggle = new ED.Squiggle(this, this.drawing.squiggleColour, this.drawing.squiggleWidth, filled);

    // Add it to squiggle array
    this.squiggleArray.push(squiggle);
}

/**
 * Adds a point to the active squiggle (the last in the squiggle array)
 *
 * @param {Point} _point The point in the doodle plane to be added
 */
ED.Doodle.prototype.addPointToSquiggle = function(_point) {
    if (this.squiggleArray.length > 0) {
        var index = this.squiggleArray.length - 1;
        var squiggle = this.squiggleArray[index];

        squiggle.addPoint(_point);
    }
}

/**
 * Complete the active squiggle (last in the array)
 */
ED.Doodle.prototype.completeSquiggle = function() {
    if (this.squiggleArray.length > 0) {
        var index = this.squiggleArray.length - 1;
        var squiggle = this.squiggleArray[index];

        squiggle.complete = true;
    }
}

/**
 * Calculates arc for doodles without a natural arc value
 *
 * @returns Arc value in radians
 */
ED.Doodle.prototype.calculateArc = function() {
    // Transform extremity points to origin of 0,0
    var left = new ED.Point(this.leftExtremity.x - this.drawing.canvas.width / 2, this.leftExtremity.y - this.drawing.canvas.height / 2);
    var right = new ED.Point(this.rightExtremity.x - this.drawing.canvas.width / 2, this.rightExtremity.y - this.drawing.canvas.height / 2);

    // Return angle between them
    return left.clockwiseAngleTo(right);
}

/**
 * Finds the nearest point in the doodle pointsArray
 *
 * @param {ED.Point} _point The point to test
 * @returns {ED.Point} The nearest point
 */
ED.Doodle.prototype.nearestPointTo = function(_point) {
    // Check that pointsArray has content
    if (this.pointsArray.length > 0) {
        var min = 10000000; // Greater than square of maximum separation in doodle plane
        var index = 0;

        // Iterate through points array to find nearest point
        for (var i = 0; i < this.pointsArray.length; i++) {
            var p = this.pointsArray[i];
            var d = (_point.x - p.x) * (_point.x - p.x) + (_point.y - p.y) * (_point.y - p.y);

            if (d < min) {
                min = d;
                index = i;
            }
        }

        return this.pointsArray[index];
    }
    // Otherwise generate error and return passed point
    else {
        ED.errorHandler('ED.Doodle', 'nearestPointTo', 'Attempt to calculate nearest points with an empty points array');
        return _point;
    }
}

/**
 * Finds the nearest angle in the doodle anglesArray
 *
 * @param {Float} _angle The angle to test
 * @returns {Float} The nearest angle
 */
ED.Doodle.prototype.nearestAngleTo = function(_angle) {
    // Check that anglesArray has content
    if (this.anglesArray.length > 0) {
        var min = 2 * Math.PI; // Greater than one complete rotation
        var index = 0;

        // Iterate through angles array to find nearest point
        for (var i = 0; i < this.anglesArray.length; i++) {
            var p = this.anglesArray[i];

            var d = Math.abs(p - _angle);

            if (d < min) {
                min = d;
                index = i;
            }
        }

        return this.anglesArray[index];
    }
    // Otherwise generate error and return passed angle
    else {
        ED.errorHandler('ED.Doodle', 'nearestAngleTo', 'Attempt to calculate nearest angle with an empty angles array');
        return _angle;
    }
}

/**
 * Returns a doodle in JSON format
 *
 * @returns {String} A JSON encoded string representing the variable properties of the doodle
 */
ED.Doodle.prototype.json = function() {
    var s = '{';
    s = s + '"version": ' + this.version.toFixed(1) + ', ';
    s = s + '"subclass": ' + '"' + this.className + '", ';
    s = s + '"originX": ' + this.originX.toFixed(0) + ', ';
    s = s + '"originY": ' + this.originY.toFixed(0) + ', ';
    s = s + '"radius": ' + this.radius.toFixed(0) + ', ';
    s = s + '"apexX": ' + this.apexX.toFixed(0) + ', ';
    s = s + '"apexY": ' + this.apexY.toFixed(0) + ', ';
    s = s + '"scaleX": ' + this.scaleX.toFixed(2) + ', ';
    s = s + '"scaleY": ' + this.scaleY.toFixed(2) + ', ';
    s = s + '"arc": ' + (this.arc * 180 / Math.PI).toFixed(0) + ', ';
    s = s + '"rotation": ' + (this.rotation * 180 / Math.PI).toFixed(0) + ', ';
    s = s + '"order": ' + this.order.toFixed(0) + ', ';

    s = s + '"squiggleArray": [';
    for (var j = 0; j < this.squiggleArray.length; j++) {
        s = s + this.squiggleArray[j].json();
        if (this.squiggleArray.length - j > 1) {
            s = s + ', ';
        }
    }
    s = s + '], ';

    s = s + '"params": [';
    if (typeof(this.savedParams) != 'undefined') {
        for (var j = 0; j < this.savedParams.length; j++) {
            var param = this.savedParams[j];
            s = s + '{ "name": "' + param + '", "value": "' + this[param] + '" }';
            if (this.savedParams.length - j > 1) {
                s = s + ', ';
            }
        }
    }
    s = s + ']';

    s = s + '}';

    return s;
}

/**
 * Draws a circular spot with given parameters
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 * @param {Float} _r Radius
 * @param {String} _colour String containing colour
 */
ED.Doodle.prototype.drawSpot = function(_ctx, _x, _y, _r, _colour) {
    _ctx.beginPath();
    _ctx.arc(_x, _y, _r, 0, Math.PI * 2, true);
    _ctx.fillStyle = _colour;
    _ctx.fill();
}

/**
 * Draws a circle with given parameters
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 * @param {Float} _r Radius
 * @param {String} _fillColour String containing fill colour
 * @param {Int} _lineWidth Line width in pixels
 * @param {String} _strokeColour String containing stroke colour
 */
ED.Doodle.prototype.drawCircle = function(_ctx, _x, _y, _r, _fillColour, _lineWidth, _strokeColour) {
    _ctx.beginPath();
    _ctx.arc(_x, _y, _r, 0, Math.PI * 2, true);
    _ctx.fillStyle = _fillColour;
    _ctx.fill();
    _ctx.lineWidth = _lineWidth;
    _ctx.strokeStyle = _strokeColour;
    _ctx.stroke();
}

/**
 * Draws a line with given parameters
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x1 X-coordinate of origin
 * @param {Float} _y1 Y-coordinate of origin
 * @param {Float} _x2 X-coordinate of origin
 * @param {Float} _y2 Y-coordinate of origin
 * @param {Float} _w Width of line
 * @param {String} _colour String containing colour
 */
ED.Doodle.prototype.drawLine = function(_ctx, _x1, _y1, _x2, _y2, _w, _colour) {
    _ctx.beginPath();
    _ctx.moveTo(_x1, _y1);
    _ctx.lineTo(_x2, _y2);
    _ctx.lineWidth = _w;
    _ctx.strokeStyle = _colour;
    _ctx.stroke();
}


/**
 * Draws a laser spot
 *
 * @param {Object} _ctx Context of canvas
 * @param {Float} _x X-coordinate of origin
 * @param {Float} _y Y-coordinate of origin
 */
ED.Doodle.prototype.drawLaserSpot = function(_ctx, _x, _y) {
    this.drawCircle(_ctx, _x, _y, 15, "Yellow", 10, "rgba(255, 128, 0, 1)");
}

/**
 * Returns the x coordinate of a point given its y and the radius
 *
 * @param {Float} _r Radius to point
 * @param {Float} _y y coordinate of point
 * @returns {Float} x coordinate of point
 */
ED.Doodle.prototype.xForY = function(_r, _y) {
    return Math.sqrt(_r * _r - _y * _y);
}

/**
 * Outputs doodle information to the console
 */
ED.Doodle.prototype.debug = function() {
    console.log('org: ' + this.originX + " : " + this.originY);
    console.log('apx: ' + this.apexX + " : " + this.apexY);
    console.log('rot: ' + this.rotation * 180 / Math.PI);
    console.log('arc: ' + this.arc * 180 / Math.PI);
}

/**
 * Represents a control handle on the doodle
 *
 * @class Handle
 * @property {Point} location Location in doodle plane
 * @property {Bool} isVisible Flag indicating whether handle should be shown
 * @property {Enum} mode The drawing mode that selection of the handle triggers
 * @property {Bool} isRotatable Flag indicating whether the handle shows an outer ring used for rotation
 * @param {Point} _location
 * @param {Bool} _isVisible
 * @param {Enum} _mode
 * @param {Bool} _isRotatable
 */
ED.Handle = function(_location, _isVisible, _mode, _isRotatable) {
    // Properties
    if (_location == null) {
        this.location = new ED.Point(0, 0);
    } else {
        this.location = _location;
    }
    this.isVisible = _isVisible;
    this.mode = _mode;
    this.isRotatable = _isRotatable;
}


/**
 * Represents a range of numerical values
 *
 * @class Range
 * @property {Float} min Minimum value
 * @property {Float} max Maximum value
 * @param {Float} _min
 * @param {Float} _max
 */
ED.Range = function(_min, _max) {
    // Properties
    this.min = _min;
    this.max = _max;
}

/**
 * Set min and max with one function call
 *
 * @param {Float} _min
 * @param {Float} _max
 */
ED.Range.prototype.setMinAndMax = function(_min, _max) {
    // Set properties
    this.min = _min;
    this.max = _max;
}

/**
 * Returns true if the parameter is less than the minimum of the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is less than the minimum
 */
ED.Range.prototype.isBelow = function(_num) {
    if (_num < this.min) {
        return true;
    } else {
        return false;
    }
}

/**
 * Returns true if the parameter is more than the maximum of the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is more than the maximum
 */
ED.Range.prototype.isAbove = function(_num) {
    if (_num > this.max) {
        return true;
    } else {
        return false;
    }
}

/**
 * Returns true if the parameter is inclusively within the range
 *
 * @param {Float} _num
 * @returns {Bool} True if the parameter is within the range
 */
ED.Range.prototype.includes = function(_num) {
    if (_num < this.min || _num > this.max) {
        return false;
    } else {
        return true;
    }
}

/**
 * Constrains a value to the limits of the range
 *
 * @param {Float} _num
 * @returns {Float} The constrained value
 */
ED.Range.prototype.constrain = function(_num) {
    if (_num < this.min) {
        return this.min;
    } else if (_num > this.max) {
        return this.max;
    } else {
        return _num;
    }
}

/**
 * Returns true if the parameter is within the 'clockface' range represented by the min and max values
 *
 * @param {Float} _angle Angle to test
 * @param {Bool} _isDegrees Flag indicating range is in degrees rather than radians
 * @returns {Bool} True if the parameter is within the range
 */
ED.Range.prototype.includesInAngularRange = function(_angle, _isDegrees) {
    // Arbitrary radius
    var r = 100;

    // Points representing vectos of angles within range
    var min = new ED.Point(0, 0);
    var max = new ED.Point(0, 0);
    var angle = new ED.Point(0, 0);

    // Set points using polar coordinates
    if (!_isDegrees) {
        min.setWithPolars(r, this.min);
        max.setWithPolars(r, this.max);
        angle.setWithPolars(r, _angle);
    } else {
        min.setWithPolars(r, this.min * Math.PI / 180);
        max.setWithPolars(r, this.max * Math.PI / 180);
        angle.setWithPolars(r, _angle * Math.PI / 180);
    }

    return (min.clockwiseAngleTo(angle) <= min.clockwiseAngleTo(max));
}

/**
 * Constrains a value to the limits of the angular range
 *
 * @param {Float} _angle Angle to test
 * @param {Bool} _isDegrees Flag indicating range is in degrees rather than radians
 * @returns {Float} The constrained value
 */
ED.Range.prototype.constrainToAngularRange = function(_angle, _isDegrees) {
    // No point in constraining unless range is less than 360 degrees!
    if ((this.max - this.min) < (_isDegrees ? 360 : (2 * Math.PI))) {
        // Arbitrary radius
        var r = 100;

        // Points representing vectors of angles within range
        var min = new ED.Point(0, 0);
        var max = new ED.Point(0, 0);
        var angle = new ED.Point(0, 0);

        // Set points using polar coordinates
        if (!_isDegrees) {
            min.setWithPolars(r, this.min);
            max.setWithPolars(r, this.max);
            angle.setWithPolars(r, _angle);
        } else {
            min.setWithPolars(r, this.min * Math.PI / 180);
            max.setWithPolars(r, this.max * Math.PI / 180);
            angle.setWithPolars(r, _angle * Math.PI / 180);
        }

        // Return appropriate value depending on relationship to range
        if (min.clockwiseAngleTo(angle) <= min.clockwiseAngleTo(max)) {
            return _angle;
        } else {
            if (angle.clockwiseAngleTo(min) < max.clockwiseAngleTo(angle)) {
                return this.min;
            } else {
                return this.max;
            }
        }
    } else {
        return _angle;
    }
}

/**
 * Represents a point in two dimensional space
 * @class Point
 * @property {Int} x The x-coordinate of the point
 * @property {Int} y The y-coordinate of the point
 * @property {Array} components Array representing point in matrix notation
 * @param {Float} _x
 * @param {Float} _y
 */
ED.Point = function(_x, _y) {
    // Properties
    this.x = Math.round(+_x);
    this.y = Math.round(+_y);
    this.components = [this.x, this.y, 1];
}

/**
 * Sets properties of the point using polar coordinates
 *
 * @param {Float} _r Distance from the origin
 * @param {Float} _p Angle in radians from North going clockwise
 */
ED.Point.prototype.setWithPolars = function(_r, _p) {
    this.x = Math.round(_r * Math.sin(_p));
    this.y = Math.round(-_r * Math.cos(_p));
}

/**
 * Sets x and y of the point
 *
 * @param {Float} _x value of x
 * @param {Float} _y value of y
 */
ED.Point.prototype.setCoordinates = function(_x, _y) {
    this.x = _x;
    this.y = _y;
}

/**
 * Calculates the distance between this point and another
 *
 * @param {Point} _point
 * @returns {Float} Distance from the passed point
 */
ED.Point.prototype.distanceTo = function(_point) {
    return Math.sqrt(Math.pow(this.x - _point.x, 2) + Math.pow(this.y - _point.y, 2));
}

/**
 * Calculates the dot product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The dot product
 */
ED.Point.prototype.dotProduct = function(_point) {
    return this.x * _point.x + this.y * _point.y;
}

/**
 * Calculates the cross product of two points (treating points as 2D vectors)
 *
 * @param {Point} _point
 * @returns {Float} The cross product
 */
ED.Point.prototype.crossProduct = function(_point) {
    return this.x * _point.y - this.y * _point.x;
}

/**
 * Calculates the length of the point treated as a vector
 *
 * @returns {Float} The length
 */
ED.Point.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

/**
 * Calculates the direction of the point treated as a vector
 *
 * @returns {Float} The angle from zero (north) going clockwise
 */
ED.Point.prototype.direction = function() {
    var north = new ED.Point(0, -100);

    return north.clockwiseAngleTo(this);
}

/**
 * Inner angle to other vector from same origin going round clockwise from vector a to vector b
 *
 * @param {Point} _point
 * @returns {Float} The angle in radians
 */
ED.Point.prototype.clockwiseAngleTo = function(_point) {
    var angle = Math.acos(this.dotProduct(_point) / (this.length() * _point.length()));
    if (this.crossProduct(_point) < 0) {
        return 2 * Math.PI - angle;
    } else {
        return angle;
    }
}

/**
 * Creates a new point at an angle
 *
 * @param {Float} _r Distance from the origin
 * @param {Float} _phi Angle form the radius to the control point
 * @returns {Point} The control point
 */
ED.Point.prototype.pointAtRadiusAndClockwiseAngle = function(_r, _phi) {
    // Calculate direction (clockwise from north)
    var angle = this.direction();

    // Create point and set length and direction
    var point = new ED.Point(0, 0);
    point.setWithPolars(_r, angle + _phi);

    return point;
}

/**
 * Creates a new point at an angle to and half way along a straight line between this point and another
 *
 * @param {Float} _phi Angle form the radius to the control point
 * @param {Float} _point Point at other end of straight line
 * @returns {Point} A point object
 */
ED.Point.prototype.pointAtAngleToLineToPointAtProportion = function(_phi, _point, _prop) {
    // Midpoint in coordinates as if current point is origin
    var bp = new ED.Point((_point.x - this.x) * _prop, (_point.y - this.y) * _prop);

    // Calculate radius
    r = bp.length();

    // Create new point
    var point = bp.pointAtRadiusAndClockwiseAngle(r, _phi);

    // Shift origin back
    point.x += this.x;
    point.y += this.y;

    return point;
}


/**
 * Clock hour of point on clock face centred on origin
 *
 * @returns {Int} The clock hour
 */
ED.Point.prototype.clockHour = function(_point) {
    var twelvePoint = new ED.Point(0, -100);
    var clockHour = ((twelvePoint.clockwiseAngleTo(this) * 6 / Math.PI) + 12) % 12;

    clockHour = clockHour.toFixed(0);
    if (clockHour == 0) clockHour = 12;

    return clockHour;
}

/**
 * Creates a control point on a tangent to the radius of the point at an angle of phi from the radius
 *
 * @param {Float} _phi Angle form the radius to the control point
 * @returns {Point} The control point
 */
ED.Point.prototype.tangentialControlPoint = function(_phi) {
    // Calculate length of line from origin to point and direction (clockwise from north)
    var r = this.length();
    var angle = this.direction();

    // Calculate length of control point
    var h = r / Math.cos(_phi);

    // Create point and set length and direction
    var point = new ED.Point(0, 0);
    point.setWithPolars(h, angle + _phi);

    return point;
}

/**
 * Returns a point in JSON encoding
 *
 * @returns {String} point in JSON format
 */
ED.Point.prototype.json = function() {
    return "{\"x\":" + this.x.toFixed(2) + ",\"y\":" + this.y.toFixed(2) + "}";
}


/**
 * Creates a new transformation matrix initialised to the identity matrix
 *
 * @class AffineTransform
 * @property {Array} components Array representing 3x3 matrix
 */
ED.AffineTransform = function() {
    // Properties - array of arrays of column values one for each row
    this.components = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
}

/**
 * Sets matrix to identity matrix
 */
ED.AffineTransform.prototype.setToIdentity = function() {
    this.components[0][0] = 1;
    this.components[0][1] = 0;
    this.components[0][2] = 0;
    this.components[1][0] = 0;
    this.components[1][1] = 1;
    this.components[1][2] = 0;
    this.components[2][0] = 0;
    this.components[2][1] = 0;
    this.components[2][2] = 1;
}

/**
 * Sets the transform matrix to another
 *
 * @param {AffineTransform} _transform Array An affine transform
 */
ED.AffineTransform.prototype.setToTransform = function(_transform) {
    this.components[0][0] = _transform.components[0][0];
    this.components[0][1] = _transform.components[0][1];
    this.components[0][2] = _transform.components[0][2];
    this.components[1][0] = _transform.components[1][0];
    this.components[1][1] = _transform.components[1][1];
    this.components[1][2] = _transform.components[1][2];
    this.components[2][0] = _transform.components[2][0];
    this.components[2][1] = _transform.components[2][1];
    this.components[2][2] = _transform.components[2][2];
}

/**
 * Adds a translation to the transform matrix
 *
 * @param {float} _x value to translate along x-axis
 * @param {float} _y value to translate along y-axis
 */
ED.AffineTransform.prototype.translate = function(_x, _y) {
    this.components[0][2] = this.components[0][0] * _x + this.components[0][1] * _y + this.components[0][2];
    this.components[1][2] = this.components[1][0] * _x + this.components[1][1] * _y + this.components[1][2];
    this.components[2][2] = this.components[2][0] * _x + this.components[2][1] * _y + this.components[2][2];
}

/**
 * Adds a scale to the transform matrix
 *
 * @param {float} _sx value to scale along x-axis
 * @param {float} _sy value to scale along y-axis
 */
ED.AffineTransform.prototype.scale = function(_sx, _sy) {
    this.components[0][0] = this.components[0][0] * _sx;
    this.components[0][1] = this.components[0][1] * _sy;
    this.components[1][0] = this.components[1][0] * _sx;
    this.components[1][1] = this.components[1][1] * _sy;
    this.components[2][0] = this.components[2][0] * _sx;
    this.components[2][1] = this.components[2][1] * _sy;
}

/**
 * Adds a rotation to the transform matrix
 *
 * @param {float} _rad value to rotate by in radians
 */
ED.AffineTransform.prototype.rotate = function(_rad) {
    // Calulate trigonometry
    var c = Math.cos(_rad);
    var s = Math.sin(_rad);

    // Make new matrix for transform
    var matrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    // Apply transform
    matrix[0][0] = this.components[0][0] * c + this.components[0][1] * s;
    matrix[0][1] = this.components[0][1] * c - this.components[0][0] * s;
    matrix[1][0] = this.components[1][0] * c + this.components[1][1] * s;
    matrix[1][1] = this.components[1][1] * c - this.components[1][0] * s;
    matrix[2][0] = this.components[2][0] * c + this.components[2][1] * s;
    matrix[2][1] = this.components[2][1] * c - this.components[2][0] * s;

    // Change old matrix
    this.components[0][0] = matrix[0][0];
    this.components[0][1] = matrix[0][1];
    this.components[1][0] = matrix[1][0];
    this.components[1][1] = matrix[1][1];
    this.components[2][0] = matrix[2][0];
    this.components[2][1] = matrix[2][1];
}

/**
 * Applies transform to a point
 *
 * @param {Point} _point a point
 * @returns {Point} a transformed point
 */
ED.AffineTransform.prototype.transformPoint = function(_point) {
    var newX = _point.x * this.components[0][0] + _point.y * this.components[0][1] + 1 * this.components[0][2];
    var newY = _point.x * this.components[1][0] + _point.y * this.components[1][1] + 1 * this.components[1][2];

    return new ED.Point(newX, newY);
}

/**
 * Calculates determinant of transform matrix
 *
 * @returns {Float} determinant
 */
ED.AffineTransform.prototype.determinant = function() {
    return this.components[0][0] * (this.components[1][1] * this.components[2][2] - this.components[1][2] * this.components[2][1]) -
        this.components[0][1] * (this.components[1][0] * this.components[2][2] - this.components[1][2] * this.components[2][0]) +
        this.components[0][2] * (this.components[1][0] * this.components[2][1] - this.components[1][1] * this.components[2][0]);
}

/**
 * Inverts transform matrix
 *
 * @returns {Array} inverse matrix
 */
ED.AffineTransform.prototype.createInverse = function() {
    // Create new matrix 
    var inv = new ED.AffineTransform();

    var det = this.determinant();

    //if (det != 0)
    var invdet = 1 / det;

    // Calculate components of inverse matrix
    inv.components[0][0] = invdet * (this.components[1][1] * this.components[2][2] - this.components[1][2] * this.components[2][1]);
    inv.components[0][1] = invdet * (this.components[0][2] * this.components[2][1] - this.components[0][1] * this.components[2][2]);
    inv.components[0][2] = invdet * (this.components[0][1] * this.components[1][2] - this.components[0][2] * this.components[1][1]);

    inv.components[1][0] = invdet * (this.components[1][2] * this.components[2][0] - this.components[1][0] * this.components[2][2]);
    inv.components[1][1] = invdet * (this.components[0][0] * this.components[2][2] - this.components[0][2] * this.components[2][0]);
    inv.components[1][2] = invdet * (this.components[0][2] * this.components[1][0] - this.components[0][0] * this.components[1][2]);

    inv.components[2][0] = invdet * (this.components[1][0] * this.components[2][1] - this.components[1][1] * this.components[2][0]);
    inv.components[2][1] = invdet * (this.components[0][1] * this.components[2][0] - this.components[0][0] * this.components[2][1]);
    inv.components[2][2] = invdet * (this.components[0][0] * this.components[1][1] - this.components[0][1] * this.components[1][0]);

    return inv;
}

/**
 * Squiggles are free-hand lines drawn by the mouse;
 * Points are stored in an array and represent points in the doodle plane
 *
 * @class Squiggle
 * @property {Doodle} doodle The doodle to which this squiggle belongs
 * @property {String} colour Colour of the squiggle
 * @property {Int} thickness Thickness of the squiggle in pixels
 * @property {Bool} filled True if squiggle is solid (filled)
 * @property {Array} pointsArray Array of points making up the squiggle
 * @property {Bool} complete True if the squiggle is complete (allows a filled squiggle to appear as a line while being created)
 * @param {Doodle} _doodle
 * @param {Colour} _colour
 * @param {Int} _thickness
 * @param {Bool} _filled
 */
ED.Squiggle = function(_doodle, _colour, _thickness, _filled) {
    this.doodle = _doodle;
    this.colour = _colour;
    this.thickness = _thickness;
    this.filled = _filled;

    this.pointsArray = new Array();
    this.complete = false;
}

/**
 * Adds a point to the points array
 *
 * @param {Point} _point
 */
ED.Squiggle.prototype.addPoint = function(_point) {
    this.pointsArray.push(_point);
}

/**
 * Returns a squiggle in JSON format
 *
 * @returns {String} A JSON encoded string representing the squiggle
 */
ED.Squiggle.prototype.json = function() {
    var s = '{';
    s = s + '"colour": "' + this.colour + '", ';
    s = s + '"thickness": ' + this.thickness + ', ';
    s = s + '"filled": "' + this.filled + '", ';

    s = s + '"pointsArray": [';
    for (var i = 0; i < this.pointsArray.length; i++) {
        s = s + this.pointsArray[i].json();
        if (this.pointsArray.length - i > 1) {
            s = s + ', ';
        }
    }
    s = s + ']';
    s = s + '}';

    return s;
}

/**
 * A colour in the RGB space;
 * Usage: var c = new ED.Colour(0, 0, 255, 0.75); ctx.fillStyle = c.rgba();
 *
 * @property {Int} red The red value
 * @property {Int} green The green value
 * @property {Int} blue The blue value
 * @property {Float} alpha The alpha value
 * @param {Int} _red
 * @param {Int} _green
 * @param {Int} _blue
 * @param {Float} _alpha
 */
ED.Colour = function(_red, _green, _blue, _alpha) {
    this.red = _red;
    this.green = _green;
    this.blue = _blue;
    this.alpha = _alpha;
}

/**
 * Sets the colour from a hex encoded string
 *
 * @param {String} Colour in hex format (eg 'E0AB4F')
 */
ED.Colour.prototype.setWithHexString = function(_hexString) {
    // ***TODO*** add some string reality checks here
    this.red = parseInt((_hexString.charAt(0) + _hexString.charAt(1)), 16);
    this.green = parseInt((_hexString.charAt(2) + _hexString.charAt(3)), 16);
    this.blue = parseInt((_hexString.charAt(4) + _hexString.charAt(5)), 16);
}

/**
 * Returns a colour in Javascript rgba format
 *
 * @returns {String} Colour in rgba format
 */
ED.Colour.prototype.rgba = function() {
    return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
}

/**
 * Returns a colour in JSON format
 *
 * @returns {String} A JSON encoded string representing the colour
 */
ED.Colour.prototype.json = function() {
    return "{\"red\":" + this.red + ",\"green\":" + this.green + ",\"blue\":" + this.blue + ",\"alpha\":" + this.alpha + "}";
}

/**
 * Additional function for String object
 *
 * @returns {String} String with first letter made lower case, unless part of an abbreviation
 */
String.prototype.firstLetterToLowerCase = function() {
    var secondChar = this.charAt(1);

    if (secondChar == secondChar.toUpperCase()) {
        return this;
    } else {
        return this.charAt(0).toLowerCase() + this.slice(1);
    }
}

/**
 * Additional function for String object
 *
 * @returns {String} String with last ', ' replaced with ', and '
 */
String.prototype.addAndAfterLastComma = function() {
    // Search backwards from end of string for comma
    var found = false;
    for (var pos = this.length - 1; pos >= 0; pos--) {
        if (this.charAt(pos) == ',') {
            found = true;
            break;
        }
    }

    if (found) return this.substring(0, pos) + ", and" + this.substring(pos + 1, this.length);
    else return this;
}

///**
// * Static class to implement groups of doodles
// *
// * @returns {String} 
// */
//ED.DoodleGroups =
//{    
//    bar: function (val)
//    {
//        console.log(val);
//    },
//    foo: 2
//}
//
//ED.DoodleGroups.foo = 4;

/**
 * @fileOverview Contains doodle subclasses for the anterior segment
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.9
 *
 * Modification date: 15th June 2012
 * Copyright 2012 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") {
    var ED = new Object();
}

/**
 * Language specific categories which can be used to take actions following addition of a doodle
 */
ED.Categories = new Object();

/**
 * Complications
 */
ED.Categories['EntrySiteBreak'] = {
    complication: 'Entry site break'
};
ED.Categories['RetinalTouch'] = {
    complication: 'Retinal touch'
};
ED.Categories['IatrogenicBreak'] = {
    complication: 'Iatrogenic break'
};
ED.Categories['SubretinalPFCL'] = {
    complication: 'Subretinal PFCL'
};

/**
 * @fileOverview Contains doodle subclasses for general use
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 1.0
 *
 * Modification date: 6th October 2012
 * Copyright 2011 OpenEyes
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") {
    var ED = new Object();
}

/**
 * Surgeon
 *
 * @class Surgeon
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Surgeon = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
    // Set classname
    this.className = "Surgeon";

    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.surgeonPosition = 'Temporal';

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Surgeon.prototype = new ED.Doodle;
ED.Surgeon.prototype.constructor = ED.Surgeon;
ED.Surgeon.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Surgeon.prototype.setPropertyDefaults = function() {
    this.isScaleable = false;
    this.isMoveable = false;
    this.snapToAngles = true;
    this.willStaySelected = false;
    this.isUnique = true;
    this.isDeletable = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+100, +500);

    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['surgeonPosition'] = {
        kind: 'derived',
        type: 'string',
        list: ['Superior', 'Supero-temporal', 'Temporal', 'Infero-temporal', 'Inferior', 'Infero-nasal', 'Nasal', 'Supero-nasal'],
        animate: true
    };

    // Array of angles to snap to
    var phi = Math.PI / 4;
    this.anglesArray = [0, phi, phi * 2, phi * 3, phi * 4, phi * 5, phi * 6, phi * 7];
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Surgeon.prototype.setParameterDefaults = function() {
    this.rotation = 0;
    this.setParameterFromString('surgeonPosition', 'Temporal');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Surgeon.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = new Array();

    var isRE = (this.drawing.eye == ED.eye.Right);
    var dial = 2 * Math.PI;

    switch (_parameter) {
        // Surgeon position
        case 'rotation':
            if (isRE) {
                if (_value < dial / 16) returnArray['surgeonPosition'] = 'Superior';
                else if (_value < 3 * dial / 16) returnArray['surgeonPosition'] = 'Supero-nasal';
                else if (_value < 5 * dial / 16) returnArray['surgeonPosition'] = 'Nasal';
                else if (_value < 7 * dial / 16) returnArray['surgeonPosition'] = 'Infero-nasal';
                else if (_value < 9 * dial / 16) returnArray['surgeonPosition'] = 'Inferior';
                else if (_value < 11 * dial / 16) returnArray['surgeonPosition'] = 'Infero-temporal';
                else if (_value < 13 * dial / 16) returnArray['surgeonPosition'] = 'Temporal';
                else if (_value < 15 * dial / 16) returnArray['surgeonPosition'] = 'Supero-temporal';
                else returnArray['surgeonPosition'] = 'Superior';
            } else {
                if (_value < dial / 16) returnArray['surgeonPosition'] = 'Superior';
                else if (_value < 3 * dial / 16) returnArray['surgeonPosition'] = 'Supero-temporal';
                else if (_value < 5 * dial / 16) returnArray['surgeonPosition'] = 'Temporal';
                else if (_value < 7 * dial / 16) returnArray['surgeonPosition'] = 'Infero-temporal';
                else if (_value < 9 * dial / 16) returnArray['surgeonPosition'] = 'Inferior';
                else if (_value < 11 * dial / 16) returnArray['surgeonPosition'] = 'Infero-nasal';
                else if (_value < 13 * dial / 16) returnArray['surgeonPosition'] = 'Nasal';
                else if (_value < 15 * dial / 16) returnArray['surgeonPosition'] = 'Supero-nasal';
                else returnArray['surgeonPosition'] = 'Superior';
            }
            break;

        case 'surgeonPosition':
            switch (_value) {
                case 'Superior':
                    returnArray['rotation'] = 0;
                    break;
                case 'Supero-temporal':
                    returnArray['rotation'] = isRE ? 7 * Math.PI / 4 : 1 * Math.PI / 4;
                    break;
                case 'Temporal':
                    returnArray['rotation'] = isRE ? 6 * Math.PI / 4 : 2 * Math.PI / 4;
                    break;
                case 'Infero-temporal':
                    returnArray['rotation'] = isRE ? 5 * Math.PI / 4 : 3 * Math.PI / 4;
                    break;
                case 'Inferior':
                    returnArray['rotation'] = Math.PI;
                    break;
                case 'Infero-nasal':
                    returnArray['rotation'] = isRE ? 3 * Math.PI / 4 : 5 * Math.PI / 4;
                    break;
                case 'Nasal':
                    returnArray['rotation'] = isRE ? 2 * Math.PI / 4 : 6 * Math.PI / 4;
                    break;
                case 'Supero-nasal':
                    returnArray['rotation'] = isRE ? 1 * Math.PI / 4 : 7 * Math.PI / 4;
                    break;
            }
            break;
    }

    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Surgeon.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.Surgeon.superclass.draw.call(this, _point);

    // Boundary path
    ctx.beginPath();

    // Scaling factor
    var s = 0.2;

    // Shift up y-axis
    var y = -300;

    // Surgeon
    ctx.moveTo(0 * s, y - 200 * s);
    ctx.bezierCurveTo(-100 * s, y - 250 * s, -145 * s, y - 190 * s, -200 * s, y - 180 * s);
    ctx.bezierCurveTo(-310 * s, y - 160 * s, -498 * s, y - 75 * s, -500 * s, y + 0 * s);
    ctx.bezierCurveTo(-500 * s, y + 50 * s, -500 * s, y + 460 * s, -470 * s, y + 700 * s);
    ctx.bezierCurveTo(-470 * s, y + 710 * s, -500 * s, y + 770 * s, -500 * s, y + 810 * s);
    ctx.bezierCurveTo(-500 * s, y + 840 * s, -440 * s, y + 850 * s, -420 * s, y + 840 * s);
    ctx.bezierCurveTo(-390 * s, y + 830 * s, -380 * s, y + 710 * s, -380 * s, y + 700 * s);
    ctx.bezierCurveTo(-370 * s, y + 700 * s, -360 * s, y + 780 * s, -350 * s, y + 780 * s);
    ctx.bezierCurveTo(-330 * s, y + 780 * s, -340 * s, y + 730 * s, -340 * s, y + 700 * s);
    ctx.bezierCurveTo(-340 * s, y + 690 * s, -350 * s, y + 680 * s, -350 * s, y + 670 * s);
    ctx.bezierCurveTo(-350 * s, y + 590 * s, -385 * s, y + 185 * s, -300 * s, y + 100 * s);

    ctx.bezierCurveTo(-150 * s, y + 140 * s, -250 * s, y + 200 * s, 0 * s, y + 300 * s);

    ctx.bezierCurveTo(250 * s, y + 200 * s, 150 * s, y + 140 * s, 300 * s, y + 100 * s);
    ctx.bezierCurveTo(380 * s, y + 180 * s, 350 * s, y + 590 * s, 350 * s, y + 670 * s);
    ctx.bezierCurveTo(350 * s, y + 680 * s, 340 * s, y + 690 * s, 340 * s, y + 700 * s);
    ctx.bezierCurveTo(340 * s, y + 730 * s, 330 * s, y + 780 * s, 350 * s, y + 780 * s);
    ctx.bezierCurveTo(360 * s, y + 780 * s, 370 * s, y + 700 * s, 380 * s, y + 700 * s);
    ctx.bezierCurveTo(380 * s, y + 710 * s, 390 * s, y + 830 * s, 420 * s, y + 840 * s);
    ctx.bezierCurveTo(430 * s, y + 845 * s, 505 * s, y + 840 * s, 505 * s, y + 810 * s);
    ctx.bezierCurveTo(505 * s, y + 760 * s, 470 * s, y + 710 * s, 470 * s, y + 700 * s);
    ctx.bezierCurveTo(500 * s, y + 460 * s, 499 * s, y + 45 * s, 500 * s, y + 0 * s);
    ctx.bezierCurveTo(498 * s, y - 78 * s, 308 * s, y - 164 * s, 200 * s, y - 182 * s);
    ctx.bezierCurveTo(145 * s, y - 190 * s, 100 * s, y - 250 * s, 0 * s, y - 200 * s);

    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,1)";

    // Set light blue for surgeon's gown
    var colour = new ED.Colour(0, 0, 0, 1);
    colour.setWithHexString('3AFEFA');
    ctx.fillStyle = colour.rgba();

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Non boundary paths here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
        // Head
        ctx.beginPath();

        ctx.moveTo(0 * s, y - 250 * s);
        ctx.bezierCurveTo(-100 * s, y - 250 * s, -180 * s, y - 200 * s, -200 * s, y - 170 * s);
        ctx.bezierCurveTo(-209 * s, y - 157 * s, -220 * s, y - 100 * s, -230 * s, y - 50 * s);
        ctx.bezierCurveTo(-260 * s, y - 70 * s, -260 * s, y - 20 * s, -260 * s, y + 0 * s);
        ctx.bezierCurveTo(-260 * s, y + 20 * s, -260 * s, y + 80 * s, -230 * s, y + 60 * s);
        ctx.bezierCurveTo(-230 * s, y + 90 * s, -220 * s, y + 141 * s, -210 * s, y + 160 * s);
        ctx.bezierCurveTo(-190 * s, y + 200 * s, -100 * s, y + 280 * s, -40 * s, y + 300 * s);
        ctx.bezierCurveTo(-34 * s, y + 303 * s, -20 * s, y + 350 * s, 0 * s, y + 350 * s);
        ctx.bezierCurveTo(20 * s, y + 350 * s, 34 * s, y + 300 * s, 40 * s, y + 300 * s);
        ctx.bezierCurveTo(100 * s, y + 280 * s, 190 * s, y + 200 * s, 210 * s, y + 160 * s);
        ctx.bezierCurveTo(218 * s, y + 143 * s, 230 * s, y + 90 * s, 230 * s, y + 60 * s);
        ctx.bezierCurveTo(260 * s, y + 80 * s, 260 * s, y + 20 * s, 260 * s, y + 0 * s);
        ctx.bezierCurveTo(260 * s, y - 20 * s, 260 * s, y - 70 * s, 230 * s, y - 50 * s);
        ctx.bezierCurveTo(220 * s, y - 100 * s, 208 * s, y - 158 * s, 200 * s, y - 170 * s);
        ctx.bezierCurveTo(180 * s, y - 200 * s, 100 * s, y - 250 * s, 0 * s, y - 250 * s);

        ctx.fill();
        ctx.stroke();
    }

    // Return value indicating successful hittest
    return this.isClicked;
}

/**
 *  OperatingTable
 *
 * @class  OperatingTable
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.OperatingTable = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
    // Set classname
    this.className = "OperatingTable";

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.OperatingTable.prototype = new ED.Doodle;
ED.OperatingTable.prototype.constructor = ED.OperatingTable;
ED.OperatingTable.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.OperatingTable.prototype.setPropertyDefaults = function() {
    this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OperatingTable.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.OperatingTable.superclass.draw.call(this, _point);

    // Boundary path
    ctx.beginPath();

    // Head
    ctx.arc(0, -0, 60, 0, Math.PI * 2, true);

    // Set Attributes
    ctx.lineWidth = 30;
    ctx.strokeStyle = "rgba(120,120,120,1)";
    ctx.fillStyle = "rgba(220,220,220,1)";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Non boundary paths here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
        ctx.beginPath();

        // Bed
        ctx.rect(-100, 20, 200, 400);

        // Set Attributes
        ctx.lineWidth = 8;
        ctx.strokeStyle = "rgba(120,120,120,1)";
        ctx.fillStyle = "rgba(220,220,220,1)";

        ctx.fill();
        ctx.stroke();
    }

    // Return value indicating successful hittest
    return this.isClicked;
}

/**
 * Peripheral iridectomy
 *
 * @class Label
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Label = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
    // Set classname
    this.className = "Label";

    // Label text
    this.labelText = "Start typing..";
    this.savedParams = ['labelText'];

    // Label width and height
    this.labelWidth = 0;
    this.labelHeight = 80;

    // Label font
    this.labelFont = "60px sans-serif";

    // Horizontal padding between label and boundary path
    this.padding = 10;

    // Maximum length
    this.maximumLength = 20;

    // Flag to indicate first edit
    this.isEdited = false;

    // Temporary store for values of originX and originY (to prevent apex moving with body of label)
    this.lastOriginX = 0;
    this.lastOriginY = 0;

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Label.prototype = new ED.Doodle;
ED.Label.prototype.constructor = ED.Label;
ED.Label.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Label.prototype.setHandles = function() {
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Label.prototype.setPropertyDefaults = function() {
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-1000, +1000);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-1000, +1000);

    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['labelText'] = {
        kind: 'derived',
        type: 'string',
        animate: false
    };
}

/**
 * Sets default parameters
 */
ED.Label.prototype.setParameterDefaults = function() {
    this.setParameterFromString('labelText', 'Start typing..');
    this.setOriginWithDisplacements(0, -100);
    this.lastOriginX = this.originX;
    this.lastOriginY = this.originY;
    this.apexX = +100;
    this.apexY = -150;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Label.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = new Array();

    switch (_parameter) {
        case 'originX':
            returnArray['apexX'] = this.apexX - (_value - this.lastOriginX) / this.drawing.globalScaleFactor;
            this.lastOriginX = _value;
            break;
        case 'originY':
            returnArray['apexY'] = this.apexY - (_value - this.lastOriginY) / this.drawing.globalScaleFactor;
            this.lastOriginY = _value;
            break;
    }

    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Label.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.Label.superclass.draw.call(this, _point);

    // Set font
    ctx.font = this.labelFont;

    // Calculate pixel width of text with padding
    this.labelWidth = ctx.measureText(this.labelText).width + this.padding * 2;

    // Boundary path
    ctx.beginPath();

    // label boundary
    ctx.rect(-this.labelWidth / 2, -this.labelHeight / 2, this.labelWidth, this.labelHeight);

    // Close path
    ctx.closePath();

    // Set line attributes
    ctx.lineWidth = 2;
    this.isFilled = false;
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    if (this.isSelected) ctx.strokeStyle = "gray";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Non boundary paths here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
        // Draw text
        ctx.fillText(this.labelText, -this.labelWidth / 2 + this.padding, this.labelHeight / 6);

        // Coordinate of start of arrow
        var arrowStart = new ED.Point(0, 0);

        // Calculation of which quadrant arrowEnd is in
        var q;
        if (this.apexX == 0) q = 2;
        else q = Math.abs(this.apexY / this.apexX);

        // Set start
        if (this.apexY <= 0 && q >= 1) {
            arrowStart.x = 0;
            arrowStart.y = -this.labelHeight / 2;
        }
        if (this.apexX <= 0 && q < 1) {
            arrowStart.x = -this.labelWidth / 2;
            arrowStart.y = 0;
        }
        if (this.apexY > 0 && q >= 1) {
            arrowStart.x = 0;
            arrowStart.y = this.labelHeight / 2;
        }
        if (this.apexX > 0 && q < 1) {
            arrowStart.x = this.labelWidth / 2;
            arrowStart.y = 0;
        }

        // Coordinates of end of arrow
        var arrowEnd = new ED.Point(this.apexX, this.apexY);

        // Draw arrow
        ctx.strokeStyle = "Gray";
        ctx.fillStyle = "Gray";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(arrowStart.x, arrowStart.y);
        ctx.lineTo(arrowEnd.x, arrowEnd.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(arrowEnd.x, arrowEnd.y, 16, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.moveTo(arrowEnd.x, arrowEnd.y);
        ctx.fill();
    }

    // Coordinates of handles (in canvas plane)
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));

    // Draw handles if selected
    if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Return value indicating successful hittest
    return this.isClicked;
}

/**
 * Adds a letter to the label text
 *
 * @param {Int} _keyCode Keycode of pressed key
 */
ED.Label.prototype.addLetter = function(_keyCode) {
    // Need code here to convert to character
    var character = String.fromCharCode(_keyCode);

    if (!this.isEdited) {
        this.labelText = "";
        this.isEdited = true;
    }

    // Use backspace to edit
    if (_keyCode == 8) {
        if (this.labelText.length > 0) this.labelText = this.labelText.substring(0, this.labelText.length - 1);
    } else {
        if (this.labelText.length < this.maximumLength) this.labelText += character;
    }

    // Save changes by triggering parameterChanged method in controller
    if (this.isEdited) {
        // Create notification message
        var object = new Object;
        object.doodle = this;

        // Trigger notification
        this.drawing.notify('parameterChanged', object);
    }
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Label.prototype.description = function() {
    return "Peripheral iridectomy at " + this.clockHour() + " o'clock";
}

/**
 * Freehand drawing
 *
 * @class Freehand
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Freehand = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
    // Set classname
    this.className = "Freehand";

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Freehand.prototype = new ED.Doodle;
ED.Freehand.prototype.constructor = ED.Freehand;
ED.Freehand.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Freehand.prototype.setHandles = function() {
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.Freehand.prototype.setPropertyDefaults = function() {
    this.isDrawable = true;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Freehand.prototype.setParameterDefaults = function() {
    this.setOriginWithDisplacements(0, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Freehand.prototype.draw = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.Freehand.superclass.draw.call(this, _point);

    // Boundary path
    ctx.beginPath();

    // Freehand
    ctx.rect(-150, -150, 300, 300);

    // Close path
    ctx.closePath();

    // Set line attributes
    ctx.lineWidth = 2;
    this.isFilled = false;
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    if (this.isSelected) ctx.strokeStyle = "gray";
    if (this.isForDrawing) ctx.strokeStyle = "blue";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    // Non boundary paths here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
        // Iterate through squiggles, drawing them
        for (var i = 0; i < this.squiggleArray.length; i++) {
            var squiggle = this.squiggleArray[i];

            ctx.beginPath();

            // Squiggle attributes
            ctx.lineWidth = squiggle.thickness;
            ctx.strokeStyle = squiggle.colour;
            ctx.fillStyle = squiggle.colour;

            // Iterate through squiggle points
            for (var j = 0; j < squiggle.pointsArray.length; j++) {
                ctx.lineTo(squiggle.pointsArray[j].x, squiggle.pointsArray[j].y);
            }

            // Draw squiggle
            ctx.stroke();

            // Optionally fill if squiggle is complete (stops filling while drawing)
            if (squiggle.filled && squiggle.complete) ctx.fill();
        }
    }

    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(150, -150));

    // Draw handles if selected but not if for drawing
    if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Return value indicating successful hittest
    return this.isClicked;
}

/**
 *  Mouse test - used for testing detection of mouse pointer
 *
 * @class  MouseTest
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.MouseTest = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order) {
    // Set classname
    this.className = "MouseTest";

    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MouseTest.prototype = new ED.Doodle;
ED.MouseTest.prototype.constructor = ED.MouseTest;
ED.MouseTest.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.MouseTest.prototype.setPropertyDefaults = function() {
    this.isMoveable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MouseTest.prototype.draw = function(_point) {
    //if (_point) console.log(_point.x, _point.y);

    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.MouseTest.superclass.draw.call(this, _point);

    // Boundary path
    ctx.beginPath();

    // Square
    var width = 200;
    ctx.rect(-width / 2, -width / 2, width, width);

    // Close path
    ctx.closePath();

    // Set line attributes
    ctx.lineWidth = 1;
    ctx.fillStyle = "white"
    ctx.strokeStyle = "blue";

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    if (this.isClicked) console.log(_point.x, _point.y);

    // Non boundary paths here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

    // Return value indicating successful hittest
    return this.isClicked;
}

/**
 * @fileOverview Contains doodle subclasses for the anterior segment
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.9
 *
 * Modification date: 15th June 2012
 * Copyright 2012 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") {
    var ED = new Object();
}

/**
 * Language specific tooltips which appear over doodles on hover
 *
 * In order to display UTF.8 characters, this file should be loaded with the 'charset="utf-8"' attribute.
 * This currently cannot be done with the Yii registerScriptFile method, so should be loaded using a tag in the view file;
 * <script src="js/ED_Tooltips.js" type="text/javascript" charset="utf-8"></script>
 */
ED.trans = new Object();

// For UTF.8, this file should be loaded with the 'charset="utf-8"' attribute. This currently cannot be done with the Yii registerScriptFile method
ED.trans['ACIOL'] = 'Anterior chamber IOL<br/><br/>Drag to move<br/>Drag the handle to rotate';
ED.trans['AngleGradeEast'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeNorth'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeSouth'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleGradeWest'] = 'Grade of angle (Iris)<br/><br/>Drag handle to adjust amount of angle obscure by iris';
ED.trans['AngleNV'] = 'Angle new vessels<br/><br/>Drag to move around angle<br/>Drag handles to change extent';
ED.trans['AngleRecession'] = 'Angle recession<br/><br/>Drag to move around angle<br/>Drag handles to change extent';
ED.trans['AntSeg'] = 'Anterior segment<br/><br/>Drag the handle to resize the pupil<br/><br/>The iris is semi-transparent so that IOLs, and<br/>other structures can be seen behind it';
ED.trans['AntSegCrossSection'] = '';
ED.trans['AntSynech'] = 'Anterior synechiae<br/><br/>Drag to move around angle<br/>Drag handles to change extent';
ED.trans['ArcuateScotoma'] = 'Arcuate scotoma<br/><br/>Drag handle to change size';
ED.trans['BiopsySite'] = 'Biopsy site<br/><br/>Drag to position';
ED.trans['Bleb'] = 'Trabeculectomy bleb<br/><br/>Drag to move around the limbus';
ED.trans['BlotHaemorrhage'] = 'Blot haemorrhage<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['BuckleSuture'] = 'Buckle suture<br/><br/>Drag to position';
ED.trans['CapsularTensionRing'] = 'Capsular Tension Ring<br/><br/>This cannot be selected directly since it is behind the iris<br/>Select the iris first<br/>Then move the scroll wheel until the ring is selected<br/>Click the \'Move to front\' button<br/>Err.. of course if you are seeing this tooltip you have already done it';
ED.trans['ChandelierSingle'] = 'Chandelier illumination<br/><br/>Drag to rotate around centre<br/>';
ED.trans['ChandelierDouble'] = 'Double chandelier illumination<br/><br/>Drag to rotate around centre<br/>';
ED.trans['CiliaryInjection'] = 'Ciliary injection<br/><br/>Drag to rotate around centre<br/>Drag handles to change extent';
ED.trans['Circinate'] = 'Circinate (Ring of exudates)<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CircumferentialBuckle'] = 'Circumferential buckle<br/><br/>Drag to position<br/>Drag outer handles to change extent<br/>Drag middle handle to change width';
ED.trans['CornealAbrasion'] = 'Corneal abrasion<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CorneaCrossSection'] = 'Corneal cross section';
ED.trans['CornealErosion'] = 'Removal of corneal epithelium<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['CornealOedema'] = 'Corneal oedema<br/><br/>Drag to position<br/>Drag handle to change size and density';
ED.trans['CornealStriae'] = 'Corneal striae';
ED.trans['CornealScar'] = 'Corneal Scar<br/><br/>Drag outer handle to change shape<br/>Drag inner handle to change density';
ED.trans['CornealSuture'] = 'Corneal suture<br/><br/>Drag to move';
ED.trans['CorticalCataract'] = '';
ED.trans['CottonWoolSpot'] = 'Cotton wool spot<br/><br/>Drag to position<br/>Drag handle to change shape and size';
ED.trans['CNV'] = 'Choroidal neovascular membrane<br/><br/>Drag to move<br/>Drag handle to scale';
ED.trans['CutterPI'] = 'Cutter iridectomy<br/><br/>Drag to move around the iris';
ED.trans['CystoidMacularOedema'] = 'Cystoid macular oedema<br/><br/>Drag handle to change size';
ED.trans['DiabeticNV'] = 'Diabetic new vessels<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['DiscHaemorrhage'] = 'Disc haemorrhage<br/><br/>Drag to position';
ED.trans['DiscPallor'] = 'Disc Pallor<br/><br/>Drag to position<br/>Drag handles to adjust extent';
ED.trans['DrainageRetinotomy'] = 'Drainage retinotomy<br/><br/>Drag to position';
ED.trans['DrainageSite'] = 'Drainage site<br/><br/>Drag to change position';
ED.trans['EncirclingBand'] = 'Encircling band<br/><br/>Drag to change orientation of Watzke sleeve';
ED.trans['EntrySiteBreak'] = 'Entry site break<br/><br/>Drag to position<br/>Drag either end handle to increase extent';
ED.trans['EpiretinalMembrane'] = 'Epiretinal membrane<br/><br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FibrousProliferation'] = 'Fibrous Proliferation<br/><br/>Drag to position<br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['FocalLaser'] = 'Focal laser burns<br/><br/>Drag the handle for a bigger area with more burns';
ED.trans['Freehand'] = 'Freehand drawing<br/><br/>Double-click to start drawing<br/>Drag inner handle to change size<br/>Drag outer handle to rotate<br/><br/>Adjust colours and settings in tool bar';
ED.trans['Fundus'] = '';
ED.trans['Fuchs'] = 'Fuch\'s Endothelial Dystrophy<br/><br/>Drag handle to change shape';
ED.trans['Geographic'] = 'Geographic Atrophy<br/><br/>Drag middle handle to alter size of remaining central island of RPE<br/>Drag outside handle to scale';
ED.trans['Gonioscopy'] = 'Goniogram<br/><br/>Drag top left handle up and down to alter pigment density<br/>Drag top left handle left and right to alter pigment homogeneity';
ED.trans['HardDrusen'] = 'Hard drusen<br/><br/>Drag middle handle up and down to alter density of drusen<br/>Drag outside handle to scale';
ED.trans['HardExudate'] = 'Hard exudate<br/><br/>Drag to position';
ED.trans['Hyphaema'] = 'Hyphaema<br/><br/>Drag handle vertically to change size<br/>Drag handle horizontally to change density';
ED.trans['Hypopyon'] = 'Hypopyon<br/><br/>Drag handle vertically to change size';
ED.trans['IatrogenicBreak'] = 'Iatrogenic Break<br/><br/>Drag to position<br/>Drag inner handle to change size<br/>Drag outer handle to rotate';
ED.trans['ILMPeel'] = 'ILM peel<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['IrisHook'] = 'Iris hook<br/><br/>Drag to move around the clock<br/><br/>The hook will match the size of the pupil as it changes<br/>Subsequent hooks are added to the next quadrant';
ED.trans['IrisNaevus'] = 'Iris naevus<br/><br/>Drag to move<br/>Drag handle to change size';
ED.trans['IRMA'] = 'Intraretinal microvascular abnormalities<br/><br/>Drag to move<br/>Drag inner handle to change size<br/>Drag outer handle to rotate';
ED.trans['KeraticPrecipitates'] = 'Keratic precipitates<br/><br/>Drag middle handle up and down to alter density<br/>Drag middle handle left and right to alter size<br/>Drag outside handle to scale';
ED.trans['KrukenbergSpindle'] = 'Krukenberg\'s spindle<br/><br/>Drag to move</br>Drag outer handle to change shape';
//ED.trans['Label'] = 'A text label<br/><br/>Drag to move label, type text to edit</br>Drag handle to move pointer';
ED.trans['LaserCircle'] = 'A circle of laser spots<br/><br/>Drag handle to change shape';
ED.trans['LaserDemarcation'] = 'A row of laser spots for demarcation<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move line more posteriorly';
ED.trans['LaserSpot'] = 'A single laser spot<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['LasikFlap'] = 'LASIK flap<br/><br/>Drag to rotate<br/>Drag the handle to scale';
ED.trans['LensCrossSection'] = '';
ED.trans['LimbalRelaxingIncision'] = 'Limbal relaxing incision<br/><br/>Drag to move';
ED.trans['MacularGrid'] = 'Macular grid<br/><br/>Drag the handle to scale';
ED.trans['MacularHole'] = 'Macular hole<br/><br/>Drag the handle to scale';
ED.trans['MacularThickening'] = 'Macular thickening<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['MattressSuture'] = 'Mattress suture<br/><br/>Drag to move';
ED.trans['Microaneurysm'] = 'Microaneurysm<br/><br/>Drag to position';
ED.trans['NerveFibreDefect'] = 'Nerve fibre layer defect<br/><br/>Drag to position<br/>Drag handles to change size';
ED.trans['OperatingTable'] = 'Operating table';
ED.trans['OpticDisc'] = 'Optic disc<br/><br/>Basic mode: Drag handle to adjust cup/disc ratio<br/>Expert mode: Drag handles to re-shape disc';
ED.trans['OpticDiscPit'] = 'Optic disc pit<br/><br/>Drag to position<br/>Drag handle to change shape';
ED.trans['Papilloedema'] = 'Papilloedema';
ED.trans['PCIOL'] = 'Posterior chamber IOL<br/><br/>Drag to move<br/>Drag the handle to rotate';
ED.trans['PeripapillaryAtrophy'] = 'Peripapillary atrophy<br/><br/>Drag to rotate<br/>Drag handles to change extent';
ED.trans['PeripheralRetinectomy'] = 'Peripheral retinectomy<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move posterior limit';
ED.trans['PeripheralRRD'] = 'Peripheral retinal detachment<br/><br/>Drag to rotate<br/>Drag each end handle to increase extent<br/>Drag the middle handle to move posterior limit';
ED.trans['PhakoIncision'] = 'Phako incision<br/><br/>Drag end handle to change length<br/>Drag the middle handle to change section type<br/>Drag the incision itself to move';
ED.trans['PI'] = 'Peripheral iridectomy<br/><br/>Drag to move around the iris';
ED.trans['PosteriorEmbryotoxon'] = 'Posterior embryotoxon';
ED.trans['PosteriorRetinectomy'] = 'Posterior retinectomy<br/><br/>Drag to position<br/>Drag the handle to change size';
ED.trans['PosteriorSynechia'] = 'PosteriorSynechia<br/><br/>Drag to rotate around centre<br/>Drag handles to increase extent';
ED.trans['PostPole'] = 'Posterior pole<br/><br/>The disc cup can be edited by clicking on the disc, and dragging the yellow handle<br/>The gray circle marks one disc diameter from the fovea';
ED.trans['PreRetinalHaemorrhage'] = 'Preretinal haemorrhage<br/><br/>Drag to position<br/>Drag handles to change shape and size';
ED.trans['PRPPostPole'] = 'Pan-retinal photocoagulation';
ED.trans['RadialSponge'] = 'Radial sponge<br/><br/>Drag to change position';
ED.trans['RetinalTouch'] = 'Retinal touch<br/><br/>Drag to change position';
ED.trans['RK'] = 'Radial keratotomy<br/><br/>Drag to rotate<br/>Drag outer handle to resize<br/>Drag inner handle to adjust central extent';
ED.trans['RoundHole'] = '';
ED.trans['RRD'] = '';
ED.trans['Rubeosis'] = 'Rubeosis iridis<br/><br/>Drag to rotate around centre<br/>Drag handles to increase extent';
ED.trans['SectorPRP'] = 'A sector of panretinal photocoagulation<br/><br/>Drag to rotate around centre<br/>Drag each end handle to increase extent';
ED.trans['ScleralIncision'] = 'Scleral incision<br/><br/>Drag to move around the sclera';
ED.trans['SectorIridectomy'] = 'Sector Iridectomy<br/><br/>Drag to position<br/>Drag handles to adjust extent';
ED.trans['Sclerostomy'] = 'A sclerostomy for vitrectomy<br/><br/>Drag to rotate around centre<br/>Drag each handle to alter gauge<br/>Click suture button to toggle suture';
ED.trans['SidePort'] = 'Side port<br/><br/>Drag to move';
ED.trans['SubretinalPFCL'] = 'Subretinal PFCL<br/><br/>Drag to position<br/>Drag handle to change size';
ED.trans['Surgeon'] = 'Surgeon';
ED.trans['ToricPCIOL'] = 'Toric posterior chamber IOL<br/><br/>Drag to move<br/>Drag the handle to rotate';
ED.trans['Trabectome'] = 'Trabectome<br/><br/>Drag to position<br/>Drag either end handle to adjust extent';
ED.trans['TractionRetinalDetachment'] = 'Traction retinal detachment<br/><br/>Drag to position<br/>Drag inner handle to change shape and size<br/>Drag outer handle to rotate';
ED.trans['TransilluminationDefect'] = 'Transillumination defects of the iris<br/><br/>Drag to rotate around centre<br/>Drag each end handle to alter extent';
ED.trans['UTear'] = '';
ED.trans['VitreousOpacity'] = 'Vitreous Opacity<br/><br/>Drag to move<br/>Drag the inner handle up and down to alter opacity<br/>Drag the outer handle to scale';

ED.trans['Crepitations'] = 'Crepitations<br/><br/>Drag to move<br/>Drag handle to resize';
ED.trans['Stenosis'] = 'Stenosis<br/><br/>Drag to move<br/>Drag handle up and down to change degree<br/>Drag handle to left and right to change type';
ED.trans['Wheeze'] = 'Wheeze<br/><br/>Drag to move';
ED.trans['Effusion'] = 'Pleural effusion<br/><br/>Drag handle to move up';
ED.trans['LeftCoronaryArtery'] = 'Left coronary artery<br/><br/>Drag handle to move origin and make anomolous';
ED.trans['DrugStent'] = 'Drug eluting stent<br/><br/>Drag to move';
ED.trans['MetalStent'] = 'Metal stent<br/><br/>Drag to move';
ED.trans['Bypass'] = 'Coronary artery bypass<br/><br/>Drag handle to alter destination';
ED.trans['Bruit'] = 'Bruit<br/><br/>Drag to move';
ED.trans['Bruising'] = 'Bruising<br/><br/>Drag to move<br/>Drag handle to resize';
ED.trans['Haematoma'] = 'Haematoma<br/><br/>Drag to move<br/>Drag handle to resize';

/**
 * @fileOverview Contains doodle subclasses for glaucoma
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.8
 *
 * Modification date: 28th Ootober 2011
 * Copyright 2011 OpenEyes
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * Heart
 *
 * @class Heart
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Heart = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Heart";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Heart.prototype = new ED.Doodle;
ED.Heart.prototype.constructor = ED.Heart;
ED.Heart.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Heart.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Heart.prototype.setPropertyDefaults = function()
{
    //this.isDeletable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Heart.prototype.setParameterDefaults = function()
{
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Heart.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Heart.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(-287,	-51);
        
        ctx.bezierCurveTo(-344, 53, -346, 243, -116, 209);
        ctx.bezierCurveTo(5, 297, 269, 341, 312, 268);
        ctx.bezierCurveTo(387, 141, 319, -17, 237, -59);
        ctx.bezierCurveTo(225, -133, 141, -209, 65, -215);
        ctx.bezierCurveTo(55, -209, 43, -219, 53, -193);
        ctx.bezierCurveTo(133, -185, 201, -129, 216, -46);
        ctx.bezierCurveTo(205, -23, 167, 11, 187, 25);
        ctx.bezierCurveTo(202, 36, 192, -37, 235, -3);
        ctx.bezierCurveTo(291, 41, 333, 227, 295, 207);
        ctx.bezierCurveTo(195, 155, 153, 111, 97, 43);
        ctx.bezierCurveTo(74, 15, 177, 62, 181, 43);
        ctx.bezierCurveTo(187, 17, 109, 25, 55, 19);
        ctx.bezierCurveTo(31, -7, -172, -89, -173, -87);
        ctx.bezierCurveTo(-173, -84, -232, -117, -191, -73);
        ctx.bezierCurveTo(-115, -49, -61, -13, -37, -3);
        ctx.bezierCurveTo(-67, 45, -14, 171, 3, 165);
        ctx.bezierCurveTo(21, 159, -53, 45, 15, 23);
        ctx.bezierCurveTo(103, 87, 199, 183, 231, 249);
        ctx.bezierCurveTo(199, 297, -31, 243, -81, 199);
        ctx.bezierCurveTo(-53, 175, -8, 204, -13, 187);
        ctx.bezierCurveTo(-17, 171, -66, 181, -105, 185);
        ctx.bezierCurveTo(-331, 209, -289, 33, -273, -37);
        ctx.bezierCurveTo(-270, -47, -287, -51, -287, -51);

        
        ctx.closePath();
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Heart.prototype.description = function()
{
    return "Heart";
}

/**
 * Aorta
 *
 * @class Aorta
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Aorta = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Aorta";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Aorta.prototype = new ED.Doodle;
ED.Aorta.prototype.constructor = ED.Aorta;
ED.Aorta.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Aorta.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Aorta.prototype.setPropertyDefaults = function()
{
    this.isSelectable= false;
    this.isDeletable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Aorta.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.5;
    this.scaleY = 0.5;
    this.originX = -352;
    this.originY = -416;
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Aorta.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Aorta.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(216, -112);
        ctx.bezierCurveTo(216, -112, 181, 46, 210, 40);
        ctx.bezierCurveTo(239, 33, 282, -111, 282, -111);

        ctx.moveTo(423, 335);
        ctx.bezierCurveTo(423, 335, 453, 57, 313, 31);
        ctx.bezierCurveTo(281, 26, 330, -100, 330, -100);
        
        ctx.moveTo(-1, -25);
        ctx.bezierCurveTo(-1, -25, 57, 2, 74, 41);
        ctx.bezierCurveTo(82, 61, 93, 79, 116, 78);
        ctx.bezierCurveTo(144, 78, 141, 42, 141, 7);
        ctx.bezierCurveTo(141, -50, 159, -97, 159, -97);

        ctx.moveTo(198, 582);
        ctx.bezierCurveTo(214, 619, 155, 663, 105, 649);
        
        ctx.moveTo(-39, 12);
        ctx.bezierCurveTo(-39, 12, 52, 54, 28, 133);
        ctx.bezierCurveTo(28, 133, -2, 180, -16, 200);
        ctx.bezierCurveTo(-49, 246, -125, 446, -28, 595);
        ctx.lineTo(-1, 640);
        ctx.bezierCurveTo(67, 725, 152, 624, 119, 566);
        ctx.bezierCurveTo(151, 598, 255, 603, 251, 514);
        ctx.bezierCurveTo(250, 473, 182, 418, 182, 418);
        ctx.bezierCurveTo(118, 352, 162, 209, 254, 211);
        ctx.bezierCurveTo(314, 212, 287, 365, 287, 365);
        
        //ctx.closePath();
        
        ctx.lineWidth = 12;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(100, 100, 100, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Aorta.prototype.description = function()
{
    return "";
}

/**
 * RightCoronaryArtery
 *
 * @class RightCoronaryArtery
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.RightCoronaryArtery = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RightCoronaryArtery";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RightCoronaryArtery.prototype = new ED.Doodle;
ED.RightCoronaryArtery.prototype.constructor = ED.RightCoronaryArtery;
ED.RightCoronaryArtery.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RightCoronaryArtery.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.RightCoronaryArtery.prototype.setPropertyDefaults = function()
{
    this.isSelectable= false;
    this.isDeletable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.RightCoronaryArtery.prototype.setParameterDefaults = function()
{
    this.originX = 24;
    this.originY = 2;
    this.scaleX = 1.5;
    this.scaleY = 1.5;
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RightCoronaryArtery.prototype.draw = function(_point)
{
    //console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RightCoronaryArtery.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
    
        ctx.moveTo(-254, -66);
        ctx.bezierCurveTo(-379, 8, -313, 171, -289, 204);
        ctx.bezierCurveTo(-245, 265, -184, 266, -151, 252);
        ctx.bezierCurveTo(-144, 261, -94, 311, -94, 311);   
        
        ctx.moveTo(-244, -58);
        ctx.bezierCurveTo(-364, -23, -327, 263, -173, 247);
        ctx.bezierCurveTo(-138, 243, -88, 191, -36, 242);
        ctx.bezierCurveTo(-15, 261, -9, 276, -9, 276);
        
        ctx.moveTo(-54, 292);
        ctx.bezierCurveTo(-54, 292, -103, 238, -110, 234);
        ctx.bezierCurveTo(-125, 237, -142, 247, -142, 247);
        
        ctx.moveTo(-82, 306);
        ctx.lineTo(-142, 247);

        ctx.moveTo(-42, 286);
        ctx.lineTo(-96, 232);
        ctx.bezierCurveTo(-84, 218, -36, 250, -24, 276);
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(100, 100, 100, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.RightCoronaryArtery.prototype.description = function()
{
    return "";
}

/**
 * LeftCoronaryArtery
 *
 * @class LeftCoronaryArtery
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.LeftCoronaryArtery = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LeftCoronaryArtery";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LeftCoronaryArtery.prototype = new ED.Doodle;
ED.LeftCoronaryArtery.prototype.constructor = ED.LeftCoronaryArtery;
ED.LeftCoronaryArtery.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LeftCoronaryArtery.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.LeftCoronaryArtery.prototype.setPropertyDefaults = function()
{
    //this.isSelectable= false;
    this.isDeletable = false;
    
    // Update component of validation array for simple parameters
//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.LeftCoronaryArtery.prototype.setParameterDefaults = function()
{

    this.originY = 0;
    this.scaleX = 1.5;
    this.scaleY = 1.5;
    this.apexX = -153;
    this.apexY = -84;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LeftCoronaryArtery.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LeftCoronaryArtery.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(-100, -50, 100, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();

        // Start segment
        //ctx.moveTo(-210, -94);
        ctx.moveTo(this.apexX, this.apexY);
        //ctx.bezierCurveTo(-277, -82, -206, -47, -186, -48);
        ctx.bezierCurveTo(-165, -48, -94, -52, -37, -58);
        ctx.bezierCurveTo(20, -63, 40, -34, 102, -34);
        ctx.bezierCurveTo(119, -34, 135, -36, 135, -36);
        
        ctx.moveTo(68, 136);
        ctx.bezierCurveTo(50, 130, 23, 124, 14, 110);
        ctx.bezierCurveTo(2, 92, -2, 66, -7, 39);
        ctx.bezierCurveTo(-11, 23, -24, -5, -35, -26);
        ctx.bezierCurveTo(-50, -55, 41, -34, 42, -8);
        ctx.bezierCurveTo(45, 25, 39, 41, 39, 41);
        
        ctx.moveTo(200, 257);
        ctx.bezierCurveTo(223, 258, 289, 267, 311, 253);
        ctx.bezierCurveTo(331, 240, 314, 208, 304, 193);
        ctx.bezierCurveTo(282, 155, 246, 114, 224, 90);
        
        ctx.moveTo(67, 143);
        ctx.bezierCurveTo(67, 143, 42, 138, 16, 129);
        ctx.bezierCurveTo(21, 144, 26, 171, 40, 185);
        ctx.bezierCurveTo(63, 208, 102, 210, 102, 210);
        
        ctx.moveTo(103, 218);
        ctx.bezierCurveTo(103, 218, 55, 208, 39, 202);
        ctx.bezierCurveTo(49, 273, 165, 280, 165, 280);
             
        ctx.moveTo(195, 136);
        ctx.bezierCurveTo(195, 136, 197, 101, 196, 86);
        ctx.bezierCurveTo(214, 97, 232, 110, 243, 130);
        ctx.bezierCurveTo(249, 142, 247, 180, 247, 180);
        
        ctx.moveTo(164, 284);
        ctx.bezierCurveTo(164, 284, 101, 286, 55, 253);
        ctx.bezierCurveTo(35, 238, 24, 200, 16, 175);
        
        ctx.lineTo(-6, 94);
        ctx.moveTo(221, 80);
        
        ctx.moveTo(135, -33);
        ctx.bezierCurveTo(135, -33, 104, -23, 71, -28);
        ctx.bezierCurveTo(110, -7, 147, 18, 182, 48);
        ctx.bezierCurveTo(193, 57, 205, 73, 215, 77);
        ctx.bezierCurveTo(226, 81, 241, 81, 253, 83);
        //
        ctx.moveTo(190, 133);
        ctx.bezierCurveTo(190, 133, 191, 87, 178, 68);
        ctx.bezierCurveTo(165, 49, 96, 11, 96, 11);
        
        // Repairs
        ctx.moveTo(-4, 98);
        ctx.bezierCurveTo(-10, 136,-10, 136,-22, 156);
        
        ctx.moveTo(58, -10);
        ctx.bezierCurveTo(62, 18, 62, 18, 54, 42);
        
        ctx.moveTo(102, 10);
        ctx.bezierCurveTo(106, 38, 106, 38, 102, 56);

        ctx.moveTo(222, 90);
        ctx.bezierCurveTo(242, 92, 242, 92, 258, 94);
        
        ctx.moveTo(258, 142);
        ctx.bezierCurveTo(340, 264, 316, 250, 204, 244);
        
        ctx.moveTo(258, 142);
        ctx.bezierCurveTo(264, 164, 264, 164, 260, 176);
        
        ctx.moveTo(54, -12);
        ctx.bezierCurveTo(54, -12, 77, -4, 84, 7);
        ctx.bezierCurveTo(94, 24, 89, 57, 89, 57);
        
        // End segment
        ctx.moveTo(-38, 158);
        ctx.bezierCurveTo(-38, 158, 17, 81, -58, -42);
        if (this.apexX > -200) ctx.bezierCurveTo(-152, -40, -146, -27, this.apexX - 20, this.apexY);
        else ctx.bezierCurveTo(-152, -40, -146, -27, this.apexX - 8, this.apexY + 15);
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(100, 100, 100, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.LeftCoronaryArtery.prototype.description = function()
{
    if (this.apexX < -200) return "Anomalous insertion of left coronary artery";
    else return "";
}

/**
 * AnomalousVessels
 *
 * @class AnomalousVessels
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AnomalousVessels = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AnomalousVessels";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AnomalousVessels.prototype = new ED.Doodle;
ED.AnomalousVessels.prototype.constructor = ED.AnomalousVessels;
ED.AnomalousVessels.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AnomalousVessels.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.AnomalousVessels.prototype.setPropertyDefaults = function()
{
    //this.isSelectable= false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.AnomalousVessels.prototype.setParameterDefaults = function()
{
    //    this.originX = -500;
    this.originY = -100;
    this.scaleX = 1.5;
    this.scaleY = 1.5;
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AnomalousVessels.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AnomalousVessels.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, 400, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        ctx.moveTo(68, 136);
        ctx.bezierCurveTo(50, 130, 23, 124, 14, 110);
        ctx.bezierCurveTo(2, 92, -2, 66, -7, 39);
        ctx.bezierCurveTo(-11, 23, -24, -5, -35, -26);
        ctx.bezierCurveTo(-50, -55, 41, -34, 42, -8);
        ctx.bezierCurveTo(45, 25, 39, 41, 39, 41);
        
        
        
        ctx.moveTo(200, 257);
        ctx.bezierCurveTo(223, 258, 289, 267, 311, 253);
        ctx.bezierCurveTo(331, 240, 314, 208, 304, 193);
        ctx.bezierCurveTo(282, 155, 246, 114, 224, 90);
        
        ctx.lineTo(254, 89);
        ctx.moveTo(-6, 94);
        ctx.bezierCurveTo(-8, 113, -11, 132, -33, 164);
        
        ctx.moveTo(67, 143);
        ctx.bezierCurveTo(67, 143, 42, 138, 16, 129);
        ctx.bezierCurveTo(21, 144, 26, 171, 40, 185);
        ctx.bezierCurveTo(63, 208, 102, 210, 102, 210);
        
        ctx.moveTo(103, 218);
        ctx.bezierCurveTo(103, 218, 55, 208, 39, 202);
        ctx.bezierCurveTo(49, 273, 165, 280, 165, 280);
        
        ctx.moveTo(-54, 292);
        ctx.bezierCurveTo(-54, 292, -103, 238, -110, 234);
        ctx.bezierCurveTo(-125, 237, -142, 247, -142, 247);
        
        ctx.lineTo(-91, 307);
        
        ctx.moveTo(195, 136);
        ctx.bezierCurveTo(195, 136, 197, 101, 196, 86);
        ctx.bezierCurveTo(214, 97, 232, 110, 243, 130);
        ctx.bezierCurveTo(249, 142, 247, 180, 247, 180);
        
        ctx.moveTo(164, 284);
        ctx.bezierCurveTo(164, 284, 101, 286, 55, 253);
        ctx.bezierCurveTo(35, 238, 24, 200, 16, 175);
        
        ctx.lineTo(-6, 94);
        ctx.moveTo(221, 80);
        //ctx.lineTo(257, 151);
        
        ctx.moveTo(257, 151);
        ctx.bezierCurveTo(257, 151, 278, 176, 288, 190);
        ctx.bezierCurveTo(297, 204, 312, 227, 304, 240);
        ctx.bezierCurveTo(291, 264, 223, 250, 200, 250);
        
        ctx.moveTo(-14, 278);
        ctx.bezierCurveTo(-14, 278, -49, 217, -98, 230);
        
        //ctx.lineTo(-48, 290);
        
        ctx.moveTo(135, -33);
        ctx.bezierCurveTo(135, -33, 104, -23, 71, -28);
        ctx.bezierCurveTo(110, -7, 147, 18, 182, 48);
        ctx.bezierCurveTo(193, 57, 205, 73, 215, 77);
        ctx.bezierCurveTo(226, 81, 241, 81, 253, 83);
        //
        ctx.moveTo(190, 133);
        ctx.bezierCurveTo(190, 133, 191, 87, 178, 68);
        ctx.bezierCurveTo(165, 49, 96, 11, 96, 11);
        
        ctx.moveTo(54, -12);
        ctx.bezierCurveTo(54, -12, 77, -4, 84, 7);
        ctx.bezierCurveTo(94, 24, 89, 57, 89, 57);
        
        ctx.moveTo(-210, -104);
        ctx.bezierCurveTo(-253, -100, -259, -73, -254, -66);
        ctx.bezierCurveTo(-379, 8, -313, 171, -289, 204);
        ctx.bezierCurveTo(-245, 265, -184, 266, -151, 252);
        ctx.bezierCurveTo(-144, 261, -94, 311, -94, 311);
        
        ctx.moveTo(-38, 158);
        ctx.bezierCurveTo(-38, 158, 17, 81, -58, -42);
        ctx.bezierCurveTo(-152, -40, -206, -27, -238, -56);
        
        ctx.moveTo(-244, -58);
        ctx.bezierCurveTo(-364, -23, -327, 263, -173, 247);
        ctx.bezierCurveTo(-138, 243, -88, 191, -36, 242);
        ctx.bezierCurveTo(-15, 261, -9, 276, -9, 276);
        
        ctx.moveTo(-210, -94);
        ctx.bezierCurveTo(-277, -82, -206, -47, -186, -48);
        ctx.bezierCurveTo(-165, -48, -94, -52, -37, -58);
        ctx.bezierCurveTo(20, -63, 40, -34, 102, -34);
        ctx.bezierCurveTo(119, -34, 135, -36, 135, -36);
        
        //ctx.closePath();
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.AnomalousVessels.prototype.description = function()
{
    return "AnomalousVessels";
}

/**
 * Lungs
 *
 * @class Lungs
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Lungs = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Lungs";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Lungs.prototype = new ED.Doodle;
ED.Lungs.prototype.constructor = ED.Lungs;
ED.Lungs.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Lungs.prototype.setHandles = function()
{
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Lungs.prototype.setPropertyDefaults = function()
{
    this.isSelectable = false;
    this.isDeletable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Lungs.prototype.setParameterDefaults = function()
{
    this.apexY = -20;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lungs.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Lungs.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Right lung
    ctx.moveTo(-147, -281);
    ctx.bezierCurveTo(-224, -279, -414, 29, -426, 289);
    ctx.bezierCurveTo(-334, 226, -219, 196, -79, 236);
    ctx.bezierCurveTo(-6, 231, -71, -284, -147, -281);

    // Left Lung
    ctx.moveTo(147, -281);
    ctx.bezierCurveTo(224, -279, 414, 29, 426, 289);
    ctx.bezierCurveTo(334, 226, 219, 196, 79, 236);
    ctx.bezierCurveTo(6, 231, 71, -284, 147, -281);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "white";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle)
    this.leftExtremity = this.transform.transformPoint(new ED.Point(-40,-40));
    this.rightExtremity = this.transform.transformPoint(new ED.Point(40,-40));
    this.arc = this.calculateArc();
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Lungs.prototype.description = function()
{
    return this.drawing.doodleArray.length == 1?"No abnormality":"";
}

/**
 * Effusion
 *
 * @class Effusion
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Effusion = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Effusion";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Effusion.prototype = new ED.Doodle;
ED.Effusion.prototype.constructor = ED.Effusion;
ED.Effusion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Effusion.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Effusion.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
    this.isRotatable = false;
    // Update component of validation array for simple parameters
    //this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    //this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Effusion.prototype.setParameterDefaults = function()
{
    this.apexX = -231;
    this.apexY = 136;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Effusion.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Effusion.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Right effusion
    ctx.moveTo(this.apexX, this.apexY);
    ctx.lineTo(-400 + (-136 + this.apexY) * -0.3, this.apexY);
    ctx.lineTo(-426, 289);
    //ctx.bezierCurveTo(-224, -279, -414, 29, -426, 289);
    ctx.bezierCurveTo(-334, 226, -219, 196, -79, 236);
    ctx.lineTo(-44, this.apexY);
    ctx.lineTo(this.apexX, this.apexY);
    //ctx.bezierCurveTo(-6, 231, -71, -284,this.apexX, this.apexY);
    
    // Left Lung
//    ctx.moveTo(147, -281);
//    ctx.bezierCurveTo(224, -279, 414, 29, 426, 289);
//    ctx.bezierCurveTo(334, 226, 219, 196, 79, 236);
//    ctx.bezierCurveTo(6, 231, 71, -284, 147, -281);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Effusion.prototype.description = function()
{
    return "pleural effusion in right lung";
}


/**
 * Bypass
 *
 * @class Bypass
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Bypass = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Bypass";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Bypass.prototype = new ED.Doodle;
ED.Bypass.prototype.constructor = ED.Bypass;
ED.Bypass.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bypass.prototype.setHandles = function()
{
//	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Bypass.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
    this.isRotatable = false;
    // Update component of validation array for simple parameters
//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Bypass.prototype.setParameterDefaults = function()
{
    var num = this.drawing.numberOfDoodlesOfClass(this.className);
    
    if (num == 0)
    {
        this.apexX = 40;
        this.apexY = -60;
    }
    else if (num == 1)
    {
        this.apexX = -11;
        this.apexY = 133;
    }
    else
    {
        this.apexX = -445;
        this.apexY = 205;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bypass.prototype.draw = function(_point)
{
    //console.log(this.apexX, this.apexY);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Bypass.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Start point and end point
    var startPoint = new ED.Point(-320, -200);
    var endPoint = new ED.Point(this.apexX, this.apexY);
    
    var d = startPoint.distanceTo(endPoint);
    var r = 20;
    var phi = Math.PI/8;
    
    // Start point
    ctx.moveTo(startPoint.x, startPoint.y);
    
    // Calculate angle to apex point
    var angleToApex = Math.atan((endPoint.y - startPoint.y)/(endPoint.x - startPoint.x));
    if (angleToApex < 0) angleToApex = Math.PI/2 + (Math.PI/2 + angleToApex);
    
    var firstPoint = new ED.Point(0,0);
    firstPoint.setWithPolars(r, angleToApex);
    
    var firstControlPoint = new ED.Point(0,0);
    firstControlPoint.setWithPolars(d/2, angleToApex + Math.PI/2 - phi);
    
    var secondPoint =  new ED.Point(firstPoint.x + endPoint.x, firstPoint.y + endPoint.y);

    var fourthPoint  = new ED.Point(0,0);
    fourthPoint.setWithPolars(r, angleToApex + Math.PI);

    var thirdPoint = new ED.Point(fourthPoint.x + endPoint.x, fourthPoint.y + endPoint.y);
    
    
    ctx.lineTo(startPoint.x + firstPoint.x, startPoint.y + firstPoint.y);
    
    //ctx.lineTo(startPoint.x + firstPoint.x + firstControlPoint.x, startPoint.y + firstPoint.y + firstControlPoint.y);
    //ctx.lineTo(secondPoint.x, secondPoint.y);
    ctx.bezierCurveTo(startPoint.x + firstPoint.x + firstControlPoint.x, startPoint.y + firstPoint.y + firstControlPoint.y, startPoint.x + firstPoint.x + firstControlPoint.x, startPoint.y + firstPoint.y + firstControlPoint.y, secondPoint.x, secondPoint.y);
    
    
    
    //ctx.lineTo(x + (this.apexX - x)/2, y + (this.apexY - y)/2 - d);
    //ctx.lineTo(this.apexX, this.apexY);
    //ctx.bezierCurveTo(cpX, cpY, cpX, cpY, this.apexX, this.apexY - r);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.lineTo(thirdPoint.x, thirdPoint.y);
    
    //ctx.lineTo(startPoint.x + fourthPoint.x + firstControlPoint.x, startPoint.y + fourthPoint.y + firstControlPoint.y);
    //ctx.lineTo(startPoint.x + fourthPoint.x, startPoint.y + fourthPoint.y);
    ctx.bezierCurveTo(startPoint.x + fourthPoint.x + firstControlPoint.x, startPoint.y + fourthPoint.y + firstControlPoint.y, startPoint.x + fourthPoint.x + firstControlPoint.x, startPoint.y + fourthPoint.y + firstControlPoint.y, startPoint.x + fourthPoint.x, startPoint.y + fourthPoint.y);
    
    ctx.closePath();
    
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 000, 000, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	//this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle)
    this.leftExtremity = this.transform.transformPoint(new ED.Point(-40,-40));
    this.rightExtremity = this.transform.transformPoint(new ED.Point(40,-40));
    this.arc = this.calculateArc();
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Bypass.prototype.description = function()
{
    var artery = "";
    
    // Size description
    if (this.apexX > 0) artery = "left coronary artery";
    else if(this.apexX > -300) artery = "circumflex artery";
    else artery = "right coronary artery";
	
	return "Bypass graft to " + artery;
}

/**
 * Macular Thickening
 *
 * @class Crepitations
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Crepitations = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Crepitations";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Crepitations.prototype = new ED.Doodle;
ED.Crepitations.prototype.constructor = ED.Crepitations;
ED.Crepitations.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Crepitations.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Crepitations.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+50, +200);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Crepitations.prototype.setParameterDefaults = function()
{
	this.rotation = -Math.PI/4;
	this.apexX = 50;
	this.apexY = 0;
	
    this.setOriginWithDisplacements(-150, 300);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Crepitations.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Crepitations.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Start path
		ctx.beginPath();
		
		// Spacing of lines
		var d = 30;
		
		// Draw central line
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
        
		// Draw other lines
		for (var s = -1; s < 2; s += 2)
		{
			for (var y = d; y < r; y += d)
			{
				var x = this.xForY(r, y);
				ctx.moveTo(-x, s * y);
				ctx.lineTo(x, s * y);
			}
		}
		
		// Set attributes
		ctx.lineWidth = 15;
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(200, 200, 200, 0.75)";
		
		// Draw lines
		ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Crepitations.prototype.description = function()
{
    var lung = this.originX > 0?" left lung":" right lung";
    var lobe = this.originY > 0?" lower lobe of":" upper lobe of";
    
    return 'crepitations' + lobe + lung;
}

/**
 * Wheeze
 *
 * @class Wheeze
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Wheeze = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Wheeze";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Wheeze.prototype = new ED.Doodle;
ED.Wheeze.prototype.constructor = ED.Wheeze;
ED.Wheeze.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Wheeze.prototype.setHandles = function()
{
//	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
//	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Wheeze.prototype.setPropertyDefaults = function()
{    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Wheeze.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.6;
    this.scaleY = 0.6;
    
    this.originX = 172;
    this.originY = -62;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Wheeze.prototype.draw = function(_point)
{
    //console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Wheeze.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, -50, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 8;
        
        // Red centre
        ctx.beginPath();
        ctx.arc(-50, 0, 20, 0, 2 * Math.PI, false);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-34, 0);
        ctx.lineTo(-34, -100);
        ctx.lineTo(66, -150);
        ctx.lineTo(66, -50);
        
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(50, -50, 20, 0, 2 * Math.PI, false);
        ctx.fill();
        
        //ctx.lin
        ctx.closePath();
        ctx.fillStyle = "gray";
        ctx.fill();
	}
    
	// Coordinates of handles (in canvas plane)
//    var point = new ED.Point(0, 0);
//    point.setWithPolars(rc, Math.PI/4);
//	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Wheeze.prototype.description = function()
{
    var lung = this.originX > 0?" left lung":" right lung";
    var lobe = this.originY > 0?" lower lobe of":" upper lobe of";
    
    return 'wheeze' + lobe + lung;
}

/**
 * MetalStent
 *
 * @class MetalStent
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.MetalStent = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MetalStent";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MetalStent.prototype = new ED.Doodle;
ED.MetalStent.prototype.constructor = ED.MetalStent;
ED.MetalStent.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MetalStent.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.MetalStent.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MetalStent.prototype.setParameterDefaults = function()
{
    this.originX = -18;
    this.originY = 86;
    this.rotation = -4.985446531081719;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MetalStent.prototype.draw = function(_point)
{
    console.log(this.originX, this.originY, this.rotation);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MetalStent.superclass.draw.call(this, _point);
    
    // Stent radius
    var r = 50;
    var w = 10;
    var d = 10
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.rect(-r, -w, 2 * r, 2* w);
    
	// Set attributes
	ctx.lineWidth = 4;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        for (var i = 0; i < 10; i ++)
        {
            ctx.moveTo(-r + i * d, -w);
            ctx.lineTo(-r + i * d, +w);
        }
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(-50, -10);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.MetalStent.prototype.description = function()
{
    var artery;
    if (this.originX > 0) artery = "left coronary artery";
    else if(this.originX > -300) artery = "circumflex artery";
    else artery = "right coronary artery";
    
    return "Metal stent in " + artery;
}

/**
 * DrugStent
 *
 * @class DrugStent
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.DrugStent = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DrugStent";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DrugStent.prototype = new ED.Doodle;
ED.DrugStent.prototype.constructor = ED.DrugStent;
ED.DrugStent.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DrugStent.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.DrugStent.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.DrugStent.prototype.setParameterDefaults = function()
{
    this.originX = -18;
    this.originY = 86;
    this.rotation = -4.985446531081719;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DrugStent.prototype.draw = function(_point)
{
    console.log(this.originX, this.originY, this.rotation);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.DrugStent.superclass.draw.call(this, _point);
    
    // Stent radius
    var r = 50;
    var w = 10;
    var d = 20;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.rect(-r, -w, 2 * r, 2* w);
    
	// Set attributes
	ctx.lineWidth = 4;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        for (var i = 0; i < 5; i ++)
        {
            ctx.moveTo(-r + i * d, -w);
            ctx.lineTo(-r + (i + 1) * d, +w);
            ctx.moveTo(-r + (i + 1) * d, -w);
            ctx.lineTo(-r + i * d, +w);
        }
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(-50, -10);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DrugStent.prototype.description = function()
{
    var artery;
    if (this.originX > 0) artery = "left coronary artery";
    else if(this.originX > -300) artery = "circumflex artery";
    else artery = "right coronary artery";
    
    return "Metal stent in " + artery;
}

/**
 * Stenosis
 *
 * @class Stenosis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Stenosis = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Stenosis";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.degree = 0;
    this.type = "Calcified";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Stenosis.prototype = new ED.Doodle;
ED.Stenosis.prototype.constructor = ED.Stenosis;
ED.Stenosis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Stenosis.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Stenosis.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-10, +10);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
//    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
//    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
//    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['degree'] = {kind:'derived', type:'int', range:new ED.Range(0, 100), precision:0, animate:true};
    this.parameterValidationArray['type'] = {kind:'derived', type:'string', list:['Calcified', 'Non-calcified'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Stenosis.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('degree', '0');
    this.setParameterFromString('type', 'Calcified');
    this.apexX = 0;
    this.apexY = 0;
    
    this.originX = -373;
    this.originY = 323;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Stenosis.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexX':
            returnArray['type']  = _value > 0?"Calcified":"Non-calcified";
            break;
            
        case 'apexY':
            returnArray['degree']  = _value/-1;
            break;
            
        case 'type':
            returnArray['apexX'] = _value == "Calcified"?+10:-10;
            break;
            
        case 'degree':
            returnArray['apexY'] = -1 * _value;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Stenosis.prototype.draw = function(_point)
{
    //console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Stenosis.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
    
	// Stenosis
    ctx.arc(0, 0, 30, 0, 2 * Math.PI, false);
    
	// Set attributes
	ctx.lineWidth = 2;
	//ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.strokeStyle = "blue";
//    if (this.apexX > 0) ctx.fillStyle = "rgba(0, 0, 255," + (this.apexY/-100) + ")";
//    else ctx.fillStyle = "rgba(0, 255, 0," + (this.apexY/-100) + ")";
    ctx.fillStyle = "rgba(155, 155, 0," + (this.apexY/-100) + ")";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        
        if (this.type == "Calcified")
        {
            ctx.beginPath();
            ctx.arc(-10, -10, 8, 0, 2 * Math.PI, false);
            ctx.moveTo(+10, -10);
            ctx.arc(+10, -10, 8, 0, 2 * Math.PI, false);
            ctx.moveTo(+10, +10);
            ctx.arc(+10, +10, 8, 0, 2 * Math.PI, false);
            ctx.moveTo(-10, +10);
            ctx.arc(-10, +10, 8, 0, 2 * Math.PI, false);
            
            ctx.fillStyle = "white";
            ctx.fill();
            
        }
//        ctx.fillStyle = "blue";
//        
//        ctx.beginPath();
//        ctx.moveTo(-100, -50);
//        ctx.bezierCurveTo(this.apexX, this.apexY, this.apexX, this.apexY, 100, -50);
//        ctx.closePath();
//        ctx.fill();
//        
//        ctx.beginPath();
//        ctx.moveTo(-100, 50);
//        ctx.bezierCurveTo(this.apexX, -this.apexY, this.apexX, -this.apexY, 100, 50);
//        ctx.closePath();
//        ctx.fill();
	}
    
    // Coordinates of handles (in canvas plane)
    point = new ED.Point(this.apexX, this.apexY);
	this.handleArray[4].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Stenosis.prototype.description = function()
{
    var artery;
    if (this.originX > 0) artery = "left coronary artery";
    else if(this.originX > -300) artery = "circumflex artery";
    else artery = "right coronary artery";
    
    return this.degree.toString() + "% " + this.type + " stenosis in the " + artery;
}

/**
 * Groin
 *
 * @class Groin
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Groin = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Groin";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Groin.prototype = new ED.Doodle;
ED.Groin.prototype.constructor = ED.Groin;
ED.Groin.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Groin.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Groin.prototype.setPropertyDefaults = function()
{
    this.isSelectable= false;
    this.isDeletable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Groin.prototype.setParameterDefaults = function()
{
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Groin.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Groin.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
    ctx.moveTo(12, 49);
    ctx.bezierCurveTo(37, 49, 68, 24, 68, 24);
    ctx.bezierCurveTo(73, 42, 136, 318, 136, 318);
    
    ctx.lineTo(460, 318);
    ctx.bezierCurveTo(460, 318, 468, 191, 468, 159);
    ctx.bezierCurveTo(468, 127, 451, -48, 451, -67);
    ctx.bezierCurveTo(451, -87, 444, -188, 444, -215);
    ctx.bezierCurveTo(444, -242, 407, -402, 407, -402);
    
    ctx.lineTo(-380, -402);
    ctx.bezierCurveTo(-380, -402, -417, -242, -417, -215);
    ctx.bezierCurveTo(-417, -189, -423, -87, -423, -67);
    ctx.bezierCurveTo(-423, -48, -440, 127, -440, 159);
    ctx.bezierCurveTo(-440, 191, -432, 318, -432, 318);
    
    ctx.lineTo(-112, 318);
    ctx.lineTo(-40, 24);
    ctx.bezierCurveTo(-27, 39, -10, 49, 15, 49);
    
    ctx.closePath();
	
	// Set line attributes
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(255, 175, 175, 0.5)";
    ctx.strokeStyle = "rgba(100, 100, 100, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();

        ctx.moveTo(-228, -189);
        
        ctx.lineTo(-158, -155);
        ctx.bezierCurveTo(-158, -155, -109, -113, -88, -75);
        ctx.bezierCurveTo(-74, -51, -65, -5, -40, 24);
        
        ctx.moveTo(255, -189);
        ctx.lineTo(186, -155);
        ctx.bezierCurveTo(186, -155, 136, -113, 115, -75);
        ctx.bezierCurveTo(102, -51, 92, -5, 68, 23);
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.strokeStyle = "rgba(100, 100, 100, 1)";
        ctx.stroke();
        
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Groin.prototype.description = function()
{
    return "Groin";
}

/**
 * Blot Haemorrhage
 *
 * @class Haematoma
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Haematoma = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Haematoma";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Haematoma.prototype = new ED.Doodle;
ED.Haematoma.prototype.constructor = ED.Haematoma;
ED.Haematoma.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Haematoma.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Haematoma.prototype.setParameterDefaults = function()
{
    this.originX = -150;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Haematoma.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Haematoma.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 30;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Haematoma.prototype.groupDescription = function()
{
    return "Haematoma";
}


/**
 * Blot Haemorrhage
 *
 * @class Bruising
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Bruising = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Bruising";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Bruising.prototype = new ED.Doodle;
ED.Bruising.prototype.constructor = ED.Bruising;
ED.Bruising.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bruising.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Bruising.prototype.setParameterDefaults = function()
{
    this.originX = -190;
    this.originY = 100;
    this.scaleY = 2;
}

/**
 * Sets default dragging attributes
 */
ED.Bruising.prototype.setPropertyDefaults = function()
{
    this.isSqueezable = true;
//    // Update component of validation array for simple parameters
//    this.parameterValidationArray['apexX']['range'].setMinAndMax(-10, +10);
//    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
//    //    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
//    //    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
//    //    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
//    
//    // Add complete validation arrays for derived parameters
//    this.parameterValidationArray['degree'] = {kind:'derived', type:'int', range:new ED.Range(0, 100), precision:0, animate:true};
//    this.parameterValidationArray['type'] = {kind:'derived', type:'string', list:['Calcified', 'Non-calcified'], animate:true};
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bruising.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Bruising.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(127, 0, 127, 0.5)";
    ctx.fillStyle = "rgba(127, 0, 127, 0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Bruising.prototype.description = function()
{
    return "Bruising";
}

/**
 * Bruit
 *
 * @class Bruit
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Bruit = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Bruit";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Bruit.prototype = new ED.Doodle;
ED.Bruit.prototype.constructor = ED.Bruit;
ED.Bruit.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Bruit.prototype.setHandles = function()
{
    //	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
    //	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Bruit.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Bruit.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.6;
    this.scaleY = 0.6;
    
    this.originX = -150;
    this.originY = -62;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bruit.prototype.draw = function(_point)
{
    //console.log(this.originX, this.originY);
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Bruit.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, -50, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(155, 255, 255, 0)";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 8;
        
        // Red centre
        ctx.beginPath();
        ctx.arc(-50, 0, 20, 0, 2 * Math.PI, false);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-34, 0);
        ctx.lineTo(-34, -100);
        ctx.lineTo(0, -80);
        
        ctx.stroke();
        
	}
    
	// Coordinates of handles (in canvas plane)
    //    var point = new ED.Point(0, 0);
    //    point.setWithPolars(rc, Math.PI/4);
    //	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Bruit.prototype.description = function()
{
//    var lung = this.originX > 0?" left lung":" right lung";
//    var lobe = this.originY > 0?" lower lobe of":" upper lobe of";
    
    return 'Bruit';
}

/**
 * @fileOverview Contains doodle subclasses for the anterior segment
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.92
 *
 * Modification date: 23rd Ootober 2011
 * Copyright 2011 OpenEyes
 *
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * Anterior segment with adjustable sized pupil
 *
 * @class AntSeg
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AntSeg = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AntSeg";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.pupilSize = 'Large';
    this.pxe = false;
    
    this.savedParams = ['pxe'];
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AntSeg.prototype = new ED.Doodle;
ED.AntSeg.prototype.constructor = ED.AntSeg;
ED.AntSeg.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSeg.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.AntSeg.prototype.setPropertyDefaults = function()
{
    this.version = 1.1;
    this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters (enable 2D control by adding -50,+50 apexX range
    this.parameterValidationArray['apexX']['range'].setMinAndMax(0, 0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-280, -60);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['pupilSize'] = {kind:'derived', type:'string', list:['Large', 'Medium', 'Small'], animate:true};
    this.parameterValidationArray['pxe'] = {kind:'derived', type:'bool', display:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSeg.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('pupilSize', 'Large');
    this.setParameterFromString('pxe', 'false');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSeg.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -200) returnArray['pupilSize'] = 'Large';
            else if (_value < -100) returnArray['pupilSize'] = 'Medium';
            else returnArray['pupilSize']  = 'Small';
            break;
            
        case 'pupilSize':
            switch (_value)
            {
                case 'Large':
                    if (this.apexY < -200) returnValue = this.apexY;
                    else returnArray['apexY'] = -260;
                    break;
                case 'Medium':
                    if (this.apexY >= -200 && this.apexY < -100) returnValue = this.apexY;
                    else returnArray['apexY'] = -200;
                    break;
                case 'Small':
                    if (this.apexY >= -100) returnValue = this.apexY;
                    else returnArray['apexY'] = -100;
                    break;
            }
            break;

            /*
        case 'apexX':
            if (_value < -5) returnArray['pxe'] = false;
            else returnArray['pxe'] = true;
            break;

            
        case 'pxe':
            if (this.pxe) returnArray['apexX'] = +50;
            else returnArray['apexX'] = -50;
            break;
             */
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSeg.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AntSeg.superclass.draw.call(this, _point);
    
	// Radius of limbus
	var ro = 380;
    var ri = -this.apexY;
	
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
    // Move to inner circle
    ctx.moveTo(ri, 0);
    
	// Arc back the other way
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
	//ctx.fillStyle = "rgba(255, 160, 40, 0.9)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Pseudo exfoliation
        if (this.pxe)
        {
            ctx.lineWidth = 8;
            ctx.strokeStyle = "darkgray";
            
            var rl = ri * 0.8;
            var rp = ri * 1.05;
            var segments = 36;
            var i;
            var phi = Math.PI * 2/segments;
            
            // Loop around alternating segments
            for (i = 0; i < segments; i++)
            {
                // PXE on lens
                ctx.beginPath();
                ctx.arc(0, 0, rl, i * phi, i * phi + phi/2, false);
                ctx.stroke();
                
                // PXE on pupil
                ctx.beginPath();
                ctx.arc(0, 0, rp, i * phi, i * phi + phi/2, false);
                ctx.stroke();
            }
        }
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.AntSeg.prototype.description = function()
{
    return this.drawing.doodleArray.length == 1?"No abnormality":"";
}

/**
 * Anterior Segment Cross Section
 *
 * @class AntSegCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AntSegCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AntSegCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.pupilSize = 'Large';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AntSegCrossSection.prototype = new ED.Doodle;
ED.AntSegCrossSection.prototype.constructor = ED.AntSegCrossSection;
ED.AntSegCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSegCrossSection.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AntSegCrossSection.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    //this.parameterValidationArray['apexX']['range'].setMinAndMax(-140, 0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-280, -60);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['pupilSize'] = {kind:'derived', type:'string', list:['Large', 'Medium', 'Small'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AntSegCrossSection.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('pupilSize', 'Large');
    this.apexX = 24;
    this.originX = 44;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AntSegCrossSection.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Set apexX and its limits for apexX according to value of apexY (prevents collisions with cornea and lens)
            this.parameterValidationArray['apexX']['range'].setMinAndMax(-40 - (140/220) * (this.apexY + 280), 32 - (72/220) * (this.apexY + 280));
            
            // If being synced, make sensible decision about x
            if (!this.drawing.isActive)
            {
                var newOriginX = this.parameterValidationArray['apexX']['range'].max;
            }
            else
            {
                var newOriginX = this.parameterValidationArray['apexX']['range'].constrain(this.apexX);
            }
            this.setSimpleParameter('apexX', newOriginX);
            
            // Set pupil size value
            if (_value < -200) returnArray['pupilSize'] = 'Large';
            else if (_value < -100) returnArray['pupilSize'] = 'Medium';
            else returnArray['pupilSize']  = 'Small';
            break;
            
        case 'pupilSize':
            switch (_value)
            {
                case 'Large':
                    returnArray['apexY'] = -260;
                    break;
                case 'Medium':
                    returnArray['apexY'] = -200;
                    break;
                case 'Small':
                    returnArray['apexY'] = -100;
                    break;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSegCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AntSegCrossSection.superclass.draw.call(this, _point);
    
    // If lens there, take account of pupil size
    var marginX = this.apexX;
//    var doodle = this.drawing.lastDoodleOfClass("LensCrossSection");
//    if (doodle) marginX -= 44 - doodle.originX;
    
    // Boundary path
	ctx.beginPath();
    
    // Bottom cut away
    ctx.moveTo(60, 480);
    ctx.lineTo(140, 480);
    ctx.lineTo(140, 380);
    
    // Bottom ciliary body
    ctx.bezierCurveTo(120, 340, 120, 340, 100, 380);
    ctx.bezierCurveTo(80, 340, 80, 340, 60, 380);
    
    // Bottom pupil and angle
    var f = Math.abs(marginX) * 0.15;
    ctx.bezierCurveTo(40, 460, marginX + 60 + f, -this.apexY, marginX, -this.apexY);
    ctx.bezierCurveTo(marginX - 60 - f, -this.apexY, -21, 317, 0, 380);
    
    // Top cut away
    ctx.moveTo(60, -480);
    ctx.lineTo(140, -480);
    ctx.lineTo(140, -380);
    
    // Bottom ciliary body
    ctx.bezierCurveTo(120, -340, 120, -340, 100, -380);
    ctx.bezierCurveTo(80, -340, 80, -340, 60, -380);
    
    // Bottom pupil and angle
    ctx.bezierCurveTo(40, -460, marginX + 60 + f, this.apexY, marginX, this.apexY);
    ctx.bezierCurveTo(marginX - 60 - f, this.apexY, -21, -317, 0, -380);

    // Close path
    ctx.closePath();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 160, 40, 1)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Cornea Cross Section
 *
 * @class CorneaCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CorneaCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CorneaCrossSection";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CorneaCrossSection.prototype = new ED.Doodle;
ED.CorneaCrossSection.prototype.constructor = ED.CorneaCrossSection;
ED.CorneaCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CorneaCrossSection.prototype.setPropertyDefaults = function()
{
    this.isSelectable = false;
    this.isDeletable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorneaCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CorneaCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CorneaCrossSection.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    // Top cut away
    ctx.moveTo(60, -480);
    ctx.lineTo(-80, -480);
    
    // Front of cornea
    ctx.bezierCurveTo(-100, -440, -100, -440, -120, -380);
    ctx.bezierCurveTo(-240, -260, -320, -160, -320, 0);
    ctx.bezierCurveTo(-320, 160, -240, 260, -120, 380);
    ctx.bezierCurveTo(-100, 440, -100, 440, -80, 480);
    
    // Bottom cut away
    ctx.lineTo(60, 480);
    ctx.lineTo(0, 380);
    
    // Back of cornea
    ctx.bezierCurveTo(-80, 260, -220, 180, -220, 0);
    ctx.bezierCurveTo(-220, -180, -80, -260, 0, -380);

    // Close path
    ctx.closePath();
    
	// Set path attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(245, 245, 245, 0.5)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // Top sclera
        ctx.beginPath();
        ctx.moveTo(56, -478);
        ctx.lineTo(-78, -478);
        ctx.bezierCurveTo(-98, -440, -96, -440, -118, -378);
        ctx.lineTo(-4, -378);
        ctx.lineTo(56, -478);
        
        // Bottom scleral
        ctx.moveTo(56, 478);
        ctx.lineTo(-78, 478);
        ctx.bezierCurveTo(-98, 440, -96, 440, -118, 378);
        ctx.lineTo(-4, 378);
        ctx.closePath();
        
        ctx.fillStyle = "rgba(255,255,185,1)";
        ctx.fill();
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Lens
 *
 * @class Lens
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Lens = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Lens";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Lens.prototype = new ED.Doodle;
ED.Lens.prototype.constructor = ED.Lens;
ED.Lens.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Lens.prototype.setPropertyDefaults = function()
{
    this.isUnique = true;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Lens.prototype.setParameterDefaults = function()
{
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Lens.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Lens.superclass.draw.call(this, _point);
    
    // Height of cross section (half value of ro in AntSeg doodle)
    var ro = 240;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
    // Move to inner circle
    ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        var ri = ro - 60;
        
        // Edge of nucleus
        ctx.beginPath();
        ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);
        ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
        ctx.stroke();
	}
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Lens Cross Section
 *
 * @class LensCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.LensCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LensCrossSection";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LensCrossSection.prototype = new ED.Doodle;
ED.LensCrossSection.prototype.constructor = ED.LensCrossSection;
ED.LensCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.LensCrossSection.prototype.setPropertyDefaults = function()
{
    this.isUnique = true;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +200);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-380, +380);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LensCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LensCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LensCrossSection.superclass.draw.call(this, _point);

    // Height of cross section (half value of ro in AntSeg doodle)
    var h = 240;
    
    // Arbitrary radius of curvature
    var r = 300;
    
    // Displacement of lens from centre
    var ld = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Measurements of nucleus
    var rn = r - 60;
    
    // Calculate nucleus angles
    var phi = Math.acos(x/rn);
    
    // Lens
    ctx.beginPath();

    // Draw lens with two sections of circumference of circle
    ctx.arc(ld - x, 0, r, theta, -theta, true);
    ctx.arc(ld + x, 0, r, Math.PI + theta, Math.PI - theta, true);

    // Draw it
    ctx.stroke();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // Nucleus
        ctx.beginPath();
        ctx.moveTo(ld, rn * Math.sin(phi));
        ctx.arc(ld - x, 0, rn, phi, -phi, true);
        ctx.arc(ld + x, 0, rn, Math.PI + phi, Math.PI - phi, true);
        ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
        ctx.stroke();

        // Zonules
        ctx.beginPath();
        
        // Top zonules
        ctx.moveTo(44 - this.originX + 80, - this.originY -349);
        ctx.lineTo(64, -207);
        ctx.moveTo(44 - this.originX + 80, - this.originY -349);
        ctx.lineTo(138, -207);
        ctx.moveTo(44 - this.originX + 120, - this.originY -349);
        ctx.lineTo(64, -207);
        ctx.moveTo(44 - this.originX + 120, - this.originY -349);
        ctx.lineTo(138, -207);

        // Bottom zonules
        ctx.moveTo(44 - this.originX + 80, - this.originY + 349);
        ctx.lineTo(64, 207);
        ctx.moveTo(44 - this.originX + 80, - this.originY + 349);
        ctx.lineTo(138, 207);
        ctx.moveTo(44 - this.originX + 120, - this.originY + 349);
        ctx.lineTo(64, 207);
        ctx.moveTo(44 - this.originX + 120, - this.originY + 349);
        ctx.lineTo(138, 207);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
        ctx.stroke();
	}
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * PhakoIncision
 *
 * @class PhakoIncision
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PhakoIncision = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PhakoIncision";
    
    // Private parameters
    this.defaultRadius = 330;
    this.sutureSeparation = 1.5;
    this.apexYDelta = _radius + _apexY;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.incisionLength = (_arc * Math.PI/180) * (6 * _radius)/this.defaultRadius;
    this.incisionSite = 'Corneal';
    this.incisionType = 'Pocket';
    this.incisionMeridian = 0;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PhakoIncision.prototype = new ED.Doodle;
ED.PhakoIncision.prototype.constructor = ED.PhakoIncision;
ED.PhakoIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PhakoIncision.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PhakoIncision.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update validation array for simple parameters
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['incisionMeridian'] = {kind:'derived', type:'mod', range:new ED.Range(0, 360), clock:'bottom', animate:true};
    this.parameterValidationArray['incisionLength'] = {kind:'derived', type:'float', range:new ED.Range(1, 9.9), precision:1, animate:true};
    this.parameterValidationArray['incisionSite'] = {kind:'derived', type:'string', list:['Corneal', 'Limbal', 'Scleral'], animate:true};
    this.parameterValidationArray['incisionType'] = {kind:'derived', type:'string', list:['Pocket', 'Section'], animate:false};
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PhakoIncision.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('incisionSite', 'Corneal');
    this.setParameterFromString('incisionLength', '3.5');
    this.setParameterFromString('incisionType', 'Pocket');
    
    // Default is temporal side, or 90 degrees to the last one
//    var doodle = this.drawing.lastDoodleOfClass(this.className);
//    if (doodle)
//    {
//        if (this.drawing.eye == ED.eye.Right)
//        {
//            this.setParameterFromString('incisionMeridian', ED.Mod(doodle.incisionMeridian - 90, 360).toFixed(0));
//        }
//        else
//        {
//            this.setParameterFromString('incisionMeridian', ED.Mod(doodle.incisionMeridian + 90, 360).toFixed(0));
//        }
//    }
//    else
//    {
//        // First incision is usually temporal
//        if (this.drawing.eye == ED.eye.Right)
//        {
//            this.setParameterFromString('incisionMeridian', '180');
//        }
//        else
//        {
//            this.setParameterFromString('incisionMeridian', '0');
//        }
//    }
    this.setRotationWithDisplacements(90, -90);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PhakoIncision.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'rotation':
            var angle = (((Math.PI * 2 - _value + Math.PI/2) * 180/Math.PI) + 360) % 360;
            if (angle == 360) angle = 0;
            returnArray['incisionMeridian'] = angle;
            //  returnArray['arc'] = _value/2;
            break;
            
        case 'arc':
            returnArray['incisionLength'] = _value * (6 * this.radius)/this.defaultRadius;
            break;
            
        case 'radius':
            if (_value >= 428) returnArray['incisionSite'] = 'Scleral';
            else if (_value >= 344) returnArray['incisionSite'] = 'Limbal';
            else returnArray['incisionSite']  = 'Corneal';
            
            // Incision length should remain constant despite changes in radius
            returnArray['arc'] =  this.incisionLength * this.defaultRadius/(6 * _value);
            this.updateArcRange();
            
            // Move apexY as radius changes and adjust range
            returnArray['apexY'] = this.apexYDelta - _value;
            this.parameterValidationArray['apexY']['range'].setMinAndMax(-_value, -_value + 34);
            break;
            
        case 'apexY':
            returnArray['apexYDelta'] = this.radius + _value;
            returnArray['incisionType'] = this.radius + _value > 0?'Section':'Pocket';
            break;
            
        // Incision Meridian (CND 5.15)
        case 'incisionMeridian':
            returnArray['rotation'] = (((90 - _value) + 360) % 360) * Math.PI/180;
            // Example of animating two simple parameters simultaneously
            //returnArray['arc'] = (1 + _value/90) * Math.PI/12;
            break;
            
        // Incision length (CND 5.14)
        case 'incisionLength':
            returnArray['arc'] = _value * this.defaultRadius/(6 * this.radius);
            this.updateArcRange();
            break;
            
        // Incision site (CND 5.13)
        case 'incisionSite':
            switch (_value)
            {
                case 'Scleral':
                    returnArray['radius'] = +428;
                    break;
                case 'Limbal':
                    returnArray['radius'] = +376;
                    break;
                case 'Corneal':
                    returnArray['radius'] = +330;
                    break;
            }
            break;
            
        case 'incisionType':
            switch (_value)
            {
                case 'Pocket':
                    returnArray['apexYDelta'] = +0;
                    returnArray['apexY'] = -this.radius;
                    break;
                case 'Section':
                    returnArray['apexYDelta'] = +34;
                    returnArray['apexY'] = +34 - this.radius;
                    break;
            }
    }
    
    return returnArray;
}

/**
 * Private method to update range of arc parameter to account for values changing with radius and incisionSite
 */
ED.PhakoIncision.prototype.updateArcRange = function()
{
    if (this.radius > 0)
    {
        this.parameterValidationArray['arc']['range'].min = this.parameterValidationArray['incisionLength']['range'].min * this.defaultRadius/(6 * this.radius);
        this.parameterValidationArray['arc']['range'].max = this.parameterValidationArray['incisionLength']['range'].max * this.defaultRadius/(6 * this.radius);
    }
    else
    {
        ED.errorHandler('ED.PhakoIncision', 'updateArcRange', 'Attempt to calculate a range of arc using an illegal value of radius: ' + this.radius);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PhakoIncision.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PhakoIncision.superclass.draw.call(this, _point);
	
    // Radii
    var r =  this.radius;
    var d = 40;
    var ro = r + d;
    var ri = r - d;
    
    // Boundary path
	ctx.beginPath();
    
    // Half angle of arc
    var theta = this.arc/2;
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Pocket
    if (this.apexYDelta == 0)
    {
        // Colour of fill
        ctx.fillStyle = "rgba(200,200,200,0.75)";

        // Set line attributes
        ctx.lineWidth = 4;
        
        // Colour of outer line is dark gray
        ctx.strokeStyle = "rgba(120,120,120,0.75)";
    }
    // Section with sutures
    else
    {
        // Colour of fill
        ctx.fillStyle = "rgba(200,200,200,0)";
        
        // Set line attributes
        ctx.lineWidth = 4;
        
        // Colour of outer line is dark gray
        ctx.strokeStyle = "rgba(120,120,120,0)";
    }
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // Section with sutures
        if (this.apexYDelta != 0)
        {
            // New path
            ctx.beginPath();
            
            // Arc across
            ctx.arc(0, 0, r, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
            
            // Sutures
            var sutureSeparationAngle = this.sutureSeparation * this.defaultRadius/(6 * this.radius);
            var p = new ED.Point(0, 0);
            var phi = theta - sutureSeparationAngle/2;
            
            do
            {
                p.setWithPolars(r - d, phi);
                ctx.moveTo(p.x, p.y);
                p.setWithPolars(r + d, phi);
                ctx.lineTo(p.x, p.y);
                
                phi = phi - sutureSeparationAngle;
            } while(phi > -theta);
            
            // Set line attributes
            ctx.lineWidth = 4;
            
            // Colour of outer line is dark gray
            ctx.strokeStyle = "rgba(120,120,120,0.75)";
            
            // Draw incision
            ctx.stroke();
        }
        
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, theta);
	this.handleArray[3].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PhakoIncision.prototype.description = function()
{
    var returnString = "";
    
    // Incision site
    if (this.radius > 428) returnString = 'Scleral ';
    else if (this.radius > 344) returnString = 'Limbal ';
    else returnString = 'Corneal ';
    
    // Incision type
    returnString += this.apexY + this.radius == 0?"pocket ":"section "
    returnString += "incision at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * SidePort
 *
 * @class SidePort
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.SidePort = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SidePort";
    
    // Private parameters
    this.incisionLength = 1.5;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SidePort.prototype = new ED.Doodle;
ED.SidePort.prototype.constructor = ED.SidePort;
ED.SidePort.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.SidePort.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
    this.parameterValidationArray['arc']['range'].setMinAndMax(0, Math.PI);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.SidePort.prototype.setParameterDefaults = function()
{
    // Incision length based on an average corneal radius of 6mm
    this.arc = this.incisionLength/6;

    this.setRotationWithDisplacements(90, 180);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SidePort.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SidePort.superclass.draw.call(this, _point);
	
    // Radius
    var r =  334;
    var d = 30;
    var ro = r + d;
    var ri = r - d;
    
    // Boundary path
	ctx.beginPath();
    
    // Half angle of arc
    var theta = this.arc/2;
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(200,200,200,0.75)";
    
    // Set line attributes
    ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SidePort.prototype.groupDescription = function()
{
	return "Sideport at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SidePort.prototype.description = function()
{
    return this.clockHour();
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SidePort.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * A cortical cataract
 *
 * @class CorticalCataract
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CorticalCataract = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CorticalCataract";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CorticalCataract.prototype = new ED.Doodle;
ED.CorticalCataract.prototype.constructor = ED.CorticalCataract;
ED.CorticalCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CorticalCataract.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CorticalCataract.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "Lens";
    this.inFrontOfClassArray = ["Lens", "PostSubcapCataract", "NuclearCataract"];

    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'White'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorticalCataract.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CorticalCataract.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -120) returnArray['grade'] = 'Mild';
            else if (_value < -60) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'White';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -180;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -100;
                    break;
                case 'White':
                    returnArray['apexY'] = -20;
                    break;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CorticalCataract.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CorticalCataract.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Parameters
    var n = 16;									// Number of cortical spokes
    var ro = 240;								// Outer radius of cataract
    var rs = 230;                               // Outer radius of spoke
    var theta = 2 * Math.PI/n;                  // Angle of outer arc of cortical shard
    var phi = theta/2;                          // Half theta
    var ri = -this.apexY;                       // Radius of inner clear area
    
    // Draw cortical spokes
    var sp = new ED.Point(0,0);
    sp.setWithPolars(rs, - phi);
    ctx.moveTo(sp.x, sp.y);

    for (var i = 0; i < n; i++)
    {
        var startAngle = i * theta - phi;
        var endAngle = startAngle + theta;

        var op = new ED.Point(0,0);
        op.setWithPolars(rs, startAngle);
        ctx.lineTo(op.x, op.y);
        
        //ctx.arc(0, 0, ro, startAngle, endAngle, false);
        var ip = new ED.Point(0, 0);
        ip.setWithPolars(ri, i * theta);
        ctx.lineTo(ip.x, ip.y);
    }
    
    ctx.lineTo(sp.x, sp.y);

    // Surrounding ring
    ctx.moveTo(ro, 0);
    ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
	
	// Set boundary path attributes
	ctx.lineWidth = 4;
    ctx.lineJoin = 'bevel';
    ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "rgba(200,200,200,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CorticalCataract.prototype.description = function()
{
	return this.getParameter('grade') + " cortical cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CorticalCataract.prototype.snomedCode = function()
{
	return 193576003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CorticalCataract.prototype.diagnosticHierarchy = function()
{
	return 3;
}

/**
 * Cortical Cataract Cross Section
 *
 * @class CorticalCataractCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CorticalCataractCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CorticalCataractCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CorticalCataractCrossSection.prototype = new ED.Doodle;
ED.CorticalCataractCrossSection.prototype.constructor = ED.CorticalCataractCrossSection;
ED.CorticalCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CorticalCataractCrossSection.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.CorticalCataractCrossSection.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "LensCrossSection";
    this.inFrontOfClassArray = ["LensCrossSection", "NuclearCataractCrossSection"];
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'White'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CorticalCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CorticalCataractCrossSection.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -120) returnArray['grade'] = 'Mild';
            else if (_value < -60) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'White';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -180;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -100;
                    break;
                case 'White':
                    returnArray['apexY'] = -20;
                    break;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CorticalCataractCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CorticalCataractCrossSection.superclass.draw.call(this, _point);
	
	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;
    
    // Radius of curvature of lens
    var r = 300;
    
    // Displacement lens from centre
    var ld = 100;
    
    // Thickness of lens
    //var lt = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);

    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Radius of cortical cataract (half way between capsule and nucleus)
    var rco = r - 30;

    // Calculate nucleus angles
    theta = Math.acos(x/rco);
    
    // Calculate cataract angles
    var phi = Math.asin(-this.apexY/rco);
    
    // Boundary path
	ctx.beginPath();
    
    // Draw cataract with two sections of circumference of circle
    ctx.arc(ld - x, 0, rco, phi, theta, false);
    ctx.arc(ld + x, 0, rco, Math.PI - theta, Math.PI - phi, false);
    
    // Move to upper half and draw it
    var l = rco * Math.cos(phi);
    ctx.moveTo(ld - x + l, this.apexY);
    ctx.arc(ld - x, 0, rco, -phi, -theta, true);
    ctx.arc(ld + x, 0, rco, Math.PI + theta, Math.PI + phi, true);
    
	// Set line attributes
	ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(200,200,200,0.75)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(ld, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Nuclear cataract
 *
 * @class NuclearCataract
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.NuclearCataract = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "NuclearCataract";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.NuclearCataract.prototype = new ED.Doodle;
ED.NuclearCataract.prototype.constructor = ED.NuclearCataract;
ED.NuclearCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NuclearCataract.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NuclearCataract.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    //this.parentClass = "Lens";
    //this.inFrontOfClassArray = ["Lens", "PostSubcapCataract"];
    this.addAtBack = true;
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-120, +0);
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'Brunescent'], animate:true};
}

/**
 * Sets default parameters
 */
ED.NuclearCataract.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.NuclearCataract.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -80) returnArray['grade'] = 'Mild';
            else if (_value < -40) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'Brunescent';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -120;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -80;
                    break;
                case 'Brunescent':
                    returnArray['apexY'] = +0;
                    break;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.NuclearCataract.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.NuclearCataract.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// NuclearCataract
    ctx.arc(0, 0, 200, 0, Math.PI * 2, true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
    
    // Colors for gradient
    yellowColour = "rgba(255, 255, 0, 0.75)";
    var brownColour = "rgba(" + Math.round(120 - this.apexY) + ", " + Math.round(60 - this.apexY) + ", 0, 0.75)";
    
    // Radial gradient
    var gradient = ctx.createRadialGradient(0, 0, 210, 0, 0, 50);
    gradient.addColorStop(0, yellowColour);
    gradient.addColorStop(1, brownColour);
    
	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.NuclearCataract.prototype.description = function()
{
	return this.getParameter('grade') + " nuclear cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.NuclearCataract.prototype.snomedCode = function()
{
	return 53889007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.NuclearCataract.prototype.diagnosticHierarchy = function()
{
	return 3;
}

/**
 * Nuclear Cataract Cross Section
 *
 * @class NuclearCataractCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.NuclearCataractCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "NuclearCataractCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.NuclearCataractCrossSection.prototype = new ED.Doodle;
ED.NuclearCataractCrossSection.prototype.constructor = ED.NuclearCataractCrossSection;
ED.NuclearCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NuclearCataractCrossSection.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NuclearCataractCrossSection.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "LensCrossSection";
    this.inFrontOfClassArray = ["LensCrossSection", "NuclearCataractCrossSection"];
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+100, +100);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Mild', 'Moderate', 'Brunescent'], animate:true};
}

/**
 * Sets default parameters
 */
ED.NuclearCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.apexX = 100;
    this.originX = 44;
    this.setParameterFromString('grade', 'Mild');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.NuclearCataractCrossSection.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -80) returnArray['grade'] = 'Mild';
            else if (_value < -40) returnArray['grade'] = 'Moderate';
            else returnArray['grade'] = 'Brunescent';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Mild':
                    returnArray['apexY'] = -120;
                    break;
                case 'Moderate':
                    returnArray['apexY'] = -80;
                    break;
                case 'Brunescent':
                    returnArray['apexY'] = +0;
                    break;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.NuclearCataractCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.NuclearCataractCrossSection.superclass.draw.call(this, _point);
    
    // Height of cross section (half value of ro in AntSeg doodle)
    var h = 240;
    
    // Arbitrary radius of curvature corresponding to nucleus in Lens subclass
    var r = 300;
    
    // Displacement of lens from centre
    var ld = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Measurements of nucleus
    var rn = r - 60;
    
    // Calculate nucleus angles
    var phi = Math.acos(x/rn);
    
    // Lens
    ctx.beginPath();
    
    // Draw lens with two sections of circumference of circle
    ctx.arc(ld - x, 0, rn, phi, -phi, true);
    ctx.arc(ld + x, 0, rn, Math.PI + phi, Math.PI - phi, true);
    
    // Draw it
    ctx.stroke();
    
	// Set line attributes
	ctx.lineWidth = 0;
    
    // Colors for gradient
    yellowColour = "rgba(255, 255, 0, 0.75)";
    var brownColour = "rgba(" + Math.round(120 - this.apexY) + ", " + Math.round(60 - this.apexY) + ", 0, 0.75)";
    
    // Radial gradient
    var gradient = ctx.createRadialGradient(ld, 0, 210, ld, 0, 50);
    gradient.addColorStop(0, yellowColour);
    gradient.addColorStop(1, brownColour);
    
	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}


/**
 * Posterior subcapsular cataract
 *
 * @class PostSubcapCataract
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PostSubcapCataract = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PostSubcapCataract";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PostSubcapCataract.prototype = new ED.Doodle;
ED.PostSubcapCataract.prototype.constructor = ED.PostSubcapCataract;
ED.PostSubcapCataract.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostSubcapCataract.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PostSubcapCataract.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "Lens";
    this.inFrontOfClassArray = ["Lens"];
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+35, +100);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, -35);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostSubcapCataract.prototype.setParameterDefaults = function()
{
    this.apexX = 35;
    this.apexY = 35;
    this.radius = 50;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PostSubcapCataract.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexX':
            returnArray['radius'] = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
            break;
            
        case 'apexY':
            returnArray['radius'] = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostSubcapCataract.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PostSubcapCataract.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// PostSubcapCataract
	ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    
    // create pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['PSCPattern'],'repeat');
    ctx.fillStyle = ptrn;
    
	ctx.strokeStyle = "lightgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(this.radius, Math.PI/4);
	this.handleArray[4].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PostSubcapCataract.prototype.description = function()
{
	return "Posterior subcapsular cataract";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.PostSubcapCataract.prototype.snomedCode = function()
{
	return 315353005;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.PostSubcapCataract.prototype.diagnosticHierarchy = function()
{
	return 3;
}

/**
 * Cortical Cataract Cross Section
 *
 * @class PostSubcapCataractCrossSection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PostSubcapCataractCrossSection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PostSubcapCataractCrossSection";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Mild';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PostSubcapCataractCrossSection.prototype = new ED.Doodle;
ED.PostSubcapCataractCrossSection.prototype.constructor = ED.PostSubcapCataractCrossSection;
ED.PostSubcapCataractCrossSection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostSubcapCataractCrossSection.prototype.setHandles = function()
{
	//this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PostSubcapCataractCrossSection.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.parentClass = "LensCrossSection";
    this.inFrontOfClassArray = ["LensCrossSection"];
    
    // Update validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-180, -20);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostSubcapCataractCrossSection.prototype.setParameterDefaults = function()
{
    this.originX = 44;
    this.apexY = -35;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostSubcapCataractCrossSection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PostSubcapCataractCrossSection.superclass.draw.call(this, _point);
	
	// Height of cross section (half value of ro in AntSeg doodle)
	var h = 240;
    
    // Radius of curvature of lens
    var r = 300;
    
    // Displacement lens from centre
    var ld = 100;
    
    // Angle of arc
    var theta = Math.asin(h/r);
    
    // X coordinate of centre of circle
    var x = r * Math.cos(theta);
    
    // Radius of cataract (Just inside capsule)
    var rco = r - 10;
    
    // Calculate nucleus angles
    theta = Math.acos(x/rco);
    
    // Calculate cataract angles
    var phi = Math.asin(-this.apexY/rco);
    
    // Boundary path
	ctx.beginPath();
    
    // Draw cataract with two sections of circumference of circle
    ctx.arc(ld - x, 0, rco, -phi, phi, false);
    
	// Set line attributes
	ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(150,150,150,0.75)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
	}
    
    // Coordinates of handles (in canvas plane)
	//this.handleArray[4].location = this.transform.transformPoint(new ED.Point(ld, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Trial Frame
 *
 * @class TrialFrame
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.TrialFrame = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "TrialFrame";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TrialFrame.prototype = new ED.Doodle;
ED.TrialFrame.prototype.constructor = ED.TrialFrame;
ED.TrialFrame.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.TrialFrame.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isDeletable = false;
    this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrialFrame.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.TrialFrame.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Settings
    var ro = 420;
    var rt = 340;
    var ri = 300;
    var d = 20;
    var height = 50;
    
    // Angles, phi gives a little extra at both ends of the frame
    var phi = -Math.PI/20;
	var arcStart = 0 + phi;
	var arcEnd = Math.PI - phi;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across
	ctx.arc(0, 0, ro, arcStart, arcEnd, false);
    
	// Arc back
	ctx.arc(0, 0, ri, arcEnd, arcStart, true);
    
    ctx.closePath();
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(230,230,230,1)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Set font and colour
        ctx.font = height + "px sans-serif";
        ctx.fillStyle = "blue";
        
        ctx.beginPath();
        
        var theta = 0;
        
        // Points for each line
        var pi = new ED.Point(0,0);
        var pj = new ED.Point(0,0);
        var pt = new ED.Point(0,0);
        var po = new ED.Point(0,0);
        var pp = new ED.Point(0,0);
        
        for (var i = 0; i < 19; i++)
        {
            var text = i.toFixed(0);
            theta = (-90 - i * 10) * Math.PI/180;
            
            pi.setWithPolars(ri, theta);
            pj.setWithPolars(ri + d, theta);
            pt.setWithPolars(rt, theta);
            pp.setWithPolars(ro - d, theta);
            po.setWithPolars(ro, theta);
            
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.moveTo(pp.x, pp.y);
            ctx.lineTo(po.x, po.y);
            
            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(Math.PI + theta);
            ctx.textAlign = "center";
            ctx.fillText(text, 0, 80/2);
            ctx.restore();
        }
        
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 20);
        
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * TrialLens
 *
 * @class TrialLens
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.TrialLens = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "TrialLens";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.axis = '0';
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TrialLens.prototype = new ED.Doodle;
ED.TrialLens.prototype.constructor = ED.TrialLens;
ED.TrialLens.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.TrialLens.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
    this.isShowHighlight = false;
	this.isMoveable = false;
    this.addAtBack = true;
    this.isUnique = true;
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['axis'] = {kind:'derived', type:'mod', range:new ED.Range(0, 180), clock:'bottom', animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.TrialLens.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('axis', '0');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.TrialLens.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'rotation':
            returnArray['axis'] = (360 - 180 * _value/Math.PI) % 180;
            break;
            
        case 'axis':
            returnArray['rotation'] = (180 - _value) * Math.PI/180;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrialLens.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.TrialLens.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 360;
    var ri = 180;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
    // Move to start of next arc
    ctx.moveTo(ri, 0);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,100,100,1)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        var d = 20;
        ctx.beginPath();
        ctx.moveTo(ro - d,0);
        ctx.lineTo(ri + d,0);
        ctx.moveTo(-ro + d,0);
        ctx.lineTo(-ri - d,0);
        
        ctx.lineWidth = 16;
        ctx.strokeStyle = "black";
        ctx.stroke();
	}
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Posterior chamber IOL
 *
 * @class PCIOL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PCIOL = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PCIOL";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PCIOL.prototype = new ED.Doodle;
ED.PCIOL.prototype.constructor = ED.PCIOL;
ED.PCIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PCIOL.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.PCIOL.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
	this.isScaleable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.PCIOL.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.75;
    this.scaleY = 0.75;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PCIOL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PCIOL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radius of IOL optic
    var r = 240;
    
    // Draw optic
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
    // Draw upper haptic
    ctx.moveTo(150, -190);
    ctx.bezierCurveTo(160, -200, 190, -350, 160, -380);
    ctx.bezierCurveTo(90, -440, -150, -410, -220, -370);
    ctx.bezierCurveTo(-250, -350, -260, -400, -200, -430);
    ctx.bezierCurveTo(-110, -480, 130, -470, 200, -430);
    ctx.bezierCurveTo(270, -390, 220, -140, 220, -100);
    
    // Draw lower haptic
    ctx.moveTo(-150, 190);
    ctx.bezierCurveTo(-160, 200, -190, 350, -160, 380);
    ctx.bezierCurveTo(-90, 440, 150, 410, 220, 370);
    ctx.bezierCurveTo(250, 350, 260, 400, 200, 430);
    ctx.bezierCurveTo(110, 480, -130, 470, -200, 430);
    ctx.bezierCurveTo(-270, 390, -220, 140, -220, 100);
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PCIOL.prototype.description = function()
{
    var returnValue = "Posterior chamber IOL";
    
    // Displacement limit
    var limit = 40;
    
    var displacementValue = "";
    
    if (this.originY < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " superiorly";
    }
    if (this.originY > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " inferiorly";
    }
    if (this.originX < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" temporally":" nasally";
    }
    if (this.originX > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" nasally":" temporally";
    }
    
    // Add displacement description
    if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;
    
	return returnValue;
}

/**
 * Toric Posterior chamber IOL
 *
 * @class ToricPCIOL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ToricPCIOL = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ToricPCIOL";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ToricPCIOL.prototype = new ED.Doodle;
ED.ToricPCIOL.prototype.constructor = ED.ToricPCIOL;
ED.ToricPCIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ToricPCIOL.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.ToricPCIOL.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
	this.isOrientated = false;
	this.isScaleable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.ToricPCIOL.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.75;
    this.scaleY = 0.75;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ToricPCIOL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ToricPCIOL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radius of IOL optic
    var r = 240;
    
    // Draw optic
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
    // Draw upper haptic
    ctx.moveTo(150, -190);
    ctx.bezierCurveTo(160, -200, 190, -350, 160, -380);
    ctx.bezierCurveTo(90, -440, -150, -410, -220, -370);
    ctx.bezierCurveTo(-250, -350, -260, -400, -200, -430);
    ctx.bezierCurveTo(-110, -480, 130, -470, 200, -430);
    ctx.bezierCurveTo(270, -390, 220, -140, 220, -100);
    
    // Draw lower haptic
    ctx.moveTo(-150, 190);
    ctx.bezierCurveTo(-160, 200, -190, 350, -160, 380);
    ctx.bezierCurveTo(-90, 440, 150, 410, 220, 370);
    ctx.bezierCurveTo(250, 350, 260, 400, 200, 430);
    ctx.bezierCurveTo(110, 480, -130, 470, -200, 430);
    ctx.bezierCurveTo(-270, 390, -220, 140, -220, 100);
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Lines for toric IOL
        ctx.beginPath();
        
        // Create points
        var phi = 0.7 * Math.PI/4;
        var theta = phi + Math.PI;
        var p1 = new ED.Point(0, 0)
        p1.setWithPolars(r - 20, phi);
        var p2 = new ED.Point(0, 0);
        p2.setWithPolars(r - 100, phi);
        var p3 = new ED.Point(0, 0)
        p3.setWithPolars(r - 20, theta);
        var p4 = new ED.Point(0, 0);
        p4.setWithPolars(r - 100, theta);
        
        // Create lines
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        
        // Set line attributes
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.strokeStyle = "darkgray";
        
        // Draw lines
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ToricPCIOL.prototype.description = function()
{
    var returnValue = "Toric posterior chamber IOL";
    
    // Displacement limit
    var limit = 40;
    
    // ***TODO*** ensure description takes account of side of eye
    var displacementValue = "";
    
    if (this.originY < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " superiorly";
    }
    if (this.originY > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " inferiorly";
    }
    if (this.originX < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " temporally";
    }
    if (this.originX > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " nasally";
    }
    
    // Add displacement description
    if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;
    
	return returnValue;
}

/**
 * Anterior chamber IOL
 *
 * @class ACIOL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ACIOL = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ACIOL";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ACIOL.prototype = new ED.Doodle;
ED.ACIOL.prototype.constructor = ED.ACIOL;
ED.ACIOL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ACIOL.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default properties
 */
ED.ACIOL.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.ACIOL.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.8;
    this.scaleY = 0.8;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ACIOL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ACIOL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radius of IOL optic
    var r = 240;
    
    // Draw optic
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
    // Draw upper haptic (see ACIOL.c4D for bezier points)
    ctx.moveTo(150, -190);
    ctx.bezierCurveTo(160, -200, 170, -210, 160, -230);
    ctx.bezierCurveTo(150, -250, 100, -280, 50, -290);
    ctx.bezierCurveTo(0, -300, -220, -330, -230, -340);
    ctx.bezierCurveTo(-250, -360, -220, -420, -200, -430);
    ctx.bezierCurveTo(-180, -440, -180, -440, -150, -450);
    ctx.bezierCurveTo(-120, -460, -130, -430, -120, -420);
    ctx.bezierCurveTo(-110, -410, 110, -410, 120, -420);
    ctx.bezierCurveTo(130, -430, 120, -460, 150, -450);
    ctx.bezierCurveTo(180, -440, 180, -440, 200, -430);
    ctx.bezierCurveTo(220, -420, 180, -400, 150, -390);
    ctx.bezierCurveTo(120, -380, -120, -380, -150, -390);
    ctx.bezierCurveTo(-180, -400, -190, -370, -170, -360);
    ctx.bezierCurveTo(-150, -350, 20, -330, 70, -320);
    ctx.bezierCurveTo(120, -310, 190, -280, 210, -250);
    ctx.bezierCurveTo(230, -220, 220, -140, 220, -100);
    
    // Draw lower haptic
    ctx.moveTo(-150, 190);
    ctx.bezierCurveTo(-160, 200, -170, 210, -160, 230);
    ctx.bezierCurveTo(-150, 250, -100, 280, -50, 290);
    ctx.bezierCurveTo(0, 300, 220, 330, 230, 340);
    ctx.bezierCurveTo(250, 360, 220, 420, 200, 430);
    ctx.bezierCurveTo(180, 440, 180, 440, 150, 450);
    ctx.bezierCurveTo(120, 460, 130, 430, 120, 420);
    ctx.bezierCurveTo(110, 410, -110, 410, -120, 420);
    ctx.bezierCurveTo(-130, 430, -120, 460, -150, 450);
    ctx.bezierCurveTo(-180, 440, -180, 440, -200, 430);
    ctx.bezierCurveTo(-220, 420, -180, 400, -150, 390);
    ctx.bezierCurveTo(-120, 380, 120, 380, 150, 390);
    ctx.bezierCurveTo(180, 400, 190, 370, 170, 360);
    ctx.bezierCurveTo(150, 350, -20, 330, -70, 320);
    ctx.bezierCurveTo(-120, 310, -190, 280, -210, 250);
    ctx.bezierCurveTo(-230, 220, -220, 140, -220, 100);
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ACIOL.prototype.description = function()
{
    var returnValue = "Anterior chamber IOL";
    
    // Displacement limit
    var limit = 40;
    
    var displacementValue = "";
    
    if (this.originY < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " superiorly";
    }
    if (this.originY > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += " inferiorly";
    }
    if (this.originX < -limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" temporally":" nasally";
    }
    if (this.originX > limit)
    {
        if (displacementValue.length > 0) displacementValue += " and";
        displacementValue += (this.drawing.eye == ED.eye.Right)?" nasally":" temporally";
    }
    
    // Add displacement description
    if (displacementValue.length > 0) returnValue += " displaced" + displacementValue;
    
	return returnValue;
}

/**
 * Bleb
 *
 * @class Bleb
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Bleb = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Bleb";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Bleb.prototype = new ED.Doodle;
ED.Bleb.prototype.constructor = ED.Bleb;
ED.Bleb.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Bleb.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.Bleb.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(30,30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Bleb.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Bleb.superclass.draw.call(this, _point);
    
    // Base radius
    var r = 384;
	
	// Boundary path
	ctx.beginPath();
    
    // Draw limbal base
    var phi = Math.PI/12;
    ctx.arc(0, 0, r, -phi - Math.PI/2, phi - Math.PI/2, false);
    ctx.lineTo(r/4, -r * 1.25);
    ctx.lineTo(-r/4, -r * 1.25);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(240,240,240,0.9)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(-40, -r);
        ctx.lineTo(-40, -r * 1.15);
        ctx.lineTo(40, -r * 1.15);
        ctx.lineTo(40, -r);
        ctx.stroke();
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Bleb.prototype.description = function()
{
    return "Trabeculectomy bleb at " + this.clockHour() + " o'clock";;
}

/**
 * Peripheral iridectomy
 *
 * @class PI
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PI = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PI";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PI.prototype = new ED.Doodle;
ED.PI.prototype.constructor = ED.PI;
ED.PI.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.PI.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.PI.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(30,30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PI.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PI.superclass.draw.call(this, _point);
    
    // Outer radiuss
    var r = 360;
	
	// Boundary path
	ctx.beginPath();
    
    // Draw base
    var phi = Math.PI/24;
    ctx.arc(0, 0, r, - phi - Math.PI/2, phi - Math.PI/2, false);
    ctx.lineTo(0, -r * 0.8);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(218,230,241,1)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PI.prototype.description = function()
{
    return "Peripheral iridectomy at " + this.clockHour() + " o'clock";
}


/**
 * Radial keratotomy
 *
 * @class RK
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.RK = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RK";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RK.prototype = new ED.Doodle;
ED.RK.prototype.constructor = ED.RK;
ED.RK.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RK.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.RK.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isUnique;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.15);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.15);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -60);
}

/**
 * Sets default parameters
 */
ED.RK.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RK.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RK.superclass.draw.call(this, _point);
    
	// RK number and size
    var ro = 320;
    var ri = -this.apexY;
    var n = 8;
	
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
    // Move to inner circle
    ctx.moveTo(ri, 0);
    
	// Arc back the other way
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill pattern
    ctx.fillStyle = "rgba(155,255,255,0)";
    
    // Transparent stroke
    ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        var theta = 2 * Math.PI/n;	// Angle between radii
        ctx.strokeStyle = "rgba(100,100,100,0.7)";
        
        // Draw radii spokes
        ctx.beginPath();
        var i;
        for (i = 0; i < n; i++)
        {
            var angle = i * theta;
            var pi = new ED.Point(0, 0);
            pi.setWithPolars(ri, angle);
            var po = new ED.Point(0, 0);
            po.setWithPolars(ro, angle);
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(po.x, po.y);
            ctx.closePath();
        }
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RK.prototype.description = function()
{
    return "Radial keratotomy";
}

/**
 * Fuch's endothelial Dystrophy
 *
 * @class Fuchs
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Fuchs = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Fuchs";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Fuchs.prototype = new ED.Doodle;
ED.Fuchs.prototype.constructor = ED.Fuchs;
ED.Fuchs.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Fuchs.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.Fuchs.prototype.setPropertyDefaults = function()
{
	this.isRotatable = false;
    this.isSqueezable = true;
    this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Fuchs.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Fuchs.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// Fuchs
    var r = 300;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['FuchsPattern'],'repeat');
    ctx.fillStyle = ptrn;
    
    // Transparent stroke
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Fuchs.prototype.description = function()
{
    return "Fuch's Endothelial Dystrophy";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Fuchs.prototype.snomedCode = function()
{
	return 193839007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Fuchs.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * Lasik Flap
 *
 * @class LasikFlap
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.LasikFlap = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LasikFlap";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LasikFlap.prototype = new ED.Doodle;
ED.LasikFlap.prototype.constructor = ED.LasikFlap;
ED.LasikFlap.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LasikFlap.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.LasikFlap.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.75, +1.15);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.75, +1.15);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -60);
}

/**
 * Sets default parameters
 */
ED.LasikFlap.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LasikFlap.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LasikFlap.superclass.draw.call(this, _point);
    
	// LasikFlap
    var r = 320;
	
	// Calculate parameters for arc
    var angle = Math.PI/6;
	var arcStart = -Math.PI/2 - angle;
	var arcEnd = -Math.PI/2 + angle;
    
	// Boundary path
	ctx.beginPath();
    
	// Do an arc
	ctx.arc(0, 0, r, arcStart, arcEnd, true);
    
	// Close path to produce straight line
	ctx.closePath();
    
    // Create transparent fill pattern
    ctx.fillStyle = "rgba(155,255,255,0)";
    
    // Transparent stroke
    ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0.9)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0)
    point.setWithPolars(r, angle);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.LasikFlap.prototype.description = function()
{
    var returnString = "";
    
    // Get side
    if(this.drawing.eye == ED.eye.Right)
	{
		var isRightSide = true;
	}
	else
	{
		var isRightSide = false;
	}
    
	// Use trigonometry on rotation field to determine quadrant ***TODO*** push function up to superclass
    var c = Math.cos(this.rotation);
    var s = Math.sin(this.rotation);
    var ac = Math.abs(c);
    var as = Math.abs(s);
    
    var quadrant = "";
    if (s > c && as > ac) quadrant = isRightSide?"nasal":"temporal";
    if (s > c && as < ac) quadrant = "inferior";
    if (s < c && as > ac) quadrant = isRightSide?"temporal":"nasal";
    if (s < c && as < ac) quadrant = "superior";
    
	returnString = "LASIK flap with " + quadrant + " hinge";
    
	return returnString;
}

/**
 * Corneal scar
 *
 * @class CornealScar
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CornealScar = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealScar";
    
    // Doodle specific property
    this.isInVisualAxis = false;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealScar.prototype = new ED.Doodle;
ED.CornealScar.prototype.constructor = ED.CornealScar;
ED.CornealScar.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealScar.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealScar.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, -10);
}

/**
 * Sets default parameters
 */
ED.CornealScar.prototype.setParameterDefaults = function()
{
    this.apexY = -50;
    this.scaleX = 0.7;
    this.scaleY = 0.5;
    
    this.setOriginWithDisplacements(0,25);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealScar.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealScar.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealScar
    var r = 100;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    var alpha = -this.apexY/100;
    ctx.fillStyle = "rgba(100,100,100," + alpha.toFixed(2) + ")";
    
    // Transparent stroke
	ctx.strokeStyle = "rgba(100,100,100,0.9)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Work out whether visual axis is involved
        var centre = new ED.Point(0,0);
        var visualAxis = this.drawing.transform.transformPoint(centre);
        var ctx = this.drawing.context;
        if (ctx.isPointInPath(visualAxis.x,visualAxis.y)) this.isInVisualAxis = true;
        else this.isInVisualAxis = false;
	}
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealScar.prototype.description = function()
{
    var returnString = "";
    
    // Calculate size
    var averageScale = this.scaleX + this.scaleY;
    
    // Arbitrary cutoffs
    if (averageScale < 2) returnString = "Small ";
    else if (averageScale < 4) returnString = "Medium ";
    else returnString = "Large ";
    
    returnString += "corneal scar";
    
    if (this.isInVisualAxis) returnString += " involving visual axis";
    
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CornealScar.prototype.snomedCode = function()
{
	return 95726001;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CornealScar.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * IrisHook
 *
 * @class IrisHook
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.IrisHook = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
    // Set classname
	this.className = "IrisHook";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.IrisHook.prototype = new ED.Doodle;
ED.IrisHook.prototype.constructor = ED.IrisHook;
ED.IrisHook.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.IrisHook.prototype.setPropertyDefaults = function()
{
    this.isMoveable = false;
	this.isScaleable = false;
}

/**
 * Sets default parameters
 */
ED.IrisHook.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(45, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IrisHook.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.IrisHook.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Length to inner iris
    var length = 260;
    
    // If iris there, take account of pupil size
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) length = -doodle.apexY;
    
    ctx.rect(-25, -440, 50, 180 + length);
    
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line
    ctx.strokeStyle = "rgba(120,120,120,0.0)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Drawing path
        ctx.beginPath();
        
        // Stem
        ctx.moveTo(10, -430);
        ctx.lineTo(10, -length + 10);
        ctx.lineTo(-10, -length);
        ctx.lineWidth = 12;
        ctx.strokeStyle = "rgba(120,120,120,0.75)";
        ctx.stroke();
        
        // Stopper
        ctx.beginPath();
        ctx.moveTo(-20, -400);
        ctx.lineTo(+40, -400);
        ctx.lineWidth = 24;
        ctx.strokeStyle = "rgba(255,120,0,0.75)";
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.IrisHook.prototype.groupDescription = function()
{
	return "Iris hooks used at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IrisHook.prototype.description = function()
{
    var returnString = "";
    
    returnString += this.clockHour();
    
	return returnString;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IrisHook.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * MattressSuture
 *
 * @class MattressSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.MattressSuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
    // Set classname
	this.className = "MattressSuture";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MattressSuture.prototype = new ED.Doodle;
ED.MattressSuture.prototype.constructor = ED.MattressSuture;
ED.MattressSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.MattressSuture.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.MattressSuture.prototype.setParameterDefaults = function()
{
    this.radius = 374;
    this.setRotationWithDisplacements(10, 20);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MattressSuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MattressSuture.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    var r =  this.radius;
    ctx.rect(-40, -(r + 40), 80, 80);
    
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0.0)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(-40, -(r + 40));
        ctx.lineTo(40, -(r + 40));
        ctx.lineTo(-40, -(r - 40));
        ctx.lineTo(40, -(r - 40));
        ctx.lineTo(-40, -(r + 40));
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,120,0.7)";
        ctx.closePath();
        
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.MattressSuture.prototype.description = function()
{
    var returnString = "Mattress suture at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * Capsular Tension Ring
 *
 * @class CapsularTensionRing
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CapsularTensionRing = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CapsularTensionRing";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CapsularTensionRing.prototype = new ED.Doodle;
ED.CapsularTensionRing.prototype.constructor = ED.CapsularTensionRing;
ED.CapsularTensionRing.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CapsularTensionRing.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
	this.isScaleable = false;
	this.isMoveable = false;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.CapsularTensionRing.prototype.setParameterDefaults = function()
{
    this.rotation = -Math.PI/2;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CapsularTensionRing.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CapsularTensionRing.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Radii
    var ro = 360;
    var rm = 340;
    var ri = 300;
    var rh = 15;
    
    // Half angle of missing arc
    var theta = Math.PI * 0.2;
    
    // Outer ring
    ctx.arc(0, 0, ro, -theta, theta, true);
    
    var p1c1 = new ED.Point(0, 0)
    p1c1.setWithPolars(ro, Math.PI/2 + 0.8 * theta);
    
    var p1c2 = new ED.Point(0, 0)
    p1c2.setWithPolars(ri, Math.PI/2 + 0.8 * theta);
    
    var p1 = new ED.Point(0, 0)
    p1.setWithPolars(ri, Math.PI/2 + theta);
    
    var p2c1 = new ED.Point(0, 0)
    p2c1.setWithPolars(ri, Math.PI/2 + 1.1 * theta);
    
    var p2c2 = new ED.Point(0, 0)
    p2c2.setWithPolars(rm, Math.PI/2 + 1.1 * theta);
    
    var p2 = new ED.Point(0, 0)
    p2.setWithPolars(rm, Math.PI/2 + 1.2 * theta);
    
    ctx.bezierCurveTo(p1c1.x, p1c1.y, p1c2.x, p1c2.y, p1.x, p1.y);
    ctx.bezierCurveTo(p2c1.x, p2c1.y, p2c2.x, p2c2.y, p2.x, p2.y);
    
    // Inner ring
    ctx.arc(0, 0, rm, 1.2 * theta, -1.2 * theta, false);
    
    var p3c1 = new ED.Point(0, 0)
    p3c1.setWithPolars(rm, Math.PI/2 - 1.1 * theta);
    
    var p3c2 = new ED.Point(0, 0)
    p3c2.setWithPolars(ri, Math.PI/2 -1.1 * theta);
    
    var p3 = new ED.Point(0, 0)
    p3.setWithPolars(ri, Math.PI/2 - theta);
    
    var p4c1 = new ED.Point(0, 0)
    p4c1.setWithPolars(ri, Math.PI/2 - 0.8 * theta);
    
    var p4c2 = new ED.Point(0, 0)
    p4c2.setWithPolars(ro, Math.PI/2 - 0.8 * theta);
    
    var p4 = new ED.Point(0, 0)
    p4.setWithPolars(ro, Math.PI/2 - theta);
    
    ctx.bezierCurveTo(p3c1.x, p3c1.y, p3c2.x, p3c2.y, p3.x, p3.y);
    ctx.bezierCurveTo(p4c1.x, p4c1.y, p4c2.x, p4c2.y, p4.x, p4.y);
    
    // Hole in end 1
    var cp1 = new ED.Point(0, 0)
    cp1.setWithPolars(rm - 8, Math.PI/2 - theta);
    var ep1 = new ED.Point(0, 0)
    ep1.setWithPolars(rm - 8 + rh, Math.PI/2 - theta);
    ctx.moveTo(ep1.x, ep1.y);
    ctx.arc(cp1.x, cp1.y, 15, 0, 2 * Math.PI, false);
    
    // Hole in end 2
    var cp2 = new ED.Point(0, 0)
    cp2.setWithPolars(rm - 8, Math.PI/2 + theta);
    var ep2 = new ED.Point(0, 0)
    ep2.setWithPolars(rm - 8 + rh, Math.PI/2 + theta);
    ctx.moveTo(ep2.x, ep2.y);
    ctx.arc(cp2.x, cp2.y, 15, 0, 2 * Math.PI, false);
    
    ctx.closePath();
    
    // Colour of fill is white but with transparency
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "darkgray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CapsularTensionRing.prototype.description = function()
{
    var returnValue = "Capsular Tension Ring";
    
	return returnValue;
}

/**
 * CornealSuture
 *
 * @class CornealSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CornealSuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealSuture";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealSuture.prototype = new ED.Doodle;
ED.CornealSuture.prototype.constructor = ED.CornealSuture;
ED.CornealSuture.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.CornealSuture.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.CornealSuture.prototype.setParameterDefaults = function()
{
    this.radius = 374;
    this.setRotationWithDisplacements(10, 20);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealSuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealSuture.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    var r =  this.radius;
    ctx.rect(-20, -(r + 40), 40, 80);
    
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0.0)";
    
	// Set line attributes
	ctx.lineWidth = 6;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.moveTo(0, -r - 40);
        ctx.lineTo(0, -r + 40);
        ctx.moveTo(-10, -r + 10);
        ctx.lineTo(0, -r + 20);
        ctx.lineTo(-10, -r + 30);
        
        ctx.lineWidth = 2;
        var colour = "rgba(0,0,120,0.7)"
        ctx.strokeStyle = colour;
        
        ctx.stroke();
        
        // Knot
        this.drawSpot(ctx, 0, -r + 20, 4, colour);
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealSuture.prototype.description = function()
{
    var returnString = "Corneal suture at ";
    
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * LimbalRelaxingIncision
 *
 * @class LimbalRelaxingIncision
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.LimbalRelaxingIncision = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LimbalRelaxingIncision";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LimbalRelaxingIncision.prototype = new ED.Doodle;
ED.LimbalRelaxingIncision.prototype.constructor = ED.LimbalRelaxingIncision;
ED.LimbalRelaxingIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LimbalRelaxingIncision.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.LimbalRelaxingIncision.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, Math.PI/2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.LimbalRelaxingIncision.prototype.setParameterDefaults = function()
{
    // Default arc
    this.arc = 30 * Math.PI/180;
    
    // Make it 180 degress to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI;
        this.arc = doodle.arc;
    }
    else
    {
        // LRIs are usually temporal
        if(this.drawing.eye == ED.eye.Right)
        {
            this.rotation = -Math.PI/2;
        }
        else
        {
            this.rotation = Math.PI/2;
        }
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LimbalRelaxingIncision.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LimbalRelaxingIncision.superclass.draw.call(this, _point);
	
    // Radius
    var r =  360
    var d = 12;
    var ro = r + d;
    var ri = r - d;
    
    // Boundary path
	ctx.beginPath();
    
    // Half angle of arc
    var theta = this.arc/2;
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(100,100,200,0.75)";
    
    // Set line attributes
    ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, theta);
	this.handleArray[3].location = this.transform.transformPoint(point);
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.LimbalRelaxingIncision.prototype.description = function()
{
    var returnString = "Limbal relaxing incision " + (this.arc * 180/Math.PI).toFixed(0) + " degrees at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * Rubeosis
 *
 * @class Rubeosis
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Rubeosis = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Rubeosis";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.severity = 50;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Rubeosis.prototype = new ED.Doodle;
ED.Rubeosis.prototype.constructor = ED.Rubeosis;
ED.Rubeosis.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Rubeosis.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Rubeosis.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -200);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['severity'] = {kind:'derived', type:'float', range:new ED.Range(20, 100), precision:1, animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Rubeosis.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/12;
    this.setRotationWithDisplacements(90, 45);
    //this.setParameterFromString('apexY', '-320');
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle)
    {
        this.apexY = doodle.apexY - this.severity;
    }
    else
    {
        this.apexY = -320;
    }
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Rubeosis.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'severity':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['apexY'] = doodle.apexY - _value;
            }
            break;

        case 'apexY':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['severity'] = doodle.apexY - _value;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Rubeosis.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Rubeosis.superclass.draw.call(this, _point);
    
    // Set inner radius according to pupil
    var ri = 200;
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) ri = -doodle.apexY;
    
    // Boundary starts further out to allow selection of pupil handle
    var rib = ri + 16;
    
    // Set apexY and range
    this.parameterValidationArray['apexY']['range'].max = -ri - 50;
    this.apexY = this.parameterValidationArray['apexY']['range'].constrain(-ri - this.severity);

    // Outer radius is position of apex handle
	var ro = -this.apexY;

    // Radius for control handles
    var r = rib + (ro - rib)/2;
    
	// Boundary path
	ctx.beginPath();
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of SectorPRPPostPole
	var startHandle = new ED.Point(-r * Math.sin(theta),  -r * Math.cos(theta));
	var endHandle = new ED.Point(r * Math.sin(theta), -r * Math.cos(theta));

	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rib, arcStart, arcEnd, true);
	ctx.arc(0, 0, ro, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = this.isSelected?"rgba(240,240,240,0.5)":"rgba(240,240,240,0.0)";
    
	// Set line attributes
	ctx.lineWidth = 1;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        // Angular separation of vessels
        var inc = 2 * Math.PI/16;
        var disp = Math.PI/24;
        var phi = 2 * Math.PI/60;
        var rc = ri + 2 * (ro - ri)/3;
        
        // Number of vessels to draw
        var n = 1 + Math.floor(this.arc/inc);
        
        // Draw each vessel tree
        for (var i = 0; i < n; i++)
        {
            // Start point
            var sp = startHandle.pointAtRadiusAndClockwiseAngle(ri, disp + i * inc);
            
            // First branch
            var ep = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc + phi);
            var cp1 = startHandle.pointAtRadiusAndClockwiseAngle(rc, disp + i * inc);
            var cp2 = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc + phi/2);
            ctx.moveTo(sp.x, sp.y);
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);
            
            // Second branch
            ep = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc - phi);
            cp1 = startHandle.pointAtRadiusAndClockwiseAngle(rc, disp + i * inc);
            cp2 = startHandle.pointAtRadiusAndClockwiseAngle(ro, disp + i * inc - phi/2);
            ctx.moveTo(sp.x, sp.y);
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);
        }
        
        // Set line attributes
        ctx.lineWidth = 4;
        ctx.strokeStyle = "red";
        
        // Draw vessels
        ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(startHandle);
	this.handleArray[3].location = this.transform.transformPoint(endHandle);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Rubeosis.prototype.groupDescription = function()
{
	return "Rubeotic vessels on margin of pupil at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Rubeosis.prototype.description = function()
{
    return this.clockHour() + " o'clock";
}

/**
 * PosteriorSynechia
 *
 * @class PosteriorSynechia
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PosteriorSynechia = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PosteriorSynechia";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.size = 150;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PosteriorSynechia.prototype = new ED.Doodle;
ED.PosteriorSynechia.prototype.constructor = ED.PosteriorSynechia;
ED.PosteriorSynechia.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PosteriorSynechia.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.PosteriorSynechia.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/12, Math.PI * 2/3);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['size'] = {kind:'derived', type:'float', range:new ED.Range(20, 100), precision:1, animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PosteriorSynechia.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/6;
    this.setRotationWithDisplacements(90, 45);

    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle)
    {
        this.apexY = doodle.apexY + this.size;
    }
    else
    {
        this.apexY = -200;
    }
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PosteriorSynechia.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'size':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['apexY'] = doodle.apexY - _value;
            }
            break;
            
        case 'apexY':
            var doodle = this.drawing.lastDoodleOfClass("AntSeg");
            if (doodle)
            {
                returnArray['size'] = doodle.apexY - _value;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PosteriorSynechia.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PosteriorSynechia.superclass.draw.call(this, _point);
    
    // Set outer radius according to pupil
    var ro = 200;
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) ro = -doodle.apexY;
    
    // Outer radius is position of apex handle
	var ri = -this.apexY;
    
    // Radius of control points
    var rc = ri + (ro - ri)/2;
    
	// Boundary path
	ctx.beginPath();
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of SectorPRPPostPole
	var startHandle = new ED.Point(-ro * Math.sin(theta),  -ro * Math.cos(theta));
	var endHandle = new ED.Point(ro * Math.sin(theta), -ro * Math.cos(theta));
    
	// Boundary path
	ctx.beginPath();
    
	// Arc at margin of pupil
	ctx.arc(0, 0, ro, arcEnd, arcStart, false);
        
    //var cp = bp.pointAtRadiusAndClockwiseAngle(pr/2, Math.PI/16);
    var apex = new ED.Point(this.apexX, this.apexY);
    
    // Curve from endpoint to apex
    var cp1 = endHandle.pointAtAngleToLineToPointAtProportion(Math.PI/12, apex, 0.33);
    var cp2 = apex.pointAtAngleToLineToPointAtProportion(-Math.PI/12, endHandle, 0.33);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.apexX, this.apexY);
    
    // Curve from apex to startpoint
    var cp3 = apex.pointAtAngleToLineToPointAtProportion(Math.PI/12, startHandle, 0.33);
    var cp4 = startHandle.pointAtAngleToLineToPointAtProportion(-Math.PI/12, apex, 0.33);
    ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, startHandle.x, startHandle.y);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is transparent
    ctx.strokeStyle = "rgba(250, 250, 250, 0.0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Visual 'hack' to overwrite line with white and then same colour as pupil fill
        ctx.beginPath();
        ctx.arc(0, 0, ro, arcEnd, arcStart, false);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.strokeStyle = "rgba(100, 200, 250, 0.5)";
        ctx.stroke();
        
        // Re-do the boundary to match pupil edge and overlap gaps at join
        ctx.beginPath();
        ctx.moveTo(endHandle.x, endHandle.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.apexX, this.apexY);
        ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, startHandle.x, startHandle.y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "gray";
        ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(startHandle);
	this.handleArray[3].location = this.transform.transformPoint(endHandle);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.PosteriorSynechia.prototype.groupDescription = function()
{
	return "Posterior synechiae at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PosteriorSynechia.prototype.description = function()
{
    return this.clockHour() + " o'clock";
}

/**
 * Corneal abrasion
 *
 * @class CornealAbrasion
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CornealAbrasion = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealAbrasion";
    
    // Doodle specific property
    this.isInVisualAxis = false;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealAbrasion.prototype = new ED.Doodle;
ED.CornealAbrasion.prototype.constructor = ED.CornealAbrasion;
ED.CornealAbrasion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealAbrasion.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealAbrasion.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +2);
}

/**
 * Sets default parameters
 */
ED.CornealAbrasion.prototype.setParameterDefaults = function()
{
    this.apexY = -50;
    this.scaleX = 1.5;
    this.scaleY = 1;
    
    this.setOriginWithDisplacements(0,25);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealAbrasion.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealAbrasion.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealAbrasion
    var r = 120;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    var alpha = -this.apexY/100;
    ctx.fillStyle = "rgba(0, 255, 0, 1)";
    
    // Semi -transparent stroke
	ctx.strokeStyle = "rgba(100,100,100,0.9)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealAbrasion.prototype.description = function()
{
    var returnString = "";
    
    // Calculate size
    var averageScale = this.scaleX + this.scaleY;
    
    // Arbitrary cutoffs
    if (averageScale < 2) returnString = "Small ";
    else if (averageScale < 4) returnString = "Medium ";
    else returnString = "Large ";
    
    returnString += "corneal abrasion";
    
	return returnString;
}

/**
 * Anterior capsulotomy
 *
 * @class AnteriorCapsulotomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AnteriorCapsulotomy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AnteriorCapsulotomy";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AnteriorCapsulotomy.prototype = new ED.Doodle;
ED.AnteriorCapsulotomy.prototype.constructor = ED.AnteriorCapsulotomy;
ED.AnteriorCapsulotomy.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.AnteriorCapsulotomy.prototype.setPropertyDefaults = function()
{
    this.isUnique = true;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-500, +500);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-500, +500);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.AnteriorCapsulotomy.prototype.setParameterDefaults = function()
{
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AnteriorCapsulotomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AnteriorCapsulotomy.superclass.draw.call(this, _point);
    
    // Height of cross section (half value of ro in AntSeg doodle)
    var ro = 240;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
    // Move to inner circle
    ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        var ri = ro - 60;
        
        // Edge of nucleus
        ctx.beginPath();
        ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);
        ctx.strokeStyle = "rgba(220, 220, 220, 0.75)";
        ctx.stroke();
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * SectorIridectomy
 *
 * @class SectorIridectomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.SectorIridectomy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SectorIridectomy";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SectorIridectomy.prototype = new ED.Doodle;
ED.SectorIridectomy.prototype.constructor = ED.SectorIridectomy;
ED.SectorIridectomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SectorIridectomy.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.SectorIridectomy.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, Math.PI/2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.SectorIridectomy.prototype.setParameterDefaults = function()
{
    // Default arc
    this.arc = 60 * Math.PI/180;
    
    // Make a second one 90 degress to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/2;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SectorIridectomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SectorIridectomy.superclass.draw.call(this, _point);
	
    // Radii
    var ro =  376;

    // If iris there, take account of pupil size
    var ri;
    var doodle = this.drawing.lastDoodleOfClass("AntSeg");
    if (doodle) ri = -doodle.apexY - 2;
    else ri = 300;
    
    var r = ri + (ro - ri)/2;
    
    // Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of doodle
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
    // Boundary path
	ctx.beginPath();
    
    // Half angle of arc
    var theta = this.arc/2;
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(218,230,241,1)";
    
    // Set line attributes
    ctx.lineWidth = 4;
    
    // Colour of outer line
    ctx.strokeStyle = "rgba(218,230,241,1)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SectorIridectomy.prototype.description = function()
{
    var returnString = "Sector iridectomy of " + (this.arc * 180/Math.PI).toFixed(0) + " degrees at ";
    returnString += this.clockHour() + " o'clock";
    
	return returnString;
}

/**
 * CiliaryInjection
 *
 * @class CiliaryInjection
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CiliaryInjection = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CiliaryInjection";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CiliaryInjection.prototype = new ED.Doodle;
ED.CiliaryInjection.prototype.constructor = ED.CiliaryInjection;
ED.CiliaryInjection.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CiliaryInjection.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.CiliaryInjection.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-334, -300);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.CiliaryInjection.prototype.setParameterDefaults = function()
{
    // Default arc
    this.arc = 90 * Math.PI/180;
    
    // Make a second one 90 degress to last one of same class
	this.setRotationWithDisplacements(90,-120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CiliaryInjection.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CiliaryInjection.superclass.draw.call(this, _point);
	
    // Radii
    var ro =  480;
    var ri = 400;
    var r = ri + (ro - ri)/2;
    
    // Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of doodle
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
    // Boundary path
	ctx.beginPath();
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(218,230,241,0)";
    
    // Set line attributes
    ctx.lineWidth = 4;
    
    // Colour of outer line
    ctx.strokeStyle = "rgba(218,230,241,0)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Total number of vessels in a 360 arc
		var t = 60;
		
		// Number in the current arc and angular separation
		var phi = 2 * Math.PI/t;
		var n = Math.floor(this.arc/phi);
		
		// Start and end points of vessel
		var sp = new ED.Point(0, 0);
		var ep = new ED.Point(0, 0);

		ctx.beginPath();
		
		// Radial lines		
		for (var i = 0; i < n; i++)
		{
			var theta = Math.PI/2 + arcEnd + i * phi;
			sp.setWithPolars(ro, theta);
			ep.setWithPolars(ri, theta);
			
			ctx.moveTo(sp.x, sp.y);
			ctx.lineTo(ep.x, ep.y);
		}
		
		ctx.strokeStyle = "red";
		ctx.lineWidth = 16;
		ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CiliaryInjection.prototype.groupDescription = function()
{
    return "Ciliary injection ";
}

/**
 * Hyphaema
 *
 * @class Hyphaema
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Hyphaema = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Hyphaema";
	
	// Private parameters
	this.ro = 380;
	this.minimum = 304;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Hyphaema.prototype = new ED.Doodle;
ED.Hyphaema.prototype.constructor = ED.Hyphaema;
ED.Hyphaema.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Hyphaema.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Hyphaema.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, this.minimum);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.Hyphaema.prototype.setParameterDefaults = function()
{
	this.apexY = 152;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Hyphaema.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Hyphaema.superclass.draw.call(this, _point);
    
    // Calculate angle of apex above or below horizontal
    var phi = Math.asin(this.apexY/this.ro);
    
    // Boundary path
	ctx.beginPath();
    
    // Arc from point on circumference level with apex point to other side
    ctx.arc(0, 0, this.ro, phi, Math.PI - phi, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill, density depends on setting of apexX
    var density = (0.1 + (this.apexX + 50)/111).toFixed(2);
    ctx.fillStyle = "rgba(255,0,0," + density + ")";
    
    // Set line attributes
    ctx.lineWidth = 1;
    
    // Colour of outer line
    ctx.strokeStyle = ctx.fillStyle;
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Hyphaema.prototype.description = function()
{
	var percent = 10 * Math.round(10 * (this.ro - this.apexY)/(2 * this.ro));
    return percent + "% hyphaema";
}

/**
 * Hypopyon
 *
 * @class Hypopyon
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Hypopyon = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Hypopyon";
	
	// Private parameters
	this.ro = 380;
	this.minimum = 304;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Hypopyon.prototype = new ED.Doodle;
ED.Hypopyon.prototype.constructor = ED.Hypopyon;
ED.Hypopyon.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Hypopyon.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Hypopyon.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, this.minimum);
    this.parameterValidationArray['radius']['range'].setMinAndMax(250, 450);
}

/**
 * Sets default parameters
 */
ED.Hypopyon.prototype.setParameterDefaults = function()
{
	this.apexY = 260;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Hypopyon.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Hypopyon.superclass.draw.call(this, _point);
    
    // Calculate angle of apex above or below horizontal
    var phi = Math.asin(this.apexY/this.ro);
    
    // Boundary path
	ctx.beginPath();
    
    // Arc from point on circumference level with apex point to other side
    ctx.arc(0, 0, this.ro, phi, Math.PI - phi, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(221,209,171,1)";
    
    // Set line attributes
    ctx.lineWidth = 1;
    
    // Colour of outer line
    ctx.strokeStyle = ctx.fillStyle;
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Hypopyon.prototype.description = function()
{
	var height = Math.round(10 * (this.ro - this.apexY)/(2 * this.ro));
    return height + "mm hypopyon";
}

/**
 * Iris Naevus
 *
 * @class IrisNaevus
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.IrisNaevus = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "IrisNaevus";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.IrisNaevus.prototype = new ED.Doodle;
ED.IrisNaevus.prototype.constructor = ED.IrisNaevus;
ED.IrisNaevus.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IrisNaevus.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.IrisNaevus.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isOrientated = true;
}

/**
 * Sets default parameters
 */
ED.IrisNaevus.prototype.setParameterDefaults = function()
{
	this.originY = -226;
	this.scaleX = 1.8;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IrisNaevus.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.IrisNaevus.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// IrisNaevus
    var r = 50;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    ctx.fillStyle = "brown";
    
    // Transparent stroke
	ctx.strokeStyle = "rgba(100,100,100,0.9)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IrisNaevus.prototype.description = function()
{
	return "Iris naevus";
}

/**
 * Corneal Oedema
 *
 * @class CornealOedema
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CornealOedema = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealOedema";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealOedema.prototype = new ED.Doodle;
ED.CornealOedema.prototype.constructor = ED.CornealOedema;
ED.CornealOedema.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealOedema.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealOedema.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -100);
}

/**
 * Sets default parameters
 */
ED.CornealOedema.prototype.setParameterDefaults = function()
{
	this.apexY = -350;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealOedema.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealOedema.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealOedema
    var r = -this.apexY;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    var alpha = 0.3 + (this.apexX + 50)/200;
    ctx.fillStyle = "rgba(100,100,100," + alpha.toFixed(2) + ")";
	ctx.strokeStyle = ctx.fillStyle;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealOedema.prototype.description = function()
{
	return "Corneal oedema";
}

/**
 * Corneal Striae
 *
 * @class CornealStriae
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CornealStriae = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealStriae";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealStriae.prototype = new ED.Doodle;
ED.CornealStriae.prototype.constructor = ED.CornealStriae;
ED.CornealStriae.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
// ED.CornealStriae.prototype.setHandles = function()
// {
//     this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
// }

/**
 * Sets default dragging attributes
 */
ED.CornealStriae.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
	
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-380, -100);
}

/**
 * Sets default parameters
 */
ED.CornealStriae.prototype.setParameterDefaults = function()
{
	this.apexY = -350;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealStriae.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealStriae.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealStriae
    var r = -this.apexY;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    ctx.fillStyle = "rgba(100,100,100,0)";
	ctx.strokeStyle = "rgba(100,100,100,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		var st = -300;
		var d = 50;
		var w = 30;
		var s = 80;
		var x =  - 2 * s;
		
		ctx.beginPath();

		for (var i = 0; i < 5; i ++)
		{
			ctx.moveTo(x + s * i, st);
			ctx.bezierCurveTo(x + s * i - w, st + 1 * d, x + s * i - w, st + 2 * d, x + s * i, st + 3 * d);
			ctx.bezierCurveTo(x + s * i + w, st + 4 * d, x + s * i + w, st + 5 * d, x + s * i, st + 6 * d);
			ctx.bezierCurveTo(x + s * i - w, st + 7 * d, x + s * i - w, st+ 8 * d, x + s * i, st + 9 * d);
			ctx.bezierCurveTo(x + s * i + w, st + 10 * d, x + s * i + w, st + 11 * d, x + s * i, st + 12 * d);		
		}
		
		ctx.lineWidth = 20;
		ctx.strokeStyle = "rgba(100,100,100,0.6)";
		ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
//     this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
// 	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealStriae.prototype.description = function()
{
	return "Striate keratopathy";
}


/**
 * @fileOverview Contains doodle subclasses for glaucoma
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.8
 *
 * Modification date: 28th Ootober 2011
 * Copyright 2011 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * Radii from out to in (mainly for gonioscopy)
 * @ignore
 */
var rsl = 480;
var rsli = 470;
var rtmo = 404;
var rtmi = 304;
var rcbo = 270;
var rcbi = 190;
var riro = 190;
var riri = 176;
var rpu = 100;

/**
 * Gonioscopy
 *
 * @class Gonioscopy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Gonioscopy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Gonioscopy";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Gonioscopy.prototype = new ED.Doodle;
ED.Gonioscopy.prototype.constructor = ED.Gonioscopy;
ED.Gonioscopy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Gonioscopy.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Gonioscopy.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-460, -420);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-460, -400);
}

/**
 * Sets default parameters
 */
ED.Gonioscopy.prototype.setParameterDefaults = function()
{
    this.apexX = -460;
    this.apexY = -460;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Gonioscopy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Gonioscopy.superclass.draw.call(this, _point);
    
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, rsl, arcStart, arcEnd, true);
	
	// Set line attributes
	ctx.lineWidth = 15;
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(200, 200, 200, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Trabecular meshwork
        ctx.beginPath();
        
        // Arc across, move to inner and arc back
        ctx.arc(0, 0, rtmo, arcStart, arcEnd, true);
        ctx.moveTo(rtmi, 0);
        ctx.arc(0, 0, rtmi, arcEnd, arcStart, false);
        
        // Set line attributes
        ctx.lineWidth = 1;
        
        // Fill style
        var ptrn;
        
        // Pattern
        if (this.apexX < -440)
        {
            if (this.apexY < -440) ptrn = ctx.createPattern(this.drawing.imageArray['MeshworkPatternLight'],'repeat');
            else if (this.apexY < -420) ptrn = ctx.createPattern(this.drawing.imageArray['MeshworkPatternMedium'],'repeat');
            else ptrn = ctx.createPattern(this.drawing.imageArray['MeshworkPatternHeavy'],'repeat');
            ctx.fillStyle = ptrn;
        }
        // Uniform
        else
        {
            if (this.apexY < -440) ctx.fillStyle = "rgba(250, 200, 0, 1)";
            else if (this.apexY < -420) ctx.fillStyle = "rgba(200, 150, 0, 1)";
            else ctx.fillStyle = "rgba(150, 100, 0, 1)";
        }
        
        // Stroke style
        ctx.strokeStyle = "rgba(200, 200, 200, 1)";
        
        // Draw it
        ctx.fill();
        ctx.stroke();
        
        // Ciliary Body
        ctx.beginPath();
        
        // Arc across, move to inner and arc back
        ctx.arc(0, 0, rcbo, arcStart, arcEnd, true);
        ctx.arc(0, 0, rcbi, arcEnd, arcStart, false);
        
        // Draw it
        ctx.fillStyle = "rgba(200, 200, 200, 1)";
        ctx.fill();
        
        // Draw radial lines
        var firstAngle = 15;
        var innerPoint = new ED.Point(0,0);
        var outerPoint = new ED.Point(0,0);
        var i = 0;
        
        // Loop through clock face
        for (i = 0; i < 12; i++)
        {
            // Get angle
            var angleInRadians = (firstAngle + i * 30) * Math.PI/180;
            innerPoint.setWithPolars(rcbi, angleInRadians);
            
            // Set new line
            ctx.beginPath();
            ctx.moveTo(innerPoint.x, innerPoint.y);
            
            // Some lines are longer, wider and darker
            if (i == 1 || i == 4 || i == 7 || i == 10)
            {
                outerPoint.setWithPolars(rsl + 80, angleInRadians);
                ctx.lineWidth = 6;
                ctx.strokeStyle = "rgba(20, 20, 20, 1)";
            }
            else
            {
                outerPoint.setWithPolars(rsl, angleInRadians);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(137, 137, 137, 1)";
            }
            
            // Draw line
            ctx.lineTo(outerPoint.x, outerPoint.y);
            ctx.closePath();
            ctx.stroke();
        }
        
        // Iris
        ctx.beginPath();
        
        // Arc across, move to inner and arc back
        ctx.arc(0, 0, riro, arcStart, arcEnd, true);
        ctx.arc(0, 0, riri, arcEnd, arcStart, false);
        
        // Set attributes
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(180, 180, 180, 1)";
        ctx.fillStyle = "rgba(200, 200, 200, 1)";
        
        // Draw it
        ctx.fill();
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle (overridden by subclasses)
 *
 * @returns {String} Description of doodle
 */
ED.Gonioscopy.prototype.description = function()
{
    var returnValue = "";
    
    if (this.apexX < -440)
    {
        if (this.apexY < -440) returnValue = "Light patchy pigment";
        else if (this.apexY < -420) returnValue = "Medium patchy pigment";
        else returnValue = "Heavy patchy pigment";
    }
    // Uniform
    else
    {
        if (this.apexY < -440) returnValue = "Light homogenous pigment";
        else if (this.apexY < -420) returnValue = "Medium homogenous pigment";
        else returnValue = "Heavy homogenous pigment";
    }

    return returnValue;
}

/**
 * AngleGradeNorth
 *
 * @class AngleGradeNorth
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AngleGradeNorth = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeNorth";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = "4";
    this.seen = "Yes";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeNorth.prototype = new ED.Doodle;
ED.AngleGradeNorth.prototype.constructor = ED.AngleGradeNorth;
ED.AngleGradeNorth.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeNorth.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeNorth.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['4', '3', '2', '1', '0'], animate:true};
    this.parameterValidationArray['seen'] = {kind:'derived', type:'string', list:['Yes', 'No'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeNorth.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
    this.setParameterFromString('grade', '4');
    this.setParameterFromString('seen', 'Yes');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeNorth.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses Schaffer classificaton (although visibility is based on Scheie)
            var returnValue = "4";
            if (-_value >= riro) returnValue = "3";
            if (-_value >= rcbo) returnValue = "2";
            if (-_value >= rtmo) returnValue = "1";
            if (-_value >= rsli) returnValue = "0";
            returnArray['grade'] = returnValue;
            returnArray['seen'] = (-_value >= rtmo) ? 'No' : 'Yes';
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
            {
                case '0':
                    if (-this.apexY >= rsli) returnValue = this.apexY;
                    else returnValue = -rsli;
                    break;
                case '1':
                    if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case '2':
                    if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -360; //-rcbo;
                    break;
                case '3':
                    if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                    else returnValue = -230; //-riro;
                    break;
                case '4':
                    if (-this.apexY >= riri && -this.apexY < riro) returnValue = this.apexY;
                    else returnValue= -riri;
                    break;
            }
            returnArray['apexY'] = returnValue;
            break;
            
        case 'seen':
            var returnValue = "";
            switch (_value)
            {
	            case 'No':
	              if (-this.apexY >= rtmo) returnValue = this.apexY;
	              else returnValue = -rtmo;
	              break;
	            case 'Yes':
	              if (-this.apexY < rtmo) returnValue = this.apexY;
	              else returnValue = -riri;
	              break;
            }
            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeNorth.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeNorth.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
  
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * AngleGradeEast
 *
 * @class AngleGradeEast
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AngleGradeEast = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeEast";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = "4";
    this.seen = "Yes";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeEast.prototype = new ED.Doodle;
ED.AngleGradeEast.prototype.constructor = ED.AngleGradeEast;
ED.AngleGradeEast.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeEast.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeEast.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['4', '3', '2', '1', '0'], animate:true};
    this.parameterValidationArray['seen'] = {kind:'derived', type:'string', list:['Yes', 'No'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeEast.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
    this.rotation = Math.PI/2;
    this.setParameterFromString('grade', '4');
    this.setParameterFromString('seen', 'Yes');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeEast.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses Schaffer classificaton (although visibility is based on Scheie)
            var returnValue = "4";
            if (-_value >= riro) returnValue = "3";
            if (-_value >= rcbo) returnValue = "2";
            if (-_value >= rtmo) returnValue = "1";
            if (-_value >= rsli) returnValue = "0";
            returnArray['grade'] = returnValue;
            returnArray['seen'] = (-_value >= rtmo) ? 'No' : 'Yes';
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
            {
                case '0':
                    if (-this.apexY >= rsli) returnValue = this.apexY;
                    else returnValue = -rsli;
                    break;
                case '1':
                    if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case '2':
                    if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -360; //-rcbo;
                    break;
                case '3':
                    if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                    else returnValue = -230; //-riro;
                    break;
                case '4':
                    if (-this.apexY >= riri && -this.apexY < riro) returnValue = this.apexY;
                    else returnValue= -riri;
                    break;
            }
            returnArray['apexY'] = returnValue;
            break;
            
        case 'seen':
            var returnValue = "";
            switch (_value)
            {
                case 'No':
                    if (-this.apexY >= rtmo) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case 'Yes':
                    if (-this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -riri;
                    break;
            }
            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeEast.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeEast.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * AngleGradeSouth
 *
 * @class AngleGradeSouth
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AngleGradeSouth = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeSouth";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = "4";
    this.seen = "Yes";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeSouth.prototype = new ED.Doodle;
ED.AngleGradeSouth.prototype.constructor = ED.AngleGradeSouth;
ED.AngleGradeSouth.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeSouth.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeSouth.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['4', '3', '2', '1', '0'], animate:true};
    this.parameterValidationArray['seen'] = {kind:'derived', type:'string', list:['Yes', 'No'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeSouth.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
    this.rotation = Math.PI;
    this.setParameterFromString('grade', '4');
    this.setParameterFromString('seen', 'Yes');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeSouth.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses Schaffer classificaton (although visibility is based on Scheie)
            var returnValue = "4";
            if (-_value >= riro) returnValue = "3";
            if (-_value >= rcbo) returnValue = "2";
            if (-_value >= rtmo) returnValue = "1";
            if (-_value >= rsli) returnValue = "0";
            returnArray['grade'] = returnValue;
            returnArray['seen'] = (-_value >= rtmo) ? 'No' : 'Yes';
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
            {
                case '0':
                    if (-this.apexY >= rsli) returnValue = this.apexY;
                    else returnValue = -rsli;
                    break;
                case '1':
                    if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case '2':
                    if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -360; //-rcbo;
                    break;
                case '3':
                    if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                    else returnValue = -230; //-riro;
                    break;
                case '4':
                    if (-this.apexY >= riri && -this.apexY < riro) returnValue = this.apexY;
                    else returnValue= -riri;
                    break;
            }
            returnArray['apexY'] = returnValue;
            break;
            
        case 'seen':
            var returnValue = "";
            switch (_value)
            {
                case 'No':
                    if (-this.apexY >= rtmo) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case 'Yes':
                    if (-this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -riri;
                    break;
            }
            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeSouth.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeSouth.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * AngleGradeWest
 *
 * @class AngleGradeWest
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AngleGradeWest = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleGradeWest";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = "4";
    this.seen = "Yes";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleGradeWest.prototype = new ED.Doodle;
ED.AngleGradeWest.prototype.constructor = ED.AngleGradeWest;
ED.AngleGradeWest.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleGradeWest.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleGradeWest.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -riri);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['4', '3', '2', '1', '0'], animate:true};
    this.parameterValidationArray['seen'] = {kind:'derived', type:'string', list:['Yes', 'No'], animate:true};
}

/**
 * Sets default parameters
 */
ED.AngleGradeWest.prototype.setParameterDefaults = function()
{
    this.arc = 90 * Math.PI/180;
    this.apexY = -riri;
    this.rotation = 3 * Math.PI/2;
    this.setParameterFromString('grade', '4');
    this.setParameterFromString('seen', 'Yes');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.AngleGradeWest.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            // Return value uses Schaffer classificaton (although visibility is based on Scheie)
            var returnValue = "4";
            if (-_value >= riro) returnValue = "3";
            if (-_value >= rcbo) returnValue = "2";
            if (-_value >= rtmo) returnValue = "1";
            if (-_value >= rsli) returnValue = "0";
            returnArray['grade'] = returnValue;
            returnArray['seen'] = (-_value >= rtmo) ? 'No' : 'Yes';
            break;
            
        case 'grade':
            var returnValue = "";
            switch (_value)
            {
                case '0':
                    if (-this.apexY >= rsli) returnValue = this.apexY;
                    else returnValue = -rsli;
                    break;
                case '1':
                    if (-this.apexY >= rtmo && -this.apexY < rsli) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case '2':
                    if (-this.apexY >= rcbo && -this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -360; //-rcbo;
                    break;
                case '3':
                    if (-this.apexY >= riro && -this.apexY < rcbo) returnValue = this.apexY;
                    else returnValue = -230; //-riro;
                    break;
                case '4':
                    if (-this.apexY >= riri && -this.apexY < riro) returnValue = this.apexY;
                    else returnValue= -riri;
                    break;
            }
            returnArray['apexY'] = returnValue;
            break;
            
        case 'seen':
            var returnValue = "";
            switch (_value)
            {
                case 'No':
                    if (-this.apexY >= rtmo) returnValue = this.apexY;
                    else returnValue = -rtmo;
                    break;
                case 'Yes':
                    if (-this.apexY < rtmo) returnValue = this.apexY;
                    else returnValue = -riri;
                    break;
            }
            returnArray['apexY'] = returnValue;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleGradeWest.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleGradeWest.superclass.draw.call(this, _point);
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
    // Arc across, move to inner and arc back
	ctx.arc(0, 0, -this.apexY, arcStart, arcEnd, true);
	ctx.arc(0, 0, rpu, arcEnd, arcStart, false);
    ctx.closePath();
    
    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Angle New Vessels
 *
 * @class AngleNV
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AngleNV = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AngleNV";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AngleNV.prototype = new ED.Doodle;
ED.AngleNV.prototype.constructor = ED.AngleNV;
ED.AngleNV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleNV.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleNV.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+50, +250);
}

/**
 * Sets default parameters
 */
ED.AngleNV.prototype.setParameterDefaults = function()
{
    this.arc = 30 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleNV.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleNV.superclass.draw.call(this, _point);
    
    // AngleNV is at equator
    var ras = rtmo;
	var rir = rtmi;
    var r = rir + (ras - rir)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of AngleNV
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rir, arcStart, arcEnd, true);
	ctx.arc(0, 0, ras, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
    
    // create pattern
    var ptrn = ctx.createPattern(this.drawing.imageArray['NewVesselPattern'],'repeat');
    ctx.fillStyle = ptrn;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.AngleNV.prototype.groupDescription = function()
{
    // Calculate total extent in degrees
    var degrees = this.drawing.totalDegreesExtent(this.className);
    
    // Return string
    return "Angle new vessels over " + degrees.toString() + " degrees";
}

/**
 * Anterior Synechiae
 *
 * @class AntSynech
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AntSynech = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "AntSynech";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.AntSynech.prototype = new ED.Doodle;
ED.AntSynech.prototype.constructor = ED.AntSynech;
ED.AntSynech.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AntSynech.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.AntSynech.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-rsli, -rcbo);
    this.parameterValidationArray['arc']['range'].setMinAndMax(30 * Math.PI/180, Math.PI*2);
}

/**
 * Sets default parameters
 */
ED.AntSynech.prototype.setParameterDefaults = function()
{
    this.arc = 30 * Math.PI/180;
    this.apexY = -rtmi;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AntSynech.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AntSynech.superclass.draw.call(this, _point);
    
    // AntSynech is at equator
    var ras = -this.apexY;
	var rir = riri;
    
    var r = rir + (ras - rir)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    var outArcStart = - Math.PI/2 + theta - Math.PI/14;
    var outArcEnd = - Math.PI/2 - theta + Math.PI/14;
    
    // Coordinates of 'corners' of AntSynech
	var topRightX = rir * Math.sin(theta);
	var topRightY = - rir * Math.cos(theta);
	var topLeftX = - rir * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rir, arcStart, arcEnd, true);
	ctx.arc(0, 0, ras, outArcEnd, outArcStart, false);
    
	// Close path
	ctx.closePath();

    // Set fill attributes (same colour as Iris)
    ctx.fillStyle = "rgba(100, 200, 250, 1.0)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
    ctx.lineWidth = 4;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(0, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.AntSynech.prototype.groupDescription = function()
{
    // Calculate total extent in degrees
    var degrees = this.drawing.totalDegreesExtent(this.className);
    
    // Return string
    return "Anterior synechiae over " + degrees.toString() + " degrees";
}

/**
 * Angle Recession
 *
 * @class AngleRecession
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.AngleRecession = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "AngleRecession";
}

/**
 * Sets superclass and constructor
 */
ED.AngleRecession.prototype = new ED.Doodle;
ED.AngleRecession.prototype.constructor = ED.AngleRecession;
ED.AngleRecession.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.AngleRecession.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.AngleRecession.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.125, +1.5);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+50, +250);
}

/**
 * Sets default parameters
 */
ED.AngleRecession.prototype.setParameterDefaults = function()
{
    this.arc = 30 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.AngleRecession.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.AngleRecession.superclass.draw.call(this, _point);
    
    // AngleRecession is at equator
    var ras = riri - 30;
	var rir = riri;
    var r = rir + (ras - rir)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    var outArcStart = - Math.PI/2 + theta - Math.PI/24;
    var outArcEnd = - Math.PI/2 - theta + Math.PI/24;
    
    // Coordinates of 'corners' of AngleRecession
	var topRightX = rir * Math.sin(theta);
	var topRightY = - rir * Math.cos(theta);
	var topLeftX = - rir * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Path
	ctx.arc(0, 0, rir, arcStart, arcEnd, true);
	ctx.arc(0, 0, ras, outArcEnd, outArcStart, false);
    
	// Close path
	ctx.closePath();
    
    ctx.fillStyle = "rgba(255, 255, 200, 1.0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.AngleRecession.prototype.groupDescription = function()
{
    // Calculate total extent in degrees
    var degrees = this.drawing.totalDegreesExtent(this.className);
    
    // Return string
    return "Angle recession over " + degrees.toString() + " degrees";
}

/**
 * The optic disc
 *
 * @class OpticDisc
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.OpticDisc = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "OpticDisc";
    
    // Private parameters
    this.numberOfHandles = 8;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.mode = "Basic";
    this.cdRatio = '0';

    this.savedParams = ['mode'];
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
    
    // Set visibility of handles
    //this.setHandleProperties();
}

/**
 * Sets superclass and constructor
 */
ED.OpticDisc.prototype = new ED.Doodle;
ED.OpticDisc.prototype.constructor = ED.OpticDisc;
ED.OpticDisc.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OpticDisc.prototype.setHandles = function()
{
    // Array of handles for expert mode
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        this.handleArray[i] = new ED.Handle(null, true, ED.Mode.Handles, false);
    }
    
    // Apex handle for basic mode
    this.handleArray[this.numberOfHandles] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.OpticDisc.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isDeletable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-320, -20);
    this.parameterValidationArray['radius']['range'].setMinAndMax(50, 290);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['mode'] = {kind:'derived', type:'string', list:['Basic', 'Expert'], animate:false};
    this.parameterValidationArray['cdRatio'] = {kind:'derived', type:'string', list:['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1.0','No view'], animate:true};
    
    // Create ranges to constrain handles
    this.handleVectorRangeArray = new Array();
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        // Full circle in radians
        var cir = 2 * Math.PI;
        
        // Create a range object for each handle
        var range = new Object;
        range.length = new ED.Range(+50, +290);
        range.angle = new ED.Range(((15 * cir/16) + i * cir/8) % cir, ((1 * cir/16) + i * cir/8) % cir);
        this.handleVectorRangeArray[i] = range;
    }
}

/**
 * Sets default parameters
 */
ED.OpticDisc.prototype.setParameterDefaults = function()
{
    this.apexY = -150;    
    this.setParameterFromString('mode', 'Basic');
    this.setParameterFromString('cdRatio', '0.3');

    // Create a squiggle to store the handles points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

    // Add it to squiggle array
    this.squiggleArray.push(squiggle);
    
    // Populate with handles at equidistant points around circumference
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        var point = new ED.Point(0, 0);
        point.setWithPolars(-this.apexY, i * 2 * Math.PI/this.numberOfHandles);
        this.addPointToSquiggle(point);
    }
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.OpticDisc.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'mode':
        	this.setHandleProperties();
//			This is commented out since it was causing recursive setting of cdRation and altering position of points in expert mode
//			Not sure what the code did in the first place anyway!
//             if (this.apexY < -300)
//             {
//                 returnArray['cdRatio'] = "No view";
//             }
//             else
//             {
//                 returnArray['cdRatio'] = (-this.apexY/300).toFixed(1);
//             }
//             console.log("mode: Setting cdRatio to " + returnArray['cdRatio']);
            break;
                        
        case 'apexY':
            if (_value < -300)
            {
                returnArray['cdRatio'] = "No view";
            }
            else
            {
                returnArray['cdRatio'] = (-_value/300).toFixed(1);
            }
            break;
            
        case 'cdRatio':
            if (_value != "No view")
            {
                var newValue = parseFloat(_value) * 300;
                returnArray['apexY'] = -newValue;
                
                // Alter position of top and bottom points accordingly, then average the others
                if (this.mode == "Expert")
                {
                    var ti = 0;
                    var bi = this.numberOfHandles/2;
                    var meanOldValue = (this.squiggleArray[0].pointsArray[ti].length() + this.squiggleArray[0].pointsArray[bi].length())/2;
                    this.squiggleArray[0].pointsArray[ti].setWithPolars(newValue, this.squiggleArray[0].pointsArray[ti].direction());
                    this.squiggleArray[0].pointsArray[bi].setWithPolars(newValue, this.squiggleArray[0].pointsArray[bi].direction());
                    
                    // Adjust others proportionately
                    for (var i = 0; i < this.numberOfHandles; i++)
                    {
                        if (i != ti && i != bi)
                        {
                            var newLength = this.squiggleArray[0].pointsArray[i].length() * newValue/meanOldValue;
                            newLength = newLength>300?300:newLength;
                            this.squiggleArray[0].pointsArray[i].setWithPolars(newLength, this.squiggleArray[0].pointsArray[i].direction());
                        }
                    }
                }
            }
            else
            {
                returnArray['apexY'] = -320;
            }
            break;
            
        case 'handles':
            // Sum distances of (vertical) control points from centre
            var sum = 0;
            sum += this.squiggleArray[0].pointsArray[0].length();
            sum += this.squiggleArray[0].pointsArray[this.numberOfHandles/2].length();
            returnArray['apexY'] = -Math.round(sum/2);
            var ratio = Math.round(10 * sum/(300 * 2))/10;
            returnArray['cdRatio'] = ratio.toFixed(1);
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OpticDisc.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.OpticDisc.superclass.draw.call(this, _point);
    
	// Radius of disc
	var ro = 300;
    var ri = -this.apexY;
	
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
	
	// Close path
	ctx.closePath();
    
    // Set attributes
	ctx.lineWidth = 2;
    var ptrn = ctx.createPattern(this.drawing.imageArray['CribriformPattern'],'repeat');
    ctx.fillStyle = ptrn;
	ctx.strokeStyle = "gray";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Begin path
		ctx.beginPath();
        
		// Do a 360 arc
		ctx.arc(0, 0, ro, arcStart, arcEnd, true);
		
	    if (this.mode == "Basic")
	    {
	        // Move to inner circle
		    ctx.moveTo(ri, 0);
		    
			// Arc back the other way
			ctx.arc(0, 0, ri, arcEnd, arcStart, false);
	    }
	    else
	    {
	        // Bezier points
	        var fp;
	        var tp;
	        var cp1;
	        var cp2;
            
	        // Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
	        var phi = 2 * Math.PI/(3 * this.numberOfHandles);
            
	        // Start curve
	        ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
	        
	        // Complete curve segments
	        for (var i = 0; i < this.numberOfHandles; i++)
	        {
	            // From and to points
	            fp = this.squiggleArray[0].pointsArray[i];
	            var toIndex = (i < this.numberOfHandles - 1)?i + 1:0;
	            tp = this.squiggleArray[0].pointsArray[toIndex];
	            
	            // Control points
	            cp1 = fp.tangentialControlPoint(+phi);
	            cp2 = tp.tangentialControlPoint(-phi);
	            
	            // Draw Bezier curve
	            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
	        }
	    }
        
        ctx.closePath();
        
	    // Set margin attributes
	    var colour = new ED.Colour(0,0,0,1);
	    colour.setWithHexString('FFA83C');  // Taken from disc margin of a fundus photo
	    ctx.fillStyle = colour.rgba();
        
        // Draw disc margin
        ctx.fill();
        
        // Disc vessels
        ctx.beginPath();
        
        // Vessels start on nasal side of disc
        var sign;
        if (this.drawing.eye == ED.eye.Right)
        {
            sign = -1;
        }
        else
        {
            sign = 1;
        }
        
        // Superotemporal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(400, - sign * Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(450, sign * Math.PI/8);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(500, sign * Math.PI/4);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Inferotemporal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(400, - sign * 7 * Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(450, sign * 7 * Math.PI/8);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(500, sign * 3 * Math.PI/4);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Superonasal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(300, - sign * 2 *  Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(350, -sign * 5 * Math.PI/16);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(450, - sign * 3 * Math.PI/8);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Inferonasal vessel
        var startPoint = new ED.Point(0,0);
        startPoint.setWithPolars(150, - sign * Math.PI/2);
        
        var controlPoint1 = new ED.Point(0,0);
        controlPoint1.setWithPolars(300, - sign * 6 *  Math.PI/8);
        var controlPoint2 = new ED.Point(0,0);
        controlPoint2.setWithPolars(350, -sign * 11 * Math.PI/16);
        
        var endPoint = new ED.Point(0,0);
        endPoint.setWithPolars(450, - sign * 5 * Math.PI/8);
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        
        // Line attributes
        ctx.lineWidth = 48;
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        
        // Draw line
        ctx.stroke();
        
        // Obscure whole disc if no view
        if (this.cdRatio == "No view")
        {
            // disk to obscure disc
            ctx.beginPath();
            ctx.arc(0, 0, 400, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fillStyle = "gray";
            ctx.fill();
        }
    }
    
	// Coordinates of expert handles (in canvas plane)
    if (this.mode == "Expert")
    {
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
        }
    }
    
    // Location of apex handle
    this.handleArray[this.numberOfHandles].location = this.transform.transformPoint(new ED.Point(0, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.OpticDisc.prototype.description = function()
{
    var returnString = "";
    
    // Expert mode 
    if (this.mode == "Expert")
    {        
        // Get mean
        var mean = this.getMeanRadius();
        
        // Look for notches by detecting outliers
        var notchArray = new Array();
        var inNotch = false;
        var notch;
        
        // Find a non-notch point to start with
        var s = 0;
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            if (this.squiggleArray[0].pointsArray[i].length() < mean * 1.1)
            {
                s = i;
                break;
            }
        }
        
        // Iterate through points starting at a non-notch point
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            var j = (i + s)%this.numberOfHandles;

            if (this.squiggleArray[0].pointsArray[j].length() > mean * 1.1)
            {
                if (!inNotch)
                {
                    notch = new Object();
                    notch.startHour = this.squiggleArray[0].pointsArray[j].clockHour();
                    notch.endHour = this.squiggleArray[0].pointsArray[j].clockHour();
                    inNotch = true;
                }
                else
                {
                    notch.endHour = this.squiggleArray[0].pointsArray[j].clockHour();
                }
            }
            else
            {
                if (inNotch)
                {
                    notchArray.push(notch);
                    inNotch = false;
                }
            }
            
            // Deal with boundary condition
            if (i == this.numberOfHandles -1)
            {
                if (inNotch)
                {
                    notch.endHour = this.squiggleArray[0].pointsArray[j].clockHour();
                    notchArray.push(notch);
                    inNotch = false;
                }
            }
        }
        
        // Turn into a sensible report
        if (notchArray.length > 0)
        {
            var many = (notchArray.length > 1);
            
            returnString = many?"Notches":"Notch";

            for (var i = 0; i < notchArray.length; i++)
            {
                if (notchArray[i].startHour == notchArray[i].endHour)
                {
                    returnString += " at " + notchArray[i].startHour;
                }
                else
                {
                    returnString += " from " + notchArray[i].startHour + " to " + notchArray[i].endHour + " o'clock";
                }
                
                if (many && i != notchArray.length - 1)
                {
                    returnString += ", and";
                }
            }
        }
        else
		{
			returnString = this.drawing.doodleArray.length == 1?"No abnormality":"";
		}
    }
    // Basic mode
    else
    {
		returnString = this.drawing.doodleArray.length == 1?"No abnormality":"";
    }

	return returnString;
}

/**
 * Defines handles visibility
 */
ED.OpticDisc.prototype.setHandleProperties = function()
{
    // Basic mode
    if (this.mode == "Basic")
    {
        // Make handles invisible, except for apex handle
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            this.handleArray[i].isVisible = false;
        }
        this.handleArray[this.numberOfHandles].isVisible = true;
        
        // Set to mean of expert handles
        this.apexY = -this.getMeanRadius();
    }
    // Expert mode
    else
    { 
        // Make handles visible, except for apex handle,
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            this.handleArray[i].isVisible = true;
            
        }
        this.handleArray[this.numberOfHandles].isVisible = false;
        
        // Set points to mean
        this.setMeanRadius(-this.apexY);
    }
}

/**
 * Returns minimum radius
 *
 * @returns {Float} Minimum radius regardless of mode
 */
ED.OpticDisc.prototype.minimumRadius = function()
{
    var returnValue = 500;
    
    if (this.mode == "Basic")
    {
        returnValue = Math.abs(this.apexY);
    }
    else
    {        
        // Iterate through points
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            // Calculate minimum radius
            var radius = this.squiggleArray[0].pointsArray[i].length();

            if (radius < returnValue)
            {
                returnValue = radius;
            }
        }
    }
    
    return returnValue;
}

/**
 * Returns mean radius
 *
 * @returns {Float} Mean radius of handle points
 */
ED.OpticDisc.prototype.getMeanRadius = function()
{
    // Sum distances of (vertical) control points from centre
    if (typeof(this.squiggleArray[0]) != 'undefined')
    {
//        var sum = 0;
//        var ti = 0;
//        var bi = this.numberOfHandles/2;
//        sum += this.squiggleArray[0].pointsArray[ti].length();
//        sum += this.squiggleArray[0].pointsArray[bi].length();
//        return sum/2;
        
        var sum = 0;
        for (var i = 0; i < this.numberOfHandles; i++)
        {
            sum += this.squiggleArray[0].pointsArray[i].length();
        }
        return sum/this.numberOfHandles;
    }
    else
    {
        return -this.apexY;
    }
}

/**
 * Sets radius of handle points
 *
 *@param {Float} _radius Value to set
 */
ED.OpticDisc.prototype.setMeanRadius = function(_radius)
{
    // Get current mean
    var mean = this.getMeanRadius();
    
    // Go through scaling each point according to new mean
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        // Get current length and direction
        var length = this.squiggleArray[0].pointsArray[i].length();
        var direction = this.squiggleArray[0].pointsArray[i].direction();

        // Calculate new length
        var newLength = length * _radius/mean;
        newLength = newLength > 300?300:newLength;
        
        // Set point
        this.squiggleArray[0].pointsArray[i].setWithPolars(newLength, direction);
    }
}

/**
 * Peripapillary atrophy
 *
 * @class PeripapillaryAtrophy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PeripapillaryAtrophy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PeripapillaryAtrophy";
    
    // Private parameters
    this.outerRadius = 340;

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PeripapillaryAtrophy.prototype = new ED.Doodle;
ED.PeripapillaryAtrophy.prototype.constructor = ED.PeripapillaryAtrophy;
ED.PeripapillaryAtrophy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripapillaryAtrophy.prototype.setHandles = function()
{
    this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Handles, false);
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Handles, false);
}

/**
 * Sets default dragging attributes
 */
ED.PeripapillaryAtrophy.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.addAtBack = true;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['rotation']['range'].setMinAndMax(7 * Math.PI/4, Math.PI/4);
    
    // Create ranges to constrain handles
    this.handleCoordinateRangeArray = new Array();

    var max = this.outerRadius * 1.4;
    var min = this.outerRadius;
    this.handleCoordinateRangeArray[0] = {x:new ED.Range(-max, -min), y:new ED.Range(-0, +0)};
    this.handleCoordinateRangeArray[1] = {x:new ED.Range(-0, +0), y:new ED.Range(-max, -min)};
    this.handleCoordinateRangeArray[2] = {x:new ED.Range(min, max), y:new ED.Range(-0, +0)};
    this.handleCoordinateRangeArray[3] = {x:new ED.Range(-0, +0), y:new ED.Range(min, max)};
}

/**
 * Sets default parameters
 */
ED.PeripapillaryAtrophy.prototype.setParameterDefaults = function()
{
    // Create a squiggle to store the handles points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
    
    // Add it to squiggle array
    this.squiggleArray.push(squiggle);

    // Add four points to the squiggle
    this.addPointToSquiggle(new ED.Point(-this.outerRadius - (this.drawing.eye == ED.eye.Right?100:0), 0));
    this.addPointToSquiggle(new ED.Point(0, -this.outerRadius));
    this.addPointToSquiggle(new ED.Point(this.outerRadius + (this.drawing.eye == ED.eye.Right?0:100), 0));
    this.addPointToSquiggle(new ED.Point(0, this.outerRadius));
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripapillaryAtrophy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PeripapillaryAtrophy.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// PeripapillaryAtrophy
    var f = 0.55;   // Gives a circular bezier curve
    var fromX;
    var fromY;
    var toX;
    var toY;
    
    // Top left curve
    fromX = this.squiggleArray[0].pointsArray[0].x;
    fromY = this.squiggleArray[0].pointsArray[0].y;
    toX = this.squiggleArray[0].pointsArray[1].x;
    toY = this.squiggleArray[0].pointsArray[1].y;
    ctx.moveTo(fromX, fromY);
    ctx.bezierCurveTo(fromX, fromX * f, toY * f, toY, toX, toY);
    
    // Top right curve
    fromX = toX;
    fromY = toY;
    toX = this.squiggleArray[0].pointsArray[2].x;
    toY = this.squiggleArray[0].pointsArray[2].y;
    ctx.bezierCurveTo(-fromY * f, fromY, toX, -toX * f, toX, toY);
    
    // Bottom right curve
    fromX = toX;
    fromY = toY;
    toX = this.squiggleArray[0].pointsArray[3].x;
    toY = this.squiggleArray[0].pointsArray[3].y;
    ctx.bezierCurveTo(fromX, fromX * f, toY * f, toY, toX, toY);
    
    // Bottom left curve
    fromX = toX;
    fromY = toY;
    toX = this.squiggleArray[0].pointsArray[0].x;
    toY = this.squiggleArray[0].pointsArray[0].y;
    ctx.bezierCurveTo(-fromY * f, fromY, toX, -toX * f, toX, toY);
    
    // Only fill to margin, to allow cup to sit behind giving disc margin
    ctx.moveTo(280, 00);
    ctx.arc(0, 0, 280, 0, Math.PI*2, true);
    
	// Close path
	ctx.closePath();
	
	// Set attributes
	ctx.lineWidth = 2;
    var colour = new ED.Colour(0,0,0,1);
    colour.setWithHexString('DFD989');
    ctx.fillStyle = colour.rgba();
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);
	this.handleArray[1].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[1]);
	this.handleArray[2].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[2]);
	this.handleArray[3].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[3]);
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PeripapillaryAtrophy.prototype.description = function()
{
    var returnString = "";
	
    // Get distances of control points from centre
    var left = - this.squiggleArray[0].pointsArray[0].x;
    var top = - this.squiggleArray[0].pointsArray[1].y;
    var right = this.squiggleArray[0].pointsArray[2].x;
    var bottom = this.squiggleArray[0].pointsArray[3].y;
    
    // Get maximum control point, and its sector
    var sector = "";
    var max = this.radius;
    if (left > max)
    {
        max = left;
        sector = (this.drawing.eye == ED.eye.Right)?"temporally":"nasally";
    }
    if (top > max)
    {
        max = top;
        sector = "superiorly";
    }
    if (right > max)
    {
        max = right;
        sector = (this.drawing.eye == ED.eye.Right)?"nasally":"temporally";
    }
    if (bottom > max)
    {
        max = bottom;
        sector = "inferiorly";
    }
    
    // Grade degree of atrophy
    if (max > this.radius)
    {
        var degree = "Mild";
        if (max > 350) degree = "Moderate";
        if (max > 400) degree = "Signficant";
        returnString += degree;
        returnString += " peri-papillary atrophy, maximum ";
        returnString += sector;
    }
	
	return returnString;
}

/**
 * Nerve Fibre Defect
 *
 * @class NerveFibreDefect
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.NerveFibreDefect = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "NerveFibreDefect";
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.NerveFibreDefect.prototype = new ED.Doodle;
ED.NerveFibreDefect.prototype.constructor = ED.NerveFibreDefect;
ED.NerveFibreDefect.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.NerveFibreDefect.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.NerveFibreDefect.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-560, -400);
}

/**
 * Sets default parameters
 */
ED.NerveFibreDefect.prototype.setParameterDefaults = function()
{
    this.arc = 20 * Math.PI/180;
    this.apexY = -460;
    
    this.setRotationWithDisplacements(150,-120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.NerveFibreDefect.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.NerveFibreDefect.superclass.draw.call(this, _point);
    
	// Radius of outer curve
	var ro = -this.apexY;
    var ri = 360;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of NerveFibreDefect
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(200, 200, 200, 0.75)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.NerveFibreDefect.prototype.groupDescription = function()
{
	return  "Nerve fibre layer defect at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.NerveFibreDefect.prototype.description = function()
{
    return this.clockHour() + " o'clock";
}

/**
 * Disc Haemorrhage
 *
 * @class DiscHaemorrhage
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.DiscHaemorrhage = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DiscHaemorrhage";
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DiscHaemorrhage.prototype = new ED.Doodle;
ED.DiscHaemorrhage.prototype.constructor = ED.DiscHaemorrhage;
ED.DiscHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.DiscHaemorrhage.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-490, -400);
}

/**
 * Sets default parameters
 */
ED.DiscHaemorrhage.prototype.setParameterDefaults = function()
{
    this.arc = 10 * Math.PI/180;
    this.apexY = -350;

    this.setRotationWithDisplacements(150,-120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DiscHaemorrhage.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.DiscHaemorrhage.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = -this.apexY;
    var ri = 250;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of DiscHaemorrhage
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DiscHaemorrhage.prototype.groupDescription = function()
{
	return  "Disc haemorrhage at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DiscHaemorrhage.prototype.description = function()
{
	return this.clockHour() + " o'clock";
}

/**
 * OpticDiscPit Acquired Pit of Optic Nerve (APON)
 *
 * @class OpticDiscPit
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.OpticDiscPit = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "OpticDiscPit";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.OpticDiscPit.prototype = new ED.Doodle;
ED.OpticDiscPit.prototype.constructor = ED.OpticDiscPit;
ED.OpticDiscPit.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.OpticDiscPit.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.OpticDiscPit.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +3);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +3);
}

/**
 * Sets default parameters
 */
ED.OpticDiscPit.prototype.setParameterDefaults = function()
{
    this.originY = 130;
    this.apexY = 0;
    this.scaleX = 1.5;
    
    // Pits are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -50;
    }
    else
    {
        this.originX = 50;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.OpticDiscPit.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.OpticDiscPit.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Round hole
    var r = 80;
	ctx.arc(0, 0, r, 0, Math.PI*2, true);
    
	// Close path
	ctx.closePath();
    
    // Radial gradient
    var lightGray = "rgba(200, 200, 200, 0.75)";
    var darkGray = "rgba(100, 100, 100, 0.75)";
    var gradient = ctx.createRadialGradient(0, 0, r, 0, 0, 10);
    gradient.addColorStop(0, darkGray);
    gradient.addColorStop(1, lightGray);
    
	ctx.fillStyle = gradient;
	ctx.lineWidth = 2;
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(55, -55));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
 	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.OpticDiscPit.prototype.description = function()
{
    return "Acquired pit of optic nerve";
}

/**
 * Disc Haemorrhage
 *
 * @class DiscPallor
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.DiscPallor = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DiscPallor";

    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.grade = 'Sectorial';
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DiscPallor.prototype = new ED.Doodle;
ED.DiscPallor.prototype.constructor = ED.DiscPallor;
ED.DiscPallor.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DiscPallor.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.DiscPallor.prototype.setPropertyDefaults = function()
{
    this.isArcSymmetrical = true;
	this.isMoveable = false;
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['grade'] = {kind:'derived', type:'string', list:['Sectorial', 'Diffuse'], animate:true};
    
    // Speed up animation for arc
    this.parameterValidationArray['arc']['delta'] = 0.2;
}

/**
 * Sets default parameters
 */
ED.DiscPallor.prototype.setParameterDefaults = function()
{
    this.arc = 60 * Math.PI/180;
    this.setRotationWithDisplacements(45,-120);
    this.setParameterFromString('grade', 'Sectorial');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.DiscPallor.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'arc':
            if (_value < 2 * Math.PI) returnArray['grade'] = 'Sectorial';
            else returnArray['grade'] = 'Diffuse';
            break;
            
        case 'grade':
            switch (_value)
            {
                case 'Sectorial':
                    if (this.arc < 2 * Math.PI) returnArray['arc'] = this.arc;
                    else returnArray['arc'] = Math.PI/2;
                    break;
                case 'Diffuse':
                    returnArray['arc'] = 2 * Math.PI;
                    break;
            }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DiscPallor.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.DiscPallor.superclass.draw.call(this, _point);
    
	// Radius of disc
	var ro = 300;
    
    // Get inner radius from OpticDisk doodle
    var opticDisc = this.drawing.firstDoodleOfClass('OpticDisc');
    if (opticDisc)
    {
        var ri = opticDisc.minimumRadius();
    }
    else
    {
        var ri = 150;
    }
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of DiscPallor
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DiscPallor.prototype.groupDescription = function()
{
    if (this.grade == 'Diffuse')
    {
        return "Diffuse disc pallor";
    }
    else
    {
        return  "Disc pallor at ";
    }
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DiscPallor.prototype.description = function()
{
    if (this.grade == 'Diffuse')
    {
        return "";
    }
    else
    {
        return this.clockHour() + " o'clock";
    }
}

/**
 * Papilloedema
 *
 * @class Papilloedema
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Papilloedema = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Papilloedema";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Papilloedema.prototype = new ED.Doodle;
ED.Papilloedema.prototype.constructor = ED.Papilloedema;
ED.Papilloedema.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Papilloedema.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.Papilloedema.prototype.setParameterDefaults = function()
{
    this.radius = 375;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Papilloedema.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Papilloedema.superclass.draw.call(this, _point);
    
    var ro = this.radius + 75;
    var ri = this.radius - 75;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, Math.PI * 2, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, Math.PI * 2, 0, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
    
    // Colors for gradient
    yellowColour = "rgba(255, 255, 0, 0.75)";
    var brownColour = "rgba(240, 140, 40, 0.75)";
    
    // Radial gradient
    var gradient = ctx.createRadialGradient(0, 0, this.radius + 75, 0, 0, this.radius - 75);
    gradient.addColorStop(0, yellowColour);
    gradient.addColorStop(1, brownColour);
    
	ctx.fillStyle = gradient;
	ctx.strokeStyle = "rgba(0,0,0,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Papilloedema.prototype.description = function()
{
	return "Papilloedema";
}

/**
 * Transillumination defect
 *
 * @class TransilluminationDefect
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.TransilluminationDefect = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "TransilluminationDefect";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TransilluminationDefect.prototype = new ED.Doodle;
ED.TransilluminationDefect.prototype.constructor = ED.TransilluminationDefect;
ED.TransilluminationDefect.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TransilluminationDefect.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Set default properties
 */
ED.TransilluminationDefect.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/8, Math.PI * 2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.TransilluminationDefect.prototype.setParameterDefaults = function()
{
    this.arc = 360 * Math.PI/180;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + (this.drawing.eye == ED.eye.Right?-1:1) * (doodle.arc/2 + this.arc/2 + Math.PI/12);
    }
    else
    {
        this.rotation = (this.drawing.eye == ED.eye.Right?-1:1) * this.arc/2;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TransilluminationDefect.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.TransilluminationDefect.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 380;
    var ri = 280;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of TransilluminationDefect
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spot data
        var sr = 30;
        var inc = Math.PI/8;
        
        // Iterate through radius and angle to draw spots
        for (var a = -Math.PI/2 - arcStart + inc/2; a < this.arc - Math.PI/2 - arcStart; a += inc )
        {
            var p = new ED.Point(0,0);
            p.setWithPolars(r, a);
            this.drawCircle(ctx, p.x, p.y, sr, "rgba(255,255,255,1)", 4, "rgba(255,255,255,1)");
        }
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.TransilluminationDefect.prototype.description = function()
{
	return "Transillumination defects of iris";
}

/**
 * Krukenberg's spindle
 *
 * @class KrukenbergSpindle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.KrukenbergSpindle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "KrukenbergSpindle";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.KrukenbergSpindle.prototype = new ED.Doodle;
ED.KrukenbergSpindle.prototype.constructor = ED.KrukenbergSpindle;
ED.KrukenbergSpindle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.KrukenbergSpindle.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.KrukenbergSpindle.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.3, +0.6);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +3);
}

/**
 * Sets default parameters
 */
ED.KrukenbergSpindle.prototype.setParameterDefaults = function()
{
    this.originY = 100;
    this.scaleX = 0.5;
    this.scaleY = 2;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.KrukenbergSpindle.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.KrukenbergSpindle.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// Krukenberg Spindle
    var r = 100;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Create fill
    ctx.fillStyle = "rgba(255,128,0,0.5)";
    
    // Stroke
	ctx.strokeStyle = "rgba(255,128,0,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.KrukenbergSpindle.prototype.description = function()
{
    return "Krukenberg spindle";
}

/**
 * Posterior embryotoxon
 *
 * @class PosteriorEmbryotoxon
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PosteriorEmbryotoxon = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PosteriorEmbryotoxon";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PosteriorEmbryotoxon.prototype = new ED.Doodle;
ED.PosteriorEmbryotoxon.prototype.constructor = ED.PosteriorEmbryotoxon;
ED.PosteriorEmbryotoxon.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.PosteriorEmbryotoxon.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PosteriorEmbryotoxon.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PosteriorEmbryotoxon.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside pupil edge
	var ro = 370;
    var ri = 340;
	
	// Calculate parameters for arcs
	var arcStart = 0;
	var arcEnd = 2 * Math.PI;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(255,255,255,0.6)";
	ctx.strokeStyle = "rgba(255,255,255,0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PosteriorEmbryotoxon.prototype.description = function()
{
    return "Posterior Embryotoxon";
}

/**
 * Keratic precipitates
 *
 * @class KeraticPrecipitates
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.KeraticPrecipitates = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "KeraticPrecipitates";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.KeraticPrecipitates.prototype = new ED.Doodle;
ED.KeraticPrecipitates.prototype.constructor = ED.KeraticPrecipitates;
ED.KeraticPrecipitates.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.KeraticPrecipitates.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.KeraticPrecipitates.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +40);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.KeraticPrecipitates.prototype.setParameterDefaults = function()
{
    // Hard drusen is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.KeraticPrecipitates.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.KeraticPrecipitates.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    var r = 200;
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Colours
        var fill = "rgba(110, 110, 110, 0.5)";
        //var fill = "rgba(210, 210, 210, 0.5)";
        
        var dr = 10 * ((this.apexX + 20)/20)/this.scaleX;
        
        var p = new ED.Point(0,0);
        var n = 40 + Math.abs(Math.floor(this.apexY/2));
        for (var i = 0; i < n; i++)
        {
            p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);
            this.drawSpot(ctx, p.x, p.y, dr, fill);
        }
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.KeraticPrecipitates.prototype.description = function()
{
    return this.apexX > 20?"Mutton fat keratic precipitates":"Keratic precipitates";
}

/**
 * A Visual field
 *
 * @class VisualField
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.VisualField = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "VisualField";
    
    // Private parameters
    this.numberOfHandles = 8;
    
    // Blind spot x coordinate
    this.blindSpotX = 0;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.VisualField.prototype = new ED.Doodle;
ED.VisualField.prototype.constructor = ED.VisualField;
ED.VisualField.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.VisualField.prototype.setHandles = function()
{
    // Array of handles for expert mode
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        this.handleArray[i] = new ED.Handle(null, true, ED.Mode.Handles, false);
    }
    
    // Apex handle for basic mode
    this.handleArray[this.numberOfHandles] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.VisualField.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isDeletable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-320, -20);
    
    // Create ranges to constrain handles
    this.handleVectorRangeArray = new Array();
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        // Full circle in radians
        var cir = 2 * Math.PI;
        
        // Create a range object for each handle
        var range = new Object;
        range.length = new ED.Range(+0, +400);
        range.angle = new ED.Range(((15 * cir/16) + i * cir/8) % cir, ((1 * cir/16) + i * cir/8) % cir);
        this.handleVectorRangeArray[i] = range;
    }
}

/**
 * Sets default parameters
 */
ED.VisualField.prototype.setParameterDefaults = function()
{
    this.apexY = -40;
    
    // Create a squiggle to store the handles points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
    
    // Add it to squiggle array
    this.squiggleArray.push(squiggle);
    
    // Populate with points around circumference
    var defaultPointsArray = [[0,-370],[300,-260],[400,0],[300,260],[0,370],[-300,260],[-400,0],[-300,-260]];
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        var coordArray = defaultPointsArray[i];
        var point = new ED.Point(coordArray[0], coordArray[1]);
        this.addPointToSquiggle(point);
    }
    
    // Adjust for eye
    if (this.drawing.eye == ED.eye.Right)
    {
        this.squiggleArray[0].pointsArray[3].x = 220;
        this.squiggleArray[0].pointsArray[3].y = 170;
        this.blindSpotX = -120;
    }
    else
    {
        this.squiggleArray[0].pointsArray[5].x = -220;
        this.squiggleArray[0].pointsArray[5].y = 170;
        this.blindSpotX = +120;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VisualField.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.VisualField.superclass.draw.call(this, _point);
    
	// Boundary path
    ctx.beginPath();

    // Bezier points
    var fp;
    var tp;
    var cp1;
    var cp2;

    // Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
    var phi = 2 * Math.PI/(3 * this.numberOfHandles);

    // Start curve
    ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);

    // Complete curve segments
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        // From and to points
        fp = this.squiggleArray[0].pointsArray[i];
        var toIndex = (i < this.numberOfHandles - 1)?i + 1:0;
        tp = this.squiggleArray[0].pointsArray[toIndex];

        // Bezier or straight depending on distance from centre
        if (fp.length() < 100 || tp.length() < 100)
        {
            ctx.lineTo(tp.x, tp.y);
        }
        else
        {
            // Control points
            cp1 = fp.tangentialControlPoint(+phi);
            cp2 = tp.tangentialControlPoint(-phi);

            // Draw Bezier curve
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
        }
    }

    
    // Blind spot
    ctx.moveTo(this.blindSpotX - this.apexY, 0);
    ctx.arc(this.blindSpotX, 0, -this.apexY, 0, Math.PI*2, true);
    
    ctx.closePath();

    // Set attributes
	ctx.lineWidth = 2;
    ctx.fillStyle = "lightGray";
	ctx.strokeStyle = "black";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Axis lines
        ctx.beginPath();
        ctx.moveTo(0, -450);
        ctx.lineTo(0, 450);
        ctx.moveTo(-450, 0);
        ctx.lineTo(450, 0);
        ctx.lineWidth = 8;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    
	// Coordinates of expert handles (in canvas plane)
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
    }
    
    // Location of apex handle
    this.handleArray[this.numberOfHandles].location = this.transform.transformPoint(new ED.Point(this.blindSpotX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.VisualField.prototype.description = function()
{
    return "";
}

/**
 * A Visual field chart
 *
 * @class VisualFieldChart
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.VisualFieldChart = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "VisualFieldChart";
    
    // Private parameters
    this.numberOfHandles = 8;
    
    // Blind spot x coordinate
    this.blindSpotX = 0;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.VisualFieldChart.prototype = new ED.Doodle;
ED.VisualFieldChart.prototype.constructor = ED.VisualFieldChart;
ED.VisualFieldChart.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.VisualFieldChart.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
}

/**
 * Sets default parameters
 */
ED.VisualFieldChart.prototype.setParameterDefaults = function()
{
    // Create a squiggle to store the handles points
    var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);
    
    // Add it to squiggle array
    this.squiggleArray.push(squiggle);
    
    // Populate with points around circumference
    var defaultPointsArray = [[0,-370],[300,-260],[400,0],[300,260],[0,370],[-300,260],[-400,0],[-300,-260]];
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        var coordArray = defaultPointsArray[i];
        var point = new ED.Point(coordArray[0], coordArray[1]);
        this.addPointToSquiggle(point);
    }
    
    // Adjust for eye
    if (this.drawing.eye == ED.eye.Right)
    {
        this.squiggleArray[0].pointsArray[3].x = 220;
        this.squiggleArray[0].pointsArray[3].y = 170;
        this.blindSpotX = -120;
    }
    else
    {
        this.squiggleArray[0].pointsArray[5].x = -220;
        this.squiggleArray[0].pointsArray[5].y = 170;
        this.blindSpotX = +120;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VisualFieldChart.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.VisualFieldChart.superclass.draw.call(this, _point);
    
	// Boundary path
    ctx.beginPath();
    
    // Bezier points
    var fp;
    var tp;
    var cp1;
    var cp2;
    
    // Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
    var phi = 2 * Math.PI/(3 * this.numberOfHandles);
    
    // Start curve
    ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
    
    // Complete curve segments
    for (var i = 0; i < this.numberOfHandles; i++)
    {
        // From and to points
        fp = this.squiggleArray[0].pointsArray[i];
        var toIndex = (i < this.numberOfHandles - 1)?i + 1:0;
        tp = this.squiggleArray[0].pointsArray[toIndex];
        
        // Control points
        cp1 = fp.tangentialControlPoint(+phi);
        cp2 = tp.tangentialControlPoint(-phi);
        
        // Draw Bezier curve
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
    }
    
    ctx.closePath();
    
    // Set attributes
	ctx.lineWidth = 2;
    ctx.fillStyle = "gray";
	ctx.strokeStyle = "black";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Conjunctival flap
 *
 * @class ConjunctivalFlap
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ConjunctivalFlap = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ConjunctivalFlap";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ConjunctivalFlap.prototype = new ED.Doodle;
ED.ConjunctivalFlap.prototype.constructor = ED.ConjunctivalFlap;
ED.ConjunctivalFlap.superclass = ED.Doodle.prototype;


/**
 * Sets handle attributes
 */
ED.ConjunctivalFlap.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.ConjunctivalFlap.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-640, -100);
    this.parameterValidationArray['arc']['range'].setMinAndMax(60 * Math.PI/180, 160 * Math.PI/180);
}

/**
 * Sets default parameters
 */
ED.ConjunctivalFlap.prototype.setParameterDefaults = function()
{
    this.arc = 120 * Math.PI/180;
    this.apexY = -620;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ConjunctivalFlap.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.NerveFibreDefect.superclass.draw.call(this, _point);

    // Radius of limbus
    var r = 380;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Offset angle for control points
    var phi = this.arc/6;
    
    // Apex point
    var apex = new ED.Point(this.apexX, this.apexY);
    
    // Coordinates of corners of flap
    var right = new ED.Point(r * Math.sin(theta), - r * Math.cos(theta));
    var left = new ED.Point(- r * Math.sin(theta), - r * Math.cos(theta));
	
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);

    // Curved flap, bp bezier proportion is adjustment factor
    var bp = 0.8;
    ctx.bezierCurveTo(left.x, left.y, bp * left.x, apex.y, apex.x, apex.y);
    ctx.bezierCurveTo(bp * right.x, apex.y, right.x, right.y, right.x, right.y);
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(left);
	this.handleArray[3].location = this.transform.transformPoint(right);
	this.handleArray[4].location = this.transform.transformPoint(apex);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ConjunctivalFlap.prototype.description = function()
{
    return (this.apexY < -280?"Fornix based ":"Limbus based ") + "flap";
}

/**
 * PartialThicknessScleralFlap
 *
 * @class PartialThicknessScleralFlap
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PartialThicknessScleralFlap = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PartialThicknessScleralFlap";
	
	// Doodle specific parameters
	this.r = 380;
	this.right = new ED.Point(0,0);
	this.left = new ED.Point(0,0);
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PartialThicknessScleralFlap.prototype = new ED.Doodle;
ED.PartialThicknessScleralFlap.prototype.constructor = ED.PartialThicknessScleralFlap;
ED.PartialThicknessScleralFlap.superclass = ED.Doodle.prototype;


/**
 * Sets handle attributes
 */
ED.PartialThicknessScleralFlap.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PartialThicknessScleralFlap.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-580, -520);
    this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI/180, 80 * Math.PI/180);
}

/**
 * Sets default parameters
 */
ED.PartialThicknessScleralFlap.prototype.setParameterDefaults = function()
{
    this.arc = 50 * Math.PI/180;
    this.apexY = -540;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PartialThicknessScleralFlap.prototype.dependentParameterValues = function(_parameter, _value)
{

    var returnArray = new Array();

    switch (_parameter)
    {
        case 'rotation':
			//console.log(_parameter);
// Coordinates of corners of flap
// 			this.right.x = this.r * Math.sin(theta);
// 			this.right.y = - this.r * Math.cos(theta);
// 			this.left.x = - this.r * Math.sin(theta);
// 			this.left.y = - this.r * Math.cos(theta);
    		
            break;
//         
//         case 'overallGauge':
//             returnArray['gauge'] = _value;
//             break;
//             
//         case 'gauge':
//             if (_value == "20g") returnArray['apexY'] = -650;
//             else if (_value == "23g") returnArray['apexY'] = -600;
//             else if (_value == "25g") returnArray['apexY'] = -550;
//             else returnArray['apexY'] = -500;
//             break;
//             
//         case 'arc':
//             if (_value < 2) returnArray['isSutured'] = false;
//             else returnArray['isSutured'] = true;
//             break;
//             
//         case 'isSutured':
//             if (_value) returnArray['arc'] = 3;
//             else returnArray['arc'] = 1;
//             break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PartialThicknessScleralFlap.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PartialThicknessScleralFlap.superclass.draw.call(this, _point);
    
    // Radius of limbus
    //var r = this.r;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Offset angle for control points
    var phi = this.arc/6;
    
    // Apex point
    var apex = new ED.Point(this.apexX, this.apexY);
    
	this.right.x = this.r * Math.sin(theta);
	this.right.y = - this.r * Math.cos(theta);
	this.left.x = - this.r * Math.sin(theta);
	this.left.y = - this.r * Math.cos(theta);
	
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, this.r, arcStart, arcEnd, true);
    
    // Rectangular flap
    ctx.lineTo(this.left.x, this.apexY);
    ctx.lineTo(this.right.x, this.apexY);
    ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(220,220,150,0.5)";

	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Draw sclerotomy at half width and height    
        var angle = theta/2;
        arcStart = - Math.PI/2 + angle;
        arcEnd = - Math.PI/2 - angle;
        var top = new ED.Point(this.apexX, -this.r + (this.apexY + this.r)/2);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.r, arcStart, arcEnd, true);
        ctx.lineTo(- this.r * Math.sin(angle), top.y);
        ctx.lineTo(this.r * Math.sin(angle), top.y);
        ctx.closePath();
        
        // Colour of fill
        ctx.fillStyle = "gray";
        ctx.fill();
        
//         ctx.beginPath();
// 		ctx.moveTo(-400, 0);
// 		ctx.lineTo(+400, 0);
// 		ctx.moveTo(0, -400);
// 		ctx.lineTo(0, +400);
// 		ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(this.left);
	this.handleArray[3].location = this.transform.transformPoint(this.right);
	this.handleArray[4].location = this.transform.transformPoint(apex);
	
	// Draw handles if selected
	//if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PartialThicknessScleralFlap.prototype.description = function()
{
    return (this.apexY < -280?"Fornix based ":"Limbus based ") + "flap";
}

/**
 * ArcuateScotoma
 *
 * @class ArcuateScotoma
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ArcuateScotoma = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ArcuateScotoma";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ArcuateScotoma.prototype = new ED.Doodle;
ED.ArcuateScotoma.prototype.constructor = ED.ArcuateScotoma;
ED.ArcuateScotoma.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ArcuateScotoma.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.ArcuateScotoma.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.isRotatable = false;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(140, +300);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters
 */
ED.ArcuateScotoma.prototype.setParameterDefaults = function()
{
    // Default arc
    this.arc = 60 * Math.PI/180;
    this.apexX = 200;
    
    // Eye
    if (this.drawing.eye == ED.eye.Left) this.scaleX = this.scaleX * -1;
    
    // Make a second one opposite to the first
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.scaleY = doodle.scaleY * -1;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ArcuateScotoma.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ArcuateScotoma.superclass.draw.call(this, _point);

    // Dimensions
    var bs = -100;
    var be = 100;
    var ts = -140;
    
    var r = (be - bs)/2;
    var x = bs + r;
    
    // Boundary path
	ctx.beginPath();
    
    // Arcuate scotoma base
    ctx.arc(x, 0, r, - Math.PI, 0, false);
    ctx.lineTo(this.apexX, 0);
    
    // Arcuate scotoma top
    r = (this.apexX - ts)/2;
    x = ts + r;
    ctx.arc(x, 0, r, 0, - Math.PI, true);
	ctx.closePath();
    
    // Set attributes
	ctx.lineWidth = 6;
    ctx.fillStyle = "gray";
	ctx.strokeStyle = "black";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ArcuateScotoma.prototype.description = function()
{
    return this.scaleY > 0?"Superior":"Inferior" +  " arcuate scotoma";
}

/**
 * Trabectome
 *
 * @class Trabectome
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Trabectome = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Trabectome";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Trabectome.prototype = new ED.Doodle;
ED.Trabectome.prototype.constructor = ED.Trabectome;
ED.Trabectome.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Trabectome.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default properties
 */
ED.Trabectome.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isArcSymmetrical = true;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/16, Math.PI);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Trabectome.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/4;
    this.setRotationWithDisplacements(-90, -120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Trabectome.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Trabectome.superclass.draw.call(this, _point);
    
	// Radius of outer curve and inner curve
	var ro = 440;
    var ri = 400;
    
    // Dimensions of instrument
    var vo = 500;
    var sw = 10;
    var sl = 760;
    var cl = 100;
    var hw = 150;
    var hl = 170;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of Trabectome
    var rm = (ro + ri)/2;
	var topRightX = rm * Math.sin(theta);
	var topRightY = - rm * Math.cos(theta);
	var topLeftX = - rm * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// arc back again
    ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
    ctx.moveTo(-sw, vo -(cl + sl));
    ctx.lineTo(0, vo -(cl + sl) - sw);
    ctx.lineTo(sw, vo -(cl + sl));
    ctx.lineTo(sw, vo - cl);
    ctx.lineTo(hw, vo);
    ctx.lineTo(hw, vo + hl);
    ctx.lineTo(-hw, vo + hl);
    ctx.lineTo(-hw, vo);
    ctx.lineTo(-sw, vo - cl);
    ctx.lineTo(-sw, vo -(cl + sl));
    
	// Set line attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
    ctx.strokeStyle = "rgba(200, 200, 200, 0.8)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Re-do ablation area
        ctx.beginPath();
        ctx.arc(0, 0, ro, arcStart, arcEnd, true);
        ctx.arc(0, 0, ri, arcEnd, arcStart, false);
        ctx.fillStyle = "rgba(200, 100, 100, 0.8)";
        ctx.strokeStyle = "red";
        ctx.fill();
        ctx.stroke();
        
        // Put in corneal incision
        var cr =  334;
        var cd = 30;
        var cro = cr + cd;
        var cri = cr - cd;
        ctx.beginPath();
        var ctheta = 0.125;
        ctx.arc(0, 0, cro, Math.PI/2 + ctheta, Math.PI/2 - ctheta, true);
        ctx.arc(0, 0, cri, Math.PI/2 - ctheta, Math.PI/2 + ctheta, false);
        ctx.fillStyle = "rgba(200,200,200,0.75)";
        ctx.strokeStyle = "rgba(120,120,120,0.75)";
        ctx.fill();
        ctx.stroke();
    }
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Trabectome.prototype.description = function()
{
    return "Trabecular meshwork ablation of " + this.degreesExtent() + " degrees centred around " + this.clockHour() + " o'clock";
}

/**
 * Baerveldt tube
 *
 * @class Baerveldt
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Baerveldt = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Baerveldt";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.platePosition = 'STQ';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Baerveldt.prototype = new ED.Doodle;
ED.Baerveldt.prototype.constructor = ED.Baerveldt;
ED.Baerveldt.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Baerveldt.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Baerveldt.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = true;
    this.snapToAngles = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-600, -100);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['platePosition'] = {kind:'derived', type:'string', list:['STQ', 'SNQ', 'INQ', 'ITQ'], animate:true};
    
    // Array of angles to snap to
    var phi = Math.PI/4;
    this.anglesArray = [phi, 3 * phi, 5 * phi, 7 * phi];
}

/**
 * Sets default parameters
 */
ED.Baerveldt.prototype.setParameterDefaults = function()
{
    this.apexY = -300;
    this.setParameterFromString('platePosition', 'STQ');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Baerveldt.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();

    var isRE = (this.drawing.eye == ED.eye.Right);
    var phi = Math.PI/4;
    
    switch (_parameter)
    {
        case 'rotation':
            if (this.rotation > 0 && this.rotation <= 2 * phi)
            {
                returnArray['platePosition'] = isRE?'SNQ':'STQ';
            }
            else if (this.rotation > 2 * phi && this.rotation <= 4 * phi)
            {
                returnArray['platePosition'] = isRE?'INQ':'ITQ';
            }
            else if (this.rotation > 4 * phi && this.rotation <= 6 * phi)
            {
                returnArray['platePosition'] = isRE?'ITQ':'INQ';
            }
            else
            {
                returnArray['platePosition'] = isRE?'STQ':'SNQ';
            }
            break;
            
        case 'platePosition':
            switch (_value)
            {
                case 'STQ':
                    if (isRE)
                    {
                        returnArray['rotation'] = 7 * phi;
                    }
                    else
                    {
                        returnArray['rotation'] = phi;
                    }
                    break;
                case 'SNQ':
                    if (isRE)
                    {
                        returnArray['rotation'] = phi;
                    }
                    else
                    {
                        returnArray['rotation'] = 7 * phi;
                    }
                    break;
                case 'INQ':
                    if (isRE)
                    {
                        returnArray['rotation'] = 3 * phi;
                    }
                    else
                    {
                        returnArray['rotation'] = 5 * phi;
                    }
                    break;
                case 'ITQ':
                    if (isRE)
                    {
                        returnArray['rotation'] = 5 * phi;
                    }
                    else
                    {
                        returnArray['rotation'] = 3 * phi;
                    }
                    break;
            }
            break;
    }

    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Baerveldt.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Baerveldt.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Scaling factor
    var s = 0.41666667;
    
    // Vertical shift
    var d = -740;
    
    // Plate
    ctx.moveTo(-400	* s, 0 * s + d);
    ctx.bezierCurveTo(-400 * s, -100 * s + d, -300 * s, -200 * s + d, -200 * s, -200 * s + d);
    ctx.bezierCurveTo(-100 * s, -200 * s + d, -58 * s, -136 * s + d, 0 * s, -135 * s + d);
    ctx.bezierCurveTo(54 * s, -136 * s + d, 100 * s, -200 * s + d, 200 * s, -200 * s + d);
    ctx.bezierCurveTo(300 * s, -200 * s + d, 400 * s, -100 * s + d, 400 * s, 0 * s + d);
    ctx.bezierCurveTo(400 * s, 140 * s + d, 200 * s, 250 * s + d, 0 * s, 250 * s + d);
    ctx.bezierCurveTo(-200 * s, 250 * s + d, -400 * s, 140 * s + d, -400 * s, 0 * s + d);
    
    // Connection flange
    ctx.moveTo(-160 * s, 230 * s + d);
    ctx.lineTo(-120 * s, 290 * s + d);
    ctx.lineTo(120 * s, 290 * s + d);
    ctx.lineTo(160 * s, 230 * s + d);
    ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);
    
    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spots
        this.drawSpot(ctx, -240 * s, -40 * s + d, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, -120 * s, 40 * s + d, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, 120 * s, 40 * s + d, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, 240 * s, -40 * s + d, 10, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, -100 * s, 260 * s + d, 5, "rgba(150,150,150,0.5)");
        this.drawSpot(ctx, 100 * s, 260 * s + d, 5, "rgba(150,150,150,0.5)");
        
        // Ridge on flange
        ctx.beginPath()
        ctx.moveTo(-30 * s, 250 * s + d);
        ctx.lineTo(-30 * s, 290 * s + d);
        ctx.moveTo(30 * s, 250 * s + d);
        ctx.lineTo(30 * s, 290 * s + d);
        
        // Tube
        ctx.moveTo(-20 * s, 290 * s + d);
        ctx.lineTo(-20 * s, this.apexY);
        ctx.lineTo(20 * s, this.apexY);
        ctx.lineTo(20 * s, 290 * s + d);
        
        ctx.strokeStyle = "rgba(150,150,150,0.5)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Baerveldt.prototype.description = function()
{
    var descArray = {STQ:'superotemporal', SNQ:'superonasal', INQ:'inferonasal', ITQ:'inferotemporal'};
    
    return "Baerveldt tube in the "+ descArray[this.platePosition] + " quadrant";
}

/**
 * Ahmed tube
 *
 * @class Ahmed
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Ahmed = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Ahmed";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.platePosition = 'STQ';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Ahmed.prototype = new ED.Doodle;
ED.Ahmed.prototype.constructor = ED.Ahmed;
ED.Ahmed.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Ahmed.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Ahmed.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = true;
    this.snapToAngles = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-600, -100);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['platePosition'] = {kind:'derived', type:'string', list:['STQ', 'SNQ', 'INQ', 'ITQ'], animate:true};
    
    // Array of angles to snap to
    var phi = Math.PI/4;
    this.anglesArray = [phi, 3 * phi, 5 * phi, 7 * phi];
}

/**
 * Sets default parameters
 */
ED.Ahmed.prototype.setParameterDefaults = function()
{
    this.apexY = -300;
    this.setParameterFromString('platePosition', 'STQ');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Ahmed.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    var isRE = (this.drawing.eye == ED.eye.Right);
    var phi = Math.PI/4;
    
    switch (_parameter)
    {
        case 'rotation':
            if (this.rotation > 0 && this.rotation <= 2 * phi)
            {
                returnArray['platePosition'] = isRE?'SNQ':'STQ';
            }
            else if (this.rotation > 2 * phi && this.rotation <= 4 * phi)
            {
                returnArray['platePosition'] = isRE?'INQ':'ITQ';
            }
            else if (this.rotation > 4 * phi && this.rotation <= 6 * phi)
            {
                returnArray['platePosition'] = isRE?'ITQ':'INQ';
            }
            else
            {
                returnArray['platePosition'] = isRE?'STQ':'SNQ';
            }
            break;
            
        case 'platePosition':
            switch (_value)
        {
            case 'STQ':
                if (isRE)
                {
                    returnArray['rotation'] = 7 * phi;
                }
                else
                {
                    returnArray['rotation'] = phi;
                }
                break;
            case 'SNQ':
                if (isRE)
                {
                    returnArray['rotation'] = phi;
                }
                else
                {
                    returnArray['rotation'] = 7 * phi;
                }
                break;
            case 'INQ':
                if (isRE)
                {
                    returnArray['rotation'] = 3 * phi;
                }
                else
                {
                    returnArray['rotation'] = 5 * phi;
                }
                break;
            case 'ITQ':
                if (isRE)
                {
                    returnArray['rotation'] = 5 * phi;
                }
                else
                {
                    returnArray['rotation'] = 3 * phi;
                }
                break;
        }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Ahmed.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Ahmed.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Scaling factor
    var s = 0.41666667;
    
    // Vertical shift
    var d = -740;
    
    // Plate
    ctx.moveTo(-300	* s, 0 * s + d);
    ctx.bezierCurveTo(-300 * s, -100 * s + d, -200 * s, -400 * s + d, 0 * s, -400 * s + d);
    ctx.bezierCurveTo(200 * s, -400 * s + d, 300 * s, -100 * s + d, 300 * s, 0 * s + d);
    ctx.bezierCurveTo(300 * s, 140 * s + d, 200 * s, 250 * s + d, 0 * s, 250 * s + d);
    ctx.bezierCurveTo(-200 * s, 250 * s + d, -300 * s, 140 * s + d, -300 * s, 0 * s + d);
    
    // Connection flange
    ctx.moveTo(-160 * s, 230 * s + d);
    ctx.lineTo(-120 * s, 290 * s + d);
    ctx.lineTo(120 * s, 290 * s + d);
    ctx.lineTo(160 * s, 230 * s + d);
    ctx.bezierCurveTo(120 * s, 250 * s + d, -120 * s, 250 * s + d, -160 * s, 230 * s + d);
    
    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spots
        this.drawSpot(ctx, 0 * s, -230 * s + d, 20 * s, "white");
        this.drawSpot(ctx, -180 * s, -180 * s + d, 20 * s, "white");
        this.drawSpot(ctx, 180 * s, -180 * s + d, 20 * s, "white");
        
        // Trapezoid mechanism
        ctx.beginPath()
        ctx.moveTo(-100 * s, 230 * s + d);
        ctx.lineTo(100 * s, 230 * s + d);
        ctx.lineTo(200 * s, 0 * s + d);
        ctx.lineTo(40 * s, 0 * s + d);
        ctx.arcTo(0, -540 * s + d, -40 * s, 0 * s + d, 15);
        ctx.lineTo(-40 * s, 0 * s + d);
        ctx.lineTo(-200 * s, 0 * s + d);
        ctx.closePath();
        
        ctx.fillStyle = "rgba(250,250,250,0.7)";
        ctx.fill();
        
        // Lines
        ctx.moveTo(-80 * s, -40 * s + d);
        ctx.lineTo(-160 * s, -280 * s + d);
        ctx.moveTo(80 * s, -40 * s + d);
        ctx.lineTo(160 * s, -280 * s + d);
        ctx.lineWidth = 8;
        ctx.strokeStyle = "rgba(250,250,250,0.7)";
        ctx.stroke();

        // Ridge on flange
        ctx.beginPath()
        ctx.moveTo(-30 * s, 250 * s + d);
        ctx.lineTo(-30 * s, 290 * s + d);
        ctx.moveTo(30 * s, 250 * s + d);
        ctx.lineTo(30 * s, 290 * s + d);
        
        // Tube
        ctx.moveTo(-20 * s, 290 * s + d);
        ctx.lineTo(-20 * s, this.apexY);
        ctx.lineTo(20 * s, this.apexY);
        ctx.lineTo(20 * s, 290 * s + d);
        
        ctx.strokeStyle = "rgba(150,150,150,0.5)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Ahmed.prototype.description = function()
{
    var descArray = {STQ:'superotemporal', SNQ:'superonasal', INQ:'inferonasal', ITQ:'inferotemporal'};
    
    return "Ahmed tube in the "+ descArray[this.platePosition] + " quadrant";
}

/**
 * Molteno tube
 *
 * @class Molteno
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Molteno = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Molteno";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.platePosition = 'STQ';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Molteno.prototype = new ED.Doodle;
ED.Molteno.prototype.constructor = ED.Molteno;
ED.Molteno.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Molteno.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Molteno.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = true;
    this.snapToAngles = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-600, -100);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['platePosition'] = {kind:'derived', type:'string', list:['STQ', 'SNQ', 'INQ', 'ITQ'], animate:true};
    
    // Array of angles to snap to
    var phi = Math.PI/4;
    this.anglesArray = [phi, 3 * phi, 5 * phi, 7 * phi];
}

/**
 * Sets default parameters
 */
ED.Molteno.prototype.setParameterDefaults = function()
{
    this.apexY = -300;
    this.setParameterFromString('platePosition', 'STQ');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Molteno.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    var isRE = (this.drawing.eye == ED.eye.Right);
    var phi = Math.PI/4;
    
    switch (_parameter)
    {
        case 'rotation':
            if (this.rotation > 0 && this.rotation <= 2 * phi)
            {
                returnArray['platePosition'] = isRE?'SNQ':'STQ';
            }
            else if (this.rotation > 2 * phi && this.rotation <= 4 * phi)
            {
                returnArray['platePosition'] = isRE?'INQ':'ITQ';
            }
            else if (this.rotation > 4 * phi && this.rotation <= 6 * phi)
            {
                returnArray['platePosition'] = isRE?'ITQ':'INQ';
            }
            else
            {
                returnArray['platePosition'] = isRE?'STQ':'SNQ';
            }
            break;
            
        case 'platePosition':
            switch (_value)
        {
            case 'STQ':
                if (isRE)
                {
                    returnArray['rotation'] = 7 * phi;
                }
                else
                {
                    returnArray['rotation'] = phi;
                }
                break;
            case 'SNQ':
                if (isRE)
                {
                    returnArray['rotation'] = phi;
                }
                else
                {
                    returnArray['rotation'] = 7 * phi;
                }
                break;
            case 'INQ':
                if (isRE)
                {
                    returnArray['rotation'] = 3 * phi;
                }
                else
                {
                    returnArray['rotation'] = 5 * phi;
                }
                break;
            case 'ITQ':
                if (isRE)
                {
                    returnArray['rotation'] = 5 * phi;
                }
                else
                {
                    returnArray['rotation'] = 3 * phi;
                }
                break;
        }
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Molteno.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Molteno.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Scaling factor
    var s = 0.41666667;
    
    // Vertical shift
    var d = -740;
    
    // Plate
    ctx.arc(0, d, 310 * s, 0, Math.PI * 2, true);
    
    // Set Attributes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(120,120,120,0.75)";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Inner ring
        ctx.beginPath();
        ctx.arc(0, d, 250 * s, 0, Math.PI * 2, true);
        ctx.stroke();
        
        // Suture holes
        this.drawSpot(ctx, -200 * s, 200 * s + d, 5, "rgba(255,255,255,1)");
        this.drawSpot(ctx, -200 * s, -200 * s + d, 5, "rgba(255,255,255,1)");
        this.drawSpot(ctx, 200 * s, -200 * s + d, 5, "rgba(255,255,255,1)");
        this.drawSpot(ctx, 200 * s, 200 * s + d, 5, "rgba(255,255,255,1)");
        
        // Tube
        ctx.moveTo(-20 * s, 290 * s + d);
        ctx.lineTo(-20 * s, this.apexY);
        ctx.lineTo(20 * s, this.apexY);
        ctx.lineTo(20 * s, 290 * s + d);
        
        ctx.strokeStyle = "rgba(150,150,150,0.5)";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Molteno.prototype.description = function()
{
    var descArray = {STQ:'superotemporal', SNQ:'superonasal', INQ:'inferonasal', ITQ:'inferotemporal'};
    
    return "Molteno tube in the "+ descArray[this.platePosition] + " quadrant";
}

/**
 * Scleral Patch
 *
 * @class ScleralPatch
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ScleralPatch = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Patch";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ScleralPatch.prototype = new ED.Doodle;
ED.ScleralPatch.prototype.constructor = ED.ScleralPatch;
ED.ScleralPatch.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ScleralPatch.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.ScleralPatch.prototype.setPropertyDefaults = function()
{
	this.isOrientated = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-20, +200);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -20);
}

/**
 * Sets default parameters
 */
ED.ScleralPatch.prototype.setParameterDefaults = function()
{
    this.apexX = 50;
    this.apexY = -70;
    this.originY = -260;
    
    
    // Patchs are usually temporal
//    if(this.drawing.eye == ED.eye.Right)
//    {
//        this.originX = -260;
//        this.rotation = -Math.PI/4;
//    }
//    else
//    {
//        this.originX = 260;
//        this.rotation = Math.PI/4;
//    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ScleralPatch.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ScleralPatch.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    ctx.rect(-this.apexX, this.apexY, Math.abs(2 * this.apexX), Math.abs(2 * this.apexY));
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(200,200,50,0.5)";
    ctx.strokeStyle = "rgba(120,120,120,0)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
//        // Suture knots
//        this.drawSpot(ctx, -50, -50, 5, "blue");
//        this.drawSpot(ctx, -50, 50, 5, "blue");
//        this.drawSpot(ctx, 50, -50, 5, "blue");
//        this.drawSpot(ctx, 50, 50, 5, "blue");
//        
//        // Suture thread ends
//        this.drawLine(ctx, -60, -60, -50, -50, 2, "blue");
//        this.drawLine(ctx, -50, -50, -60, -40, 2, "blue");
//        this.drawLine(ctx, -60, 60, -50, 50, 2, "blue");
//        this.drawLine(ctx, -50, 50, -60, 40, 2, "blue");
//        this.drawLine(ctx, 60, -60, 50, -50, 2, "blue");
//        this.drawLine(ctx, 50, -50, 60, -40, 2, "blue");
//        this.drawLine(ctx, 60, 60, 50, 50, 2, "blue");
//        this.drawLine(ctx, 50, 50, 60, 40, 2, "blue");
	}
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ScleralPatch.prototype.description = function()
{
    return "Scleral patch";
}

/**
 * Supramid suture
 *
 * @class Supramid
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Supramid = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{	
	// Set classname
	this.className = "Supramid";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Supramid.prototype = new ED.Doodle;
ED.Supramid.prototype.constructor = ED.Supramid;
ED.Supramid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Supramid.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Supramid.prototype.setPropertyDefaults = function()
{
	this.isOrientated = true;
	this.isRotatable = false;
    this.snapToQuadrant = true;
    this.quadrantPoint = new ED.Point(10, 10);
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-420, -200);
}

/**
 * Sets default parameters
 */
ED.Supramid.prototype.setParameterDefaults = function()
{
    this.apexX = 0;
    this.apexY = -350;
    this.originY = -10;
    
    // Tubes are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -10;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 10;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Supramid.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Supramid.superclass.draw.call(this, _point);

    // Calculate key points for supramid bezier
    var startPoint = new ED.Point(0, this.apexY);
    var tubePoint = new ED.Point(0, -450);    
    var controlPoint1 = new ED.Point(0, -600);
    
    // Calculate mid point x coordinate
    var midPointX = -450;
    var controlPoint2 = new ED.Point(midPointX, -300);
    var midPoint = new ED.Point(midPointX, 0);
    var controlPoint3 = new ED.Point(midPointX, 300);
    var controlPoint4 = new ED.Point(midPointX * 0.5, 450);
    var endPoint = new ED.Point(midPointX * 0.2, 450);

	// Boundary path
	ctx.beginPath();
    
    // Rectangle around suture
    ctx.moveTo(this.apexX, tubePoint.y);
    ctx.lineTo(midPointX, tubePoint.y);
    ctx.lineTo(midPointX, endPoint.y);
    ctx.lineTo(this.apexX, endPoint.y);            
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 1;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{        
        // Suture
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(tubePoint.x, tubePoint.y);
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, midPoint.x, midPoint.y);
        ctx.bezierCurveTo(controlPoint3.x, controlPoint3.y, controlPoint4.x, controlPoint4.y, endPoint.x, endPoint.y);
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "purple";
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(0, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
 	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns parameters
 *
 * @returns {String} value of parameter
 */
// ED.Supramid.prototype.getParameter = function(_parameter)
// {
//     var returnValue;
//     
//     switch (_parameter)
//     {
//         // Position of end of suture
//         case 'endPosition':
//             var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
//             
//             if (r < 280 ) returnValue = 'in the AC';
//             else returnValue = ((r - 280)/14).toFixed(0) + 'mm from limbus';
//             break;
// 
//         default:
//             returnValue = "";
//             break;
//     }
//     
//     return returnValue;
// }

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Supramid.prototype.description = function()
{
    var returnString = "Supramid suture ";
    
    returnString += this.getParameter('endPosition');
    
	return returnString;
}

/**
 * Vicryl suture
 *
 * @class Vicryl
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Vicryl = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{	
	// Set classname
	this.className = "Vicryl";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Vicryl.prototype = new ED.Doodle;
ED.Vicryl.prototype.constructor = ED.Vicryl;
ED.Vicryl.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Vicryl.prototype.setPropertyDefaults = function()
{
	this.isOrientated = true;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.Vicryl.prototype.setParameterDefaults = function()
{
    this.originY = -240;
    this.apexY = 400;
    
    // Tubes are usually STQ
    if(this.drawing.eye == ED.eye.Right)
    {
        this.originX = -240;        
        this.rotation = -Math.PI/4;
    }
    else
    {
        this.originX = 240;
        this.rotation = Math.PI/4;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Vicryl.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Vicryl.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Use arcTo to create an ellipsoid
    ctx.moveTo(-20, 0);
    ctx.arcTo(0, -20, 20, 0, 30); 
    ctx.arcTo(0, 20, -20, 0, 30);
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "purple";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Ends of suture
        ctx.beginPath();
        ctx.moveTo(35, -10);
        ctx.lineTo(20, 0);
        ctx.lineTo(35, 10); 
        ctx.stroke();
        
        // Knot
        this.drawSpot(ctx, 20, 0, 4, "purple");
 	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
 	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Vicryl.prototype.description = function()
{
	return "Vicryl suture";
}

/**
 * TrabySuture suture
 *
 * @class TrabySuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.TrabySuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{	
	// Set classname
	this.className = "TrabySuture";
	
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.type = 'Fixed';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TrabySuture.prototype = new ED.Doodle;
ED.TrabySuture.prototype.constructor = ED.TrabySuture;
ED.TrabySuture.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TrabySuture.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Rotate, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.TrabySuture.prototype.setPropertyDefaults = function()
{
	//this.isMoveable = false;
	//this.isRotatable = false;
	
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-50, +50);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(+70, +70);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['type'] = {kind:'derived', type:'string', list:['Fixed', 'Adjustable', 'Releasable'], animate:false};
}

/**
 * Sets default parameters
 */
ED.TrabySuture.prototype.setParameterDefaults = function()
{
	this.apexX = +50;
	this.apexY = +70;
    this.type = 'Fixed';
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.TrabySuture.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexX':
            if (_value > 17) returnArray['type'] = "Releasable";
            else if (_value > -17) returnArray['type'] = "Adjustable";
            else returnArray['type'] = "Fixed";
            break;
        
        case 'type':
            switch (_value)
        	{
            	case 'Fixed':
            		returnArray['apexX'] = -50;
            		break;
            	case 'Adjustable':
            		returnArray['apexX'] = 0;
            		break;
            	case 'Releasable':
            		returnArray['apexX'] = +50;
            		break;
            }
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TrabySuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.TrabySuture.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Outline
	ctx.rect(-40, -70, 80, 100);

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,255,0)";
	if (this.isSelected)
	{
		ctx.strokeStyle = "gray";
	}
	else
	{
		ctx.strokeStyle = "rgba(255,255,255,0)";
	}
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Suture path
		ctx.beginPath();
		
		// Type of suture
		switch (this.type)
		{
			case 'Releasable':
				ctx.moveTo(-2, 64);
				ctx.bezierCurveTo(20, 36, -15, 16, -16, -7);
				ctx.bezierCurveTo(-18, -30, -12, -43, -4, -43);
				ctx.bezierCurveTo(6, -43, 12, -28, 12, -9);
				ctx.bezierCurveTo(12, 11, 0, 23, -2, 30);
				ctx.bezierCurveTo(-3, 36, 3, 37, 2, 30);
				ctx.bezierCurveTo(2, 20, -4, 24, -3, 29);
				ctx.bezierCurveTo(-3, 36, 14, 37, 23, 56);
				ctx.bezierCurveTo(32, 74, 34, 100, 34, 100);
				ctx.bezierCurveTo(34, 150, -34, 150, -34, 100);
				break;

			case 'Adjustable':
				ctx.moveTo(-2, 64);
				ctx.bezierCurveTo(20, 36, -15, 16, -16, -7);
				ctx.bezierCurveTo(-18, -30, -12, -43, -4, -43);
				ctx.bezierCurveTo(6, -43, 12, -28, 12, -9);
				ctx.bezierCurveTo(12, 11, 0, 23, -2, 30);
				ctx.bezierCurveTo(-3, 36, 3, 37, 2, 30);
				ctx.bezierCurveTo(2, 20, -4, 24, -3, 29);
				ctx.bezierCurveTo(-3, 36, 14, 37, 23, 56);
				ctx.bezierCurveTo(32, 74, 34, 100, 34, 100);
				break;

			case 'Fixed':
				ctx.moveTo(0, -30);
				ctx.bezierCurveTo(5, -10, 5, 10, 0, 30);
				ctx.bezierCurveTo(-5, 10, -5, -10, 0, -30);
				ctx.moveTo(-5, 50);
				ctx.lineTo(0, 30);
				ctx.lineTo(5, 50);
				break;	
		}
	
		// Set line attributes
		ctx.lineWidth = 8;
		ctx.fillStyle = "rgba(0, 0, 0, 0)";
		ctx.strokeStyle = "purple";
		
		// Draw line
		ctx.stroke();
 	}
 	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(+40, -70));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
		
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
 	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws extra items if the doodle is highlighted
 */
ED.TrabySuture.prototype.drawHighlightExtras = function()
{
    // Get context
	var ctx = this.drawing.context;
    
    // Draw text description of gauge
    ctx.lineWidth=1;
    ctx.fillStyle="gray";
    ctx.font="64px sans-serif";
    ctx.fillText(this.type, 80, 0 + 20);
}


/**
 * @fileOverview Contains doodle subclasses for Medical Retina
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.9
 *
 * Modification date: 20th May 2011
 * Copyright 2011 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * PostPole template with disc and arcades
 *
 * @class PostPole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PostPole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PostPole";
    
    // Private parameters
    this.discRadius = 84;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.cdRatio = '0';
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PostPole.prototype = new ED.Doodle;
ED.PostPole.prototype.constructor = ED.PostPole;
ED.PostPole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PostPole.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.PostPole.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameterss
    var apexX = this.drawing.eye == ED.eye.Right?300:-300;
    this.parameterValidationArray['apexX']['range'].setMinAndMax(apexX, apexX);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -8);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['cdRatio'] = {kind:'derived', type:'float', range:new ED.Range(0, 1), precision:1, animate:true};
    
    // Slow down ApexY animation for this doodle (small scope)
    this.parameterValidationArray['apexY']['delta'] = 5;
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PostPole.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('cdRatio', '0.5');
    this.apexX = this.drawing.eye == ED.eye.Right?300:-300;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.PostPole.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {           
        case 'apexY':
            returnArray['cdRatio'] = -_value/80;
            break;

        case 'cdRatio':
            returnArray['apexY'] = -(+_value * 80);
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PostPole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PostPole.superclass.draw.call(this, _point);
    
    // Disc location
    var x = this.drawing.eye == ED.eye.Right?300:-300;
    
	// Boundary path
	ctx.beginPath();
    
	// Optic disc
	ctx.arc(x, 0, this.discRadius, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(249,187,76,1)";
    ctx.fillStyle = "rgba(249,187,76,1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Optic cup
        ctx.beginPath();
        ctx.arc(x, 0, -this.apexY, 2 * Math.PI, 0, false);
        ctx.fillStyle = "white";
        var ptrn = ctx.createPattern(this.drawing.imageArray['CribriformPatternSmall'],'repeat');
        ctx.fillStyle = ptrn;
        ctx.lineWidth = 4;
        ctx.fill();
		ctx.stroke();
        
        // Arcades
        ctx.beginPath();
        
        // Coordinates
        var sign = this.drawing.eye == ED.eye.Right?1:-1;
        var startX = -300 * sign;
        var midX1 = -50 * sign;
        var midX2 = 300 * sign;
        var midX3 = 300 * sign;
        var endX1 = 300 * sign;
        var endX2 = 350 * sign;
        var endX3 = 400 * sign;
        var foveaX = 0;
        
        // Superior arcades
        ctx.moveTo(startX, -100);
        ctx.bezierCurveTo(midX1, -500, midX2, -200, midX3, -24);
        ctx.bezierCurveTo(endX1, -80, endX2, -140, endX3, -160);
        
        // Inferior arcades
        ctx.moveTo(endX3, 160);
        ctx.bezierCurveTo(endX2, 140, endX1, 80, midX3, 24);
        ctx.bezierCurveTo(midX2, 200, midX1, 500, startX, 100);
        
		// Small cross marking fovea
		var crossLength = 10;
		ctx.moveTo(foveaX, -crossLength);
		ctx.lineTo(foveaX, crossLength);
		ctx.moveTo(foveaX - crossLength, 0);
		ctx.lineTo(foveaX + crossLength, 0);
		
		// Draw arcades
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red";
		ctx.stroke();
        
        // One disc diameter
        ctx.beginPath();
        ctx.arc(0, 0, 2 * this.discRadius, 2 * Math.PI, 0, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gray";
        ctx.stroke();
	}

    // Coordinates of handles (in canvas plane)
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PostPole.prototype.description = function()
{
    return this.drawing.doodleArray.length == 1?"No abnormality":"";
}

/**
 * Tests whether passed doodle is within a number of disc diameters of fovea
 *
 * @param {Doodle} _doodle The doodle to test
 * @param {Int} _diameters The number of disc diameters to test
 * @returns {Bool} True if doodle is within the passed number of disc diameters of fovea
 */
ED.PostPole.prototype.isWithinDiscDiametersOfFovea = function(_doodle, _diameters)
{
	return (_doodle.originX * _doodle.originX + _doodle.originY * _doodle.originY) < _diameters * 4 * this.discRadius * this.discRadius;
}

/**
 * Tests whether passed doodle is within a the confines of the optic disc
 *
 * @param {Doodle} _doodle The doodle to test
 * @returns {Bool} True if doodle is within the confines of the optic disc
 */
ED.PostPole.prototype.isWithinDisc = function(_doodle)
{
    // Disc location
    var x = _doodle.originX - (this.drawing.eye == ED.eye.Right?300:-300);
    
	return ( x * x + _doodle.originY * _doodle.originY) <  this.discRadius * this.discRadius;
}

/**
 * Tests whether passed doodle is within a the vascular arcades
 *
 * @param {Doodle} _doodle The doodle to test
 * @returns {Bool} True if doodle is within the vascular arcades
 */
ED.PostPole.prototype.isWithinArcades = function(_doodle)
{
	return (_doodle.originX * _doodle.originX + _doodle.originY * _doodle.originY) < (300 * 300);
}

/**
 * Microaneurysm
 *
 * @class Microaneurysm
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Microaneurysm = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Microaneurysm";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Microaneurysm.prototype = new ED.Doodle;
ED.Microaneurysm.prototype.constructor = ED.Microaneurysm;
ED.Microaneurysm.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Microaneurysm.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(50, 30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Microaneurysm.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Microaneurysm.superclass.draw.call(this, _point);
    
    // Microaneurysm radius
    var r = 14;
    
	// Boundary path
	ctx.beginPath();
    
	// Microaneurysm
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Microaneurysm.prototype.groupDescription = function()
{
	return "Microaneurysms";
}

/**
 * Hard exudate
 *
 * @class HardExudate
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.HardExudate = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HardExudate";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HardExudate.prototype = new ED.Doodle;
ED.HardExudate.prototype.constructor = ED.HardExudate;
ED.HardExudate.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HardExudate.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(50, 30);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HardExudate.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HardExudate.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 14;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(220,220,0,1)";
    ctx.fillStyle = "rgba(220,220,0,1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.HardExudate.prototype.groupDescription = function()
{
	return "Hard exudates";
}

/**
 * Cotton Wool Spot
 *
 * @class CottonWoolSpot
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CottonWoolSpot = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CottonWoolSpot";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CottonWoolSpot.prototype = new ED.Doodle;
ED.CottonWoolSpot.prototype.constructor = ED.CottonWoolSpot;
ED.CottonWoolSpot.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CottonWoolSpot.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.CottonWoolSpot.prototype.setPropertyDefaults = function()
{
    this.isSqueezable = true;
    this.isOrientated = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CottonWoolSpot.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(-150, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CottonWoolSpot.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CottonWoolSpot.superclass.draw.call(this, _point);
    
    // Dimensions of haemorrhage
    var r = 80;
    var h = 50;
    var d = h/3;
    
	// Boundary path
	ctx.beginPath();
    
	// Cotton wool spot
    ctx.moveTo(-r,-h);
    ctx.lineTo(-r + d, -h + 1 * d);
    ctx.lineTo(-r, -h + 2 * d);
    ctx.lineTo(-r + d, -h + 3 * d);
    ctx.lineTo(-r, -h + 4 * d);
    ctx.lineTo(-r + d, -h + 5 * d);
    ctx.lineTo(-r, -h + 6 * d);
    ctx.bezierCurveTo(-r + d, -h + 7 * d, r - d, -h + 7 * d, r, -h + 6 * d);
    ctx.lineTo(r - d, -h + 5 * d);
    ctx.lineTo(r, -h + 4 * d);
    ctx.lineTo(r - d, -h + 3 * d);
    ctx.lineTo(r, -h + 2 * d);
    ctx.lineTo(r - d, -h + 1 * d);
    ctx.lineTo(r, -h);
    ctx.bezierCurveTo(r - d, -h - d, -r + d, -h - d, -r, -h);
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
    ctx.fillStyle = "rgba(220,220,220,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r, -h));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.CottonWoolSpot.prototype.groupDescription = function()
{
    return "Cotton wool spots";
}

/**
 * Pre-retinal Haemorrhage
 *
 * @class PreRetinalHaemorrhage
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PreRetinalHaemorrhage = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PreRetinalHaemorrhage";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PreRetinalHaemorrhage.prototype = new ED.Doodle;
ED.PreRetinalHaemorrhage.prototype.constructor = ED.PreRetinalHaemorrhage;
ED.PreRetinalHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PreRetinalHaemorrhage.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.PreRetinalHaemorrhage.prototype.setPropertyDefaults = function()
{
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(50, 200);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2.0);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2.0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PreRetinalHaemorrhage.prototype.setParameterDefaults = function()
{
    this.apexY = 200;

    this.setOriginWithDisplacements(-150, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PreRetinalHaemorrhage.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PreRetinalHaemorrhage.superclass.draw.call(this, _point);
    
    // Dimensions of haemorrhage
    var r = 100;
    var f = 0.6;
    
	// Boundary path
	ctx.beginPath();
    
	// Haemorrhage
    ctx.moveTo(r,0);
    ctx.lineTo(-r,0);
    ctx.bezierCurveTo(-r * f, 0, -r * f, this.apexY, 0, this.apexY);
    ctx.bezierCurveTo(r * f, this.apexY, r * f, 0, r, 0);
    
    // Close path
    ctx.closePath();

	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{

	}
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(100, 0));
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.PreRetinalHaemorrhage.prototype.groupDescription = function()
{
    return "Pre-retinal haemorrages";
}

/**
 * Fibrous Proliferation
 *
 * @class FibrousProliferation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.FibrousProliferation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "FibrousProliferation";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.FibrousProliferation.prototype = new ED.Doodle;
ED.FibrousProliferation.prototype.constructor = ED.FibrousProliferation;
ED.FibrousProliferation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.FibrousProliferation.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.FibrousProliferation.prototype.setPropertyDefaults = function()
{
    this.isSqueezable = true;

    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.FibrousProliferation.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(-200, 150);
    this.rotation = -Math.PI/4;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FibrousProliferation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.FibrousProliferation.superclass.draw.call(this, _point);
    
    // Dimensions
    var w = 180;
    var h = 70;
    var wc = w * 0.6;
    var hc = h * 0.2;
    
	// Boundary path
	ctx.beginPath();
    
    // Patch with scalloped edges
    ctx.moveTo(-w, -h);
    ctx.bezierCurveTo(-wc, -hc, wc, -hc, w, -h);
    ctx.bezierCurveTo(wc, -hc, wc, hc, w, h);
    ctx.bezierCurveTo(wc, hc, -wc, hc, -w, h);
    ctx.bezierCurveTo(-wc, hc, -wc, -hc, -w, -h);
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(120,120,120,0.5)";
    ctx.fillStyle = "rgba(120,120,120,0.5)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    this.handleArray[2].location = this.transform.transformPoint(new ED.Point(w, -h));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.FibrousProliferation.prototype.description = function()
{
    return "Fibrous proliferation";
}

/**
 * Blot Haemorrhage
 *
 * @class BlotHaemorrhage
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.BlotHaemorrhage = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BlotHaemorrhage";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BlotHaemorrhage.prototype = new ED.Doodle;
ED.BlotHaemorrhage.prototype.constructor = ED.BlotHaemorrhage;
ED.BlotHaemorrhage.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.BlotHaemorrhage.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.BlotHaemorrhage.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(-60, -60);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BlotHaemorrhage.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BlotHaemorrhage.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = 30;
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.BlotHaemorrhage.prototype.groupDescription = function()
{
    return "Blot haemorrhages";
}

/**
 * DiabeticNV template with disc and arcades
 *
 * @class DiabeticNV
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.DiabeticNV = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DiabeticNV";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DiabeticNV.prototype = new ED.Doodle;
ED.DiabeticNV.prototype.constructor = ED.DiabeticNV;
ED.DiabeticNV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DiabeticNV.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.DiabeticNV.prototype.setPropertyDefaults = function()
{
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.DiabeticNV.prototype.setParameterDefaults = function()
{
    var n = this.drawing.numberOfDoodlesOfClass(this.className);
    
    switch (n)
    {
        case 0:
            this.originX = (this.drawing.eye == ED.eye.Right)?300:-300;
            this.originY = -100;
            break;
        case 1:
            this.originX = (this.drawing.eye == ED.eye.Right)?-176:176;
            this.originY = -236;
            break;
        case 2:
            this.originX = (this.drawing.eye == ED.eye.Right)?-176:176;
            this.originY = 236;
            break;
        default:
            this.setOriginWithDisplacements(0, -100);
            break;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DiabeticNV.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.DiabeticNV.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Radius of NV
    var r = 60;
    var c = r/2;
    var phi = 0;
    var theta = Math.PI/8;
    var n = 8;
    
	// Do a vessel
    var cp1 = new ED.Point(0, 0);
    var cp2 = new ED.Point(0, 0);
    var tip = new ED.Point(0, 0);
    var cp3 = new ED.Point(0, 0);
    var cp4 = new ED.Point(0, 0);
    
    // Move to centre
    ctx.moveTo(0,0);
    
    // Loop through making petals
    var i;
    for (i = 0; i < n; i++)
    {
        phi = i * 2 * Math.PI/n;
        
        cp1.setWithPolars(c, phi - theta);
        cp2.setWithPolars(r, phi - theta);
        tip.setWithPolars(r, phi);
        cp3.setWithPolars(r, phi + theta);
        cp4.setWithPolars(c, phi + theta);
        
        // Draw petal
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tip.x, tip.y);
        ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, 0, 0);
    }
    
    // Transparent fill
    ctx.fillStyle = "rgba(100, 100, 100, 0)";
	
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle =  "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
    point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DiabeticNV.prototype.groupDescription = function()
{
	return "Diabetic new vessels ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DiabeticNV.prototype.description = function()
{
    return this.locationRelativeToDisc();
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.DiabeticNV.prototype.snomedCode = function()
{
	return 59276001;
}

/**
 * Circinate
 *
 * @class Circinate
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Circinate = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Circinate";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Circinate.prototype = new ED.Doodle;
ED.Circinate.prototype.constructor = ED.Circinate;
ED.Circinate.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Circinate.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.Circinate.prototype.setPropertyDefaults = function()
{
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Circinate.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(60, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Circinate.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.Circinate.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    // Radius of Circinate
    var rc = 80;
    
    // Circle
    ctx.arc(0, 0, rc, 0, 2 * Math.PI, false);
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(200,200,0,0)";
	ctx.strokeStyle = "rgba(100,100,100,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Parameters
        var ro = 40;
        var rh = 10
        var ne = 12;
        var el = 30;
        
        // Point objects
        var cp = new ED.Point(0, 0);
        var ep = new ED.Point(0, 0);
        
        // Red centre
        ctx.beginPath();
        ctx.arc(0, 0, rh, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        
        // Exudates
        phi = 2 * Math.PI/ne;
        for (i = 0; i < ne; i++)
        {
            ctx.beginPath();
            cp.setWithPolars(ro, i * phi);
            ep.setWithPolars(ro + el, i * phi);
            ctx.moveTo(cp.x, cp.y);
            ctx.lineTo(ep.x, ep.y);
            ctx.closePath();
            ctx.lineWidth = 12;
            ctx.strokeStyle = "rgba(220,220,0,1)";
            ctx.lineCap = "round";
            ctx.stroke();
        }
	}
    
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(rc, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Circinate.prototype.groupDescription = function()
{
	return "Circinate maculopathy ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Circinate.prototype.description = function()
{
    return this.locationRelativeToFovea();
}

/**
 * Cystoid Macular Oedema
 *
 * @class CystoidMacularOedema
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CystoidMacularOedema = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CystoidMacularOedema";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CystoidMacularOedema.prototype = new ED.Doodle;
ED.CystoidMacularOedema.prototype.constructor = ED.CystoidMacularOedema;
ED.CystoidMacularOedema.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CystoidMacularOedema.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CystoidMacularOedema.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.CystoidMacularOedema.prototype.setParameterDefaults = function()
{
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CystoidMacularOedema.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CystoidMacularOedema.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
	ctx.arc(0,0,120,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Colours
        var fill = "rgba(255, 255, 138, 0.5)";
        var stroke = "rgba(255, 82, 0, 0.7)";
        
        // Peripheral cysts
        var point = new ED.Point(0,0);
        var n = 8;
        for (var i = 0; i < n; i++)
        {
            var angle = i * 2 * Math.PI/n;
            point.setWithPolars(80,angle);
            this.drawCircle(ctx, point.x, point.y, 40, fill, 2, stroke);
        }
        
        // Large central cyst
        this.drawCircle(ctx, 0, 0, 60, fill, 2, stroke);
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(84, -84));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CystoidMacularOedema.prototype.description = function()
{
    return "Cystoid macular oedema";
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CystoidMacularOedema.prototype.snomedCode = function()
{
	return 193387007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CystoidMacularOedema.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * Hard Drusen
 *
 * @class HardDrusen
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.HardDrusen = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HardDrusen";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HardDrusen.prototype = new ED.Doodle;
ED.HardDrusen.prototype.constructor = ED.HardDrusen;
ED.HardDrusen.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.HardDrusen.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.HardDrusen.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-160, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HardDrusen.prototype.setParameterDefaults = function()
{
    // Hard drusen is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HardDrusen.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HardDrusen.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    var r = 200;
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Colours
        var fill = "yellow";
        
        var dr = 10/this.scaleX;
        
        var p = new ED.Point(0,0);
        var n = 20 + Math.abs(Math.floor(this.apexY/2));
        for (var i = 0; i < n; i++)
        {
            p.setWithPolars(r * ED.randomArray[i], 2 * Math.PI * ED.randomArray[i + 100]);
            this.drawSpot(ctx, p.x, p.y, dr, fill);
        }
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.HardDrusen.prototype.description = function()
{
    var returnString = "Signficant numbers of ";
    if (this.apexY > -100) returnString = "Moderate numbers of ";
    if (this.apexY > -50) returnString = "Several ";
	
	return returnString + "hard drusen";
}

/**
 * Laser Spot
 *
 * @class LaserSpot
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.LaserSpot = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LaserSpot";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserSpot.prototype = new ED.Doodle;
ED.LaserSpot.prototype.constructor = ED.LaserSpot;
ED.LaserSpot.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserSpot.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.LaserSpot.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +3);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +3);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LaserSpot.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.75;
    this.scaleY = 0.75;
    this.setOriginWithDisplacements(100, 80);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LaserSpot.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LaserSpot.superclass.draw.call(this, _point);
    
    // Radius of laser spot
    var r = 30;
    
	// Boundary path
	ctx.beginPath();
    
	// Circle
    ctx.arc(0, 0, r, 0, Math.PI * 2, true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = r * 2/3;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "rgba(255, 128, 0, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.LaserSpot.prototype.groupDescription = function()
{
    return "Laser spots";
}

/**
 * Sector PRP
 *
 * @class SectorPRPPostPole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.SectorPRPPostPole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SectorPRPPostPole";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SectorPRPPostPole.prototype = new ED.Doodle;
ED.SectorPRPPostPole.prototype.constructor = ED.SectorPRPPostPole;
ED.SectorPRPPostPole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SectorPRPPostPole.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Set default properties
 */
ED.SectorPRPPostPole.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI * 2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.SectorPRPPostPole.prototype.setParameterDefaults = function()
{
    this.arc = 55 * Math.PI/180;
    this.apexY = -300;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + (this.drawing.eye == ED.eye.Right?-1:1) * (doodle.arc/2 + this.arc/2 + Math.PI/12);
    }
    else
    {
        this.rotation = (this.drawing.eye == ED.eye.Right?-1:1) * this.arc/2;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SectorPRPPostPole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SectorPRPPostPole.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 1000/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of SectorPRPPostPole
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 40;
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // PRP spot data
        var si = 30;
        var sd = (30 + si);
        
        // Array of number of spots for each radius value
        var count = [47,41,35,28,22,15];
        
        // Iterate through radius and angle to draw sector
        var i = 0;
        for (var r = ro - si; r > ri; r -= sd)
        {
            var j = 0;
            
            for (var a = -Math.PI/2 - arcStart; a < this.arc - Math.PI/2 - arcStart; a += sd/r )
            {
                a = -Math.PI/2 - arcStart + j * 2 * Math.PI/count[i];
                
                var p = new ED.Point(0,0);
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x, p.y);
                
                j++;
            }
            
            i++;
        }
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.SectorPRPPostPole.prototype.description = function()
{
    return "Sector PRP";
}

/**
 * PRP (Poterior pole)
 *
 * @class PRPPostPole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PRPPostPole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PRPPostPole";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PRPPostPole.prototype = new ED.Doodle;
ED.PRPPostPole.prototype.constructor = ED.PRPPostPole;
ED.PRPPostPole.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.PRPPostPole.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
    this.isUnique = true;
    this.isMoveable = false;
    this.isRotatable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PRPPostPole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    ctx.rect(-480, -480, 960, 960);
    var r = 320;
    ctx.moveTo(r,0);
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // PRP spot data
        var sr = 15;
        var si = 30;
        var ss = 48;
        var n = (1000 - 2 * ss)/(2 * sr + si);
        var sd = (2 * sr + si);
        var st = 10;
        
        // Draw spots
        for (var i = 0; i < n; i++)
        {
            for (var j = 0; j < n; j++)
            {
                // Calculate coordinates with a random element
                var x = -500 + ss + i * sd + Math.round((-0.5 + ED.randomArray[i + j]) * 20);
                var y = -500 + ss + j * sd + Math.round((-0.5 + ED.randomArray[i + j + 100]) * 20);
                
                // Avoid macula
                if ((x * x + y * y) > r * r)
                {
                    // Avoid disc
                    if (this.drawing.eye == ED.eye.Right)
                    {
                        if (!((i == 13 && (j == 6 || j == 7 || j == 8 || j == 9)) || (i == 14) && (j == 7 || j == 8)))
                        {
                            this.drawCircle(ctx, x, y, sr, "Yellow", st, "rgba(255, 128, 0, 1)");
                        }
                    }
                    else
                    {
                        if (!((i == 2 && (j == 6 || j == 7 || j == 8 || j == 9)) || (i == 1) && (j == 7 || j == 8)))
                        {
                            this.drawCircle(ctx, x, y, sr, "Yellow", st, "rgba(255, 128, 0, 1)");
                        }
                    }
                }
            }
        }
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PRPPostPole.prototype.description = function()
{
	return "Panretinal photocoagulation";
}

/**
 * Macular Grid
 *
 * @class MacularGrid
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.MacularGrid = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MacularGrid";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MacularGrid.prototype = new ED.Doodle;
ED.MacularGrid.prototype.constructor = ED.MacularGrid;
ED.MacularGrid.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularGrid.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.MacularGrid.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isRotatable = false;
    this.isUnique = true;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-150, -50);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MacularGrid.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
    this.scaleX = 0.7;
    this.scaleY = 0.7;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularGrid.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);
    
	// Radius of outer and inner circle
	var ro = 250;
    var ri = -this.apexY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Grid spot separation
        var ss = 60;
        n = Math.floor(2 * ro/ss);
        var start = -n/2 * ss;
        
        // Draw spots
        for (var i = 0; i < n + 1; i++)
        {
            for (var j = 0; j < n + 1; j++)
            {
                var x = start + i * ss + Math.round((-0.5 + ED.randomArray[i + j]) * 15);
                var y = start + j * ss + Math.round((-0.5 + ED.randomArray[i + j + 100]) * 15);

                // calculate radius of spot position
                var rSq = x * x + y * y;
                
                // Only draw spots that within area
                if (rSq >= ri * ri && rSq <= ro * ro)
                {
                    this.drawLaserSpot(ctx, x, y);
                }
            }
        }
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.MacularGrid.prototype.description = function()
{
    return "Macular grid laser";
}

/**
 * Focal laser
 *
 * @class FocalLaser
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.FocalLaser = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "FocalLaser";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.FocalLaser.prototype = new ED.Doodle;
ED.FocalLaser.prototype.constructor = ED.FocalLaser;
ED.FocalLaser.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.FocalLaser.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.FocalLaser.prototype.setPropertyDefaults = function()
{
    this.isRotatable = false;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-75, -50);
    this.parameterValidationArray['radius']['range'].setMinAndMax(50, 75);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.FocalLaser.prototype.setParameterDefaults = function()
{
    this.apexY = -50;
    
    this.setOriginWithDisplacements(150, 80);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.FocalLaser.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PRPPostPole.superclass.draw.call(this, _point);
    
	// Radius of outer circle
	var ro = -this.apexY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes (NB Note strokeStyle in order to get a highlight when selected
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Outer ring
        if (this.apexY <= -75)
        {
            var m = 50;
            var d = m/Math.sqrt(2);
            this.drawLaserSpot(ctx, 0, -m);
            this.drawLaserSpot(ctx, d, -d);
            this.drawLaserSpot(ctx, m, 0);
            this.drawLaserSpot(ctx, d, d);
            this.drawLaserSpot(ctx, 0, m);
            this.drawLaserSpot(ctx, -d, d);
            this.drawLaserSpot(ctx, -m, 0);
            this.drawLaserSpot(ctx, -d, -d);
        }

        // Inner ring
        var i = 25;
        this.drawLaserSpot(ctx, 0, -i);
        this.drawLaserSpot(ctx, i, 0);
        this.drawLaserSpot(ctx, 0, i);
        this.drawLaserSpot(ctx, -i, 0);
        
        // Central spot
        this.drawLaserSpot(ctx, 0, 0);
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[4].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.FocalLaser.prototype.groupDescription = function()
{
    return "Focal laser";
}

/**
 * Geographic atrophy with variabel foveal sparing
 *
 * @class Geographic
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Geographic = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Geographic";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Geographic.prototype = new ED.Doodle;
ED.Geographic.prototype.constructor = ED.Geographic;
ED.Geographic.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Geographic.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.Geographic.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
}

/**
 * Sets default parameters
 */
ED.Geographic.prototype.setParameterDefaults = function()
{
	this.apexY = -100;
    this.scaleX = 0.7;
    this.scaleY = 0.7;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Geographic.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.Geographic.superclass.draw.call(this, _point);
    
	// Radius of limbus
	var ro = 200;
    var ri = -this.apexY;
    var phi = -this.apexY * Math.PI/800;
    
    // Boundary path
	ctx.beginPath();
    
    var point = new ED.Point(0, 0);
    
	// Outer arc
    if (this.drawing.eye == ED.eye.Right)
    {
        ctx.arc(0, 0, ro, phi, 2 * Math.PI - phi, false);
        point.setWithPolars(ri, Math.PI/2 - phi);
        ctx.lineTo(point.x, point.y);
        ctx.arc(0, 0, ri, 2 * Math.PI - phi, phi, true);
    }
    else
    {
        ctx.arc(0, 0, ro, Math.PI - phi, -Math.PI + phi, true);
        point.setWithPolars(ri, phi - Math.PI/2);
        ctx.lineTo(point.x, point.y);
        ctx.arc(0, 0, ri, -Math.PI + phi, Math.PI - phi, false);
    }
    
    // Close path
    ctx.closePath();
	
	// Set attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(255,255,50,0.8)";
	ctx.strokeStyle = "rgba(100,100,100,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
	// Coordinates of handles (in canvas plane)
    point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Geographic.prototype.description = function()
{
	return "Geographic atrophy";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.Geographic.prototype.snomedCode = function()
{
	return 414875008;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.Geographic.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * VitreousOpacity template with disc and arcades
 *
 * @class VitreousOpacity
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.VitreousOpacity = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "VitreousOpacity";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.VitreousOpacity.prototype = new ED.Doodle;
ED.VitreousOpacity.prototype.constructor = ED.VitreousOpacity;
ED.VitreousOpacity.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.VitreousOpacity.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.VitreousOpacity.prototype.setPropertyDefaults = function()
{
	this.isRotatable = false;
	this.isSqueezable = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-100, +0);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);    
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +4);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +4);
}

/**
 * Sets default parameters
 */
ED.VitreousOpacity.prototype.setParameterDefaults = function()
{
    this.apexY = -100;
    this.setOriginWithDisplacements(0, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VitreousOpacity.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.VitreousOpacity.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Boundary path
	ctx.beginPath();
    
    // Radius of opacity
    var ro = 200;
    
	// Do a 360 arc
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
    // Opacity from apexY
    var opacity = 0.3  + 0.6 * (ro + 2 * this.apexY)/ro;
    ctx.fillStyle = "rgba(255, 0, 0," + opacity + ")";
	
	// Set attributes
	ctx.lineWidth = 0;
	ctx.strokeStyle =  "rgba(255, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
    // Coordinates of handles (in canvas plane)
    point = new ED.Point(0, 0);
    point.setWithPolars(ro, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
    this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.VitreousOpacity.prototype.description = function()
{
	return "Vitreous haemorrhage";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.VitreousOpacity.prototype.snomedCode = function()
{
	return 31341008;
}

/**
 * CNV
 *
 * @class CNV
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CNV = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CNV";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CNV.prototype = new ED.Doodle;
ED.CNV.prototype.constructor = ED.CNV;
ED.CNV.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CNV.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Set default properties
 */
ED.CNV.prototype.setPropertyDefaults = function()
{
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, +0);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +2);
}

/**
 * Sets default parameters
 */
ED.CNV.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(0, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CNV.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.CNV.superclass.draw.call(this, _point);
    
    // Boundary path
	ctx.beginPath();
    
    // Radius of CNV
    var r = 80;
    
    // Parameters of random curve
    var n = 16;
    var phi = 2 * Math.PI/n;
    var th = 0.5 * Math.PI/n;
    var b = 4;
    var point = new ED.Point(0,0);
    
    // First point
    var fp = new ED.Point(0,0);
    fp.setWithPolars(r, 0);
    ctx.moveTo(fp.x, fp.y);
    var rl = r;
    
    // Subsequent points
    for (var i = 0; i < n; i++)
    {
        // Get radius of next point
        var rn = r * (b + ED.randomArray[i])/b;
        
        // Control point 1
        var cp1 = new ED.Point(0,0);
        cp1.setWithPolars(rl, i * phi + th);
        
        // Control point 2
        var cp2 = new ED.Point(0,0);
        cp2.setWithPolars(rn, (i + 1) * phi - th);
        
        // Next point
        var pn = new ED.Point(0,0);
        pn.setWithPolars(rn, (i + 1) * phi);
        
        // Assign next point
        rl = rn;
        
        // Next point
        if (i == n - 1)
        {
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, fp.x, fp.y);
        }
        else
        {
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pn.x, pn.y);
        }
        
        // Control handle point
        if (i == 1)
        {
            point.x = pn.x;
            point.y = pn.y;
        }
    }
    
    // Close path
    ctx.closePath();
    
	// Set attributes
	ctx.lineWidth = 0;
    ctx.fillStyle = "red";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Yellow centre
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,190,1)";
        ctx.fill();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CNV.prototype.description = function()
{
	return "CNV";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CNV.prototype.snomedCode = function()
{
	return 314517003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CNV.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * IRMA
 *
 * @class IRMA
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.IRMA = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "IRMA";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.IRMA.prototype = new ED.Doodle;
ED.IRMA.prototype.constructor = ED.IRMA;
ED.IRMA.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IRMA.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.IRMA.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+1, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +1.5);
}

/**
 * Sets default parameters
 */
ED.IRMA.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(100, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IRMA.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.IRMA.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Move to centre
    ctx.moveTo(0, 30);
    
    // Create curves for the IRMA
    ctx.bezierCurveTo(-30, 30, -70, 0, -50, -20);
    ctx.bezierCurveTo(-30, -40, -20, -10, 0, -10);
    ctx.bezierCurveTo(20, -10, 30, -40, 50, -20);
    ctx.bezierCurveTo(70, 0, 30, 30, 0, 30);
    
    // Transparent fill
    ctx.fillStyle = "rgba(100, 100, 100, 0)";
	
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle =  "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(50, -40));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.IRMA.prototype.groupDescription = function()
{
	return "Intraretinal microvascular abnormalities ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IRMA.prototype.description = function()
{
    return this.locationRelativeToFovea();
}

/**
 * Macular Thickening
 *
 * @class MacularThickening
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.MacularThickening = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MacularThickening";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MacularThickening.prototype = new ED.Doodle;
ED.MacularThickening.prototype.constructor = ED.MacularThickening;
ED.MacularThickening.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularThickening.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Set default properties
 */
ED.MacularThickening.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(+100, +400);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.MacularThickening.prototype.setParameterDefaults = function()
{
	this.rotation = -Math.PI/4;
	this.apexX = 100;
	this.apexY = 0;
	
    this.setOriginWithDisplacements(0, 150);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularThickening.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MacularThickening.superclass.draw.call(this, _point);
    
    // Exudate radius
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    
	// Boundary path
	ctx.beginPath();
    
	// Exudate
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    
	// Set attributes
	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// Start path
		ctx.beginPath();
		
		// Spacing of lines
		var d = 30;
		
		// Draw central line
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
        
		// Draw other lines
		for (var s = -1; s < 2; s += 2)
		{
			for (var y = d; y < r; y += d)
			{
				var x = this.xForY(r, y);
				ctx.moveTo(-x, s * y);
				ctx.lineTo(x, s * y);
			}
		}
		
		// Set attributes
		ctx.lineWidth = 15;
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(200, 200, 200, 0.75)";
		
		// Draw lines
		ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.MacularThickening.prototype.groupDescription = function()
{
	return "Macular thickening ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.MacularThickening.prototype.description = function()
{
    return this.locationRelativeToFovea();
}

/**
 * TractionRetinalDetachment
 *
 * @class TractionRetinalDetachment
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.TractionRetinalDetachment = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "TractionRetinalDetachment";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.TractionRetinalDetachment.prototype = new ED.Doodle;
ED.TractionRetinalDetachment.prototype.constructor = ED.TractionRetinalDetachment;
ED.TractionRetinalDetachment.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.TractionRetinalDetachment.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Set default properties
 */
ED.TractionRetinalDetachment.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.addAtBack = true;
	
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.TractionRetinalDetachment.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(200, -100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.TractionRetinalDetachment.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
    
	// Call draw method in superclass
	ED.TractionRetinalDetachment.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
    // Move to centre
    var r = 60;
    var s = 150;
    ctx.moveTo(-s, -s);
    
    // Create curves for the TractionRetinalDetachment
    ctx.bezierCurveTo(-r, -r, r, -r, s, -s);
    ctx.bezierCurveTo(r, -r, r, r, s, s);
    ctx.bezierCurveTo(r, r, -r, r, -s, s);
    ctx.bezierCurveTo(-r, r, -r, -r, -s, -s);
    ctx.closePath();
	
	// Set attributes
	ctx.lineWidth = 1;
	ctx.strokeStyle =  "blue";
    ctx.fillStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(s, -s));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.TractionRetinalDetachment.prototype.groupDescription = function()
{
	return "Traction retinal detachment ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.TractionRetinalDetachment.prototype.description = function()
{
    return this.locationRelativeToDisc();
}

/**
 * @fileOverview Contains doodle subclasses for Strabismus and Orthoptics
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.8
 *
 * Modification date: 22nd October 2011
 * Copyright 2011 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * Template for strabismus surgery
 *
 * @class StrabOpTemplate
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.StrabOpTemplate = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "StrabOpTemplate";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.StrabOpTemplate.prototype = new ED.Doodle;
ED.StrabOpTemplate.prototype.constructor = ED.StrabOpTemplate;
ED.StrabOpTemplate.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.StrabOpTemplate.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isUnique = true;
    this.isDeletable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.StrabOpTemplate.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.StrabOpTemplate.superclass.draw.call(this, _point);
    
    // Drawing properties
    var insertionY = -200;
    var insertionHalfWidth = 70;
	
	// Boundary path
	ctx.beginPath();
	
	// Cornea
	ctx.arc(0,0,80,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(100, 200, 250, 0.75)";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Pupil
        ctx.beginPath();
        ctx.arc(0,0,30,0,Math.PI*2,true);
        ctx.fillStyle = "black";
        ctx.fill();
        
        // Insertions
        ctx.beginPath();
        ctx.moveTo(-insertionHalfWidth, insertionY);
        ctx.lineTo(insertionHalfWidth, insertionY);
        ctx.moveTo(insertionY, -insertionHalfWidth);
        ctx.lineTo(insertionY, insertionHalfWidth);
        ctx.moveTo(-insertionHalfWidth, -insertionY);
        ctx.lineTo(insertionHalfWidth, -insertionY);
        ctx.moveTo(-insertionY, -insertionHalfWidth);
        ctx.lineTo(-insertionY, insertionHalfWidth);
        ctx.lineWidth = 16;
        ctx.strokeStyle = "brown";
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * A rectus muscle
 *
 * @class Rectus
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 * @constructor
 */
ED.Rectus = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Rectus";
    
    // Private parameters
    this.insertionY = -200;
    this.hangback = false;
    this.canTranspose = true;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.recession = 0;
    this.transposition = 'None';

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Rectus.prototype = new ED.Doodle;
ED.Rectus.prototype.constructor = ED.Rectus;
ED.Rectus.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Rectus.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Rectus.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = false;

    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['recession'] = {kind:'derived', type:'float', range:new ED.Range(-12.5, 6.5), precision:1, animate:true};
    this.parameterValidationArray['transposition'] = {kind:'derived', type:'string', list:['Up', 'None', 'Down'], animate:true};
    this.parameterValidationArray['canTranspose'] = {kind:'derived', type:'bool', animate:false};
}

/**
 * Sets default parameters
 */
ED.Rectus.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('recession', '0');
    this.setParameterFromString('transposition', 'None');
    this.apexY = this.insertionY;
    this.canTranspose = true;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Rectus.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            returnArray['recession'] = Math.round(2 * (_value - this.insertionY)/16)/2;
            break;

        case 'recession':
            returnArray['apexY'] = _value * 16 + this.insertionY;
            break;
            
        case 'apexX':
            if (this.rotation > 0 && this.rotation < Math.PI)
            {
                if (_value < 0) returnArray['transposition'] = "Up";
                else if (_value > 0) returnArray['transposition'] = "Down";
                else returnArray['transposition'] = "None";
            }
            else
            {
                if (_value < 0) returnArray['transposition'] = "Down";
                else if (_value > 0) returnArray['transposition'] = "Up";
                else returnArray['transposition'] = "None";
            }
            break;
            
        case 'transposition':
            switch (_value)
            {
                case "Up":
                    if (this.rotation > 0 && this.rotation < Math.PI)
                    {
                        returnArray['apexX'] = -50;
                    }
                    else
                    {
                        returnArray['apexX'] = +50;
                    }
                    break;
                case "Down":
                    if (this.rotation > 0 && this.rotation < Math.PI)
                    {
                        returnArray['apexX'] = +50;
                    }
                    else
                    {
                        returnArray['apexX'] = -50;
                    }
                    break;
                case "None":
                    returnArray['apexX'] = +0;
                    break;
            }
            break;
    }
    
    // Constrain to a cross shaped path
    var cw = 15;
    if (this.apexY > this.insertionY - cw && this.apexY < this.insertionY + cw && this.canTranspose)
    {
        this.parameterValidationArray['apexX']['range'].setMinAndMax(-100, +100);
    }
    else
    {
        this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    }
    if (this.apexX > - cw && this.apexX < cw)
    {
        this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
    }
    else
    {
        this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -200);
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Rectus.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Rectus.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    var muscleHalfWidth = 60;
    var startY = -450;
	
	// Rectus
	ctx.moveTo(-muscleHalfWidth, startY);
    ctx.lineTo(muscleHalfWidth, startY);
    ctx.lineTo(this.apexX + muscleHalfWidth, this.apexY);
    ctx.lineTo(this.apexX - muscleHalfWidth, this.apexY);   
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.fillStyle = "rgba(255, 140 , 80, 1)";
    ctx.strokeStyle = "rgba(255, 184, 93, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Indicate a recection by continuing muscle beyond insertion with different fill
        if (this.insertionY < this.apexY)
        {
            // x coordinate of left side of muscle at insertion
            var xi = -muscleHalfWidth + this.apexX * (this.insertionY - startY)/(this.apexY - startY);
            
            // Part of muscle anterior to insertion
            ctx.beginPath();
            ctx.moveTo(xi, this.insertionY);
            ctx.lineTo(xi + 2 * muscleHalfWidth, this.insertionY);
            ctx.lineTo(this.apexX + muscleHalfWidth, this.apexY);
            ctx.lineTo(this.apexX - muscleHalfWidth, this.apexY);
            ctx.closePath();

            ctx.fillStyle = "rgba(255, 220, 140, 1)";
            ctx.fill();
        }
        
        // Suture
        if (!(this.apexX == 0 && this.apexY == this.insertionY)) //&& this.recession() == "0.0"))
        {
            var margin = 15;
            var sutureLength = 15;
            var indent = 10;
            var bite = 20;
            
            // Y coordinate of muscle bite
            var ym;
            if (this.insertionY > this.apexY)
            {
                ym = this.apexY;
            }
            else
            {
                ym = this.insertionY;
            }
            
            // Y coordinate of knot
            var yk;
            if (!this.hangback && this.insertionY > this.apexY)
            {
                yk = this.apexY + margin;
            }
            else
            {
                yk = this.insertionY + margin;
            }
            
            // X coordinate
            var x = this.apexX;

            ctx.beginPath();
            ctx.moveTo(x, yk);
            ctx.lineTo(x - sutureLength, yk + sutureLength);
            ctx.moveTo(x + sutureLength, yk + sutureLength);
            ctx.lineTo(x, yk);
            ctx.arc(x, yk, 4, 0, Math.PI*2, true);            
            ctx.moveTo(x, yk);
            ctx.lineTo(x - muscleHalfWidth + indent, yk);
            ctx.lineTo(x - muscleHalfWidth + indent, ym);
            ctx.moveTo(x - muscleHalfWidth + indent, ym - margin);
            ctx.lineTo(x - muscleHalfWidth + indent + bite, ym - margin);
            ctx.moveTo(x + muscleHalfWidth - indent - bite, ym - margin);
            ctx.lineTo(x + muscleHalfWidth - indent, ym - margin);
            ctx.moveTo(x + muscleHalfWidth - indent, ym);  
            ctx.lineTo(x + muscleHalfWidth - indent, yk);             
            ctx.lineTo(x, yk);      
            
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * HVTGrid
 *
 * @class HVTGrid
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.HVTGrid = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HVTGrid";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HVTGrid.prototype = new ED.Doodle;
ED.HVTGrid.prototype.constructor = ED.HVTGrid;
ED.HVTGrid.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.HVTGrid.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
    this.isShowHighlight = false;
    this.isSelectable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HVTGrid.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HVTGrid.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Radius of HVT doodle
    var ro = 125;
    var d = ro * 2;
	ctx.moveTo(-2 * d, 0);
    ctx.lineTo(+2 * d, 0);
	ctx.moveTo(-d, -d);
    ctx.lineTo(-d, +d);
	ctx.moveTo(+d, -d);
    ctx.lineTo(+d, +d);
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * HVT
 *
 * @class HVT
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.HVT = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "HVT";
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.hor = 'None';
    this.ver = 'None';
    this.tor = 'None';
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.HVT.prototype = new ED.Doodle;
ED.HVT.prototype.constructor = ED.HVT;
ED.HVT.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.HVT.prototype.setHandles = function()
{
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.HVT.prototype.setPropertyDefaults = function()
{
    this.isDeletable = false;
    this.isShowHighlight = false;
    
    // Adjust ranges for simple parameters
    this.parameterValidationArray['originY']['range'] = new ED.Range(-100, +100);
    this.parameterValidationArray['rotation']['range'] = new ED.Range(0, Math.PI/2);
    
    // Speed up horizontal and vertical animation
    this.parameterValidationArray['originX']['delta'] = 30;
    this.parameterValidationArray['originY']['delta'] = 30;
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['hor'] = {kind:'derived', type:'string', list:['XT', 'None', 'ET'], animate:true};
    this.parameterValidationArray['ver'] = {kind:'derived', type:'string', list:['R/L', 'None', 'L/R'], animate:true};
    this.parameterValidationArray['tor'] = {kind:'derived', type:'string', list:['Excyclotorsion', 'None', 'Incyclotorsion'], animate:true};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.HVT.prototype.setParameterDefaults = function()
{
    this.setParameterFromString('hor', 'None');
    this.setParameterFromString('tor', 'None');
    //this.setParameterFromString('axis', '0');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.HVT.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();

    // Value of centre for right eye
    var centre = -250;
    
    switch (_parameter)
    {
        case 'originX':
            var fudge = 20;
            if (_value < centre - fudge)
            {
                returnArray['hor'] = 'XT';
            }
            else if (_value > centre + fudge)
            {
                returnArray['hor'] = 'ET';
            }
            else
            {
                returnArray['hor'] = 'None';
            }
            break;

        case 'originY':
            var fudge = 20;
            if (_value < 0 - fudge)
            {
                returnArray['ver'] = 'R/L';
            }
            else if (_value > 0 + fudge)
            {
                returnArray['ver'] = 'L/R';
            }
            else
            {
                returnArray['ver'] = 'None';
            }
            break;
            
        case 'rotation':
            var fudge = Math.PI/16;
            if (_value < Math.PI/4 - fudge)
            {
                returnArray['tor'] = 'Excyclotorsion';
            }
            else if (_value > Math.PI/4 + fudge)
            {
                returnArray['tor'] = 'Incyclotorsion';
            }
            else
            {
                returnArray['tor'] = 'None';
            }
            break;

        case 'hor':
            switch (_value)
            {
                case 'XT':
                    returnArray['originX'] = centre - 100;
                    break;
                    
                case 'ET':
                    returnArray['originX'] = centre + 100;
                    break;
                    
                default:
                    returnArray['originX'] = centre;
                    break;
            }
            break;

        case 'ver':
            switch (_value)
            {
                case 'R/L':
                    returnArray['originY'] = 0 - 100;
                    break;
                    
                case 'L/R':
                    returnArray['originY'] = 0 + 100;
                    break;
                    
                default:
                    returnArray['originY'] = 0;
                    break;
            }
            break;
            
        case 'tor':
            switch (_value)
            {
                case 'Excyclotorsion':
                    returnArray['rotation'] = 0;
                    break;
                
                case 'Incyclotorsion':
                    returnArray['rotation'] = Math.PI/2;
                    break;
                    
                default:
                    returnArray['rotation'] = Math.PI/4;
                    break;
            }
            break;
    }

    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.HVT.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.HVT.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 125;
    var ri = 40;
    
    // Use polar coordinates to draw axis line and handle
    var phi = 1.75 * Math.PI;
    var p = new ED.Point(0,0);
    
	// Boundary path
	ctx.beginPath();
    
	// Circle
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);

    // Move to inner circle
    ctx.moveTo(ri, 0);
    
	// Arc back the other way
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = ctx.fillStyle = "rgba(100, 200, 250, 0.5)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Axis lines
        var d = 5;
        ctx.beginPath();
        
        // Define axis
        p.setWithPolars(ro - d, phi);
        ctx.moveTo(p.x, p.y);
        p.setWithPolars(ri + d, phi);
        ctx.lineTo(p.x, p.y);
        p.setWithPolars(-ro + d, phi);
        ctx.moveTo(p.x, p.y);
        p.setWithPolars(-ri - d, phi);
        ctx.lineTo(p.x, p.y);
        
        // Draw it
        ctx.lineWidth = 20;
        ctx.strokeStyle ="rgba(100, 100, 100, 0.5)";
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
    p.setWithPolars(ro, phi);
	this.handleArray[1].location = this.transform.transformPoint(p);
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}


/**
 * @fileOverview Contains doodle subclasses for surgical retina
 * @author <a href="mailto:bill.aylward@mac.com">Bill Aylward</a>
 * @version 0.93
 * @description A description
 *
 * Modification date: 23rd October 2011
 * Copyright 2011 OpenEyes
 * 
 * This file is part of OpenEyes.
 * 
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines the EyeDraw namespace
 * @namespace Namespace for all EyeDraw classes
 */
if (ED == null || typeof(ED) != "object") { var ED = new Object();}

/**
 * Fundus template with disc and arcades, extends to ora. Natively right eye, flipFundus for left eye
 *
 * @class Fundus
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Fundus = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Fundus";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Fundus.prototype = new ED.Doodle;
ED.Fundus.prototype.constructor = ED.Fundus;
ED.Fundus.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.Fundus.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isDeletable = false;
    this.isFilled = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Fundus.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Fundus.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Ora
	ctx.arc(0,0,480,0,Math.PI*2,true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
		// These values different for right and left side
		if(this.drawing.eye != ED.eye.Right)
		{
			var startX = 200;
			var midX = 100;
			var ctrlX = -50;
			var endX = -100;
			var foveaX = 100;
		}
		else
		{
			var startX = -200;
			var midX = -100;
			var ctrlX = 50;
			var endX = 100;
			var foveaX = -100;
		}
		
		// Superior arcades
		ctx.moveTo(startX, -50);
		ctx.bezierCurveTo(midX, -166, 0, -62, 0, -12);
		ctx.bezierCurveTo(0, -40, ctrlX, -100, endX, -50);
		
		// Inferior arcades
		ctx.moveTo(startX, 50);
		ctx.bezierCurveTo(midX, 166, 0, 62, 0, 12);
		ctx.bezierCurveTo(0, 40, ctrlX, 100, endX, 50);
		
		// Small cross marking fovea
		var crossLength = 10;
		ctx.moveTo(foveaX, -crossLength);
		ctx.lineTo(foveaX, crossLength);
		ctx.moveTo(foveaX - crossLength, 0);
		ctx.lineTo(foveaX + crossLength, 0);
		
		// Optic disc and cup
		ctx.moveTo(25, 0);
		ctx.arc(0,0,25,0,Math.PI*2,true);
		ctx.moveTo(12, 0);
		ctx.arc(0,0,12,0,Math.PI*2,true);
		
		// Draw it
		ctx.stroke();
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Epiretinal Membrane
 *
 * @class EpiretinalMembrane
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.EpiretinalMembrane = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
	
	// Set classname
	this.className = "EpiretinalMembrane";
}

/**
 * Sets superclass and constructor
 */
ED.EpiretinalMembrane.prototype = new ED.Doodle;
ED.EpiretinalMembrane.prototype.constructor = ED.EpiretinalMembrane;
ED.EpiretinalMembrane.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.EpiretinalMembrane.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.EpiretinalMembrane.prototype.setPropertyDefaults = function()
{
	this.isSelectable = true;
	this.isOrientated = false;
	this.isScaleable = true;
	this.isSqueezable = true;
	this.isMoveable = true;
	this.isRotatable = true;
	this.rangeOfScale = new ED.Range(+0.5, +1.5);
	this.rangeOfArc = new ED.Range(Math.PI/6, Math.PI*2);
	this.rangeOfApexX = new ED.Range(-0, +0);
	this.rangeOfApexY = new ED.Range(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.EpiretinalMembrane.prototype.setParameterDefaults = function()
{
    this.originY = 0;
    if (this.drawing.hasDoodleOfClass('PostPole'))
    {
        this.originX = 0;
    }
    else
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EpiretinalMembrane.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.EpiretinalMembrane.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    var r = 120;
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Greenish semi-transparent
        ctx.strokeStyle= "rgba(0, 255, 0, 0.7)";

        // Central line
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r,0);
        
        // Curved lines above and below
        var x = r * 0.9;
        var y = -r/2;
        var f = 0.3;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        y = r/2;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        x = r * 0.6;
        y = -r * 0.8;
        f = 0.5;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        y = r * 0.8;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        
        // Round ended line
        ctx.lineWidth = 18;
        ctx.lineCap = "round";
        
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.EpiretinalMembrane.prototype.description = function()
{
    var returnString = "Epiretinal membrane";
	
	return returnString;
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.EpiretinalMembrane.prototype.snomedCode = function()
{
	return 367649002;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.EpiretinalMembrane.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * Cryotherapy
 *
 * @class Cryo
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Cryo = function(_drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Cryo";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Cryo.prototype = new ED.Doodle;
ED.Cryo.prototype.constructor = ED.Cryo;
ED.Cryo.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Cryo.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.Cryo.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -40);
}

/**
 * Sets default parameters
 */
ED.Cryo.prototype.setParameterDefaults = function()
{
    this.apexY = -40;
    
    // Put control handle at 45 degrees
    this.rotation = Math.PI/4;
    
    // Displacement from fovea, and from last doodle
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var p = new ED.Point(doodle.originX, doodle.originY);
        
        var np = new ED.Point(0,0);
        np.setWithPolars(p.length(), p.direction() + Math.PI/6);
        
        this.move(np.x, np.y);
    }
    else
    {
        this.move((this.drawing.eye == ED.eye.Right?-1:1) * 200, -300);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Cryo.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Cryo.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Circular scar
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    
    // Circular scar
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
	
	// Set line attributes
	ctx.lineWidth = 8;
    var ptrn = ctx.createPattern(this.drawing.imageArray['CryoPattern'],'repeat');
    ctx.fillStyle = ptrn;
	ctx.strokeStyle = "rgba(80, 40, 0, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Cryo.prototype.groupDescription = function()
{
	return "Cryotherapy";
}

/**
 * Sector PRP
 *
 * @class SectorPRP
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.SectorPRP = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SectorPRP";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SectorPRP.prototype = new ED.Doodle;
ED.SectorPRP.prototype.constructor = ED.SectorPRP;
ED.SectorPRP.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SectorPRP.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Set default properties
 */
ED.SectorPRP.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI * 2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -100);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.SectorPRP.prototype.setParameterDefaults = function()
{
    this.arc = 55 * Math.PI/180;
    this.apexY = -100;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + (this.drawing.eye == ED.eye.Right?-1:1) * (doodle.arc/2 + this.arc/2 + Math.PI/12);
    }
    else
    {
        this.rotation = (this.drawing.eye == ED.eye.Right?-1:1) * this.arc/2;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SectorPRP.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SectorPRP.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of SectorPRP
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 40;
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // PRP spot data
        var si = 30;
        var sd = (30 + si);
        
        // Array of number of spots for each radius value
        var count = [47,41,35,28,22,15];
        
        // Iterate through radius and angle to draw sector
        var i = 0;
        for (var r = ro - si; r > ri; r -= sd)
        {
            var j = 0;
            
            for (var a = -Math.PI/2 - arcStart; a < this.arc - Math.PI/2 - arcStart; a += sd/r )
            {
                a = -Math.PI/2 - arcStart + j * 2 * Math.PI/count[i];
                
                var p = new ED.Point(0,0);
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x, p.y);
                
                j++;
            }
            
            i++;
        }
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Laser circle
 *
 * @class LaserCircle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.LaserCircle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LaserCircle";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserCircle.prototype = new ED.Doodle;
ED.LaserCircle.prototype.constructor = ED.LaserCircle;
ED.LaserCircle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserCircle.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, true);
}

/**
 * Set default properties
 */
ED.LaserCircle.prototype.setPropertyDefaults = function()
{
    //this.isOrientated = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI * 2);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(50, +400);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -50);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LaserCircle.prototype.setParameterDefaults = function()
{
    this.apexX = 84;
    this.apexY = -84;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var p = new ED.Point(doodle.originX, doodle.originY);
        
        var np = new ED.Point(0,0);
        np.setWithPolars(p.length(), p.direction() + Math.PI/6);
        
        this.move(np.x, np.y);
    }
    else
    {
        this.move((this.drawing.eye == ED.eye.Right?-1:1) * 200, -300);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LaserCircle.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LaserCircle.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    ctx.moveTo(this.apexX, this.apexY);
    ctx.lineTo(this.apexX, -this.apexY);
    ctx.lineTo(-this.apexX, -this.apexY);
    ctx.lineTo(-this.apexX, this.apexY);
    ctx.lineTo(this.apexX, this.apexY);
	ctx.closePath();
    
    // Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spot separation
        var ss = 25;
        
        // Point for spot
        var p = new ED.Point(0,0);
        
        // Difference indicating aspect ratio
        var d = this.apexX + this.apexY;
        
        // Radius and displacement of semicircle
        if (d < 0)
        {
            var r = this.apexX;
        }
        else
        {
            var r = -this.apexY;
        }
        
        // Number of spots in a semicircle
        var n = (Math.round(Math.PI/(ss/r)));
        
        // Draw upper (or left) half
        for (var i = 0; i < n + 1; i++)
        {
            if (d < 0)
            {
                var a = -Math.PI/2 + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x, p.y + d);
            }
            else
            {
                var a = -Math.PI + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x - d, p.y);
            }
        }
        
        // Draw lower (or right) half
        for (var i = 1; i < n; i++)
        {
            if (d < 0)
            {
                var a = Math.PI/2 + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x, p.y - d);
            }
            else
            {
                var a = 0 + i * Math.PI/n;
                p.setWithPolars(r, a);
                this.drawLaserSpot(ctx, p.x + d, p.y);
            }
        }
        
        // Draw connecting straight lines of laser
        n = Math.abs(Math.round(d/ss));
        for (var i = 0; i < 2 * n + 1; i++)
        {
            if (d < 0)
            {
                var y = this.apexY + r + i * Math.abs(d/n);
                this.drawLaserSpot(ctx, -r, y);
                this.drawLaserSpot(ctx, r, y);
            }
            else
            {
                var x = -this.apexX + r + i * Math.abs(d/n);
                this.drawLaserSpot(ctx, x, -r);
                this.drawLaserSpot(ctx, x, r);
            }
        }
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.LaserCircle.prototype.groupDescription = function()
{
	return "laser retinopexy";
}

/**
 * Laser Demarcation
 *
 * @class LaserDemarcation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.LaserDemarcation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "LaserDemarcation";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.LaserDemarcation.prototype = new ED.Doodle;
ED.LaserDemarcation.prototype.constructor = ED.LaserDemarcation;
ED.LaserDemarcation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.LaserDemarcation.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.LaserDemarcation.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/8, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -300);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.LaserDemarcation.prototype.setParameterDefaults = function()
{
    this.arc = 120 * Math.PI/180;
    this.apexY = -350;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/4;
    }
    else
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            this.rotation = -0.8 * Math.PI;
        }
        else
        {
            this.rotation = 0.8 * Math.PI;
        }
    }
    
    // If there is a retinectomy present, adjust to it
    doodle = this.drawing.lastDoodleOfClass('PeripheralRetinectomy');
    if (doodle)
    {
        this.rotation = doodle.rotation;
        this.arc = doodle.arc + Math.PI/16;
        this.apexY = doodle.apexY + 50;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LaserDemarcation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.LaserDemarcation.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of LaserDemarcation
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,0,0)";
	ctx.strokeStyle = "rgba(255,255,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Spot separation
        var ss = 25;
        
        // Location of laser spot
        var p = new ED.Point(0,0);
        
        // Unless 360, go out to the ora with an elegant semicircle
        if (this.arc < 1.9 * Math.PI)
        {
            // Radius of quarter circle
            var rc = ro - ri;
            
            // Angle of quarter circle (not quite a quarter)
            var quad = Math.PI/2;
            
            // Number of spots in a quarter circle
            var n = (Math.round(quad/(ss/rc)));
            
            // Centre of first quarter circle
            var c1 = new ED.Point(- ro * Math.sin(theta - rc/ro),- ro * Math.cos(theta - rc/ro));
            
            // Draw first quarter circle, including adjustment for improved junction
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(rc, arcEnd + 0.5 * (rc/ro) - i * quad/n);
                this.drawLaserSpot(ctx, c1.x + p.x, c1.y + p.y);
            }
            
            // Angle of main arc, with adjustment to make junction with semicircles look better
            var mainArc = this.arc - 2 * rc/ro;
            
            // Number of spots in the main arc
            var m = (Math.round(mainArc/(ss/ri)));
            
            // Draw main arc
            var mainStart = c1.direction();
            for (var i = 0; i < m + 1; i++)
            {
                p.setWithPolars(ri, mainStart + i * mainArc/m);
                this.drawLaserSpot(ctx, p.x, p.y);
            }
            
            // Centre of second quarter circle
            var c2 = new ED.Point(- ro * Math.sin(- theta + rc/ro), - ro * Math.cos(- theta + rc/ro));
            
            // Draw second quarter circle, including adjustment for improved junction
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(rc, arcStart + Math.PI - 0.5 * (rc/ro) + i * quad/n);
                this.drawLaserSpot(ctx, c2.x + p.x, c2.y + p.y);
            }
        }
        else
        {
            // Number of spots in the main arc
            var n = (Math.round(2 * Math.PI/(ss/ri)));
            
            // Draw main arc
            for (var i = 0; i < n; i++)
            {
                p.setWithPolars(ri, i * 2 * Math.PI/n);
                this.drawLaserSpot(ctx, p.x, p.y);
            }
        }
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.LaserDemarcation.prototype.description = function()
{
    var returnString = "";
    
    if (this.arc > 1.9 * Math.PI)
    {
        returnString += "360 degree ";
    }
    
    returnString += "laser demarcation";
    
	return returnString;
}

/**
 * Retinal detachment
 *
 * @class RRD
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.RRD = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RRD";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RRD.prototype = new ED.Doodle;
ED.RRD.prototype.constructor = ED.RRD;
ED.RRD.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RRD.prototype.setHandles = function()
{
	this.handleArray[1] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.RRD.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+1, +4);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+1, +4);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, +400);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RRD.prototype.setParameterDefaults = function()
{
    this.arc = 120 * Math.PI/180;
    this.apexY = -100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RRD.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RRD.superclass.draw.call(this, _point);
	
	// Fit outer curve just inside ora on right and left fundus diagrams
	var r = 952/2;
    
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
	
	// Coordinates of corners of arc
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
	
	// Boundary path
	ctx.beginPath();
	
	// Arc across from top right to to mirror image point on the other side
	ctx.arc(0, 0, r, arcStart, arcEnd, true);
	
	// Connect across the bottom via the apex point
	var bp = +0.6;
	
	// Radius of disc (from Fundus doodle)
	var dr = +25;
	
	// RD above optic disc
	if (this.apexY < -dr)
	{
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, this.apexX, this.apexY);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// RRD involves optic disc
	else if (this.apexY < dr)
	{
		// Angle from origin to intersection of disc margin with a horizontal line through apexY
		var phi = Math.acos((0 - this.apexY)/dr);
		
		// Curve to disc, curve around it, then curve out again
		var xd = dr * Math.sin(phi);
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, -xd, this.apexY);
		ctx.arc(0, 0, dr, -Math.PI/2 - phi, -Math.PI/2 + phi, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	// RRD beyond optic disc
	else
	{
		ctx.bezierCurveTo(topLeftX, topLeftY, bp * topLeftX, this.apexY, 0, 25);
		ctx.arc(0, 0, dr, Math.PI/2, 2.5*Math.PI, false);
		ctx.bezierCurveTo(-bp * topLeftX, this.apexY, topRightX, topRightY, topRightX, topRightY);
	}
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[1].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RRD.prototype.description = function()
{
	// Construct description
	var returnString = "";
	
	// Use trigonometry on rotation field to determine quadrant
	returnString = returnString + (Math.cos(this.rotation) > 0?"Supero":"Infero");
	returnString = returnString + (Math.sin(this.rotation) > 0?(this.drawing.eye == ED.eye.Right?"nasal":"temporal"):(this.drawing.eye == ED.eye.Right?"temporal":"nasal"));
	returnString = returnString + " retinal detachment";
	returnString = returnString + (this.isMacOff()?" (macula off)":" (macula on)");
	
	// Return description
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.RRD.prototype.snomedCode = function()
{
	return (this.isMacOff()?232009009:232008001);
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.RRD.prototype.diagnosticHierarchy = function()
{
	return (this.isMacOff()?10:9);
}

/**
 * Determines whether the macula is off or not
 *
 * @returns {Bool} True if macula is off
 */
ED.RRD.prototype.isMacOff = function()
{
	// Get coordinates of macula in doodle plane
	if(this.drawing.eye == ED.eye.Right)
	{
		var macula = new ED.Point(-100,0);
	}
	else
	{
		var macula = new ED.Point(100,0);
	}
	
	// Convert to canvas plane
	var maculaCanvas = this.drawing.transform.transformPoint(macula);
	
	// Determine whether macula is off or not
	if (this.draw(maculaCanvas)) return true;
	else return false;
}

/**
 * Peripheral RRD
 *
 * @class PeripheralRRD
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PeripheralRRD = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PeripheralRRD";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PeripheralRRD.prototype = new ED.Doodle;
ED.PeripheralRRD.prototype.constructor = ED.PeripheralRRD;
ED.PeripheralRRD.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripheralRRD.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PeripheralRRD.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/4, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-400, -300);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PeripheralRRD.prototype.setParameterDefaults = function()
{
    this.arc = 112 * Math.PI/180;
    this.apexY = -380;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            
        }
    }
    else
    {
        if (this.drawing.eye == ED.eye.Right)
        {
            this.rotation = -0.8 * Math.PI;
        }
        else
        {
            this.rotation = 0.8 * Math.PI;
        }
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripheralRRD.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PeripheralRRD.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
    
    // Radius of quarter circle
    var rc = ro - ri;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of PeripheralRRD
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
    // Centre of first quarter circle
    var c1 = new ED.Point(0,0);
    c1.x = - ro * Math.sin(theta - rc/ro);
    c1.y = - ro * Math.cos(theta - rc/ro);
    
    // Centre of second quarter circle
    var c2 = new ED.Point(0,0);
    c2.x = - ro * Math.sin(- theta + rc/ro);
    c2.y = - ro * Math.cos(- theta + rc/ro);
    
	// Boundary path
	ctx.beginPath();
    
	// Arc from right to left
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

    // Arc round first quarter circle (slightly less than 90 degrees)
    var phi = arcEnd - Math.PI/2;
    ctx.arc(c1.x, c1.y, rc, phi, phi - Math.PI/2 + rc/ro, true);
    
    // Arc back to the right
    ctx.arc(0, 0, ri, c1.direction() - Math.PI/2, c2.direction() - Math.PI/2, false);
    
    // Arc round second quarter circle (slightly less than 90 degrees)
    phi = arcStart + Math.PI/2;
    ctx.arc(c2.x, c2.y, rc, phi + Math.PI/2 - rc/ro, phi, true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.PeripheralRRD.prototype.snomedCode = function()
{
	return 232008001;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.PeripheralRRD.prototype.diagnosticHierarchy = function()
{
	return 8;
}


/**
 * 'U' tear
 *
 * @class UTear
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.UTear = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "UTear";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.UTear.prototype = new ED.Doodle;
ED.UTear.prototype.constructor = ED.UTear;
ED.UTear.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.UTear.prototype.setHandles = function()
{
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Scale, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.UTear.prototype.setPropertyDefaults = function()
{
	this.isOrientated = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.UTear.prototype.setParameterDefaults = function()
{
    this.apexY = -20;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var p = new ED.Point(doodle.originX, doodle.originY);
        
        var np = new ED.Point(0,0);
        np.setWithPolars(p.length(), p.direction() + Math.PI/6);
        
        this.move(np.x, np.y);
    }
    else
    {
        this.move((this.drawing.eye == ED.eye.Right?-1:1) * 200, -300);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.UTear.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.UTear.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// U tear
	ctx.moveTo(0, 40);
	ctx.bezierCurveTo(-20, 40, -40, -20, -40, -40);
	ctx.bezierCurveTo(-40, -60, -20, this.apexY, 0, this.apexY);
	ctx.bezierCurveTo(20, this.apexY, 40, -60, 40, -40);
	ctx.bezierCurveTo(40, -20, 20, 40, 0, 40);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(40, -40));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle)
    this.leftExtremity = this.transform.transformPoint(new ED.Point(-40,-40));
    this.rightExtremity = this.transform.transformPoint(new ED.Point(40,-40));
    this.arc = this.calculateArc();
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.UTear.prototype.groupDescription = function()
{
	return "'U' tear at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.UTear.prototype.description = function()
{
	return this.clockHour();
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.UTear.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * Round hole
 *
 * @class RoundHole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.RoundHole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RoundHole";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RoundHole.prototype = new ED.Doodle;
ED.RoundHole.prototype.constructor = ED.RoundHole;
ED.RoundHole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.RoundHole.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.RoundHole.prototype.setPropertyDefaults = function()
{
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RoundHole.prototype.setParameterDefaults = function()
{
    // Displacement from fovea, and from last doodle
    var d = 300;
    this.originX = d;
    this.originY = d;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var point = new ED.Point(doodle.originX, doodle.originY);
        var direction = point.direction() + Math.PI/8;
        var distance = point.length();
        var np = new ED.Point(0,0);
        np.setWithPolars(distance, direction);
        
        this.originX = np.x;
        this.originY = np.y;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RoundHole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RoundHole.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Round hole
	ctx.arc(0,0,30,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(21, -21));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
    // Calculate arc (Arc property not used naturally in this doodle ***TODO** more elegant method of doing this possible!)
    var centre = this.transform.transformPoint(new ED.Point(0,0));
    var oneWidthToRight = this.transform.transformPoint(new ED.Point(60,0));
    var xco = centre.x - this.drawing.canvas.width/2;
    var yco = centre.y - this.drawing.canvas.height/2;
    var radius = this.scaleX * Math.sqrt(xco * xco + yco * yco);
    var width = this.scaleX * (oneWidthToRight.x - centre.x);
    this.arc = Math.atan(width/radius);
    //console.log(this.arc * 180/Math.PI + " + " + this.calculateArc() * 180/Math.PI);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RoundHole.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.scaleX < 1) returnString = "Small ";
    if (this.scaleX > 1.5) returnString = "Large ";
    
    // Round hole
	returnString += "Round hole ";
	
    // Location (clockhours)
	returnString += this.clockHour() + " o'clock";
	
	return returnString;
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.RoundHole.prototype.snomedCode = function()
{
	return 302888003;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.RoundHole.prototype.diagnosticHierarchy = function()
{
	return 3;
}

/**
 * Cystoid Macular Oedema
 *
 * @class CystoidMacularOedema
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CystoidMacularOedema = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CystoidMacularOedema";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CystoidMacularOedema.prototype = new ED.Doodle;
ED.CystoidMacularOedema.prototype.constructor = ED.CystoidMacularOedema;
ED.CystoidMacularOedema.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CystoidMacularOedema.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CystoidMacularOedema.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.CystoidMacularOedema.prototype.setParameterDefaults = function()
{
    // CMO is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CystoidMacularOedema.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CystoidMacularOedema.superclass.draw.call(this, _point);
	
    // Outer radius
    var r = 100;
    
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Colours
        var fill = "rgba(255, 255, 138, 0.5)";
        var stroke = "rgba(255, 82, 0, 0.7)";
        
        // Peripheral cysts
        var point = new ED.Point(0,0);
        var n = 8;
        for (var i = 0; i < n; i++)
        {
            var angle = i * 2 * Math.PI/n;
            point.setWithPolars(2 * r/3,angle);
            this.drawCircle(ctx, point.x, point.y, 40, fill, 2, stroke);
        }
        
        // Large central cyst
        this.drawCircle(ctx, 0, 0, r/2, fill, 2, stroke);
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(84, -84));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CystoidMacularOedema.prototype.description = function()
{
    return "Cystoid macular oedema";
}

/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.CystoidMacularOedema.prototype.snomedCode = function()
{
	return 193387007;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.CystoidMacularOedema.prototype.diagnosticHierarchy = function()
{
	return 2;
}


/**
 * Epiretinal Membrane
 *
 * @class EpiretinalMembrane
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.EpiretinalMembrane = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "EpiretinalMembrane";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.EpiretinalMembrane.prototype = new ED.Doodle;
ED.EpiretinalMembrane.prototype.constructor = ED.EpiretinalMembrane;
ED.EpiretinalMembrane.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.EpiretinalMembrane.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.EpiretinalMembrane.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/6, Math.PI*2);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +1.5);
}

/**
 * Sets default parameters
 */
ED.EpiretinalMembrane.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(0, -100);
    
    // CMO is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EpiretinalMembrane.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.EpiretinalMembrane.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Invisible boundary
    var r = 120;
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Greenish semi-transparent
        ctx.strokeStyle= "rgba(0, 255, 0, 0.7)";
        
        // Central line
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r,0);
        
        // Curved lines above and below
        var x = r * 0.9;
        var y = -r/2;
        var f = 0.3;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        y = r/2;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        x = r * 0.6;
        y = -r * 0.8;
        f = 0.5;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        y = r * 0.8;
        ctx.moveTo(-x, y);
        ctx.bezierCurveTo(-x * f, y * f, x * f, y * f, x, y);
        
        // Round ended line
        ctx.lineWidth = 18;
        ctx.lineCap = "round";
        
        ctx.stroke();
	}
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(r * 0.7, -r * 0.7));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.EpiretinalMembrane.prototype.description = function()
{
    return "Epiretinal membrane";
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.EpiretinalMembrane.prototype.snomedCode = function()
{
	return 367649002;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.EpiretinalMembrane.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * Macular hole
 *
 * @class MacularHole
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.MacularHole = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "MacularHole";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.MacularHole.prototype = new ED.Doodle;
ED.MacularHole.prototype.constructor = ED.MacularHole;
ED.MacularHole.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.MacularHole.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.MacularHole.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
	this.isRotatable = false;
    this.isUnique = true;

    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-40, +30);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +1.5);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +1.5);
}

/**
 * Sets default parameters
 */
ED.MacularHole.prototype.setParameterDefaults = function()
{
    // CMO is displaced for Fundus, central for others
    if (this.drawing.hasDoodleOfClass('Fundus'))
    {
        this.originX = this.drawing.eye == ED.eye.Right?-100:100;
        this.scaleX = 0.5;
        this.scaleY = 0.5;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MacularHole.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.MacularHole.superclass.draw.call(this, _point);
    
    // Radius
    var r = 40;
	
	// Boundary path
	ctx.beginPath();
	
	// Large yellow circle - hole and subretinal fluid
	ctx.arc(0,0,r,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 0;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.arc(0,0,2*r/3,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
	}
	
	// Coordinates of handles (in canvas plane)
    point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.MacularHole.prototype.description = function()
{
    return "Macular hole";
}


/**
 * Returns the SnoMed code of the doodle
 *
 * @returns {Int} SnoMed code of entity representated by doodle
 */
ED.MacularHole.prototype.snomedCode = function()
{
	return 232006002;
}

/**
 * Returns a number indicating position in a hierarchy of diagnoses from 0 to 9 (highest)
 *
 * @returns {Int} Position in diagnostic hierarchy
 */
ED.MacularHole.prototype.diagnosticHierarchy = function()
{
	return 2;
}

/**
 * BuckleOperation
 *
 * @class BuckleOperation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.BuckleOperation = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BuckleOperation";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BuckleOperation.prototype = new ED.Doodle;
ED.BuckleOperation.prototype.constructor = ED.BuckleOperation;
ED.BuckleOperation.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.BuckleOperation.prototype.setPropertyDefaults = function()
{
	this.isSelectable = false;
    this.isDeletable = false;
    this.willReport = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BuckleOperation.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BuckleOperation.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
	
	// Cornea
    ctx.arc(0,0,100,0,Math.PI*2,true);
	
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    this.isFilled = false;
	ctx.strokeStyle = "#444";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Recti
        this.drawRectus(ctx, 'Sup');
        this.drawRectus(ctx, 'Nas');
        this.drawRectus(ctx, 'Inf');
        this.drawRectus(ctx, 'Tem');
	}
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws a rectus muscle
 *
 * @param {Context} _ctx
 * @param {Stirng} _quad Quadrant
 */
ED.BuckleOperation.prototype.drawRectus = function(_ctx, _quad)
{
    _ctx.beginPath();
    
    switch (_quad)
    {
        case 'Sup':
            x1 = -60;
            y1 = -480;
            x2 = -60;
            y2 = -200;
            x3 = 60;
            y3 = -200;
            x4 = 60;
            y4 = -480;
            xd = 30;
            yd = 0;
            break;
        case 'Nas':
            x1 = 480;
            y1 = -60;
            x2 = 200;
            y2 = -60;
            x3 = 200;
            y3 = 60;
            x4 = 480;
            y4 = 60;
            xd = 0;
            yd = 30;
            break;
        case 'Inf':
            x1 = 60;
            y1 = 480;
            x2 = 60;
            y2 = 200;
            x3 = -60;
            y3 = 200;
            x4 = -60;
            y4 = 480;
            xd = -30;
            yd = 0;
            break;
        case 'Tem':
            x1 = -480;
            y1 = 60;
            x2 = -200;
            y2 = 60;
            x3 = -200;
            y3 = -60;
            x4 = -480;
            y4 = -60;
            xd = 0;
            yd = -30;
        default:
            break;
    }
    
    _ctx.moveTo(x1, y1);
    _ctx.lineTo(x2, y2);
    _ctx.lineTo(x3, y3);
    _ctx.lineTo(x4, y4);
    _ctx.moveTo(x1 + xd, y1 + yd);
    _ctx.lineTo(x2 + xd, y2 + yd);
    _ctx.moveTo(x1 + 2 * xd, y1 + 2 * yd);
    _ctx.lineTo(x2 + 2 * xd, y2 + 2 * yd);
    _ctx.moveTo(x1 + 3 * xd, y1 + 3 * yd);
    _ctx.lineTo(x2 + 3 * xd, y2 + 3 * yd);
    _ctx.fillStyle = "#CA6800";
    _ctx.fill();
    _ctx.lineWidth = 8;
    _ctx.strokeStyle = "#804000";
    _ctx.stroke();
}

/**
 * CircumferentialBuckle buckle
 *
 * @class CircumferentialBuckle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CircumferentialBuckle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CircumferentialBuckle";

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CircumferentialBuckle.prototype = new ED.Doodle;
ED.CircumferentialBuckle.prototype.constructor = ED.CircumferentialBuckle;
ED.CircumferentialBuckle.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CircumferentialBuckle.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.CircumferentialBuckle.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-410, -320);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +4);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +4);
}

/**
 * Sets default parameters
 */
ED.CircumferentialBuckle.prototype.setParameterDefaults = function()
{
    this.arc = 140 * Math.PI/180;
    this.apexY = -320;
    this.rotation = -45 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CircumferentialBuckle.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CircumferentialBuckle.superclass.draw.call(this, _point);
    
	// Radii
    var ro = 320;
    if (-350 > this.apexY && this.apexY > -380) ro = 350;
    else if (this.apexY < -380) ro = 410;
    var ri = 220;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of CircumferentialBuckle
	var topRightX = ro * Math.sin(theta);
	var topRightY = - ro * Math.cos(theta);
	var topLeftX = - ro * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Gutter path
        ctx.beginPath();
        
        var gut = 30;
        
        rgi = ri + (ro - ri - gut)/2;
        rgo = ro - (ro - ri - gut)/2;
        
        // Arc across
        ctx.arc(0, 0, rgo, arcStart, arcEnd, true);
        
        // Arc back
        ctx.arc(0, 0, rgi, arcEnd, arcStart, false);
        
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, -ro));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CircumferentialBuckle.prototype.description = function()
{
    var returnString = "";
    
    // Size description
    if (this.apexY <= -380) returnString = "280 circumferential buckle ";
    else if (this.apexY <= -350) returnString = "279 circumferential buckle ";
	else returnString = "277 circumferential buckle ";
    
    // Location (clockhours)
    if (this.arc > Math.PI * 1.8) returnString += "encirclement";
    else returnString += this.clockHourExtent() + " o'clock";
	
	return returnString;
}


/**
 * BuckleSuture
 *
 * @class BuckleSuture
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.BuckleSuture = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BuckleSuture";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BuckleSuture.prototype = new ED.Doodle;
ED.BuckleSuture.prototype.constructor = ED.BuckleSuture;
ED.BuckleSuture.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.BuckleSuture.prototype.setHandles = function()
{
    //this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default dragging attributes
 */
ED.BuckleSuture.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.willReport = false;
}

/**
 * Sets default parameters
 */
ED.BuckleSuture.prototype.setParameterDefaults = function()
{
    this.arc = 15 * Math.PI/180;
    this.apexY = -320;
    
    // Make rotation 30 degrees to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/6;
    }
    else
    {
        this.rotation = -60 * Math.PI/180
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BuckleSuture.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BuckleSuture.superclass.draw.call(this, _point);

    // If Buckle there, take account of  size
    var ro = 340;
    var doodle = this.drawing.lastDoodleOfClass("CircumferentialBuckle");
    if (doodle) ro = -doodle.apexY + 20;
    
    var ri = 200;
    
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
    
	// Close path
	ctx.closePath();
    
	// Set line attributes
	ctx.lineWidth = 4;
    this.isFilled = false;
	ctx.strokeStyle = "#666";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Calculate location of suture
        r = ri + (ro - ri)/2;
        var sutureX = r * Math.sin(theta);
        var sutureY = - r * Math.cos(theta);
        
        ctx.beginPath();
        ctx.arc(sutureX, sutureY,5,0,Math.PI*2,true);
        ctx.moveTo(sutureX + 20, sutureY + 20);
        ctx.lineTo(sutureX, sutureY);
        ctx.lineTo(sutureX + 20, sutureY - 20);
        
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * EncirclingBand buckle
 *
 * @class EncirclingBand
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.EncirclingBand = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "EncirclingBand";

	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.EncirclingBand.prototype = new ED.Doodle;
ED.EncirclingBand.prototype.constructor = ED.EncirclingBand;
ED.EncirclingBand.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.EncirclingBand.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.addAtBack = true;
    this.isUnique = true;
}

/**
 * Sets default parameters
 */
ED.EncirclingBand.prototype.setParameterDefaults = function()
{
    this.rotation = -45 * Math.PI/180;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EncirclingBand.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.EncirclingBand.superclass.draw.call(this, _point);
    
	// Radii
    var r = 270;
    // If Buckle there, take account of  size
    var doodle = this.drawing.lastDoodleOfClass("CircumferentialBuckle");
    if (doodle)
    {
        var da = doodle.apexY;
        if (-350 > da && da > -380) r = 286;
        else if (da < -380) r = 315;
    }
    
    var ro = r + 15;
    var ri = r - 15;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, 0, 2 * Math.PI, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, 2 * Math.PI, 0, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(200,200,200,0.75)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Watzke
        ctx.beginPath();
        
        var theta = Math.PI/16;
        
        // Arc across to mirror image point on the other side
        ctx.arc(0, 0, ro + 10, theta, -theta, true);
        
        // Arc back to mirror image point on the other side
        ctx.arc(0, 0, ri - 10, -theta, theta, false);
        
        // Close path
        ctx.closePath();
        ctx.lineWidth = 6;
        ctx.stroke();
	}
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.EncirclingBand.prototype.description = function()
{
    var returnString = "Encircling band, with Watzke in ";
    
    // Get side
    if(this.drawing.eye == ED.eye.Right)
	{
		var isRightSide = true;
	}
	else
	{
		var isRightSide = false;
	}
	
	// Use trigonometry on rotation field to determine quadrant
    var angle = this.rotation + Math.PI/2;
	returnString = returnString + (Math.cos(angle) > 0?"supero":"infero");
	returnString = returnString + (Math.sin(angle) > 0?(isRightSide?"nasal":"temporal"):(isRightSide?"temporal":"nasal"));
	returnString = returnString + " quadrant";
    
	return returnString;
}

/**
 * Drainage site
 *
 * @class DrainageSite
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.DrainageSite = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DrainageSite";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DrainageSite.prototype = new ED.Doodle;
ED.DrainageSite.prototype.constructor = ED.DrainageSite;
ED.DrainageSite.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.DrainageSite.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.DrainageSite.prototype.setParameterDefaults = function()
{
    // Make rotation 30 degrees to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/6;
    }
    else
    {
        this.rotation = -60 * Math.PI/180
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DrainageSite.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.DrainageSite.superclass.draw.call(this, _point);
    
    // Radii
    var ro = 440;
    var ri = 360;
    
	// Calculate parameters for arcs
	var theta = Math.PI/30;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Line to point
	ctx.lineTo(0, -ri);;
    
	// Close path
	ctx.closePath();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#777";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.DrainageSite.prototype.groupDescription = function()
{
	return "Drainage site at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DrainageSite.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * RadialSponge
 *
 * @class RadialSponge
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.RadialSponge = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RadialSponge";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RadialSponge.prototype = new ED.Doodle;
ED.RadialSponge.prototype.constructor = ED.RadialSponge;
ED.RadialSponge.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.RadialSponge.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    this.addAtBack = true;
}

/**
 * Sets default parameters
 */
ED.RadialSponge.prototype.setParameterDefaults = function()
{
    // Make rotation 30 degrees to last one of same class
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/6;
    }
    else
    {
        this.rotation = -60 * Math.PI/180
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RadialSponge.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RadialSponge.superclass.draw.call(this, _point);
    
    // Radii
    var y = -220;
    var h = 200;
    var w = 80;
    
	// Boundary path
	ctx.beginPath();
    
    ctx.moveTo(-w/2, y);
    ctx.lineTo(-w/2, y - h);
	ctx.lineTo(w/2, y - h);
	ctx.lineTo(w/2, y);
    
	// Close path
	ctx.closePath();
    
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "lightgray";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        
        // Knot
        ctx.arc(0, y - h + 40,5,0,Math.PI*2,true);
        ctx.lineTo(-20, y - h + 30);
        ctx.moveTo(0, y - h + 40);
        ctx.lineTo(20, y - h + 30);
        
        // Suture
        ctx.moveTo(-w/2 - 20, y - 40);
        ctx.lineTo(-w/2 - 20, y - h + 40);
        ctx.lineTo(w/2 + 20, y - h + 40);
        ctx.lineTo(w/2 + 20, y - 40);
        ctx.closePath();
        ctx.stroke();
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}


/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.RadialSponge.prototype.groupDescription = function()
{
	return "Radial sponge at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.RadialSponge.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * Sclerostomy - bind an HTML element with 'overallGauge' parameter in order to achieve one way binding
 *
 * Also an example of using 'spare' properties to save otherwise unsaved parameters
 *
 * @class Sclerostomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.Sclerostomy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "Sclerostomy";
    
    // Private parameters
    this.parsPlana = -560;
    
    // Derived parameters (NB must set a value here to define parameter as a property of the object, even though value set later)
    this.overallGauge = '23g';
    this.gauge = '23g';
    this.isSutured = false;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.Sclerostomy.prototype = new ED.Doodle;
ED.Sclerostomy.prototype.constructor = ED.Sclerostomy;
ED.Sclerostomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Sclerostomy.prototype.setHandles = function()
{
    this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default dragging attributes
 */
ED.Sclerostomy.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-660, -460);
    
    // Add complete validation arrays for derived parameters
    this.parameterValidationArray['overallGauge'] = {kind:'derived', type:'string', list:['20g', '23g', '25g', '27g'], animate:false};
    this.parameterValidationArray['gauge'] = {kind:'derived', type:'string', list:['20g', '23g', '25g', '27g'], animate:false};
    this.parameterValidationArray['isSutured'] = {kind:'derived', type:'bool', display:true};
}

/**
 * Sets default parameters
 */
ED.Sclerostomy.prototype.setParameterDefaults = function()
{
    this.apexY = -600;
    this.gauge = "23g";
    this.isSutured = false;
    
    // Arc property is unused, so used it to store isSutured property 
    this.arc = 1;
    
    this.setRotationWithDisplacements(60,-45);
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.Sclerostomy.prototype.dependentParameterValues = function(_parameter, _value)
{
    var returnArray = new Array();
    
    switch (_parameter)
    {
        case 'apexY':
            if (_value < -610) returnArray['gauge'] = "20g";
            else if (_value < -560) returnArray['gauge'] = "23g";
            else if (_value < -510) returnArray['gauge'] = "25g";
            else returnArray['gauge'] = "27g";
            break;
        
        case 'overallGauge':
            returnArray['gauge'] = _value;
            break;
            
        case 'gauge':
            if (_value == "20g") returnArray['apexY'] = -650;
            else if (_value == "23g") returnArray['apexY'] = -600;
            else if (_value == "25g") returnArray['apexY'] = -550;
            else returnArray['apexY'] = -500;
            break;
            
        case 'arc':
            if (_value < 2) returnArray['isSutured'] = false;
            else returnArray['isSutured'] = true;
            break;
            
        case 'isSutured':
            if (_value) returnArray['arc'] = 3;
            else returnArray['arc'] = 1;
            break;
    }
    
    return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Sclerostomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.Sclerostomy.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Port
	ctx.rect(-60, this.parsPlana - 120, 120, 160);
    
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Draw different shape according to gauge
        switch (this.gauge)
        {
            case "20g":
                ctx.beginPath();
                ctx.moveTo(-50, this.parsPlana);
                ctx.bezierCurveTo(-30, this.parsPlana - 30, 30, this.parsPlana - 30, 50, this.parsPlana);
                ctx.bezierCurveTo(30, this.parsPlana + 30, -30, this.parsPlana + 30, -50, this.parsPlana);
                ctx.closePath();
                ctx.fillStyle = "red";
                ctx.fill();
                break;
            
            case "23g":
                ctx.beginPath();
                ctx.rect(-60, this.parsPlana - 120, 120, 60);
                ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-30, this.parsPlana - 60, 60, 60);
                ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-30, this.parsPlana, 60, 100);
                ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
                ctx.fill();
                break;
                
            case "25g":
                ctx.beginPath();
                ctx.rect(-50, this.parsPlana - 120, 100, 60);
                ctx.fillStyle = "rgba(255, 128, 0, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-20, this.parsPlana - 60, 40, 60);
                ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-20, this.parsPlana, 40, 100);
                ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
                ctx.fill();
                break;
                
            case "27g":
                ctx.beginPath();
                ctx.rect(-40, this.parsPlana - 120, 80, 60);
                ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-15, this.parsPlana - 60, 30, 60);
                ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
                ctx.fill();
                ctx.beginPath();
                ctx.rect(-15, this.parsPlana, 30, 100);
                ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
                ctx.fill();
                break;
        }
        ctx.fill();
        
        // Draw suture
        if (this.isSutured || this.gauge == "20g")
        {
            ctx.beginPath();
            ctx.moveTo(-40, this.parsPlana + 40);
            ctx.lineTo(-40, this.parsPlana - 40);
            ctx.lineTo(+40, this.parsPlana + 40);
            ctx.lineTo(+40, this.parsPlana - 40);
            ctx.lineTo(-40, this.parsPlana + 40);
            
            ctx.lineWidth = 6;
            ctx.strokeStyle = "rgba(0,0,120,0.7)";
            ctx.closePath();
            ctx.stroke();
        }
    }
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Draws extra items if the doodle is highlighted
 */
ED.Sclerostomy.prototype.drawHighlightExtras = function()
{
    // Get context
	var ctx = this.drawing.context;
    
    // Draw text description of gauge
    ctx.lineWidth=1;
    ctx.fillStyle="gray";
    ctx.font="64px sans-serif";
    ctx.fillText(this.gauge, 80, this.parsPlana + 20);
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.Sclerostomy.prototype.groupDescription = function()
{
	return "Sclerostomies at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Sclerostomy.prototype.description = function()
{
    // Sutured?
    var sutured = this.isSutured?" (sutured)":"";
    
    // Location (clockhours)
	return this.clockHour() + sutured;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Sclerostomy.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * Chandelier (single)
 *
 * @class ChandelierSingle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ChandelierSingle = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ChandelierSingle";
    
    // Private parameters
    this.parsPlana = -560;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ChandelierSingle.prototype = new ED.Doodle;
ED.ChandelierSingle.prototype.constructor = ED.ChandelierSingle;
ED.ChandelierSingle.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.ChandelierSingle.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.ChandelierSingle.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(180, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ChandelierSingle.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ChandelierSingle.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Port
	ctx.rect(-60, this.parsPlana - 60, 120, 160);
    
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Trocar
        ctx.beginPath();
        ctx.moveTo(-20, this.parsPlana + 60);
        ctx.lineTo(+20, this.parsPlana + 60);
        ctx.lineTo(+20, this.parsPlana + 120);
        ctx.lineTo(0, this.parsPlana + 140);
        ctx.lineTo(-20, this.parsPlana + 120);
        ctx.lineTo(-20, this.parsPlana + 60);
        ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.rect(-60, this.parsPlana, 120, 60);
        ctx.fillStyle = "rgba(120, 120, 120, 1)";
        ctx.fill();
        
        // Fibre optic
        ctx.beginPath();
        ctx.moveTo(0, this.parsPlana);
        ctx.bezierCurveTo(0, this.parsPlana - 50, 50, this.parsPlana - 100, 100, this.parsPlana - 100);
        ctx.lineWidth = 40;
        ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
        ctx.stroke();
    }

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ChandelierSingle.prototype.groupDescription = function()
{
	return "Chandelier at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ChandelierSingle.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * Chandelier (double)
 *
 * @class ChandelierDouble
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ChandelierDouble = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ChandelierDouble";
    
    // Private parameters
    this.parsPlana = -560;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ChandelierDouble.prototype = new ED.Doodle;
ED.ChandelierDouble.prototype.constructor = ED.ChandelierDouble;
ED.ChandelierDouble.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.ChandelierDouble.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.ChandelierDouble.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(180, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ChandelierDouble.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ChandelierDouble.superclass.draw.call(this, _point);
    
	// Boundary path
	ctx.beginPath();
    
	// Port
	ctx.rect(-120, this.parsPlana - 60, 240, 160);
    
	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other stuff here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Trocars
        ctx.beginPath();
        var d = -80;
        ctx.moveTo(d - 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 120);
        ctx.lineTo(d, this.parsPlana + 140);
        ctx.lineTo(d - 20, this.parsPlana + 120);
        ctx.lineTo(d - 20, this.parsPlana + 60);
        var d = 80;
        ctx.moveTo(d - 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 60);
        ctx.lineTo(d + 20, this.parsPlana + 120);
        ctx.lineTo(d, this.parsPlana + 140);
        ctx.lineTo(d - 20, this.parsPlana + 120);
        ctx.lineTo(d - 20, this.parsPlana + 60);
        ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.rect(-120, this.parsPlana, 240, 60);
        ctx.fillStyle = "rgba(120, 120, 120, 1)";
        ctx.fill();
        
        // Fibre optic
        ctx.beginPath();
        ctx.moveTo(0, this.parsPlana);
        ctx.bezierCurveTo(0, this.parsPlana - 50, 50, this.parsPlana - 100, 100, this.parsPlana - 100);
        ctx.lineWidth = 40;
        ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
        ctx.stroke();
    }
    
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ChandelierDouble.prototype.groupDescription = function()
{
	return "Twin chandelier at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ChandelierDouble.prototype.description = function()
{
    // Location (clockhours)
	return this.clockHour() + " o'clock";
}

/**
 * Corneal erosion
 *
 * @class CornealErosion
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CornealErosion = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CornealErosion";
    
    // Doodle specific property
    this.isInVisualAxis = false;
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CornealErosion.prototype = new ED.Doodle;
ED.CornealErosion.prototype.constructor = ED.CornealErosion;
ED.CornealErosion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealErosion.prototype.setHandles = function()
{
    this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.CornealErosion.prototype.setPropertyDefaults = function()
{
	this.isSqueezable = true;
	this.isRotatable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['originX']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['originY']['range'].setMinAndMax(-150, +150);
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.25, +2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.25, +2);
}

/**
 * Sets default parameters
 */
ED.CornealErosion.prototype.setParameterDefaults = function()
{
    this.apexY = -50;
    this.scaleX = 1.5;
    this.scaleY = 1;
    
    this.setOriginWithDisplacements(0,25);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealErosion.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CornealErosion.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
	// CornealErosion
    var r = 120;
	ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    
	// Close path
	ctx.closePath();
    
    // Properties
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(230, 230, 230, 0.25)";
	ctx.strokeStyle = "rgba(100, 100, 100, 1)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealErosion.prototype.groupDescription = function()
{
	return "Removal of some corneal epithelium";
}

/**
 * Cutter Peripheral iridectomy
 *
 * @class CutterPI
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.CutterPI = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "CutterPI";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.CutterPI.prototype = new ED.Doodle;
ED.CutterPI.prototype.constructor = ED.CutterPI;
ED.CutterPI.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.CutterPI.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.CutterPI.prototype.setParameterDefaults = function()
{
    this.setRotationWithDisplacements(160,40);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CutterPI.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.CutterPI.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
    
    // Draw base
    ctx.arc(0, -324, 40, 0, 2 * Math.PI, true);
    
    // Colour of fill
    ctx.fillStyle = "rgba(255,255,255,1)";
    
	// Set line attributes
	ctx.lineWidth = 4;
    
    // Colour of outer line is dark gray
    ctx.strokeStyle = "rgba(120,120,120,0.75)";;
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CutterPI.prototype.groupDescription = function()
{
    return "Cutter iridectomy/s";
}

/**
 * Scleral incision
 *
 * @class ScleralIncision
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ScleralIncision = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ScleralIncision";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ScleralIncision.prototype = new ED.Doodle;
ED.ScleralIncision.prototype.constructor = ED.ScleralIncision;
ED.ScleralIncision.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ScleralIncision.prototype.setHandles = function()
{
    this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default properties
 */
ED.ScleralIncision.prototype.setPropertyDefaults = function()
{
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/16, Math.PI/2);
}

/**
 * Sets default parameters (only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.ScleralIncision.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/8;
    this.setRotationWithDisplacements(60,-120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ScleralIncision.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ScleralIncision.superclass.draw.call(this, _point);
	
    // Radii
    var r =  560;
    var d = 40;
    var ro = r + d;
    var ri = r - d;
    
    // Boundary path
	ctx.beginPath();
    
    // Half angle of arc
    var theta = this.arc/2;
    
    // Arc across
    ctx.arc(0, 0, ro, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
    
    // Arc back to mirror image point on the other side
    ctx.arc(0, 0, ri, - Math.PI/2 - theta, - Math.PI/2 + theta, false);
    
	// Close path
	ctx.closePath();
    
    // Colour of fill
    ctx.fillStyle = "rgba(200,200,200,0)";
    
    // Set line attributes
    ctx.lineWidth = 5;
    
    // Colour of outer line
    ctx.strokeStyle = "rgba(120,120,120,0)";
    
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Non boundary drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
    {
        // New path
        ctx.beginPath();
        
        // Arc across
        ctx.arc(0, 0, r, - Math.PI/2 + theta, - Math.PI/2 - theta, true);
        
        // Sutures
        var sutureSeparationAngle = 0.2;
        var p = new ED.Point(0, 0);
        var phi = theta - sutureSeparationAngle/2;
        
        do
        {
            p.setWithPolars(r - d, phi);
            ctx.moveTo(p.x, p.y);
            p.setWithPolars(r + d, phi);
            ctx.lineTo(p.x, p.y);
            
            phi = phi - sutureSeparationAngle;
        } while(phi > -theta);
        
        // Set line attributes
        ctx.lineWidth = 6;
        
        // Colour of outer line is dark gray
        ctx.strokeStyle = "rgba(120,120,120,0.75)";
        
        // Draw incision
        ctx.stroke();
	}
    
    // Coordinates of handles (in canvas plane)
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, theta);
	this.handleArray[3].location = this.transform.transformPoint(point);
    
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ScleralIncision.prototype.groupDescription = function()
{
	return "Scleral incision at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ScleralIncision.prototype.description = function()
{
	return this.clockHour();
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ScleralIncision.prototype.groupDescriptionEnd = function()
{
	return " o'clock";
}

/**
 * Peripheral retinectomy
 *
 * @class PeripheralRetinectomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PeripheralRetinectomy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PeripheralRetinectomy";
    
    // Private parameter
    this.extent = "";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PeripheralRetinectomy.prototype = new ED.Doodle;
ED.PeripheralRetinectomy.prototype.constructor = ED.PeripheralRetinectomy;
ED.PeripheralRetinectomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PeripheralRetinectomy.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PeripheralRetinectomy.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/4, 2 * Math.PI);
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-450, -350);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.PeripheralRetinectomy.prototype.setParameterDefaults = function()
{
    this.arc = 240 * Math.PI/180;
    this.apexY = -380;
    
    // If more than one, rotate it a bit to distinguish it
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        this.rotation = doodle.rotation + Math.PI/4;
    }
    else
    {
        this.rotation = Math.PI;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PeripheralRetinectomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PeripheralRetinectomy.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 952/2;
    var ri = -this.apexY;
    var r = ri + (ro - ri)/2;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of PeripheralRetinectomy
	var topRightX = r * Math.sin(theta);
	var topRightY = - r * Math.cos(theta);
	var topLeftX = - r * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,0,0)";
	ctx.strokeStyle = "rgba(255,0,255,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        // Path for retinectomy
        ctx.beginPath();
        
        // Unless 360, curve out from the ora
        if (this.arc < 1.95 * Math.PI)
        {
            // Angle to determine curve
            var phi1 = theta - Math.PI/24;
            var phi2 = theta - 2 * Math.PI/24;
            
            // Right points
            var rsp = new ED.Point(ro * Math.sin(theta), -ro * Math.cos(theta));
            var rcp1 = new ED.Point(r * Math.sin(theta), -r * Math.cos(theta));
            var rcp2 = new ED.Point(ri * Math.sin(phi1), -ri * Math.cos(phi1));
            var rep = new ED.Point(ri * Math.sin(phi2), -ri * Math.cos(phi2));
            
            // Inner arc
            arcStart = - Math.PI/2 + phi2;
            arcEnd = - Math.PI/2 - phi2;
            
            // Left points
            var lsp = new ED.Point(-ri * Math.sin(phi2), -ri * Math.cos(phi2));
            var lcp1 = new ED.Point(-ri * Math.sin(phi1), -ri * Math.cos(phi1));
            var lcp2 = new ED.Point(-r * Math.sin(theta), -r * Math.cos(theta));
            var lep = new ED.Point(-ro * Math.sin(theta), -ro * Math.cos(theta));
            
            // Path
            ctx.moveTo(rsp.x, rsp.y);
            ctx.bezierCurveTo(rcp1.x, rcp1.y, rcp2.x, rcp2.y, rep.x, rep.y);
            ctx.arc(0, 0, ri, arcStart, arcEnd, true);
            ctx.bezierCurveTo(lcp1.x, lcp1.y, lcp2.x, lcp2.y, lep.x, lep.y)
            
            // Angle to nearest 10 degrees.
            var degrees = Math.floor(this.arc * 18/Math.PI) * 10;
            
            this.extent = "Retinectomy of " + degrees + " degrees centred at " + this.clockHour() + " o'clock";
        }
        else
        {
            // Just a circl to represent a 360 degree retinectomy
            ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);
            
            // Description text
            this.extent = "360 degree retinectomy";
        }
        
        // Draw retinectomy
        ctx.lineWidth = 16;
        ctx.strokeStyle = "red";
        ctx.stroke();
	}
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PeripheralRetinectomy.prototype.description = function()
{
	return this.extent;
}

/**
 * Posterior retinectomy
 *
 * @class PosteriorRetinectomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.PosteriorRetinectomy = function(_drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "PosteriorRetinectomy";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.PosteriorRetinectomy.prototype = new ED.Doodle;
ED.PosteriorRetinectomy.prototype.constructor = ED.PosteriorRetinectomy;
ED.PosteriorRetinectomy.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.PosteriorRetinectomy.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.PosteriorRetinectomy.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-200, -50);
}

/**
 * Sets default parameters
 */
ED.PosteriorRetinectomy.prototype.setParameterDefaults = function()
{
    this.apexX = 0;
    this.apexY = -100;
    
    // Displacement from fovea, and from last doodle
    var d = 100;
    
    this.originX = d;
    this.originY = -d;
    
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var point = new ED.Point(doodle.originX, doodle.originY);
        var direction = point.direction() + Math.PI/8;
        var distance = point.length();
        var np = new ED.Point(0,0);
        np.setWithPolars(distance, direction);
        
        this.originX = np.x;
        this.originY = np.y;
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.PosteriorRetinectomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.PosteriorRetinectomy.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Circular retinectomy
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    var w = 16;
    
    // Two arcs
	ctx.arc(0, 0, r + w, 0, Math.PI*2, true);
    ctx.arc(0, 0, r - w, Math.PI*2, 0, false);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(255,255,0,0)";
	ctx.strokeStyle = "rgba(255,255,0,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI*2, true);
        ctx.lineWidth = 16;
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.PosteriorRetinectomy.prototype.groupDescription = function()
{
	return "Posterior retinectomy";
}

/**
 * Drainage retinotomy
 *
 * @class DrainageRetinotomy
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.DrainageRetinotomy = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "DrainageRetinotomy";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.DrainageRetinotomy.prototype = new ED.Doodle;
ED.DrainageRetinotomy.prototype.constructor = ED.DrainageRetinotomy;
ED.DrainageRetinotomy.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.DrainageRetinotomy.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(140, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.DrainageRetinotomy.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.DrainageRetinotomy.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Circle
	ctx.arc(0,0,30,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 16;
	ctx.fillStyle = "rgba(255,0,0,0.5)";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.DrainageRetinotomy.prototype.description = function()
{
    return "Drainage retinotomy in " + this.quadrant();
}

/**
 * Entry Site Break
 *
 * @class EntrySiteBreak
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.EntrySiteBreak = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "EntrySiteBreak";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.EntrySiteBreak.prototype = new ED.Doodle;
ED.EntrySiteBreak.prototype.constructor = ED.EntrySiteBreak;
ED.EntrySiteBreak.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.EntrySiteBreak.prototype.setHandles = function()
{
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default properties
 */
ED.EntrySiteBreak.prototype.setPropertyDefaults = function()
{
	this.isMoveable = false;
    this.isArcSymmetrical = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI/16, 3 * Math.PI/16);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.EntrySiteBreak.prototype.setParameterDefaults = function()
{
    this.arc = Math.PI/8;
    this.setRotationWithDisplacements(60, -120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EntrySiteBreak.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.EntrySiteBreak.superclass.draw.call(this, _point);
    
	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 460;
    var ri = 400;
	
	// Calculate parameters for arcs
	var theta = this.arc/2;
	var arcStart = - Math.PI/2 + theta;
	var arcEnd = - Math.PI/2 - theta;
    
    // Coordinates of 'corners' of EntrySiteBreak
	var topRightX = ro * Math.sin(theta);
	var topRightY = - ro * Math.cos(theta);
	var topLeftX = - ro * Math.sin(theta);
	var topLeftY = topRightY;
    
	// Boundary path
	ctx.beginPath();
    
	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);
    
	// Curve gracefull to start again
	ctx.bezierCurveTo(0, -ri, 0, -ri, topRightX, topRightY);
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * RetinalTouch
 *
 * @class RetinalTouch
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.RetinalTouch = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "RetinalTouch";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.RetinalTouch.prototype = new ED.Doodle;
ED.RetinalTouch.prototype.constructor = ED.RetinalTouch;
ED.RetinalTouch.superclass = ED.Doodle.prototype;

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.RetinalTouch.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(140, 100);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.RetinalTouch.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.RetinalTouch.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Circle
	ctx.arc(0,0,60,0,Math.PI*2,true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,0,0,0)";
	ctx.strokeStyle = "rgba(255,0,0,0)";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
    
    // Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
        var n = 8;
        var ri = 20;
        var ro = 40;
        
        ctx.beginPath();
        
        // Circle
        ctx.arc(0, 0, ri, 0, 2 * Math.PI, true);
        
        // Radial lines
        var theta = 0;
        for (var i = 0; i < n; i++)
        {
            theta += 2 * Math.PI/n;
            var sp = new ED.Point(0,0);
            var ep = new ED.Point(0,0);
            sp.setWithPolars(ri, theta);
            ep.setWithPolars(ro, theta);
            
            ctx.moveTo(sp.x, sp.y);
            ctx.lineTo(ep.x, ep.y);
        }
        
        ctx.lineWidth = 8;
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Iatrogenic break
 *
 * @class IatrogenicBreak
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.IatrogenicBreak = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "IatrogenicBreak";
	
    // Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.IatrogenicBreak.prototype = new ED.Doodle;
ED.IatrogenicBreak.prototype.constructor = ED.IatrogenicBreak;
ED.IatrogenicBreak.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.IatrogenicBreak.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, true);
}

/**
 * Sets default properties
 */
ED.IatrogenicBreak.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(0.8, 2);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(0.8, 2);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.IatrogenicBreak.prototype.setParameterDefaults = function()
{
    this.setOriginWithDisplacements(240, -50);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.IatrogenicBreak.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.IatrogenicBreak.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Oval break
    var d = 40;
    var p = 0.8;
    var sp = new ED.Point(-d,d);
    var ep = new ED.Point(d,-d);
    
    // Oval shape
    ctx.moveTo(sp.x, sp.y);
    ctx.bezierCurveTo(sp.x, sp.y - p * d, ep.x - p * d, ep.y, ep.x, ep.y);
    ctx.bezierCurveTo(ep.x, ep.y + p * d, sp.x + p * d, sp.y, sp.x, sp.y);
	
	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "red";
	ctx.strokeStyle = "blue";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(ep);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.IatrogenicBreak.prototype.description = function()
{
    return "Iatrogenic break in " + this.quadrant();
}

/**
 * Biopsy site
 *
 * @class BiopsySite
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Float} _radius
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.BiopsySite = function(_drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "BiopsySite";
    
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _radius, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.BiopsySite.prototype = new ED.Doodle;
ED.BiopsySite.prototype.constructor = ED.BiopsySite;
ED.BiopsySite.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.BiopsySite.prototype.setHandles = function()
{
	this.handleArray[2] = new ED.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.BiopsySite.prototype.setPropertyDefaults = function()
{
    // Update component of validation array for simple parameters
    this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.5, +3);
    this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.5, +3);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.BiopsySite.prototype.setParameterDefaults = function()
{
    this.scaleX = 0.75;
    this.scaleY = 0.75;
    this.setOriginWithDisplacements(300, -80);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.BiopsySite.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.BiopsySite.superclass.draw.call(this, _point);
    
    // Radius of laser spot
    var r = 30;
    
	// Boundary path
	ctx.beginPath();
    
	// Circle
    ctx.arc(0, 0, r, 0, Math.PI * 2, true);
    
	// Close path
	ctx.closePath();
	
	// Set line attributes
	ctx.lineWidth = r * 2/3;
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "red";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Other paths and drawing here
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw)
	{
	}
    
    var point = new ED.Point(0, 0);
    point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
    
	// Return value indicating successful hit test
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.BiopsySite.prototype.description = function()
{
    return "Biopsy site in the " + this.quadrant();
}

/**
 * ILM peel
 *
 * @class ILMPeel
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.ILMPeel = function(_drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "ILMPeel";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.ILMPeel.prototype = new ED.Doodle;
ED.ILMPeel.prototype.constructor = ED.ILMPeel;
ED.ILMPeel.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ILMPeel.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.ILMPeel.prototype.setPropertyDefaults = function()
{
    this.isUnique = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -40);
}

/**
 * Sets default parameters
 */
ED.ILMPeel.prototype.setParameterDefaults = function()
{
    this.apexY = -60;
    this.rotation = Math.PI/4;
    
    this.originX = this.drawing.eye == ED.eye.Right?-100:100;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ILMPeel.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.ILMPeel.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Circular scar
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    
    // Circular scar
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
	
	// Set line attributes
	ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(220, 220, 220, 0.5)";
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ILMPeel.prototype.groupDescription = function()
{
	return "ILM peel";
}

/**
 * Subretinal heavy liquid
 *
 * @class SubretinalPFCL
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Int} _originX
 * @param {Int} _originY
 * @param {Int} _apexX
 * @param {Int} _apexY
 * @param {Float} _scaleX
 * @param {Float} _scaleY
 * @param {Float} _arc
 * @param {Float} _rotation
 * @param {Int} _order
 */
ED.SubretinalPFCL = function(_drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order)
{
	// Set classname
	this.className = "SubretinalPFCL";
    
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _originX, _originY, _apexX, _apexY, _scaleX, _scaleY, _arc, _rotation, _order);
}

/**
 * Sets superclass and constructor
 */
ED.SubretinalPFCL.prototype = new ED.Doodle;
ED.SubretinalPFCL.prototype.constructor = ED.SubretinalPFCL;
ED.SubretinalPFCL.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SubretinalPFCL.prototype.setHandles = function()
{
	this.handleArray[4] = new ED.Handle(null, true, ED.Mode.Apex, false);
}

/**
 * Sets default properties
 */
ED.SubretinalPFCL.prototype.setPropertyDefaults = function()
{
    this.addAtBack = true;
    
    // Update component of validation array for simple parameters
    this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
    this.parameterValidationArray['apexY']['range'].setMinAndMax(-80, -20);
}

/**
 * Sets default parameters
 */
ED.SubretinalPFCL.prototype.setParameterDefaults = function()
{
    this.apexY = -40;
    
    // Put control handle at 45 degrees
    this.rotation = Math.PI/4;
    
    // Displacement from fovea, and from last doodle
    var doodle = this.drawing.lastDoodleOfClass(this.className);
    if (doodle)
    {
        var p = new ED.Point(doodle.originX, doodle.originY);
        
        var np = new ED.Point(0,0);
        np.setWithPolars(p.length(), p.direction() + Math.PI/6);
        
        this.move(np.x, np.y);
    }
    else
    {
        this.move((this.drawing.eye == ED.eye.Right?-1:1) * 200, 0);
    }
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SubretinalPFCL.prototype.draw = function(_point)
{
	// Get context
	var ctx = this.drawing.context;
	
	// Call draw method in superclass
	ED.SubretinalPFCL.superclass.draw.call(this, _point);
	
	// Boundary path
	ctx.beginPath();
	
	// Radius 
    var r = Math.sqrt(this.apexX * this.apexX + this.apexY * this.apexY);
    
    // Circular bleb
	ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
	
	// Set line attributes
	ctx.lineWidth = 1;
    
    var d = r/1.1412135
    var lingrad = ctx.createLinearGradient(-d,-d,d,d);
    lingrad.addColorStop(0, 'rgba(255,255,255,1)');
    lingrad.addColorStop(0.7, 'rgba(200,200,200,1)');
    lingrad.addColorStop(1, 'rgba(140,140,140,1)');
    
    ctx.fillStyle = lingrad
	ctx.strokeStyle = "gray";
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of handles (in canvas plane)
	this.handleArray[4].location = this.transform.transformPoint(new ED.Point(this.apexX, this.apexY));
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SubretinalPFCL.prototype.groupDescription = function()
{
	return "Subretinal PFCL";
}
