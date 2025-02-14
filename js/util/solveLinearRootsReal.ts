// Copyright 2025, University of Colorado Boulder

/**
 * Returns an array of the real roots of the quadratic equation $ax + b=0$, or null if every value is a solution.
 *
 * @returns The real roots of the equation, or null if all values are roots. If the root has
 *          a multiplicity larger than 1, it will be repeated that many times.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function solveLinearRootsReal( a: number, b: number ): number[] | null {
  if ( a === 0 ) {
    if ( b === 0 ) {
      return null;
    }
    else {
      return [];
    }
  }
  else {
    return [ -b / a ];
  }
}
dot.register( 'solveLinearRootsReal', solveLinearRootsReal );