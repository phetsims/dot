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

    if ( options.seed !== null && options.staticSeed ) {
      assert && assert( false, 'cannot specify seed and useChipperSeed, use one or the other' );
    }

    var seed = options.staticSeed ? window.phet.chipper.randomSeed : options.seed;
    this.setSeed( seed );
  }

  dot.register( 'Random', Random );

  Random.prototype = {

    constructor: Random,

    /**
     * Re-seed the random number generator, or null to use Math.random()
     * @param seed
     */
    setSeed: function( seed ) {
      this.seed = seed;

      // Use "new" to create a local prng without altering Math.random.
      this.seedrandom = this.seed !== null ? new Math.seedrandom( this.seed + '' ) : null;
    },

    getSeed: function() {
      return this.seed;
    },

    random: function() {
      return this.seed === null ? Math.random() : this.seedrandom();
    },

    nextBoolean: function() {
      return this.random() >= 0.5;
    },

    nextInt: function( n ) {
      var value = this.random() * n;
      return value | 0; // convert to int
    },

    nextDouble: function() {
      var vv = this.random();
      return vv;
    },

    /**
     * @public
     * @returns {number}
     * // TODO: Seed this
     */
    nextGaussian: function() {
      // random gaussian with mean = 0 and standard deviation = 1
      return Util.boxMullerTransform( 0, 1 );
    }
  };

  return Random;
} );