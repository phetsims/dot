// Copyright 2002-2012, University of Colorado

/**
 * Basic width and height
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  "use strict";
  
  var dot = require( 'DOT/dot' );
  
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

    equals: function( other ) {
      return this.width === other.width && this.height === other.height;
    }
  };
  
  return Dimension2;
} );
