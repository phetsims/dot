// Copyright 2025, University of Colorado Boulder

/**
 * Returns an array of the real roots of the quadratic equation $ax^2 + bx + c=0$, or null if every value is a
 * solution. If a is nonzero, there should be between 0 and 2 (inclusive) values returned.
 *
 * @returns The real roots of the equation, or null if all values are roots. If the root has
 *          a multiplicity larger than 1, it will be repeated that many times.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import { solveLinearRootsReal } from './solveLinearRootsReal.js';

export function solveQuadraticRootsReal( a: number, b: number, c: number ): number[] | null {
  // Check for a degenerate case where we don't have a quadratic, or if the order of magnitude is such where the
  // linear solution would be expected
  const epsilon = 1E7;
  if ( a === 0 || Math.abs( b / a ) > epsilon || Math.abs( c / a ) > epsilon ) {
    return solveLinearRootsReal( b, c );
  }

  const discriminant = b * b - 4 * a * c;
  if ( discriminant < 0 ) {
    return [];
  }
  const sqrt = Math.sqrt( discriminant );
  // TODO: how to handle if discriminant is 0? give unique root or double it? https://github.com/phetsims/dot/issues/96
  // TODO: probably just use Complex for the future https://github.com/phetsims/dot/issues/96
  return [
    ( -b - sqrt ) / ( 2 * a ),
    ( -b + sqrt ) / ( 2 * a )
  ];
}
dot.register( 'solveQuadraticRootsReal', solveQuadraticRootsReal );