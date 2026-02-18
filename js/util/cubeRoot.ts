// Copyright 2025-2026, University of Colorado Boulder

/**
 * Returns the unique real cube root of x, such that $y^3=x$.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import dot from '../dot.js';

export function cubeRoot( x: number ): number {
  return x >= 0 ? Math.pow( x, 1 / 3 ) : -Math.pow( -x, 1 / 3 );
}
dot.register( 'cubeRoot', cubeRoot );