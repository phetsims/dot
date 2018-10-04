// Copyright 2013-2018, University of Colorado Boulder

/**
 * A numeric range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrew Adare
 * @author Chris Klusendorf (PhET Interactive Simulations)
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

    assert && assert( min <= max, 'max must be >= min. min: ' + min + ', max: ' + max );

    // @private the minimum value of the range
    this._min = min;

    // @private the maximum value of the range
    this._max = max;
  }

  dot.register( 'Range', Range );

  Range.prototype = {

    constructor: Range,

    /**
     * Getter for min
     * @returns {number}
     * @public
     */
    getMin: function() {
      return this._min;
    },
    get min() {
      return this.getMin();
    },

    /**
     * Setter for min
     * @public
     * @param {number} min
     */
    setMin: function( min ) {
      assert && assert( min <= this._max, 'min must be <= max: ' + min );
      this._min = min;
    },
    set min( min ) {
      this.setMin( min );
    },

    /**
     * Getter for max
     * @returns {number}
     * @public
     */
    getMax: function() {
      return this._max;
    },
    get max() {
      return this.getMax();
    },

    /**
     * Setter for max
     * @public
     * @param {number} max
     */
    setMax: function( max ) {
      assert && assert( this._min <= max, 'max must be >= to min: ' + max );
      this._max = max;
    },
    set max( max ) {
      this.setMax( max );
    },

    /**
     * Sets the minimum and maximum value of the range
     * @public
     * @param {number} min
     * @param {number} max
     */
    setMinMax: function( min, max ) {
      assert && assert( min <= max, 'max must be >= to min. min: ' + min + ', max: ' + max );
      this._min = min;
      this._max = max;
    },

    /**
     * Makes a copy of this range
     * @public
     * @returns {Range}
     */
    copy: function() {
      return new Range( this._min, this._max );
    },

    /**
     * Gets the length of this range, that is the difference between the maximum and minimum value of this range
     * @public
     * @returns {number}
     */
    getLength: function() {
      return this._max - this._min;
    },

    /**
     * Gets the center of this range, that is the average value of the maximum and minimum value of this range
     * @public
     * @returns {number}
     */
    getCenter: function() {
      return ( this._max + this._min ) / 2;
    },

    /**
     * Determines if this range contains the value
     * @public
     * @param {number} value
     * @returns {boolean}
     */
    contains: function( value ) {
      return ( value >= this._min ) && ( value <= this._max );
    },

    /**
     * Does this range contain the specified range?
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    containsRange: function( range ) {
      return ( this._min <= range.min ) && ( this._max >= range.max );
    },

    /**
     * Determine if this range overlaps (intersects) with another range
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    intersects: function( range ) {
      return ( this._max >= range.min ) && ( range.max >= this._min );
    },

    /**
     * Do the two ranges overlap with one another?  Note that this assumes that
     * This is a open interval.
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    intersectsExclusive: function( range ) {
      return ( this._max > range.min ) && ( range.max > this._min );
    },

    /**
     * Converts the attributes of this range to a string
     * @public
     * @returns {string}
     */
    toString: function() {
      return '[Range (min:' + this._min + ' max:' + this._max + ')]';
    },

    /**
     * Constrains a value to the range.
     * @public
     * @param {number} value
     * @returns {number}
     */
    constrainValue: function( value ) {
      return Math.min( Math.max( value, this._min ), this._max );
    },

    /**
     * Determines if this Range is equal to some object.
     * @public
     * @param {*} object
     * @returns {boolean}
     */
    equals: function( object ) {
      return ( this.constructor === object.constructor ) &&
             ( this._min === object.min ) &&
             ( this._max === object.max );
    },

    /**
     * In https://github.com/phetsims/dot/issues/57, defaultValue was moved to RangeWithValue.
     * This ES5 getter catches programming errors where defaultValue is still used with Range.
     */
    get defaultValue() {
      throw new Error( 'defaultValue is undefined, did you mean to use RangeWithValue?' );
    }
  };

  return Range;
} );
