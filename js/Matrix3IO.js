// Copyright 2019, University of Colorado Boulder

/**
 * IO type for Matrix3
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const dot = require( 'DOT/dot' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const validate = require( 'AXON/validate' );

  class Matrix3IO extends ObjectIO {

    /**
     * Encodes a Matrix3 instance to a state.
     * @param {Matrix3} matrix3
     * @returns {Object}
     */
    static toStateObject( matrix3 ) {
      validate( matrix3, this.validator );
      return Matrix3.toStateObject( matrix3 );
    }

    /**
     * Decodes a state into a Matrix3.
     * @param {Object} stateObject
     * @returns {Matrix3}
     */
    static fromStateObject( stateObject ) {
      return Matrix3.fromStateObject( stateObject );
    }
  }

  Matrix3IO.documentation = 'A 3x3 matrix often used for holding transform data.';
  Matrix3IO.validator = { valueType: Matrix3 };
  Matrix3IO.typeName = 'Matrix3IO';
  ObjectIO.validateSubtype( Matrix3IO );

  return dot.register( 'Matrix3IO', Matrix3IO );
} );