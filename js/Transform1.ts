// Copyright 2021-2022, University of Colorado Boulder

/**
 * One dimensional (scalar) transforms, which are invertible. Unlike Transform3 and Transform4, Transform1
 * may be nonlinear.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import dot from './dot.js';
import Range from './Range.js';

// For assertions that the inverse is correct.
const TOLERANCE = 1E-6;
const approxEquals = ( a, b ) => Math.abs( a - b ) <= TOLERANCE;

class Transform1 {

  /**
   * @param {function(number):number} evaluationFunction
   * @param {function(number):number} inverseFunction
   * @param {Object} [options]
   */
  constructor( evaluationFunction, inverseFunction, options ) {

    options = merge( {

      // Used for asserting the inverse is correct, and that inputs are valid
      domain: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY ),
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    }, options );

    // @private
    this.evaluationFunction = evaluationFunction;
    this.inverseFunction = inverseFunction;
    this.domain = options.domain;
    this.range = options.range;
  }

  /**
   * Evaluate the transform at the specified scalar.
   * @param {number} x
   * @returns {number}
   * @public
   */
  evaluate( x ) {
    assert && assert( this.domain.contains( x ), 'Value out of domain' );
    const result = this.evaluationFunction( x );
    assert && assert( approxEquals( this.inverseFunction( result ), x ) );
    return result;
  }

  /**
   * Evaluate the inverse at the specified scalar.
   * @param {number} x
   * @returns {number}
   * @public
   */
  inverse( x ) {
    assert && assert( this.range.contains( x ), 'Value out of range' );
    const result = this.inverseFunction( x );
    assert && assert( approxEquals( this.evaluationFunction( result ), x ) );
    return result;
  }
}

dot.register( 'Transform1', Transform1 );

export default Transform1;