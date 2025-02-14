// Copyright 2025, University of Colorado Boulder

/**
 * Intersection point between the lines defined by the line segments p1-p2 and p3-p4. If the
 * lines are not properly defined, null is returned. If there are no intersections or infinitely many,
 * e.g. parallel lines, null is returned.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Andrea Lin
 * @author Martin Veillette (Berea College)
 */

import dot from '../dot.js';
import Vector2 from '../Vector2.js';

export function lineLineIntersection(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2
): Vector2 | null {
  const epsilon = 1e-10;

  // If the endpoints are the same, they don't properly define a line
  if ( p1.equalsEpsilon( p2, epsilon ) || p3.equalsEpsilon( p4, epsilon ) ) {
    return null;
  }

  // Taken from an answer in
  // http://stackoverflow.com/questions/385305/efficient-maths-algorithm-to-calculate-intersections
  const x12 = p1.x - p2.x;
  const x34 = p3.x - p4.x;
  const y12 = p1.y - p2.y;
  const y34 = p3.y - p4.y;

  const denom = x12 * y34 - y12 * x34;

  // If the denominator is 0, lines are parallel or coincident
  if ( Math.abs( denom ) < epsilon ) {
    return null;
  }

  // define intersection using determinants, see https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  const a = p1.x * p2.y - p1.y * p2.x;
  const b = p3.x * p4.y - p3.y * p4.x;

  return new Vector2(
    ( a * x34 - x12 * b ) / denom,
    ( a * y34 - y12 * b ) / denom
  );
}
dot.register( 'lineLineIntersection', lineLineIntersection );