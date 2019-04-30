// Copyright 2015-2016, University of Colorado Boulder
/* eslint-disable bad-sim-text */ // Needs randomness, since this is the source of joist's randomness.

/**
 * Random number generator with an optional seed.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );

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

      // {number|null} seed for the random number generator.  When seed is null, Math.random() is used.
      seed: null,

      // {boolean} if true, use the seed specified statically in `phet.chipper.randomSeed`.  This value is declared
      // in initialize-globals.js and can be overriden by PhET-iO for reproducible playback (see PhetioEngineIO.setRandomSeed).
      staticSeed: false

    }, options );

    // If staticSeed and seed are both specified, there will be an assertion error.
    if ( options.seed !== null && options.staticSeed ) {
      assert && assert( false, 'cannot specify seed and staticSeed, use one or the other' );
    }

    var seed = options.staticSeed ? window.phet.chipper.randomSeed : options.seed;
    this.setSeed( seed );
  }

  inherit( Object, Random, {

    /**
     * Sets the seed of the random number generator. Setting it to null reverts the random generator to Math.random()
     * @param {number|null} seed
     */
    setSeed: function( seed ) {
      this.seed = seed;

      // If seed is provided, create a local random number generator without altering Math.random.
      this.seedrandom = this.seed !== null ? new Math.seedrandom( this.seed + '' ) : null;
    },

    /**
     * Returns the next pseudo-random boolean
     * @public
     * @returns {boolean}
     */
    nextBoolean: function() {
      return this.nextDouble() >= 0.5;
    },

    /**
     * Returns the next pseudo random number from this random number generator sequence.
     * The random number is an integer ranging from 0 to n-1.
     * @public
     * @param {number} n
     * @returns {number} - an integer
     */
    nextInt: function( n ) {
      var value = this.nextDouble() * n;
      return value | 0; // convert to int by removing the decimal places
    },

    /**
     * Randomly select a random integer between min and max (inclusive).
     *
     * @param {number} min - must be an integer
     * @param {number} max - must be an integer
     * @returns {number} an integer between min and max, inclusive
     */
    nextIntBetween: function( min, max ) {

      assert && assert( arguments.length === 2, 'nextIntBetween must have exactly 2 arguments' );
      assert && assert( Util.isInteger( min ), 'min must be an integer: ' + min );
      assert && assert( Util.isInteger( max ), 'max must be an integer: ' + max );

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
      var index = this.nextIntBetween( 0, array.length - 1 );
      return array[ index ];
    },

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.  Adapted from lodash-2.4.1 by
     * Sam Reid on Aug 16, 2016, See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @param {Array} array - the array which will be shuffled
     * @returns {Array} a new array with all the same elements in the passed-in array, in randomized order.
     */
    shuffle: function( array ) {
      assert && assert( array, 'Array should exist' );
      var self = this;
      var index = -1;
      var result = new Array( array.length );

      _.forEach( array, function( value ) {
        var rand = self.nextIntBetween( 0, ++index );
        result[ index ] = result[ rand ];
        result[ rand ] = value;
      } );
      return result;
    },

    /**
     * Returns the next pseudo random number from this random number generator sequence in the range [0, 1)
     * The distribution of the random numbers is uniformly distributed across the interval
     * @public
     * @returns {number} - the random number
     */
    nextDouble: function() {
      return this.seed === null ? Math.random() : this.seedrandom();
    },

    /**
     * Randomly selects a double in the range [min,max).
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    nextDoubleBetween: function ( min, max ) {
      assert && assert( min < max, 'min must be < max' );
      const value = min + this.nextDouble() * ( max - min );
      assert && assert( value >= min && value < max, `value out of range: ${value}` );
      return value;
    },

    /**
     * Returns the next gaussian-distributed random number from this random number generator sequence.
     * The distribution of the random numbers is gaussian, with a mean = 0 and standard deviation = 1
     * @public
     * @returns {number}
     */
    nextGaussian: function() {
      return Util.boxMullerTransform( 0, 1, this );
    }
  } );

  dot.register( 'Random', Random );

  return Random;
} );