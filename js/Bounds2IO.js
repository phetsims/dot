// Copyright 2016, University of Colorado Boulder

/**
 * IO Type for Bounds2
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var dot = require( 'DOT/dot' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Bounds2} bounds2
   * @param {string} phetioID
   * @constructor
   */
  function Bounds2IO( bounds2, phetioID ) {
    ObjectIO.call( this, bounds2, phetioID );
  }

  phetioInherit( ObjectIO, 'Bounds2IO', Bounds2IO, {}, {
    documentation: 'a 2-dimensional bounds rectangle',
    validator: { valueType: Bounds2 },

    /**
     * Encodes a Bounds2 instance to a state.
     * @param {Bounds2} bounds2
     * @returns {Object}
     * @override
     */
    toStateObject: function( bounds2 ) {
      validate( bounds2, this.validator );
      return {
        minX: bounds2.minX,
        minY: bounds2.minY,

        maxX: bounds2.maxX,
        maxY: bounds2.maxY
      };
    },

    /**
     * Decodes a state into a Bounds2.
     * @param {Object} stateObject
     * @returns {Bounds2}
     * @override
     */
    fromStateObject: function( stateObject ) {
      return new Bounds2(
        stateObject.minX, stateObject.minY,
        stateObject.maxX, stateObject.maxY
      );
    }
  } );

  dot.register( 'Bounds2IO', Bounds2IO );

  return Bounds2IO;
} );