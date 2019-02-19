// Copyright 2013-2015, University of Colorado Boulder

/**
 * 3-dimensional ray consisting of an origin point and a unit direction vector.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  /**
   * Constructs a 3D ray using the supplied origin position and unit length direction vector
   *
   * @param {Vector3} position - the ray's point of origin
   * @param {Vector3} direction - the ray's unit direction vector
   * @constructor
   */
  function Ray3( position, direction ) {

    this.position = position;  // @public (read-only)
    this.direction = direction; // @public (read-only)

    assert && assert( Math.abs( direction.magnitude - 1 ) < 0.01, 'the direction must be a unit vector' );
  }

  dot.register( 'Ray3', Ray3 );

  Ray3.prototype = {
    constructor: Ray3,

    /**
     * Returns a new Ray that has it origin shifted to a position given by an amount distance*this.direction.
     * @public
     * @param {number} distance
     * @returns {Ray3}
     */
    shifted: function( distance ) {
      return new Ray3( this.pointAtDistance( distance ), this.direction );
    },

    /**
     * Returns a position that is a distance 'distance' along the ray.
     * @public
     * @param {number} distance
     * @returns {Vector3}
     */
    pointAtDistance: function( distance ) {
      return this.position.plus( this.direction.timesScalar( distance ) );
    },

    /**
     * Returns the distance of this ray to a plane
     * @public
     * @param {Plane3} plane
     * @returns {number}
     */
    distanceToPlane: function( plane ) {
      return ( plane.distance - this.position.dot( plane.normal ) ) / this.direction.dot( plane.normal );
    },

    /**
     * Returns the attributes of this ray into a string
     * @public
     * @returns {string}
     */
    toString: function() {
      return this.position.toString() + ' => ' + this.direction.toString();
    }
  };

  return Ray3;
} );
