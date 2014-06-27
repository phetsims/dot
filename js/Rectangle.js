// Copyright 2002-2014, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area, with a convenience name and constructor. Totally functionally
 * equivalent to Bounds2, but with a different constructor.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );

  dot.Rectangle = function Rectangle( x, y, width, height ) {
    assert && assert( height !== undefined, 'Rectangle requires 4 parameters' );
    Bounds2.call( this, x, y, x + width, y + height );
  };
  var Rectangle = dot.Rectangle;

  inherit( Bounds2, Rectangle );

  return Rectangle;
} );
