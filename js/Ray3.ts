// Copyright 2013-2022, University of Colorado Boulder

/**
 * 3-dimensional ray consisting of an origin point and a unit direction vector.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import Plane3 from './Plane3.js';
import Vector3 from './Vector3.js';

export default class Ray3 {

  public position: Vector3;
  public direction: Vector3;

  /**
   * Constructs a 3D ray using the supplied origin position and unit length direction vector
   *
   * @param position - the ray's point of origin
   * @param direction - the ray's unit direction vector
   */
  public constructor( position: Vector3, direction: Vector3 ) {

    this.position = position;
    this.direction = direction;

    assert && assert( Math.abs( direction.magnitude - 1 ) < 0.01, 'the direction must be a unit vector' );
  }

  /**
   * Returns a new Ray that has it origin shifted to a position given by an amount distance*this.direction.
   */
  public shifted( distance: number ): Ray3 {
    return new Ray3( this.pointAtDistance( distance ), this.direction );
  }

  /**
   * Returns a position that is a distance 'distance' along the ray.
   */
  public pointAtDistance( distance: number ): Vector3 {
    return this.position.plus( this.direction.timesScalar( distance ) );
  }

  /**
   * Returns the distance of this ray to a plane
   */
  public distanceToPlane( plane: Plane3 ): number {
    return ( plane.distance - this.position.dot( plane.normal ) ) / this.direction.dot( plane.normal );
  }

  /**
   * Returns the attributes of this ray into a string
   */
  public toString(): string {
    return `${this.position.toString()} => ${this.direction.toString()}`;
  }
}

dot.register( 'Ray3', Ray3 );
