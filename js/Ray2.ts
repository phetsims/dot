// Copyright 2013-2022, University of Colorado Boulder

/**
 * 2-dimensional ray consisting of an origin point and a unit direction vector.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import Vector2 from './Vector2.js';

export default class Ray2 {

  public position: Vector2;
  public direction: Vector2;

  /**
   * Constructs a2D ray using the supplied origin position and unit length direction vector
   *
   * @param position - the ray's point of origin
   * @param direction - the ray's unit direction vector
   */
  public constructor( position: Vector2, direction: Vector2 ) {

    this.position = position;
    this.direction = direction;

    assert && assert( Math.abs( direction.magnitude - 1 ) < 0.01, 'the direction must be a unit vector' );
  }

  /**
   * Returns a new Ray that has it origin shifted to a position given by an amount distance*this.direction.
   */
  public shifted( distance: number ): Ray2 {
    return new Ray2( this.pointAtDistance( distance ), this.direction );
  }

  /**
   * Returns a position that is a distance 'distance' along the ray.
   */
  public pointAtDistance( distance: number ): Vector2 {
    return this.position.plus( this.direction.timesScalar( distance ) );
  }

  /**
   * Returns the attributes of this ray into a string
   */
  public toString(): string {
    return `${this.position.toString()} => ${this.direction.toString()}`;
  }
}

dot.register( 'Ray2', Ray2 );
