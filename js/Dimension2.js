
// Copyright 2002-2014, University of Colorado Boulder

/**
 * Basic width and height
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';
  
  var dot = require( 'DOT/dot' );
  require( 'DOT/Bounds2' );
  
  dot.Dimension2 = function Dimension2( width, height ) {
    this.width = width;
    this.height = height;
  };
  var Dimension2 = dot.Dimension2;

  Dimension2.prototype = {
    constructor: Dimension2,

    toString: function() {
      return "[" + this.width + "w, " + this.height + "h]";
    },
    
    toBounds: function( x, y ) {
      x = x || 0;
      y = y || 0;
      return new dot.Bounds2( x, y, this.width + x, this.height + y );
    },

    equals: function( other ) {
      return this.width === other.width && this.height === other.height;
    }
  };
  
  return Dimension2;
} );
