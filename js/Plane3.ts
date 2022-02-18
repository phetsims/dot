// Copyright 2014-2020, University of Colorado Boulder

/**
 * A mathematical plane in 3 dimensions determined by a normal vector to the plane and the distance to the closest
 * point on the plane to the origin
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Ray3 from './Ray3.js';
import Vector3 from './Vector3.js';
import dot from './dot.js';

class Plane3 {

  normal: Vector3;
  distance: number;

  /**
   * @param normal - A normal vector (perpendicular) to the plane
   * @param distance - The signed distance to the plane from the origin, so that normal.times( distance )
   *                            will be a point on the plane.
   */
  constructor( normal: Vector3, distance: number ) {
    this.normal = normal;
    this.distance = distance;

    assert && assert( Math.abs( normal.magnitude - 1 ) < 0.01, 'the normal vector must be a unit vector' );
  }

  intersectWithRay( ray: Ray3 ): Vector3 {
    return ray.pointAtDistance( ray.distanceToPlane( this ) );
  }

  /**
   * Returns a new plane that passes through three points $(\vec{a},\vec{b},\vec{c})$
   * The normal of the plane points along $\vec{c-a} \times \vec{b-a}$
   * Passing three collinear points will return null
   *
   * @param a - first point
   * @param b - second point
   * @param c - third point
   */
  static fromTriangle( a: Vector3, b: Vector3, c: Vector3 ): Plane3 | null {
    const normal = ( c.minus( a ) ).cross( b.minus( a ) );
    if ( normal.magnitude === 0 ) {
      return null;
    }
    normal.normalize();

    return new Plane3( normal, normal.dot( a ) );
  }

  static XY: Plane3;
  static XZ: Plane3;
  static YZ: Plane3;
}

dot.register( 'Plane3', Plane3 );

Plane3.XY = new Plane3( new Vector3( 0, 0, 1 ), 0 );
Plane3.XZ = new Plane3( new Vector3( 0, 1, 0 ), 0 );
Plane3.YZ = new Plane3( new Vector3( 1, 0, 0 ), 0 );

export default Plane3;