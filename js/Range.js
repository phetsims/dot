// Copyright 2002-2013, University of Colorado

/**
 * A numeric range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  var assert = require( 'ASSERT/assert' )( 'dot' );

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

    getLength: function () {
      return this.max - this.min;
    },

    contains: function ( value ) {
      return ( value >= this.min ) && ( value <= this.max );
    },

    intersects: function ( range ) {
      return ( this.max >= range.min ) && ( range.max >= this.min );
    },

    toString: function () {
      return "[Range (min:" + this.min + " max:" + this.max + " defaultValue:" + this.defaultValue + ")]";
    }
  };

  return Range;
} );
