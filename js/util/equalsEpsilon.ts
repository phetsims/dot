// Copyright 2025, University of Colorado Boulder

/**
 * Returns true if two numbers are within epsilon of each other.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function equalsEpsilon( a: number, b: number, epsilon: number ): boolean {
  return Math.abs( a - b ) <= epsilon;
}
dot.register( 'equalsEpsilon', equalsEpsilon );