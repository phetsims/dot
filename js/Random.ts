// Copyright 2015-2023, University of Colorado Boulder

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

import merge from '../../phet-core/js/merge.js';
import Bounds2 from './Bounds2.js';
import dot from './dot.js';
import Range from './Range.js';
import Utils from './Utils.js';
import Vector2 from './Vector2.js';

class Random {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {number|null} seed for the random number generator.  When seed is null, Math.random() is used.
      seed: null
    }, options );

    // @private {number|null} initialized via setSeed below
    this.seed = null;

    // If seed is provided, create a local random number generator without altering Math.random.
    // Math.seedrandom is provided by seedrandom.js, see https://github.com/davidbau/seedrandom.
    // @private {function:number|null} initialized via setSeed below
    this.seedrandom = null;
    this.setSeed( options.seed );

    // @public (read-only) - the number of times `nextDouble` is called
    this.numberOfCalls = 0;

    Random.allRandomInstances.add( this );
  }

  /**
   * Clears out this instance from all of the Random instances.
   * @public
   */
  dispose() {
    Random.allRandomInstances.delete( this );
  }

  /**
   * Gets the seed.
   * @public
   * @returns {number|null}
   */
  getSeed() {
    return this.seed;
  }

  /**
   * Returns the next pseudo-random boolean
   * @public
   * @returns {boolean}
   */
  nextBoolean() {
    return this.nextDouble() >= 0.5;
  }

  /**
   * Returns the next pseudo random number from this random number generator sequence.
   * The random number is an integer ranging from 0 to n-1.
   * @public
   * @param {number} n
   * @returns {number} - an integer
   */
  nextInt( n ) {
    const value = this.nextDouble() * n;
    return Math.floor( value );
  }

  /**
   * Randomly select a random integer between min and max (inclusive).
   * @public
   * @param {number} min - must be an integer
   * @param {number} max - must be an integer
   * @returns {number} an integer between min and max, inclusive
   */
  nextIntBetween( min, max ) {

    assert && assert( arguments.length === 2, 'nextIntBetween must have exactly 2 arguments' );
    assert && assert( Number.isInteger( min ), `min must be an integer: ${min}` );
    assert && assert( Number.isInteger( max ), `max must be an integer: ${max}` );

    const range = max - min;
    return this.nextInt( range + 1 ) + min;
  }

  /**
   * Randomly select one element from the given array.
   * @public
   * @param {T[]} array - the array from which one element will be selected, must have at least one element
   * @returns {T} - the selected element from the array
   * @template T
   */
  sample( array ) {
    assert && assert( array.length > 0, 'Array should have at least 1 item.' );
    const index = this.nextIntBetween( 0, array.length - 1 );
    return array[ index ];
  }

  /**
   * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.  Adapted from lodash-2.4.1 by
   * Sam Reid on Aug 16, 2016, See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
   * @public
   * @param {Array} array - the array which will be shuffled
   * @returns {Array} a new array with all the same elements in the passed-in array, in randomized order.
   */
  shuffle( array ) {
    assert && assert( array, 'Array should exist' );
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
   * @public
   * @returns {number} - the random number
   */
  nextDouble() {
    this.numberOfCalls++;
    return this.seedrandom();
  }

  /**
   * Randomly selects a double in the range [min,max).
   * @public
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  nextDoubleBetween( min, max ) {
    assert && assert( min < max, 'min must be < max' );
    const value = min + this.nextDouble() * ( max - min );
    assert && assert( value >= min && value < max, `value out of range: ${value}` );
    return value;
  }

  /**
   * Returns the next gaussian-distributed random number from this random number generator sequence.
   * The distribution of the random numbers is gaussian, with a mean = 0 and standard deviation = 1
   * @public
   * @returns {number}
   */
  nextGaussian() {
    return Utils.boxMullerTransform( 0, 1, this );
  }

  /**
   * Gets the next random double in a Range.
   * For min < max, the return value is [min,max), between min (inclusive) and max (exclusive).
   * For min === max, the return value is min.
   * @public
   * @param {Range} range
   * @returns {number}
   */
  nextDoubleInRange( range ) {
    assert && assert( range instanceof Range, 'invalid range' );
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
   * @param {Bounds2} bounds
   * @returns {Vector2}
   * @public
   */
  nextPointInBounds( bounds ) {
    assert && assert( bounds instanceof Bounds2, 'invalid Bounds2' );
    return new Vector2(
      this.nextDoubleBetween( bounds.minX, bounds.maxX ),
      this.nextDoubleBetween( bounds.minY, bounds.maxY )
    );
  }

  /**
   * @public
   * @param {number|null} seed - if null, Math.random will be used to create the seed.
   */
  setSeed( seed ) {
    assert && assert( seed === null || typeof seed === 'number' );

    if ( typeof seed === 'number' ) {
      assert && assert( Math.seedrandom, 'cannot set seed with 3rd party library "Math.seedrandom".' );
    }
    else {
      seed = Math.random(); // eslint-disable-line bad-sim-text
    }

    this.seed = seed;

    // If seed is provided, create a local random number generator without altering Math.random.
    // Math.seedrandom is provided by seedrandom.js, see https://github.com/davidbau/seedrandom.
    // @private {function:number|null}
    this.seedrandom = Math.seedrandom ? new Math.seedrandom( `${seed}` ) : () => Math.random(); // eslint-disable-line bad-sim-text
  }

  /**
   * Choose a numeric index from the array of weights.  The array of weights does not need to be normalized.
   * See https://stackoverflow.com/questions/8877249/generate-random-integers-with-probabilities
   * See also ContinuousServer.weightedSampleTest which uses the same algorithm
   * @param {ReadonlyArray<number>} weights
   * @returns {number}
   * @public
   */
  sampleProbabilities( weights ) {
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
    assert && assert( !weights[ weights.length - 1 ] === 0, 'if last weight is zero, should have selected something beforehand' );
    return weights.length - 1;
  }
}

Random.allRandomInstances = new Set();
Random.isNormalized = array => {
  assert && assert( _.sum( array ) === 1 );
};

dot.register( 'Random', Random );

export default Random;