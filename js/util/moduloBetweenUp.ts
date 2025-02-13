// Copyright 2025, University of Colorado Boulder

/**
 * Returns a number in the range $n\in(\mathrm{min},\mathrm{max}]$ with the same equivalence class as the input
 * value mod (max-min), i.e. for a value $m$, $m\equiv n\ (\mathrm{mod}\ \mathrm{max}-\mathrm{min})$.
 *
 * The 'up' indicates that if the value is equal to min or max, the min is returned.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { moduloBetweenDown } from './moduloBetweenDown.js';
import dot from '../dot.js';

export function moduloBetweenUp( value: number, min: number, max: number ): number {
  return -moduloBetweenDown( -value, -max, -min );
}
dot.register( 'moduloBetweenUp', moduloBetweenUp );