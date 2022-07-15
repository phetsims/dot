// Copyright 2013-2022, University of Colorado Boulder

/**
 * Function for doing a linear mapping between two domains ('a' and 'b').
 * <p>
 * Example usage:
 * <code>
 * var f = new LinearFunction( 0, 100, 0, 200 );
 * f.evaluate( 50 ); // 100
 * f.inverse( 100 ); // 50
 * </code>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from './Utils.js';
import dot from './dot.js';

export default class LinearFunction {
  private a1: number;
  private a2: number;
  private b1: number;
  private b2: number;
  private clamp: boolean;

  /**
   * @param a1
   * @param a2
   * @param b1
   * @param b2
   * @param clamp - clamp the result to the provided ranges, false by default
   */
  public constructor( a1: number, a2: number, b1: number, b2: number, clamp = false ) {
    this.a1 = a1;
    this.a2 = a2;
    this.b1 = b1;
    this.b2 = b2;
    this.clamp = clamp;
  }

  /**
   * Maps from a to b.
   */
  public evaluate( a3: number ): number {
    return map( this.a1, this.a2, this.b1, this.b2, a3, this.clamp );
  }

  /**
   * Maps from b to a
   */
  public inverse( b3: number ): number {
    return map( this.b1, this.b2, this.a1, this.a2, b3, this.clamp );
  }
}

/**
 * Linearly interpolate two points and evaluate the line equation for a third point.
 * f( a1 ) = b1, f( a2 ) = b2, f( a3 ) = <linear mapped value>
 * Optionally clamp the result to the range [b1,b2].
 */
const map = ( a1: number, a2: number, b1: number, b2: number, a3: number, clamp: boolean ): number => {
  let b3 = Utils.linear( a1, a2, b1, b2, a3 );
  if ( clamp ) {
    const max = Math.max( b1, b2 );
    const min = Math.min( b1, b2 );
    b3 = Utils.clamp( b3, min, max );
  }
  return b3;
};

dot.register( 'LinearFunction', LinearFunction );
