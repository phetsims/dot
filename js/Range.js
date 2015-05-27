/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * A numeric range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  dot.Range = function Range( min, max, defaultValue ) {

    this.min = min;
    this.max = max;
    this.defaultValue = ( defaultValue === undefined ) ? min : defaultValue;

    assert && assert( min <= max );
    assert && assert( ( this.defaultValue >= min ) && ( this.defaultValue <= max ) );
  };
  var Range = dot.Range;

  Range.prototype = {

    constructor: Range,

    copy: function() {
      return new Range( this.min, this.max, this.defaultValue );
    },

    getLength: function() {
      return this.max - this.min;
    },

    getCenter: function() {
      return (this.max + this.min) / 2;
    },

    contains: function( value ) {
      return ( value >= this.min ) && ( value <= this.max );
    },

    /**
     * Does this range contain the specified range?
     * @param {Range} range
     * @returns {boolean}
     */
    containsRange: function( range ) {
      return this.min <= range.min && this.max >= range.max;
    },

    intersects: function( range ) {
      return ( this.max >= range.min ) && ( range.max >= this.min );
    },

    /**
     * Do the two ranges overlap with one another?  Note that this assumes that
     * this is a open interval.
     */
    intersectsExclusive: function( range ) {
      return ( this.max > range.min ) && ( range.max > this.min );
    },

    toString: function() {
      return "[Range (min:" + this.min + " max:" + this.max + " defaultValue:" + this.defaultValue + ")]";
    },

    /**
     * Constrains a value to the range.
     * @param {number} value
     * @returns {number}
     */
    constrainValue: function( value ) {
      return Math.min( Math.max( value, this.min ), this.max );
    },

    equals: function( other ) {
      return this.min === other.min && this.max === other.max && this.defaultValue === this.defaultValue;
    }
  };

  return Range;
} );
