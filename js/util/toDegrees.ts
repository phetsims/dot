// Copyright 2025-2026, University of Colorado Boulder

/**
 * Converts radians to degrees.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import dot from '../dot.js';

export function toDegrees( radians: number ): number {
  return 180 * radians / Math.PI;
}
dot.register( 'toDegrees', toDegrees );