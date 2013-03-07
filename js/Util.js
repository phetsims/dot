// Copyright 2002-2012, University of Colorado

/**
 * Utility functions for Dot, placed into the dot.X namespace.
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  "use strict";
  
  var assert = require( 'ASSERT/assert' )( 'dot' );
  
  var dot = require( 'DOT/dot' );
  // require( 'DOT/Vector2' ); // Require.js doesn't like the circular reference
  
  dot.Util = {
    testAssert: function() {
      return 'assert.dot: ' + ( assert ? 'true' : 'false' );
    },
    
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
    },
    
    lineLineIntersection: function( p1, p2, p3, p4 ) {
      return new dot.Vector2(
        ( ( p1.x * p2.y - p1.y * p2.x ) * ( p3.x - p4.x ) - ( p1.x - p2.x ) * ( p3.x * p4.y - p3.y * p4.x ) ) / ( ( p1.x - p2.x ) * ( p3.y - p4.y ) - ( p1.y - p2.y ) * ( p3.x - p4.x ) ),
        ( ( p1.x * p2.y - p1.y * p2.x ) * ( p3.y - p4.y ) - ( p1.y - p2.y ) * ( p3.x * p4.y - p3.y * p4.x ) ) / ( ( p1.x - p2.x ) * ( p3.y - p4.y ) - ( p1.y - p2.y ) * ( p3.x - p4.x ) )
      );
    }
  };
  var Util = dot.Util;
  
  // make these available in the main namespace directly (for now)
  dot.testAssert = Util.testAssert;
  dot.isArray = Util.isArray;
  dot.clamp = Util.clamp;
  dot.rangeInclusive = Util.rangeInclusive;
  dot.rangeExclusive = Util.rangeExclusive;
  dot.toRadians = Util.toRadians;
  dot.toDegrees = Util.toDegrees;
  
  return Util;
} );
