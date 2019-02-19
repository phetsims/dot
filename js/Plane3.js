// Copyright 2014, University of Colorado Boulder

/**
 * A mathematical plane in 3 dimensions determined by a normal vector to the plane and the distance to the closest
 * point on the plane to the origin
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var Vector3 = require( 'DOT/Vector3' );

  /**
   *
   * @param {Vector3} normal - A normal vector (perpendicular) to the plane
   * @param {number} distance - The signed distance to the plane from the origin, so that normal.times( distance )
   *                            will be a point on the plane.
   * @constructor
   */
  function Plane3( normal, distance ) {
    this.normal = normal; // @public (read-only)
    this.distance = distance; // @public (read-only)

    assert && assert( Math.abs( normal.magnitude - 1 ) < 0.01, 'the normal vector must be a unit vector' );
  }

  dot.register( 'Plane3', Plane3 );

  Plane3.prototype = {
    constructor: Plane3,

    /**
     * Returns the intersection point of a ray with this plane.
     * @public
     * @param {Ray3} ray
     * @returns {Vector3}
     */
    intersectWithRay: function( ray ) {
      return ray.pointAtDistance( ray.distanceToPlane( this ) );
    }
  };

  Plane3.XY = new Plane3( new Vector3( 0, 0, 1 ), 0 );
  Plane3.XZ = new Plane3( new Vector3( 0, 1, 0 ), 0 );
  Plane3.YZ = new Plane3( new Vector3( 1, 0, 0 ), 0 );

  /**
   * Returns a new plane that passes through three points $(\vec{a},\vec{b},\vec{c})$
   * The normal of the plane points along $\vec{c-a} \times \vec{b-a}$
   * Passing three collinear points will return null
   * @public
   * @param {Vector3} a - first point
   * @param {Vector3} b - second point
   * @param {Vector3} c - third point
   * @returns {Plane3|null}
   */
  Plane3.fromTriangle = function( a, b, c ) {
    var normal = ( c.minus( a ) ).cross( b.minus( a ) );
    if ( normal.magnitude === 0 ) {
      return null;
    }
    normal.normalize();

    return new Plane3( normal, normal.dot( a ) );
  };

  return Plane3;
} );
