// Copyright 2025, University of Colorado Boulder

/**
 * Returns an array of integers from A to B (inclusive), e.g. rangeInclusive( 4, 7 ) maps to [ 4, 5, 6, 7 ].
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function rangeInclusive( a: number, b: number ): number[] {
  if ( b < a ) {
    return [];
  }
  const result = new Array( b - a + 1 );
  for ( let i = a; i <= b; i++ ) {
    result[ i - a ] = i;
  }
  return result;
}
dot.register( 'rangeInclusive', rangeInclusive );