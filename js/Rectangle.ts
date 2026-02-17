// Copyright 2013-2026, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area, with a convenience name and constructor. Totally functionally
 * equivalent to Bounds2, but with a different constructor.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import Bounds2 from './Bounds2.js';
import dot from './dot.js';

export default class Rectangle extends Bounds2 {

  public constructor( x: number, y: number, width: number, height: number ) {
    super( x, y, x + width, y + height );
  }
}

dot.register( 'Rectangle', Rectangle );
