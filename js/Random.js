// Copyright 2015-2020, University of Colorado Boulder

/**
 * Random number generator with an optional seed.
 * It uses seedrandom.js, a monkey patch for Math, see https://github.com/davidbau/seedrandom.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Mohamed Safi
 */

import merge from '../../phet-core/js/merge.js';
import dot from './dot.js';
import Range from './Range.js';
import Utils from './Utils.js';

class Random {

  /**
   * Construct a Random instance.
   *
   * If you are developing a PhET Simulation, you should probably use the global `phet.joist.random` because it
   * provides built-in support for phet-io seeding and a check that it isn't used before the seed has been set.
   *
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {
    options = merge( {

      // {number|null} seed for the random number generator.  When seed is null, Math.random() is used.
      seed: null,

      // {boolean} if true, use the seed specified statically in `phet.chipper.randomSeed`.  This value is declared
      // in initialize-globals.js and can be overridden by PhET-iO for reproducible playback (see PhetioEngineIO.setRandomSeed).
      staticSeed: false

    }, options );

    // If staticSeed and seed are both specified, there will be an assertion error.
    if ( options.seed !== null && options.staticSeed ) {
      assert && assert( false, 'cannot specify seed and staticSeed, use one or the other' );
    }

    // @private {number|null} initialized via setSeed below
    this.seed = null;

    // @private {function:number|null} initialized via setSeed below
    this.seedrandom = null;

    const seed = options.staticSeed ? window.phet.chipper.randomSeed : options.seed;
    this.setSeed( seed );
  }

  /**
   * Sets the seed of the random number generator. Setting it to null reverts the random generator to Math.random()
   * @public
   * @param {number|null} seed
   */
  setSeed( seed ) {
    this.seed = seed;

    // If seed is provided, create a local random number generator without altering Math.random.
    // Math.seedrandom is provided by seedrandom.js, see https://github.com/davidbau/seedrandom.
    this.seedrandom = ( this.seed !== null ) ? new Math.seedrandom( this.seed + '' ) : null;
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
    return value | 0; // convert to int by removing the decimal places
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
    assert && assert( Utils.isInteger( min ), 'min must be an integer: ' + min );
    assert && assert( Utils.isInteger( max ), 'max must be an integer: ' + max );

    const range = max - min;
    return this.nextInt( range + 1 ) + min;
  }

  /**
   * Randomly select one element from the given array.
   * @public
   * @param {Object[]} array - the array from which one element will be selected, must have at least one element
   * @returns {Object} - the selected element from the array
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
    const self = this;
    let index = -1;
    const result = new Array( array.length );

    _.forEach( array, value => {
      const rand = self.nextIntBetween( 0, ++index );
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
    return this.seed === null ? Math.random() : this.seedrandom(); // eslint-disable-line bad-sim-text
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
}

dot.register( 'Random', Random );

export default Random;