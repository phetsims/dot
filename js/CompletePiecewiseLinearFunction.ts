// Copyright 2022, University of Colorado Boulder

/**
 * Describes a 1d complete (fully defined for any number) function, where values are extrapolated given the final end
 * points.
 *
 * E.g. if the points (0,0) and (1,1) are provided, it represents the function f(x) = x for ALL values, especially
 * values outside of the range [0,1]. For example, f(6) = 6.
 *
 * If a single point is provided, it represents a constant function.
 *
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import Utils from './Utils.js';
import Vector2 from './Vector2.js';

class CompletePiecewiseLinearFunction {

  public points: Vector2[];

  // Assumed to be sorted by x value, and continuous
  public constructor( points: Vector2[] ) {
    assert && assert( points.length > 0 );
    assert && points.forEach( ( point, i ) => {
      if ( i < points.length - 1 ) {
        assert && assert( point.x < points[ i + 1 ].x,
          'Points should be strictly increasing in x value (ordered by their x value)' );
      }
    } );

    // We're going to remove collinear points, so we create an extra copy
    this.points = points.slice();

    // NOTE: The removal of collinear points helps improve performance, since we sometimes need to "expand" the number
    // of points. Repeated minimums/maximums for many inputs could otherwise become quite slow.
    for ( let i = 0; i < this.points.length - 2; i++ ) {
      const a = this.points[ i ];
      const b = this.points[ i + 1 ];
      const c = this.points[ i + 2 ];

      if ( Utils.arePointsCollinear( a, b, c ) ) {
        this.points.splice( i + 1, 1 );
        i--;
      }
    }
  }

  /**
   * Returns the pair of points that the x value is defined by.
   *
   * NOTE: x may NOT be contained in these points, if it's either less than or greater than any points in the points
   * list.
   */
  public findMatchingPair( x: number ): [ Vector2, Vector2 ] {
    assert && assert( this.points.length > 1 );

    let i = 0;
    while ( i < this.points.length - 2 && this.points[ i + 1 ].x < x ) {
      i++;
    }
    return [ this.points[ i ], this.points[ i + 1 ] ];
  }

  /**
   * Evaluates the function at the given x value, e.g. returns f(x).
   */
  public evaluate( x: number ): number {
    if ( this.points.length === 1 ) {
      return this.points[ 0 ].y;
    }
    else {
      const [ leftPoint, rightPoint ] = this.findMatchingPair( x );

      if ( leftPoint.x === x ) {
        return leftPoint.y;
      }
      else if ( rightPoint.x === x ) {
        return rightPoint.y;
      }
      else {
        return Utils.linear( leftPoint.x, rightPoint.x, leftPoint.y, rightPoint.y, x );
      }
    }
  }

  /**
   * Returns an array that combines sorted unique x-values provided by this function and/or the other function.
   */
  private getCombinedXValues( linearFunction: CompletePiecewiseLinearFunction ): number[] {
    return CompletePiecewiseLinearFunction.sortedUniqueEpsilon(
      this.points.map( point => point.x ).concat( linearFunction.points.map( point => point.x ) )
    );
  }

  /**
   * Returns an array that combines the sorted unique x-values included in this function and/or the other function, OR the unique x-values
   * that result from the intersection of the two functions.
   */
  private getIntersectedXValues( linearFunction: CompletePiecewiseLinearFunction ): number[] {
    const xValues = this.getCombinedXValues( linearFunction );
    const newXValues: number[] = [];

    for ( let i = 0; i < xValues.length - 1; i++ ) {
      const leftX = xValues[ i ];
      const rightX = xValues[ i + 1 ];
      const intersectionPoint = Utils.lineLineIntersection(

        // The linear function defined in this
        new Vector2( leftX, this.evaluate( leftX ) ),
        new Vector2( rightX, this.evaluate( rightX ) ),

        // The passed in argument linear function
        new Vector2( leftX, linearFunction.evaluate( leftX ) ),
        new Vector2( rightX, linearFunction.evaluate( rightX ) )
      );
      if ( intersectionPoint &&
           // If it's our first pair of points, don't filter out points that are on the left side of the left point
           ( i === 0 || intersectionPoint.x > leftX ) &&
           // If it's our last pair of points, don't filter out points that are on the right side of the right point
           ( i === xValues.length - 2 || intersectionPoint.x < rightX )
      ) {
        newXValues.push( intersectionPoint.x );
      }
    }

    // Remove duplicate values above and sort them
    const criticalXValues = CompletePiecewiseLinearFunction.sortedUniqueEpsilon( [
      ...xValues,
      ...newXValues
    ] );

    // To capture the slope at the start/end, we'll add extra points to guarantee this. If they're duplicated, they'll
    // be removed during the collinear check on construction.
    return [
      criticalXValues[ 0 ] - 1,
      ...criticalXValues,
      criticalXValues[ criticalXValues.length - 1 ] + 1
    ];
  }

  /**
   * Returns a new function that's the result of applying the binary operation at the given x values.
   */
  private binaryXOperation( linearFunction: CompletePiecewiseLinearFunction, operation: ( a: number, b: number ) => number, xValues: number[] ): CompletePiecewiseLinearFunction {
    return new CompletePiecewiseLinearFunction( xValues.map( x => {
      return new Vector2( x, operation( this.evaluate( x ), linearFunction.evaluate( x ) ) );
    } ) );
  }

  /**
   * Returns a new function that's the result of applying the binary operation at the x values that already occur
   * in each function.
   */
  private binaryPointwiseOperation( linearFunction: CompletePiecewiseLinearFunction, operation: ( a: number, b: number ) => number ): CompletePiecewiseLinearFunction {
    return this.binaryXOperation( linearFunction, operation, this.getCombinedXValues( linearFunction ) );
  }

  /**
   * Returns a new function that's the result of applying the binary operation at the x values that either occur in
   * each function OR at the intersection of the two functions.
   */
  private binaryIntersectingOperation( linearFunction: CompletePiecewiseLinearFunction, operation: ( a: number, b: number ) => number ): CompletePiecewiseLinearFunction {
    return this.binaryXOperation( linearFunction, operation, this.getIntersectedXValues( linearFunction ) );
  }

  /**
   * Returns a CompletePiecewiseLinearFunction that's the result of adding the two functions.
   */
  public plus( linearFunction: CompletePiecewiseLinearFunction ): CompletePiecewiseLinearFunction {
    return this.binaryPointwiseOperation( linearFunction, ( a, b ) => a + b );
  }

  /**
   * Returns a CompletePiecewiseLinearFunction that's the result of subtracting the two functions.
   */
  public minus( linearFunction: CompletePiecewiseLinearFunction ): CompletePiecewiseLinearFunction {
    return this.binaryPointwiseOperation( linearFunction, ( a, b ) => a - b );
  }

  /**
   * Returns a CompletePiecewiseLinearFunction that's the result of taking the minimum of the two functions
   */
  public min( linearFunction: CompletePiecewiseLinearFunction ): CompletePiecewiseLinearFunction {
    return this.binaryIntersectingOperation( linearFunction, Math.min );
  }

  /**
   * Returns a CompletePiecewiseLinearFunction that's the result of taking the maximum of the two functions
   */
  public max( linearFunction: CompletePiecewiseLinearFunction ): CompletePiecewiseLinearFunction {
    return this.binaryIntersectingOperation( linearFunction, Math.max );
  }

  /**
   * Allows redefining or clamping/truncating the function by only representing it from the given x values
   */
  public withXValues( xValues: number[] ): CompletePiecewiseLinearFunction {
    return new CompletePiecewiseLinearFunction( xValues.map( x => new Vector2( x, this.evaluate( x ) ) ) );
  }

  /**
   * Returns an inverted form of the function (assuming it is monotonically increasing or monotonically decreasing)
   */
  public inverted(): CompletePiecewiseLinearFunction {
    const points = this.points.map( point => new Vector2( point.y, point.x ) );

    // NOTE: We'll rely on the constructor to make sure that the inverse is valid. Here we'll handle the monotonically
    // decreasing case (which is invertible, just needs a reversal of points)
    if ( points.length > 1 && points[ 0 ].x > points[ 1 ].x ) {
      points.reverse();
    }

    return new CompletePiecewiseLinearFunction( points );
  }

  public static sum( ...functions: CompletePiecewiseLinearFunction[] ): CompletePiecewiseLinearFunction {
    return functions.reduce( ( a, b ) => a.plus( b ) );
  }

  public static min( ...functions: CompletePiecewiseLinearFunction[] ): CompletePiecewiseLinearFunction {
    return functions.reduce( ( a, b ) => a.min( b ) );
  }

  public static max( ...functions: CompletePiecewiseLinearFunction[] ): CompletePiecewiseLinearFunction {
    return functions.reduce( ( a, b ) => a.max( b ) );
  }

  public static constant( y: number ): CompletePiecewiseLinearFunction {
    return new CompletePiecewiseLinearFunction( [ new Vector2( 0, y ) ] );
  }

  // Represents the function ax+b
  public static linear( a: number, b: number ): CompletePiecewiseLinearFunction {
    return new CompletePiecewiseLinearFunction( [ new Vector2( 0, b ), new Vector2( 1, a + b ) ] );
  }

  /**
   * Returns a sorted list of the input numbers, ensuring no duplicates within a specified epsilon value
   */
  private static sortedUniqueEpsilon( numbers: number[], epsilon = 1e-10 ): number[] {
    numbers = _.sortBy( numbers );

    for ( let i = 0; i < numbers.length - 1; i++ ) {
      if ( Math.abs( numbers[ i ] - numbers[ i + 1 ] ) < epsilon ) {
        numbers.splice( i, 1 );
        i--;
      }
    }

    return numbers;
  }
}

dot.register( 'CompletePiecewiseLinearFunction', CompletePiecewiseLinearFunction );

export default CompletePiecewiseLinearFunction;