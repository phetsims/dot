// Copyright 2025, University of Colorado Boulder

/**
 * Ray-sphere intersection, returning information about the closest intersection. Assumes the sphere is centered
 * at the origin (for ease of computation), transform the ray to compensate if needed.
 *
 * If there is no intersection, null is returned. Otherwise an object will be returned like:
 * <pre class="brush: js">
 * {
 *   distance: {number}, // distance from the ray position to the intersection
 *   hitPoint: {Vector3}, // location of the intersection
 *   normal: {Vector3}, // the normal of the sphere's surface at the intersection
 *   fromOutside: {boolean}, // whether the ray intersected the sphere from outside the sphere first
 * }
 * </pre>
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import Vector3 from '../Vector3.js';
import Ray3 from '../Ray3.js';

export type SphereRayIntersectionResult = {
  distance: number;
  hitPoint: Vector3;
  normal: Vector3;
  fromOutside: boolean;
};

// assumes a sphere with the specified radius, centered at the origin
export function sphereRayIntersection( radius: number, ray: Ray3, epsilon?: number ): SphereRayIntersectionResult | null {
  epsilon = epsilon === undefined ? 1e-5 : epsilon;

  // center is the origin for now, but leaving in computations so that we can change that in the future. optimize away if needed
  const center = new Vector3( 0, 0, 0 );

  const rayDir = ray.direction;
  const pos = ray.position;
  const centerToRay = pos.minus( center );

  // basically, we can use the quadratic equation to solve for both possible hit points (both +- roots are the hit points)
  const tmp = rayDir.dot( centerToRay );
  const centerToRayDistSq = centerToRay.magnitudeSquared;
  const det = 4 * tmp * tmp - 4 * ( centerToRayDistSq - radius * radius );
  if ( det < epsilon ) {
    // ray misses sphere entirely
    return null;
  }

  const base = rayDir.dot( center ) - rayDir.dot( pos );
  const sqt = Math.sqrt( det ) / 2;

  // the "first" entry point distance into the sphere. if we are inside the sphere, it is behind us
  const ta = base - sqt;

  // the "second" entry point distance
  const tb = base + sqt;

  if ( tb < epsilon ) {
    // sphere is behind ray, so don't return an intersection
    return null;
  }

  const hitPositionB = ray.pointAtDistance( tb );
  const normalB = hitPositionB.minus( center ).normalized();

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
    const hitPositionA = ray.pointAtDistance( ta );
    const normalA = hitPositionA.minus( center ).normalized();

    // close hit, we have out => in
    return {
      distance: ta,
      hitPoint: hitPositionA,
      normal: normalA,
      fromOutside: true
    };
  }
}
dot.register( 'sphereRayIntersection', sphereRayIntersection );