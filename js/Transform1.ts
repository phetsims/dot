// Copyright 2021-2026, University of Colorado Boulder

/**
 * One dimensional (scalar) transforms, which are invertible. Unlike Transform3 and Transform4, Transform1
 * may be nonlinear.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import affirm from '../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../phet-core/js/optionize.js';
import dot from './dot.js';
import Range from './Range.js';

// For assertions that the inverse is correct.
const TOLERANCE = 1E-6;
const approxEquals = ( a: number, b: number ) => Math.abs( a - b ) <= TOLERANCE;

type Transform1Options = {
  domain?: Range;
  range?: Range;
};

class Transform1 {
  private readonly domain: Range;
  private readonly range: Range;

  public constructor(
    private readonly evaluationFunction: ( x: number ) => number,
    private readonly inverseFunction: ( x: number ) => number,
    providedOptions?: Transform1Options ) {

    const options = optionize<Transform1Options>()( {

      // Used for asserting the inverse is correct, and that inputs are valid
      domain: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY ),
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    }, providedOptions );

    this.domain = options.domain;
    this.range = options.range;
  }

  /**
   * Evaluate the transform at the specified scalar.
   */
  public evaluate( x: number ): number {
    affirm( this.domain.contains( x ), 'Value out of domain' );
    const result = this.evaluationFunction( x );
    affirm( approxEquals( this.inverseFunction( result ), x ) );
    return result;
  }

  /**
   * Evaluate the inverse at the specified scalar.
   */
  public inverse( x: number ): number {
    affirm( this.range.contains( x ), 'Value out of range' );
    const result = this.inverseFunction( x );
    affirm( approxEquals( this.evaluationFunction( result ), x ) );
    return result;
  }
}

dot.register( 'Transform1', Transform1 );

export default Transform1;