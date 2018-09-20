// Copyright 2013-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var Namespace = require( 'PHET_CORE/Namespace' );

  var dot = new Namespace( 'dot' );

  dot.register( 'v2', function( x, y ) { return new dot.Vector2( x, y ); } );
  dot.register( 'v3', function( x, y, z ) { return new dot.Vector3( x, y, z ); } );
  dot.register( 'v4', function( x, y, z, w ) { return new dot.Vector4( x, y, z, w ); } );

  // TODO: performance: check browser speed to compare how fast this is. We may need to add a 32 option for GL ES.
  dot.register( 'FastArray', window.Float64Array ? window.Float64Array : window.Array );

  // will be filled in by other modules
  return dot;
} );
