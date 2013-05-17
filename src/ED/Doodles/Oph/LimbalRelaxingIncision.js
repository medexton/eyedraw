/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * LimbalRelaxingIncision
 *
 * @class LimbalRelaxingIncision
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.LimbalRelaxingIncision = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "LimbalRelaxingIncision";

	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation'];
	
	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
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
ED.LimbalRelaxingIncision.prototype.setHandles = function() {
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Sets default dragging attributes
 */
ED.LimbalRelaxingIncision.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isArcSymmetrical = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(20 * Math.PI / 180, Math.PI / 2);
}

/**
 * Sets default parameters
 */
ED.LimbalRelaxingIncision.prototype.setParameterDefaults = function() {
	// Default arc
	this.arc = 30 * Math.PI / 180;

	// Make it 180 degrees to last one of same class
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		this.rotation = doodle.rotation + Math.PI;
		this.arc = doodle.arc;
	} else {
		// LRIs are usually temporal
		if (this.drawing.eye == ED.eye.Right) {
			this.rotation = -Math.PI / 2;
		} else {
			this.rotation = Math.PI / 2;
		}
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.LimbalRelaxingIncision.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.LimbalRelaxingIncision.superclass.draw.call(this, _point);

	// Radius
	var r = 360
	var d = 12;
	var ro = r + d;
	var ri = r - d;

	// Boundary path
	ctx.beginPath();

	// Half angle of arc
	var theta = this.arc / 2;

	// Arc across
	ctx.arc(0, 0, ro, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);

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
ED.LimbalRelaxingIncision.prototype.description = function() {
	var returnString = "Limbal relaxing incision " + (this.arc * 180 / Math.PI).toFixed(0) + " degrees at ";
	returnString += this.clockHour() + " o'clock";

	return returnString;
}