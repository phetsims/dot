// Copyright 2002-2012, University of Colorado

/**
 * Utility functions for Dot, placed into the dot.X namespace.
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  "use strict";
  
  var assert = require( 'ASSERT/assert' )( 'dot' );
  
  var Util = {
    isArray: function( array ) {
      // yes, this is actually how to do this. see http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array
      return Object.prototype.toString.call( array ) === '[object Array]';
    },
    
    clamp: function( value, min, max ) {
      if ( value < min ) {
        return min;
      }
      else if ( value > max ) {
        return max;
      }
      else {
        return value;
      }
    },
    
    // Returns an array of integers from A to B (including both A to B)
    rangeInclusive: function( a, b ) {
      if ( b < a ) {
        return [];
      }
      var result = new Array( b - a + 1 );
      for ( var i = a; i <= b; i++ ) {
        result[i-a] = i;
      }
      return result;
    },
    
    // Returns an array of integers between A and B (excluding both A to B)
    rangeExclusive: function( a, b ) {
      return Util.rangeInclusive( a + 1, b - 1 );
    },
    
    toRadians: function( degrees ) {
      return Math.PI * degrees / 180;
    },
    
    toDegrees: function( radians ) {
      return 180 * radians / Math.PI;
    }
  };
  
  return Util;
} );
