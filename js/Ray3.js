// Copyright 2013-2015, University of Colorado Boulder

/**
 * 3-dimensional ray
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  function Ray3( position, direction ) {
    this.position = position;
    this.direction = direction;
  }
  dot.register( 'Ray3', Ray3 );

  Ray3.prototype = {
    constructor: Ray3,

    shifted: function( distance ) {
      return new Ray3( this.pointAtDistance( distance ), this.direction );
    },

    pointAtDistance: function( distance ) {
      return this.position.plus( this.direction.timesScalar( distance ) );
    },

    // @param {Plane3} plane
    distanceToPlane: function( plane ) {
      return ( plane.distance - this.position.dot( plane.normal ) ) / this.direction.dot( plane.normal );
    },

    toString: function() {
      return this.position.toString() + ' => ' + this.direction.toString();
    }
  };

  return Ray3;
} );
