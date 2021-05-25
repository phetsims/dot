// Copyright 2013-2021, University of Colorado Boulder

/**
 * 3-dimensional ray consisting of an origin point and a unit direction vector.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';

class Ray3 {
  /**
   * Constructs a 3D ray using the supplied origin position and unit length direction vector
   *
   * @param {Vector3} position - the ray's point of origin
   * @param {Vector3} direction - the ray's unit direction vector
   */
  constructor( position, direction ) {

    this.position = position;  // @public (read-only)
    this.direction = direction; // @public (read-only)

    assert && assert( Math.abs( direction.magnitude - 1 ) < 0.01, 'the direction must be a unit vector' );
  }

  /**
   * Returns a new Ray that has it origin shifted to a position given by an amount distance*this.direction.
   * @public
   * @param {number} distance
   * @returns {Ray3}
   */
  shifted( distance ) {
    return new Ray3( this.pointAtDistance( distance ), this.direction );
  }

  /**
   * Returns a position that is a distance 'distance' along the ray.
   * @public
   * @param {number} distance
   * @returns {Vector3}
   */
  pointAtDistance( distance ) {
    return this.position.plus( this.direction.timesScalar( distance ) );
  }

  /**
   * Returns the distance of this ray to a plane
   * @public
   * @param {Plane3} plane
   * @returns {number}
   */
  distanceToPlane( plane ) {
    return ( plane.distance - this.position.dot( plane.normal ) ) / this.direction.dot( plane.normal );
  }

  /**
   * Returns the attributes of this ray into a string
   * @public
   * @returns {string}
   */
  toString() {
    return `${this.position.toString()} => ${this.direction.toString()}`;
  }
}

dot.register( 'Ray3', Ray3 );
export default Ray3;