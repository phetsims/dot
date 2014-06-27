// Copyright 2002-2014, University of Colorado Boulder

/**
 * 3-dimensional ray
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  dot.Ray3 = function Ray3( pos, dir ) {
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
