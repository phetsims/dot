// Copyright 2025, University of Colorado Boulder

/**
 * Returns whether the point p is inside the circle defined by the other three points (p1, p2, p3).
 *
 * NOTE: p1,p2,p3 should be specified in a counterclockwise (mathematically) order, and thus should have a positive
 * signed area.
 *
 * See notes in https://en.wikipedia.org/wiki/Delaunay_triangulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import type Vector2 from '../Vector2.js';
import { triangleAreaSigned } from './triangleAreaSigned.js';

export function pointInCircleFromPoints( p1: Vector2, p2: Vector2, p3: Vector2, p: Vector2 ): boolean {
  assert && assert( triangleAreaSigned( p1, p2, p3 ) > 0,
    'Defined points should be in a counterclockwise order' );

  const m00 = p1.x - p.x;
  const m01 = p1.y - p.y;
  const m02 = ( p1.x - p.x ) * ( p1.x - p.x ) + ( p1.y - p.y ) * ( p1.y - p.y );
  const m10 = p2.x - p.x;
  const m11 = p2.y - p.y;
  const m12 = ( p2.x - p.x ) * ( p2.x - p.x ) + ( p2.y - p.y ) * ( p2.y - p.y );
  const m20 = p3.x - p.x;
  const m21 = p3.y - p.y;
  const m22 = ( p3.x - p.x ) * ( p3.x - p.x ) + ( p3.y - p.y ) * ( p3.y - p.y );

  const determinant = m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m02 * m11 * m20 - m01 * m10 * m22 - m00 * m12 * m21;
  return determinant > 0;
}
dot.register( 'pointInCircleFromPoints', pointInCircleFromPoints );