// Copyright 2014-2015, University of Colorado Boulder

/**
 * A sphere in 3 dimensions (NOT a 3-sphere).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {Vector3} center  - The center of the sphere
   * @param {number} radius - The radius of the sphere
   * @constructor
   */
  function Sphere3( center, radius ) {

    // @public {Vector3} - The location of the center of the sphere
    this.center = center;

    // @public {number} -  the radius of the sphere
    this.radius = radius;

    assert && assert( radius >= 0, 'the radius of a sphere should be positive' );
  }

  dot.register( 'Sphere3', Sphere3 );

  inherit( Object, Sphere3, {

    /**
     * Determines if a ray (a half-line) intersects this sphere.
     * A successful intersection returns the result the closest intersection in the form { distance, hitPoint, normal, fromOutside },
     * distance: {number} distance to the intersection point
     * hitPoint: {Vector3} the intersection point
     * normal: {Vector3} the normal vector on the sphere at the point of intersection. (the normal vector points outwards the sphere by convention)
     * fromOutside: {boolean} is the ray half-line intersecting the sphere from the outside of a sphere or from the inside.
     *
     * Returns null if the ray misses the sphere
     *
     * @public
     * @param {Ray3} ray - The ray to intersect with the sphere
     * @param {number} epsilon - A small varying-point value to be used to handle intersections tangent to the sphere
     * @returns {{ distance: number, hitPoint: Vector3, normal, fromOutside: boolean }| null}
     */
    intersect: function( ray, epsilon ) {
      var raydir = ray.direction;
      var pos = ray.position;
      var centerToRay = pos.minus( this.center );

      // basically, we can use the quadratic equation to solve for both possible hit points (both +- roots are the hit points)
      var tmp = raydir.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared;
      var det = 4 * tmp * tmp - 4 * ( centerToRayDistSq - this.radius * this.radius );
      if ( det < epsilon ) {
        // ray misses sphere entirely
        return null;
      }

      var base = raydir.dot( this.center ) - raydir.dot( pos );
      var sqt = Math.sqrt( det ) / 2;

      // the "first" entry point distance into the sphere. if we are inside the sphere, it is behind us
      var ta = base - sqt;

      // the "second" entry point distance
      var tb = base + sqt;

      if ( tb < epsilon ) {
        // sphere is behind ray, so don't return an intersection
        return null;
      }

      var hitPositionB = ray.pointAtDistance( tb );
      var normalB = hitPositionB.minus( this.center ).normalized();

      if ( ta < epsilon ) {
        // we are inside the sphere
        // in => out
        return {
          distance: tb,
          hitPoint: hitPositionB,
          normal: normalB.negated(),
          fromOutside: false
        };
      }
      else {
        // two possible hits
        var hitPositionA = ray.pointAtDistance( ta );
        var normalA = hitPositionA.minus( this.center ).normalized();

        // close hit, we have out => in
        return {
          distance: ta,
          hitPoint: hitPositionA,
          normal: normalA,
          fromOutside: true
        };
      }
    },

    /**
     *
     * Returns the intersections of a ray with a sphere. There will be 0 or 2 intersections, with
     * the "proper" intersection first, if applicable (closest in front of the ray).
     * Note that this method makes the implicit assumptions that the ray's origin does not lie inside the sphere.
     *
     * @public
     * @param {Ray3} ray - The ray to intersect with the sphere
     * @param {number} epsilon - A small varying-point value to be used to handle intersections tangent to the sphere
     * @returns {Array.<{distance:number, hitPoint:Vector3, normal:Vector3, fromOutside:boolean }>| null} -  An array of intersection
     *                                                                         results like { distance, hitPoint, normal, fromOutside }.
     */
    intersections: function( ray, epsilon ) {
      var raydir = ray.direction;
      var pos = ray.position;
      var centerToRay = pos.minus( this.center );

      // basically, we can use the quadratic equation to solve for both possible hit points (both +- roots are the hit points)
      var tmp = raydir.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared;
      var det = 4 * tmp * tmp - 4 * ( centerToRayDistSq - this.radius * this.radius );
      if ( det < epsilon ) {
        // ray misses sphere entirely
        return [];
      }

      var base = raydir.dot( this.center ) - raydir.dot( pos );
      var sqt = Math.sqrt( det ) / 2;

      // the "first" entry point distance into the sphere. if we are inside the sphere, it is behind us
      var ta = base - sqt;

      // the "second" entry point distance
      var tb = base + sqt;

      if ( tb < epsilon ) {
        // sphere is behind ray, so don't return an intersection
        return [];
      }

      var hitPositionB = ray.pointAtDistance( tb );
      var normalB = hitPositionB.minus( this.center ).normalized();

      var hitPositionA = ray.pointAtDistance( ta );
      var normalA = hitPositionA.minus( this.center ).normalized();

      var resultB = {
        distance: tb,
        hitPoint: hitPositionB,
        normal: normalB.negated(),
        fromOutside: false
      };
      var resultA = {
        distance: ta,
        hitPoint: hitPositionA,
        normal: normalA,
        fromOutside: true
      };
      if ( ta < epsilon ) {
        // we are inside the sphere
        // in => out

        return [ resultB, resultA ];
      }
      else {
        // two possible hits

        // close hit, we have out => in
        return [ resultA, resultB ];
      }
    }
  } );

  return Sphere3;
} );
