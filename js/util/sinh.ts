// Copyright 2025, University of Colorado Boulder

/**
 * Function that returns the hyperbolic sine of a number
 *
 * @author Martin Veillette (Berea College)
 */

import dot from '../dot.js';

export function sinh( value: number ): number {
  return ( Math.exp( value ) - Math.exp( -value ) ) / 2;
}
dot.register( 'sinh', sinh );