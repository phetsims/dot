// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Vector2
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import dot from './dot.js';
import Vector2 from './Vector2.js';

const Vector2IO = new IOType( 'Vector2IO', {
  valueType: Vector2,
  documentation: 'A numerical object with x and y properties, like {x:3,y:4}',
  toStateObject: vector2 => vector2.toStateObject(),
  fromStateObject: Vector2.fromStateObject
} );

dot.register( 'Vector2IO', Vector2IO );
export default Vector2IO;