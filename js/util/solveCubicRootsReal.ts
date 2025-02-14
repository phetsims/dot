// Copyright 2025, University of Colorado Boulder

/**
 * Returns an array of the real roots of the cubic equation $ax^3 + bx^2 + cx + d=0$, or null if every value is a
 * solution. If a is nonzero, there should be between 0 and 3 (inclusive) values returned.
 *
 * @param [discriminantThreshold] - for determining whether we have a single real root
 * @returns The real roots of the equation, or null if all values are roots. If the root has
 *          a multiplicity larger than 1, it will be repeated that many times.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import { solveQuadraticRootsReal } from './solveQuadraticRootsReal.js';
import { cubeRoot } from './cubeRoot.js';

export function solveCubicRootsReal(
  a: number,
  b: number,
  c: number,
  d: number,
  discriminantThreshold = 1e-7
): number[] | null {

  let roots: number[] | null;

  // TODO: a Complex type! https://github.com/phetsims/dot/issues/96

  // Check for a degenerate case where we don't have a cubic
  if ( a === 0 ) {
    roots = solveQuadraticRootsReal( b, c, d );
  }
  else {
    //We need to test whether a is several orders of magnitude less than b, c, d
    const epsilon = 1E7;

    if ( a === 0 || Math.abs( b / a ) > epsilon || Math.abs( c / a ) > epsilon || Math.abs( d / a ) > epsilon ) {
      roots = solveQuadraticRootsReal( b, c, d );
    }
    else {
      if ( d === 0 || Math.abs( a / d ) > epsilon || Math.abs( b / d ) > epsilon || Math.abs( c / d ) > epsilon ) {
        roots = [ 0 ].concat( solveQuadraticRootsReal( a, b, c )! );
      }
      else {
        b /= a;
        c /= a;
        d /= a;

        const q = ( 3.0 * c - ( b * b ) ) / 9;
        const r = ( -( 27 * d ) + b * ( 9 * c - 2 * ( b * b ) ) ) / 54;
        const discriminant = q * q * q + r * r;
        const b3 = b / 3;

        if ( discriminant > discriminantThreshold ) {
          // a single real root
          const dsqrt = Math.sqrt( discriminant );
          roots = [ cubeRoot( r + dsqrt ) + cubeRoot( r - dsqrt ) - b3 ];
        }
        else if ( discriminant > -discriminantThreshold ) { // would truly be discriminant==0, but floating-point error
          // contains a double root (but with three roots)
          const rsqrt = cubeRoot( r );
          const doubleRoot = -b3 - rsqrt;
          roots = [ -b3 + 2 * rsqrt, doubleRoot, doubleRoot ];
        }
        else {
          // all unique (three roots)
          let qX = -q * q * q;
          qX = Math.acos( r / Math.sqrt( qX ) );
          const rr = 2 * Math.sqrt( -q );
          roots = [
            -b3 + rr * Math.cos( qX / 3 ),
            -b3 + rr * Math.cos( ( qX + 2 * Math.PI ) / 3 ),
            -b3 + rr * Math.cos( ( qX + 4 * Math.PI ) / 3 )
          ];
        }
      }
    }
  }

  assert && roots && roots.forEach( root => {
    assert && assert( isFinite( root ), 'All returned solveCubicRootsReal roots should be finite' );
  } );

  return roots;
}
dot.register( 'solveCubicRootsReal', solveCubicRootsReal );