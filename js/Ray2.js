// Copyright 2002-2014, University of Colorado Boulder

/**
 * 2-dimensional ray
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  dot.Ray2 = function Ray2( position, direction ) {
    this.position = position;
    this.direction = direction;

    assert && assert( Math.abs( direction.magnitude() - 1 ) < 0.01 );

    phetAllocation && phetAllocation( 'Ray2' );
  };
  var Ray2 = dot.Ray2;

  Ray2.prototype = {
    constructor: Ray2,

    shifted: function( distance ) {
      return new Ray2( this.pointAtDistance( distance ), this.direction );
    },

    pointAtDistance: function( distance ) {
      return this.position.plus( this.direction.timesScalar( distance ) );
    },

    toString: function() {
      return this.position.toString() + " => " + this.direction.toString();
    }
  };

  return Ray2;
} );
