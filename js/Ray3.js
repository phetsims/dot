// Copyright 2002-2012, University of Colorado

/**
 * 3-dimensional ray
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  "use strict";
  
  var dot = require( 'DOT/dot' );
  
  dot.Ray3 = function( pos, dir ) {
    this.pos = pos;
    this.dir = dir;
  };
  var Ray3 = dot.Ray3;
  
  Ray3.prototype = {
    constructor: Ray3,

    shifted: function( distance ) {
      return new Ray3( this.pointAtDistance( distance ), this.dir );
    },

    pointAtDistance: function( distance ) {
      return this.pos.plus( this.dir.timesScalar( distance ) );
    },

    toString: function() {
      return this.pos.toString() + " => " + this.dir.toString();
    }
  };
  
  return Ray3;
} );
