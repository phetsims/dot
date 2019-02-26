// Copyright 2016, University of Colorado Boulder

/**
 * IO Type for Bounds3
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds3 = require( 'DOT/Bounds3' );
  var dot = require( 'DOT/dot' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Bounds3} bounds3
   * @param {string} phetioID
   * @constructor
   */
  function Bounds3IO( bounds3, phetioID ) {
    ObjectIO.call( this, bounds3, phetioID );
  }

  phetioInherit( ObjectIO, 'Bounds3IO', Bounds3IO, {}, {
    documentation: 'a 3-dimensional bounds (bounding box)',
    validator: { valueType: Bounds3 },

    /**
     * Encodes a Bounds3 instance to a state.
     * @param {Bounds3} bounds3
     * @returns {Object}
     * @override
     */
    toStateObject: function( bounds3 ) {
      validate( bounds3, this.validator );
      return {
        minX: bounds3.minX,
        minY: bounds3.minY,
        minZ: bounds3.minZ,

        maxX: bounds3.maxX,
        maxY: bounds3.maxY,
        maxZ: bounds3.maxZ
      };
    },

    /**
     * Decodes a state into a Bounds3.
     * @param {Object} stateObject
     * @returns {Bounds3}
     * @override
     */
    fromStateObject: function( stateObject ) {
      return new Bounds3(
        stateObject.minX, stateObject.minY, stateObject.minZ,
        stateObject.maxX, stateObject.maxY, stateObject.maxZ
      );
    }
  } );

  dot.register( 'Bounds3IO', Bounds3IO );

  return Bounds3IO;
} );

