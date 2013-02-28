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
    }
  };
  
  return Util;
} );
