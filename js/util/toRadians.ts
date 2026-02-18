// Copyright 2025-2026, University of Colorado Boulder

/**
 * Converts degrees to radians.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import dot from '../dot.js';

export function toRadians( degrees: number ): number {
  return Math.PI * degrees / 180;
}
dot.register( 'toRadians', toRadians );