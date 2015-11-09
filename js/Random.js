// Copyright 2015, University of Colorado Boulder

/**
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aaron Davis
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var Util = require( 'DOT/Util' );
  var dot = require( 'DOT/dot' );

  function Random() {
  }
  dot.register( 'Random', Random );

  Random.prototype = {

    constructor: Random,

    nextBoolean: function() {
      return Math.random() >= 0.5;
    },

    nextInt: function( n ) {
      var value = Math.random() * n;
      return value | 0; // convert to int
    },

    nextDouble: function() {
      return Math.random();
    },

    /**
     * @public
     * @returns {number}
     */
    nextGaussian: function() {
      // random gaussian with mean = 0 and standard deviation = 1
      return Util.boxMullerTransform( 0, 1 );
    }

  };

  return Random;

} );