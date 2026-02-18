// Copyright 2025-2026, University of Colorado Boulder

/**
 * Returns an array of integers from A to B (exclusive), e.g. rangeExclusive( 4, 7 ) maps to [ 5, 6 ].
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import { rangeInclusive } from './rangeInclusive.js';
import dot from '../dot.js';

export function rangeExclusive( a: number, b: number ): number[] {
  return rangeInclusive( a + 1, b - 1 );
}
dot.register( 'rangeExclusive', rangeExclusive );