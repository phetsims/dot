// Copyright 2025, University of Colorado Boulder

/**
 * Computes the intersection of the two line segments $(x_1,y_1)(x_2,y_2)$ and $(x_3,y_3)(x_4,y_4)$. If there is no
 * intersection, null is returned.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import Vector2 from '../Vector2.js';

export function lineSegmentIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): Vector2 | null {

  // Determines counterclockwiseness. Positive if counterclockwise, negative if clockwise, zero if straight line
  // Point1(a,b), Point2(c,d), Point3(e,f)
  // See http://jeffe.cs.illinois.edu/teaching/373/notes/x05-convexhull.pdf
  const ccw = (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => ( f - b ) * ( c - a ) - ( d - b ) * ( e - a );

  // Check if intersection doesn't exist. See http://jeffe.cs.illinois.edu/teaching/373/notes/x06-sweepline.pdf
  // If point1 and point2 are on opposite sides of line 3 4, exactly one of the two triples 1, 3, 4 and 2, 3, 4
  // is in counterclockwise order.
  if ( ccw( x1, y1, x3, y3, x4, y4 ) * ccw( x2, y2, x3, y3, x4, y4 ) > 0 ||
       ccw( x3, y3, x1, y1, x2, y2 ) * ccw( x4, y4, x1, y1, x2, y2 ) > 0
  ) {
    return null;
  }

  const denom = ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 );
  // If denominator is 0, the lines are parallel or coincident
  if ( Math.abs( denom ) < 1e-10 ) {
    return null;
  }

  // Check if there is an exact endpoint overlap (and then return an exact answer).
  if ( ( x1 === x3 && y1 === y3 ) || ( x1 === x4 && y1 === y4 ) ) {
    return new Vector2( x1, y1 );
  }
  else if ( ( x2 === x3 && y2 === y3 ) || ( x2 === x4 && y2 === y4 ) ) {
    return new Vector2( x2, y2 );
  }

  // Use determinants to calculate intersection, see https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  const intersectionX = ( ( x1 * y2 - y1 * x2 ) * ( x3 - x4 ) - ( x1 - x2 ) * ( x3 * y4 - y3 * x4 ) ) / denom;
  const intersectionY = ( ( x1 * y2 - y1 * x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 * y4 - y3 * x4 ) ) / denom;
  return new Vector2( intersectionX, intersectionY );
}
dot.register( 'lineSegmentIntersection', lineSegmentIntersection );