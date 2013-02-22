// Copyright 2002-2012, University of Colorado

/**
 * 2-dimensional ray
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  "use strict";
  
  var debugAssert = require( 'DOT/debugAssert' );

  var Ray2 = function ( pos, dir ) {
    this.pos = pos;
    this.dir = dir;
    
    debugAssert( function() {
      return Math.abs( dir.magnitude() - 1 ) < 0.01;
    } );
  };

  Ray2.prototype = {
    constructor: Ray2,

    shifted: function ( distance ) {
      return new Ray2( this.pointAtDistance( distance ), this.dir );
    },

    pointAtDistance: function ( distance ) {
      return this.pos.plus( this.dir.timesScalar( distance ) );
    },

    toString: function () {
      return this.pos.toString() + " => " + this.dir.toString();
    }
  };
  
  return Ray2;
} );
