// Copyright 2017, University of Colorado Boulder

/**
 * Unit tests for dot. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  require( 'DOT/BinPackerTests' );
  require( 'DOT/Bounds2Tests' );
  require( 'DOT/ComplexTests' );
  require( 'DOT/DampedHarmonicTests' );
  require( 'DOT/Matrix3Tests' );
  require( 'DOT/MatrixOps3Tests' );
  require( 'DOT/UtilTests' );

  // Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
  QUnit.start();
} );