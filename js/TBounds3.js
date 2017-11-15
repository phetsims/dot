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
   * Wrapper type for phet/dot's Bounds3
   * @param bounds3
   * @param phetioID
   * @constructor
   */
  function TBounds3( bounds3, phetioID ) {
    assert && assertInstanceOf( bounds3, phet.dot.Bounds3 );
    ObjectIO.call( this, bounds3, phetioID );
  }

  phetioInherit( ObjectIO, 'TBounds3', TBounds3, {}, {
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
     * @param {Bounds3} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return {
        minX: instance.minX,
        minY: instance.minY,
        minZ: instance.minZ,

        maxX: instance.maxX,
        maxY: instance.maxY,
        maxZ: instance.maxZ
      };
    }
  } );

  dot.register( 'TBounds3', TBounds3 );

  return TBounds3;
} );

