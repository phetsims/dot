// Copyright 2025, University of Colorado Boulder

/**
 * Log base-10, since it wasn't included in every supported browser.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function log10( val: number ): number {
  return Math.log( val ) / Math.LN10;
}
dot.register( 'log10', log10 );