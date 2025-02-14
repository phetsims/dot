// Copyright 2025, University of Colorado Boulder

/**
 * Workaround for broken modulo operator.
 * E.g. on iOS9, 1e10 % 1e10 -> 2.65249474e-315
 * See https://github.com/phetsims/dot/issues/75
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

import dot from '../dot.js';

export function mod( a: number, b: number ): number {
  if ( a / b % 1 === 0 ) {
    return 0; // a is a multiple of b
  }
  else {
    return a % b;
  }
}
dot.register( 'mod', mod );