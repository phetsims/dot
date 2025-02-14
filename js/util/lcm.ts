// Copyright 2025, University of Colorado Boulder

/**
 * Least Common Multiple, https://en.wikipedia.org/wiki/Least_common_multiple
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

import dot from '../dot.js';
import { roundSymmetric } from './roundSymmetric.js';
import { gcd } from './gcd.js';

export function lcm( a: number, b: number ): number {
  return roundSymmetric( Math.abs( a * b ) / gcd( a, b ) );
}
dot.register( 'lcm', lcm );