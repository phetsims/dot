// Copyright 2013-2015, University of Colorado Boulder

/**
 * A numeric range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  /**
   * @param {number} min - the minimum value of the range
   * @param {number} max - the maximum value of the range
   * @constructor
   */
  function Range( min, max ) {

    // @public (read-only) - the minimum value of the range
    this.min = min;

    // @public (read-only) - the maximum value of the range
    this.max = max;

    assert && assert( min <= max );
  }

  dot.register( 'Range', Range );

  Range.prototype = {

    constructor: Range,

    /**
     * Makes a copy of this range
     * @public
     * @returns {Range}
     */
    copy: function() {
      return new Range( this.min, this.max );
    },

    /**
     * Gets the length of this range, that is the difference between the maximum and minimum value of this range
     * @public
     * @returns {number}
     */
    getLength: function() {
      return this.max - this.min;
    },

    /**
     * Gets the center of this range, that is the average value of the maximum and minimum value of this range
     * @public
     * @returns {number}
     */
    getCenter: function() {
      return (this.max + this.min) / 2;
    },

    /**
     * Determines if this range contains the value
     * @public
     * @param {number} value
     * @returns {boolean}
     */
    contains: function( value ) {
      return ( value >= this.min ) && ( value <= this.max );
    },

    /**
     * Does this range contain the specified range?
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    containsRange: function( range ) {
      return this.min <= range.min && this.max >= range.max;
    },

    /**
     * Determine if this range overlaps (intersects) with another range
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    intersects: function( range ) {
      return ( this.max >= range.min ) && ( range.max >= this.min );
    },

    /**
     * Do the two ranges overlap with one another?  Note that this assumes that
     * This is a open interval.
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    intersectsExclusive: function( range ) {
      return ( this.max > range.min ) && ( range.max > this.min );
    },

    /**
     * Converts the attributes of this range to a string
     * @public
     * @returns {string}
     */
    toString: function() {
      return '[Range (min:' + this.min + ' max:' + this.max + ')]';
    },

    /**
     * Constrains a value to the range.
     * @public
     * @param {number} value
     * @returns {number}
     */
    constrainValue: function( value ) {
      return Math.min( Math.max( value, this.min ), this.max );
    },

    /**
     * Determines if this range is equal to other range.
     * @public
     * @param {Range} other
     * @returns {boolean}
     */
    equals: function( other ) {
      return this.min === other.min && this.max === other.max;
    }
  };

  return Range;
} );
