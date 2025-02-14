// Copyright 2025, University of Colorado Boulder

/**
 * Defines and evaluates a linear mapping. The mapping is defined so that $f(a_1)=b_1$ and $f(a_2)=b_2$, and other
 * values are interpolated along the linear equation. The returned value is $f(a_3)$.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function linear(
  a1: number,
  a2: number,
  b1: number,
  b2: number,
  a3: number
): number {
  return ( b2 - b1 ) / ( a2 - a1 ) * ( a3 - a1 ) + b1;
}
dot.register( 'linear', linear );