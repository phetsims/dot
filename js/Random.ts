// Copyright 2015-2025, University of Colorado Boulder

/**
 * Random number generator with an optional seed.  It uses seedrandom.js, a monkey patch for Math, see
 * https://github.com/davidbau/seedrandom.
 *
 * If you are developing a PhET Simulation, you should probably use the global `DOT/dotRandom` because it
 * provides built-in support for phet-io seeding and a check that it isn't used before the seed has been set.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Mohamed Safi
 */

import optionize from '../../phet-core/js/optionize.js';
import Bounds2 from './Bounds2.js';
import dot from './dot.js';
import Range from './Range.js';
import Vector2 from './Vector2.js';
import { boxMullerTransform } from './util/boxMullerTransform.js';

type RandomOptions = {

  // {number|null} seed for the random number generator.  When seed is null, Math.random() is used.
  seed?: number | null;
};

export default class Random {
  private seed: number | null = null;

  // If seed is provided, create a local random number generator without altering Math.random.
  // Math.seedrandom is provided by seedrandom.js, see https://github.com/davidbau/seedrandom.
  private seedrandom: ( () => number ) | null = null;

  // the number of times `nextDouble` is called. Clients should not write to this value.
  public numberOfCalls = 0;

  public constructor( providedOptions?: RandomOptions ) {

    const options = optionize<RandomOptions>()( {
      seed: null
    }, providedOptions );

    this.setSeed( options.seed );
  }

  /**
   * Gets the seed.
   */
  public getSeed(): number | null {
    return this.seed;
  }

  /**
   * Returns the next pseudo-random boolean
   */
  public nextBoolean(): boolean {
    return this.nextDouble() >= 0.5;
  }

  /**
   * Returns the next pseudo random number from this random number generator sequence.
   * The random number is an integer ranging from 0 to n-1.
   * @returns an integer
   */
  public nextInt( n: number ): number {
    const value = this.nextDouble() * n;
    return Math.floor( value );
  }

  /**
   * Randomly select a random integer between min and max (inclusive).
   * @param min - must be an integer
   * @param max - must be an integer
   * @returns an integer between min and max, inclusive
   */
  public nextIntBetween( min: number, max: number ): number {

    assert && assert( Number.isInteger( min ), `min must be an integer: ${min}` );
    assert && assert( Number.isInteger( max ), `max must be an integer: ${max}` );

    const range = max - min;
    return this.nextInt( range + 1 ) + min;
  }

  /**
   * Randomly select one element from the given array.
   * @param array - from which one element will be selected, must have at least one element
   * @returns the selected element from the array
   */
  public sample<T>( array: readonly T[] ): T {
    assert && assert( array.length > 0, 'Array should have at least 1 item.' );
    const index = this.nextIntBetween( 0, array.length - 1 );
    return array[ index ];
  }

  /**
   * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.  Adapted from lodash-2.4.1 by
   * Sam Reid on Aug 16, 2016, See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
   * @param array - the array which will be shuffled
   * @returns a new array with all the same elements in the passed-in array, in randomized order.
   */
  public shuffle<T>( array: T[] ): T[] {
    let index = -1;
    const result = new Array( array.length );

    _.forEach( array, value => {
      const rand = this.nextIntBetween( 0, ++index );
      result[ index ] = result[ rand ];
      result[ rand ] = value;
    } );
    return result;
  }

  /**
   * Returns the next pseudo random number from this random number generator sequence in the range [0, 1)
   * The distribution of the random numbers is uniformly distributed across the interval
   * @returns the random number
   */
  public nextDouble(): number {
    this.numberOfCalls++;
    return this.seedrandom!();
  }

  /**
   * Randomly selects a double in the range [min,max).
   */
  public nextDoubleBetween( min: number, max: number ): number {
    assert && assert( min < max, 'min must be < max' );
    const value = min + this.nextDouble() * ( max - min );
    assert && assert( value >= min && value < max, `value out of range: ${value}` );
    return value;
  }

  /**
   * Returns the next gaussian-distributed random number from this random number generator sequence.
   * The distribution of the random numbers is gaussian, with a mean = 0 and standard deviation = 1
   */
  public nextGaussian(): number {
    return boxMullerTransform( 0, 1, this );
  }

  /**
   * Gets the next random double in a Range.
   * For min < max, the return value is [min,max), between min (inclusive) and max (exclusive).
   * For min === max, the return value is min.
   */
  public nextDoubleInRange( range: Range ): number {
    if ( range.min < range.max ) {
      return this.nextDoubleBetween( range.min, range.max );
    }
    else {
      // because random.nextDoubleBetween requires min < max
      return range.min;
    }
  }

  /**
   * Gets a random point within the provided Bounds2, [min,max)
   */
  public nextPointInBounds( bounds: Bounds2 ): Vector2 {
    return new Vector2(
      this.nextDoubleBetween( bounds.minX, bounds.maxX ),
      this.nextDoubleBetween( bounds.minY, bounds.maxY )
    );
  }

  /**
   * @param seed - if null, Math.random will be used to create the seed.
   */
  public setSeed( seed: number | null ): void {

    if ( typeof seed === 'number' ) {

      // @ts-expect-error
      assert && assert( Math.seedrandom, 'If a seed is specified, then we must also have Math.seedrandom to use the seed.' );
    }
    else {
      seed = Math.random(); // eslint-disable-line phet/bad-sim-text
    }

    this.seed = seed;

    // If seed is provided, create a local random number generator without altering Math.random.
    // Math.seedrandom is provided by seedrandom.js, see https://github.com/davidbau/seedrandom.
    // @ts-expect-error
    this.seedrandom = Math.seedrandom ? new Math.seedrandom( `${seed}` ) : () => Math.random(); // eslint-disable-line phet/bad-sim-text
  }

  /**
   * Choose a numeric index from the array of weights.  The array of weights does not need to be normalized.
   * See https://stackoverflow.com/questions/8877249/generate-random-integers-with-probabilities
   * See also ContinuousServer.weightedSampleTest which uses the same algorithm
   */
  public sampleProbabilities( weights: readonly number[] ): number {
    const totalWeight = _.sum( weights );

    const cutoffWeight = totalWeight * this.nextDouble();
    let cumulativeWeight = 0;

    for ( let i = 0; i < weights.length; i++ ) {
      cumulativeWeight += weights[ i ];
      if ( cumulativeWeight >= cutoffWeight ) {
        return i;
      }
    }

    // The fallback is the last test
    assert && assert( weights[ weights.length - 1 ] !== 0, 'if last weight is zero, should have selected something beforehand' );
    return weights.length - 1;
  }
}

dot.register( 'Random', Random );