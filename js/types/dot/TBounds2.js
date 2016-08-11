// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );

  // constants
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  var TBounds2 = function( bounds2, phetioID ) {
    assert && assert( !!bounds2, 'bounds should exist' );
    TObject.call( this, bounds2, phetioID );
    assert && assert( bounds2 instanceof phet.dot.Bounds2 );
  };

  phetioInherit( TObject, 'TBounds2', TBounds2, {}, {
    documentation: 'a 2-dimensional bounds rectangle',

    fromStateObject: function( stateObject ) {
      return new phet.dot.Bounds2(
        stateObject.minX, stateObject.minY,
        stateObject.maxX, stateObject.maxY
      );
    },

    toStateObject: function( instance ) {
      return {
        minX: instance.minX,
        minY: instance.minY,

        maxX: instance.maxX,
        maxY: instance.maxY
      };
    }
  } );

  phetioNamespace.register( 'TBounds2', TBounds2 );

  return TBounds2;
} );