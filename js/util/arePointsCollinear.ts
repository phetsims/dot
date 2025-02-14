// Copyright 2025, University of Colorado Boulder

/**
 * Determines whether the three points are approximately collinear.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import { triangleArea } from './triangleArea.js';
import type Vector2 from '../Vector2.js';

export function arePointsCollinear( a: Vector2, b: Vector2, c: Vector2, epsilon = 0 ): boolean {
  return triangleArea( a, b, c ) <= epsilon;
}
dot.register( 'arePointsCollinear', arePointsCollinear );