// Copyright 2017-2019, University of Colorado Boulder

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
  var validate = require( 'AXON/validate' );

  class Bounds3IO extends ObjectIO {


    /**
     * Encodes a Bounds3 instance to a state.
     * @param {Bounds3} bounds3
     * @returns {Object}
     * @override
     */
    static toStateObject( bounds3 ) {
      validate( bounds3, this.validator );
      return {
        minX: bounds3.minX,
        minY: bounds3.minY,
        minZ: bounds3.minZ,

        maxX: bounds3.maxX,
        maxY: bounds3.maxY,
        maxZ: bounds3.maxZ
      };
    }

    /**
     * Decodes a state into a Bounds3.
     * @param {Object} stateObject
     * @returns {Bounds3}
     * @override
     */
    static fromStateObject( stateObject ) {
      return new Bounds3(
        stateObject.minX, stateObject.minY, stateObject.minZ,
        stateObject.maxX, stateObject.maxY, stateObject.maxZ
      );
    }
  }

  Bounds3IO.documentation = 'a 3-dimensional bounds (bounding box)';
  Bounds3IO.validator = { valueType: Bounds3 };
  Bounds3IO.typeName = 'Bounds3IO';
  ObjectIO.validateSubtype( Bounds3IO );

  return dot.register( 'Bounds3IO', Bounds3IO );
} );

