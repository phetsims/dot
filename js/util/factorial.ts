// Copyright 2025, University of Colorado Boulder

/**
 * Computes the factorial of a non-negative integer n without using recursion.
 * n! = 1 * 2 * ... * ( n - 1 ) * n
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

import dot from '../dot.js';

export default function factorial( n: number ): number {
  assert && assert( Number.isInteger( n ) && n >= 0, `n must be a non-negative integer: ${n}` );
  let f = 1;
  for ( let i = 2; i <= n; i++ ) {
    f *= i;
  }
  return f;
}

dot.register( 'factorial', factorial );