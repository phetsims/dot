// Copyright 2015, University of Colorado Boulder

/**
 * Random number generator with an optional seed.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aaron Davis
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Util = require( 'DOT/Util' );
  var dot = require( 'DOT/dot' );

  /**
   * Construct a Random instance.
   *
   * If you are developing a PhET Simulation, you should probably use the global `phet.joist.random` because it
   * provides built-in support for phet-io seeding and a check that it isn't used before the seed has been set.
   *
   * @param {Object} [options]
   * @constructor
   */
  function Random( options ) {
    options = _.extend( {

      // {number|null} seed for the random number generator.
      //               when seed is null, Math.random() is used
      seed: null,

      // {boolean} if true, use the seed specified statically in `phet.chipper.randomSeed`.  This value is declared
      // in initialize-globals.js and overrideable by phet-io for reproducible playback (see TPhETIO.setRandomSeed)
      // This is a convenience option since it will be a common occurrence to use the replicable playback seed.
      // If staticSeed and seed are both specified, there will be an assertion error.
      staticSeed: false

    }, options );

    if ( options.seed !== null && options.staticSeed ) {
      assert && assert( false, 'cannot specify seed and staticSeed, use one or the other' );
    }

    var seed = options.staticSeed ? window.phet.chipper.randomSeed : options.seed;
    this.setSeed( seed );
  }

  dot.register( 'Random', Random );

  Random.prototype = {

    constructor: Random,

    /**
     * Sets the seed of the random number generator. Setting it to null reverts the random generator to Math.random()
     * @param {number|null} seed
     */
    setSeed: function( seed ) {
      this.seed = seed;

      // Use "new" to create a local prng without altering Math.random.
      this.seedrandom = this.seed !== null ? new Math.seedrandom( this.seed + '' ) : null;
    },

    /**
     * Returns the value of the seed, null indicates that Math.random() is used
     * @public
     * @returns {number|null}
     */
    getSeed: function() {
      return this.seed;
    },

    /**
     * Returns a floating-point number in the range [0, 1), i.e. from 0 (inclusive) to 1 (exclusive)
     * The random number can be seeded
     * @public
     * @returns {number}
     */
    random: function() {
      return this.seed === null ? Math.random() : this.seedrandom();
    },

    /**
     * Returns the next pseudo-random boolean
     * @public
     * @returns {boolean}
     */
    nextBoolean: function() {
      return this.random() >= 0.5;
    },

    /**
     * Returns the next pseudo random number from this random number generator sequence.
     * The random number is an integer ranging from 0 to n-1.
     * @public
     * @param {number} n
     * @returns {number} - an integer
     */
    nextInt: function( n ) {
      var value = this.random() * n;
      return value | 0; // convert to int by removing the decimal places
    },

    /**
     * Randomly select a random value an integral number of steps above min (inclusive).
     * This is a replacement for lodash's _.random function (though doesn't support lodash's 3rd argument)
     * @param {number} min
     * @param {number} max
     * @returns {number} a value between min and max, inclusive
     */
    nextBetween: function( min, max ) {
      assert && assert( arguments.length === 2, 'nextBetween must have exactly 2 arguments' );

      var range = max - min;
      return this.nextInt( range + 1 ) + min;
    },

    /**
     * Randomly select one element from the given array.
     * @param {Object[]} array - the array from which one element will be selected, must have at least one element
     * @returns {Object} - the selected element from the array
     */
    sample: function( array ) {
      assert && assert( array.length > 0, 'Array should have at least 1 item.' );
      var index = this.nextBetween( 0, array.length - 1 );
      return array[ index ];
    },

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     *
     * Adapted from lodash-2.4.1 by Sam Reid on Aug 16, 2016
     */
    shuffle: function( collection ) {
      var r = this;
      var index = -1;
      var length = collection ? collection.length : 0;
      var result = Array( typeof length === 'number' ? length : 0 );

      _.forEach( collection, function( value ) {
        var rand = r.nextBetween( 0, ++index );
        result[ index ] = result[ rand ];
        result[ rand ] = value;
      } );
      return result;
    },

    /**
     * Returns the next pseudo random number from this random number generator sequence in the range [0, 1)
     * The distribution of the random numbers is uniformly distributed across the interval
     * @public
     * @returns {number} - a float
     */
    nextDouble: function() {
      var vv = this.random();
      return vv;
    },

    /**
     * Returns the next pseudo random number from this random number generator sequence.
     * The distribution of the random numbers is gaussian, with a mean =0  and standard deviation = 1
     * This random number is not seeded
     * @public
     * @returns {number}
     * // TODO: Seed this
     */
    nextGaussian: function() {
      return Util.boxMullerTransform( 0, 1 );
    }
  };

  return Random;
} );