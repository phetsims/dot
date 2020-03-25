// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Vector2
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../axon/js/validate.js';
import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import dot from './dot.js';
import Vector2 from './Vector2.js';

class Vector2IO extends ObjectIO {

  /**
   * Encodes a Vector2 instance to a state.
   * @param {Vector2} vector2
   * @returns {Object}
   * @public
   */
  static toStateObject( vector2 ) {
    validate( vector2, this.validator );
    return vector2.toStateObject();
  }

  /**
   * Decodes a state into a Vector2.
   * @param {Object} stateObject
   * @returns {Vector2}
   * @public
   */
  static fromStateObject( stateObject ) {
    return Vector2.fromStateObject( stateObject );
  }
}

Vector2IO.documentation = 'A numerical object with x and y properties, like {x:3,y:4}';
Vector2IO.validator = { valueType: Vector2 };
Vector2IO.typeName = 'Vector2IO';
ObjectIO.validateSubtype( Vector2IO );

dot.register( 'Vector2IO', Vector2IO );
export default Vector2IO;