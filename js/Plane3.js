// Copyright 2002-2014, University of Colorado Boulder

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

  /*
   * @constructor
   * @param {Vector3} normal - A normal vector (perpendicular) to the plane
   * @param {number} distance - The signed distance to the plane from the origin, so that normal.times( distance )
   *                            will be a point on the plane.
   */
  dot.Plane3 = function Plane3( normal, distance ) {
    this.normal = normal;
    this.distance = distance;

    assert && assert( Math.abs( normal.magnitude() - 1 ) < 0.01 );

    phetAllocation && phetAllocation( 'Plane3' );
  };
  var Plane3 = dot.Plane3;

  Plane3.prototype = {
    constructor: Plane3,

    /*
     * @param {Ray3} ray
     * @returns The intersection {Vector3} of the ray with the plane
     */
    intersectWithRay: function( ray ) {
      return ray.pointAtDistance( ray.distanceToPlane( this ) );
    }
  };

  Plane3.XY = new Plane3( new Vector3( 0, 0, 1 ), 0 );
  Plane3.XZ = new Plane3( new Vector3( 0, 1, 0 ), 0 );
  Plane3.YZ = new Plane3( new Vector3( 1, 0, 0 ), 0 );

  /*
   * @param {Vector3} a - first point
   * @param {Vector3} b - second point
   * @param {Vector3} c - third point
   */
  Plane3.fromTriangle = function( a, b, c ) {
    var normal = ( c.minus( a ) ).cross( b.minus( a ) );
    if ( normal.magnitude() === 0 ) {
      return null;
    }
    normal.normalize();

    return new Plane3( normal, normal.dot( a ) );
  };

  return Plane3;
} );
