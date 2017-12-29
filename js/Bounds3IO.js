// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * IO type for phet/dot's Bounds3
   * @param {Bounds3} bounds3
   * @param {string} phetioID
   * @constructor
   */
  function Bounds3IO( bounds3, phetioID ) {
    assert && assertInstanceOf( bounds3, phet.dot.Bounds3 );
    ObjectIO.call( this, bounds3, phetioID );
  }

  phetioInherit( ObjectIO, 'Bounds3IO', Bounds3IO, {}, {
    documentation: 'a 3-dimensional bounds (bounding box)',

    /**
     * Decodes a state into a Bounds3.
     * @param {Object} stateObject
     * @returns {Bounds3}
     */
    fromStateObject: function( stateObject ) {
      return new phet.dot.Bounds3(
        stateObject.minX, stateObject.minY, stateObject.minZ,
        stateObject.maxX, stateObject.maxY, stateObject.maxZ
      );
    },

    /**
     * Encodes a Bounds3 instance to a state.
     * @param {Bounds3} bounds3
     * @returns {Object}
     */
    toStateObject: function( bounds3 ) {
      assert && assertInstanceOf( bounds3, phet.dot.Bounds3 );
      return {
        minX: bounds3.minX,
        minY: bounds3.minY,
        minZ: bounds3.minZ,

        maxX: bounds3.maxX,
        maxY: bounds3.maxY,
        maxZ: bounds3.maxZ
      };
    }
  } );

  dot.register( 'Bounds3IO', Bounds3IO );

  return Bounds3IO;
} );

