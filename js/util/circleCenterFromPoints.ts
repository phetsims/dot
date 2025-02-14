// Copyright 2025, University of Colorado Boulder

/**
 * Returns the center of a circle that will lie on 3 points (if it exists), otherwise null (if collinear).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import Vector2 from '../Vector2.js';
import { lineLineIntersection } from './lineLineIntersection.js';

export function circleCenterFromPoints(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2
): Vector2 | null {
  // TODO: Can we make scratch vectors here, avoiding the circular reference? https://github.com/phetsims/dot/issues/96

  // midpoints between p1-p2 and p2-p3
  const p12 = new Vector2( ( p1.x + p2.x ) / 2, ( p1.y + p2.y ) / 2 );
  const p23 = new Vector2( ( p2.x + p3.x ) / 2, ( p2.y + p3.y ) / 2 );

  // perpendicular points from the minpoints
  const p12x = new Vector2( p12.x + ( p2.y - p1.y ), p12.y - ( p2.x - p1.x ) );
  const p23x = new Vector2( p23.x + ( p3.y - p2.y ), p23.y - ( p3.x - p2.x ) );

  return lineLineIntersection( p12, p12x, p23, p23x );
}
dot.register( 'circleCenterFromPoints', circleCenterFromPoints );