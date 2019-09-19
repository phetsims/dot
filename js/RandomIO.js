// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Random
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const dot = require( 'DOT/dot' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const Random = require( 'DOT/Random' );

  class RandomIO extends ObjectIO {}

  RandomIO.documentation = 'Generates pseudorandom values';
  RandomIO.validator = { valueType: Random };
  RandomIO.typeName = 'RandomIO';
  ObjectIO.validateSubtype( RandomIO );

  return dot.register( 'RandomIO', RandomIO );
} );