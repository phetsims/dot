// Copyright 2025, University of Colorado Boulder

/**
 * The area inside the triangle defined by the three vertices, but with the sign determined by whether the vertices
 * provided are clockwise or counter-clockwise.
 *
 * If the vertices are counterclockwise (in a right-handed coordinate system), then the signed area will be
 * positive.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import type Vector2 from '../Vector2.js';

export function triangleAreaSigned( a: Vector2, b: Vector2, c: Vector2 ): number {
  return a.x * ( b.y - c.y ) + b.x * ( c.y - a.y ) + c.x * ( a.y - b.y );
}
dot.register( 'triangleAreaSigned', triangleAreaSigned );