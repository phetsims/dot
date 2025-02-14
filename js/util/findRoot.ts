// Copyright 2024-2025, University of Colorado Boulder

/**
 * Hybrid root-finding given our constraints (guaranteed interval, value/derivative). Combines Newton's and bisection.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import dot from '../dot.js';

export function findRoot( minX: number, maxX: number, tolerance: number, valueFunction: ( n: number ) => number, derivativeFunction: ( n: number ) => number ): number {
  let x = ( minX + maxX ) / 2;

  let y;
  let dy;

  while ( Math.abs( y = valueFunction( x ) ) > tolerance ) {
    dy = derivativeFunction( x );

    if ( y < 0 ) {
      minX = x;
    }
    else {
      maxX = x;
    }

    // Newton's method first
    x -= y / dy;

    // Bounded to be bisection at the very least
    if ( x <= minX || x >= maxX ) {
      x = ( minX + maxX ) / 2;

      // Check to see if it's impossible to pass our tolerance
      if ( x === minX || x === maxX ) {
        break;
      }
    }
  }

  return x;
}
dot.register( 'findRoot', findRoot );