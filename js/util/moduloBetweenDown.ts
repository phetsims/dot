// Copyright 2025, University of Colorado Boulder

/**
 * Returns a number in the range $n\in[\mathrm{min},\mathrm{max})$ with the same equivalence class as the input
 * value mod (max-min), i.e. for a value $m$, $m\equiv n\ (\mathrm{mod}\ \mathrm{max}-\mathrm{min})$.
 *
 * The 'down' indicates that if the value is equal to min or max, the max is returned.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function moduloBetweenDown( value: number, min: number, max: number ): number {
  assert && assert( max > min, 'max > min required for moduloBetween' );

  const divisor = max - min;

  // get a partial result of value-min between [0,divisor)
  let partial = ( value - min ) % divisor;
  if ( partial < 0 ) {
    // since if value-min < 0, the remainder will give us a negative number
    partial += divisor;
  }

  return partial + min; // add back in the minimum value
}
dot.register( 'moduloBetweenDown', moduloBetweenDown );