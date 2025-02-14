// Copyright 2025, University of Colorado Boulder

/**
 * Distance from a point to a line segment squared.
 *
 * @param point - The point
 * @param a - Starting point of the line segment
 * @param b - Ending point of the line segment
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import Vector2 from '../Vector2.js';
import { distToSegmentSquared } from './distToSegmentSquared.js';

export function distToSegment( point: Vector2, a: Vector2, b: Vector2 ): number {
  return Math.sqrt( distToSegmentSquared( point, a, b ) );
}
dot.register( 'distToSegment', distToSegment );