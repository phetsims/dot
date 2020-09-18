// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Vector3
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import dot from './dot.js';
import Vector3 from './Vector3.js';

const Vector3IO = new IOType( 'Vector3IO', {
  valueType: Vector3,
  documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',
  toStateObject: vector3 => vector3.toStateObject(),
  fromStateObject: Vector3.fromStateObject
} );

dot.register( 'Vector3IO', Vector3IO );
export default Vector3IO;