// Copyright 2019, University of Colorado Boulder

/**
 * Evaluates points on a piecewise linear function.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const dot = require( 'DOT/dot' );
  const Util = require( 'DOT/Util' );

  // modules
  require( 'DOT/Util' );

  class PiecewiseLinearFunction {

    /**
     * @param {number[]} array - in the form x0,y0, x1,y1, x2,y2, etc.  Points do not have to be in order.
     *                         - points cannot have a different y value for the same x value (not checked)
     */
    constructor( array ) {
      assert && assert( array.length % 2 === 0, 'array length should be even' );
      assert && assert( array.length > 0, 'array must have elements' );
      assert && assert( Array.isArray( array ), 'array should be an array' );
      this.array = array;
    }

    evaluate( x ) {
      return PiecewiseLinearFunction.evaluate( this.array, x );
    }

    /**
     * This algorithm generates no garbage
     * @param {number[]} array - in the form x0,y0, x1,y1, x2,y2, etc.  Points do not have to be ordered from low to high x
     *                         - points cannot have a different y value for the same x value (not checked)
     * @param {number} x
     */
    static evaluate( array, x ) {

      // Find the points in the range by a single pass through the anchors
      let lowerIndex = -1;
      let lowerDelta = Number.POSITIVE_INFINITY;
      let upperIndex = -1;
      let upperDelta = Number.POSITIVE_INFINITY;
      for ( let i = 0; i < array.length; i += 2 ) {
        const arrayElement = array[ i ];
        const delta = x - arrayElement;
        const abs = Math.abs( delta );

        // Check for exact match
        if ( arrayElement === x ) {
          return array[ i + 1 ];
        }
        if ( arrayElement <= x && abs < lowerDelta ) {
          lowerIndex = i;
          lowerDelta = abs;
        }
        if ( arrayElement >= x && abs < upperDelta ) {
          upperIndex = i;
          upperDelta = abs;
        }
      }

      assert && assert( lowerIndex >= 0, 'lower bound not found' );
      assert && assert( upperIndex >= 0, 'upper bound not found' );

      const anchor1X = array[ lowerIndex ];
      const anchor1Y = array[ lowerIndex + 1 ];
      const anchor2X = array[ upperIndex ];
      const anchor2Y = array[ upperIndex + 1 ];
      return Util.linear( anchor1X, anchor2X, anchor1Y, anchor2Y, x );
    }
  }

  dot.register( 'PiecewiseLinearFunction', PiecewiseLinearFunction );

  return PiecewiseLinearFunction;
} );