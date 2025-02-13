// Copyright 2025, University of Colorado Boulder

/**
 * Rounds using "Round half away from zero" algorithm. See dot#35.
 *
 * JavaScript's Math.round is not symmetric for positive and negative numbers, it uses IEEE 754 "Round half up".
 * See https://en.wikipedia.org/wiki/Rounding#Round_half_up.
 * For sims, we want to treat positive and negative values symmetrically, which is IEEE 754 "Round half away from zero",
 * See https://en.wikipedia.org/wiki/Rounding#Round_half_away_from_zero
 *
 * Note that -0 is rounded to 0, since we typically do not want to display -0 in sims.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function roundSymmetric( value: number ): number {
  return ( ( value < 0 ) ? -1 : 1 ) * Math.round( Math.abs( value ) ); // eslint-disable-line phet/bad-sim-text
}
dot.register( 'roundSymmetric', roundSymmetric );