// Copyright 2025-2026, University of Colorado Boulder

/**
 * Greatest Common Divisor, using https://en.wikipedia.org/wiki/Euclidean_algorithm. See
 * https://en.wikipedia.org/wiki/Greatest_common_divisor
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import dot from '../dot.js';
import { mod } from './mod.js';

export function gcd( a: number, b: number ): number {
  return Math.abs( b === 0 ? a : gcd( b, mod( a, b ) ) );
}
dot.register( 'gcd', gcd );