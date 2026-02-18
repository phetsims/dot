// Copyright 2025-2026, University of Colorado Boulder

/**
 * The area inside the triangle defined by the three vertices.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import dot from '../dot.js';
import { triangleAreaSigned } from './triangleAreaSigned.js';
import type Vector2 from '../Vector2.js';

export function triangleArea( a: Vector2, b: Vector2, c: Vector2 ): number {
  return Math.abs( triangleAreaSigned( a, b, c ) );
}
dot.register( 'triangleArea', triangleArea );