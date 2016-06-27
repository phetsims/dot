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
   *
   * @param [Object] options
   * @constructor
   */
  function Random( options ) {
    options = _.extend( {

      // {Tandem} for deterministic playback in randomized sims
      tandem: null,

      // {number|null} seed for the random number generator.
      //               when seed is null, Math.random() is used
      seed: null,

      // {boolean} if true, use the seed specified statically in the preloads for replicable playback in phet-io
      // this is a convenience option since it will be a common occurrence to use the replicable playback seed
      // if staticSeed and seed are both specified, there will be an assertion error.
      staticSeed: false

    }, options );

    // The tandem is required when brand==='phet-io'
    // Like Tandem.validateOptions, but without depending on tandem
    assert && phet && phet.chipper && phet.chipper.brand && phet.chipper.brand === 'phet-io' && assert( options.tandem,
      'When running as PhET-iO, a tandem must be specified for each user interface component' );

    if ( options.seed !== null && options.staticSeed ) {
      assert && assert( false, 'cannot specify seed and useChipperSeed, use one or the other' );
    }

    var seed = options.staticSeed ? window.phet.chipper.randomSeed : options.seed;
    this.setSeed( seed );

    options.tandem && options.tandem.addInstance( this );
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