// Copyright 2025, University of Colorado Boulder

/**
 * Generates a random Gaussian sample with the given mean and standard deviation.
 * This method relies on the "static" variables generate, z0, and z1 defined above.
 * Random.js is the primary client of this function, but it is defined here so it can be
 * used other places more easily if need be.
 * Code inspired by example here: https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform.
 *
 * @param mu - The mean of the Gaussian
 * @param sigma - The standard deviation of the Gaussian
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import type Random from '../Random.js';

let generate = false;
let z0 = 0;
let z1 = 0;
const TWO_PI = 2 * Math.PI;

export function boxMullerTransform( mu: number, sigma: number, random: Random ): number {
  generate = !generate;

  if ( !generate ) {
    return z1 * sigma + mu;
  }

  let u1;
  let u2;
  do {
    u1 = random.nextDouble();
    u2 = random.nextDouble();
  }
  while ( u1 <= Number.MIN_VALUE );

  z0 = Math.sqrt( -2.0 * Math.log( u1 ) ) * Math.cos( TWO_PI * u2 );
  z1 = Math.sqrt( -2.0 * Math.log( u1 ) ) * Math.sin( TWO_PI * u2 );
  return z0 * sigma + mu;
}
dot.register( 'boxMullerTransform', boxMullerTransform );