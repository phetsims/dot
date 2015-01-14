// Copyright 2002-2014, University of Colorado Boulder

/**
 * A sphere in 3 dimensions (NOT a 3-sphere).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  /*
   * @constructor
   * @param {Vector3} center - The center of the sphere
   * @param {number} radius - The radius of the sphere
   */
  dot.Sphere3 = function Sphere3( center, radius ) {
    this.center = center;
    this.radius = radius;

    assert && assert( radius >= 0 );

    phetAllocation && phetAllocation( 'Sphere3' );
  };
  var Sphere3 = dot.Sphere3;

  Sphere3.prototype = {
    constructor: Sphere3,

    /*
     * @param {Ray3} ray - The ray to intersect with the sphere
     * @param {number} epsilon - A small varing-point value to be used to handle intersections tangent to the sphere
     * @returns An intersection result { distance, hitPoint, normal, fromOutside }, or null if the sphere is behind the ray
     */
    intersect: function( ray, epsilon ) {
      var raydir = ray.dir;
      var pos = ray.pos;
      var centerToRay = pos.minus( this.center );

      // basically, we can use the quadratic equation to solve for both possible hit points (both +- roots are the hit points)
      var tmp = raydir.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared();
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

    /*
     * @param {Ray3} ray - The ray to intersect with the sphere
     * @param {number} epsilon - A small varing-point value to be used to handle intersections tangent to the sphere
     * @returns An array of intersection results like { distance, hitPoint, normal, fromOutside }. Will be 0 or 2, with
     *          the "proper" intersection first, if applicable (closest in front of the ray).
     */
    intersections: function( ray, epsilon ) {
      var raydir = ray.dir;
      var pos = ray.pos;
      var centerToRay = pos.minus( this.center );

      // basically, we can use the quadratic equation to solve for both possible hit points (both +- roots are the hit points)
      var tmp = raydir.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared();
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
  };

  return Sphere3;
} );
