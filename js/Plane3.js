// Copyright 2014-2020, University of Colorado Boulder

/**
 * A mathematical plane in 3 dimensions determined by a normal vector to the plane and the distance to the closest
 * point on the plane to the origin
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Vector3 from './Vector3.js';
import dot from './dot.js';

class Plane3 {
  /**
   *
   * @param {Vector3} normal - A normal vector (perpendicular) to the plane
   * @param {number} distance - The signed distance to the plane from the origin, so that normal.times( distance )
   *                            will be a point on the plane.
   */
  constructor( normal, distance ) {
    // @public {Vector3}
    this.normal = normal;

    // @public {number}
    this.distance = distance;

    assert && assert( Math.abs( normal.magnitude - 1 ) < 0.01, 'the normal vector must be a unit vector' );
  }


  /**
   * Returns the intersection point of a ray with this plane.
   * @public
   *
   * @param {Ray3} ray
   * @returns {Vector3}
   */
  intersectWithRay( ray ) {
    return ray.pointAtDistance( ray.distanceToPlane( this ) );
  }

  /**
   * Returns a new plane that passes through three points $(\vec{a},\vec{b},\vec{c})$
   * The normal of the plane points along $\vec{c-a} \times \vec{b-a}$
   * Passing three collinear points will return null
   * @public
   *
   * @param {Vector3} a - first point
   * @param {Vector3} b - second point
   * @param {Vector3} c - third point
   * @returns {Plane3|null}
   */
  static fromTriangle( a, b, c ) {
    const normal = ( c.minus( a ) ).cross( b.minus( a ) );
    if ( normal.magnitude === 0 ) {
      return null;
    }
    normal.normalize();

    return new Plane3( normal, normal.dot( a ) );
  }
}

dot.register( 'Plane3', Plane3 );

// @public {Plane3}
Plane3.XY = new Plane3( new Vector3( 0, 0, 1 ), 0 );
Plane3.XZ = new Plane3( new Vector3( 0, 1, 0 ), 0 );
Plane3.YZ = new Plane3( new Vector3( 1, 0, 0 ), 0 );

export default Plane3;