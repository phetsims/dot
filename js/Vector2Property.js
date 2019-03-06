// Copyright 2019, University of Colorado Boulder

/**
 * Convenience subtype of Property that takes only Vector2 values (no null values)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const dot = require( 'DOT/dot' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2IO = require( 'DOT/Vector2IO' );

  class Vector2Property extends Property {

    /**
     * @param {Vector2} initialValue
     * @param {Object} [options]
     */
    constructor( initialValue, options ) {
      super( initialValue, _.extend( {
        valueType: Vector2,
        phetioType: PropertyIO( Vector2IO )
      }, options ) );
    }
  }

  return dot.register( 'Vector2Property', Vector2Property );
} );