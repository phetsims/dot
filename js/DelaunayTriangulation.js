// Copyright 2015, University of Colorado Boulder

/**
 * Handles constrained Delaunay triangulation based on "Sweep-line algorithm for constrained Delaunay triangulation"
 * by Domiter and Zalik (2008).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @public
   * @constructor
   *
   * @param {Array.<Vector2>} points
   * @param {Array.<Array.<number>>} constraints - Pairs of indices into the points that should be treated as
   *                                               constrained edges.
   * @param {Object} [options]
   */
  function DelaunayTriangulation( points, constraints, options ) {
    options = _.extend( {

    }, options );

    var i;

    // @public {Array.<Vector2>}
    this.points = points;

    // @public {Array.<Array.<number>>}
    this.constraints = constraints;
    // TODO: record constraints in the Vertex objects

    // @public {Array.<Triangle>}
    this.triangles = [];

    // @public {Array.<Edge>}
    this.edges = [];

    if ( points.length === 0 ) {
      return;
    }

    // @private {Array.<Vector2>}
    this.vertices = points.map( function( point, index ) {
      return new Vertex( point, index );
    } );
    this.vertices.sort( DelaunayTriangulation.vertexComparison );

    var bounds = Bounds2.NOTHING.copy();
    for ( i = points.length - 1; i >= 0; i-- ) {
      bounds.addPoint( points[ i ] );
    }

    var alpha = 0.4;
    // @private {Vertex} - Fake index -1
    this.artificialMinVertex = new Vertex( new Vector2( bounds.minX - bounds.width * alpha, bounds.minY - bounds.height * alpha ), -1 );
    // @private {Vertex} - Fake index -2
    this.artificialMaxVertex = new Vertex( new Vector2( bounds.maxX + bounds.width * alpha, bounds.minY - bounds.height * alpha ), -2 );

    this.edges.push( new Edge( this.artificialMinVertex, this.artificialMaxVertex ) );
    this.edges.push( new Edge( this.artificialMaxVertex, this.vertices[ 0 ] ) );
    this.edges.push( new Edge( this.vertices[ 0 ], this.artificialMinVertex ) );

    // Set up our first (artificial) triangle.
    this.triangles.push( new Triangle( this.edges[ 0 ], this.edges[ 1 ], this.edges[ 2 ] ) );

    // @private {Edge} - The start of our front (the edges at the front of the sweep-line)
    this.firstFrontEdge = this.edges[ 1 ];
    this.edges[ 1 ].appendEdge( this.edges[ 2 ] );

    // @private {Edge} - The start of our hull (the edges at the back, making up the convex hull)
    this.firstHullEdge = this.edges[ 0 ];
  }

  dot.register( 'DelaunayTriangulation', DelaunayTriangulation );

  inherit( Object, DelaunayTriangulation, {

  }, {
    /**
     * Comparison for sorting points by y, then by x.
     * @private
     *
     * TODO: Do we need to reverse the x sort? "If our edge is horizontal, the ending point with smaller x coordinate
     *       is considered as the upper point"?
     *
     * @param {Vertex} a
     * @param {Vertex} b
     * @returns {number}
     */
    vertexComparison: function( a, b ) {
      assert && assert( a instanceof Vertex );
      assert && assert( b instanceof Vertex );

      a = a.point;
      b = b.point;
      if ( a.y < b.y ) {
        return -1;
      }
      else if ( a.y > b.y ) {
        return 1;
      }
      else if ( a.x < b.x ) {
        return -1;
      }
      else if ( a.x > b.x ) {
        return 1;
      }
      else {
        // NOTE: How would the algorithm work if this is the case? Would the comparison ever test the reflexive
        // property?
        return 0;
      }
    }
  } );

  /**
   * Vertex (point with an index)
   * @private
   * @constructor
   *
   * @param {Vector2} point
   * @param {number} index - Index of the point in the points array
   */
  function Vertex( point, index ) {
    assert && assert( point instanceof Vector2 );
    assert && assert( point.isFinite() );
    assert && assert( typeof index === 'number' );

    // @public {Vector2}
    this.point = point;

    // @public {number}
    this.index = index;
  }

  inherit( Object, Vertex, {
    /**
     * Returns whether this is an artificial vertex (index less than zero).
     * @public
     *
     * @returns {boolean}
     */
    isArtificial: function() {
      return this.index < 0;
    }
  } );

  /**
   * Edge defined by two vertices
   * @private
   * @constructor
   *
   * @param {Vertex} startVertex
   * @param {Vertex} endVertex
   */
  function Edge( startVertex, endVertex ) {
    assert && assert( startVertex instanceof Vertex );
    assert && assert( endVertex instanceof Vertex );

    // @public {Vertex}
    this.startVertex = startVertex;
    this.endVertex = endVertex;

    // @public {Triangle|null} - Adjacent triangles to the edge
    this.insideTriangle = null;
    this.outsideTriangle = null;

    // @public {Edge|null} - Linked list for the front of the sweep-line (or in the back for the convex hull)
    this.nextEdge = null;
  }

  inherit( Object, Edge, {
    /**
     * Appends the edge to the end of this edge (for our linked list).
     * @public
     *
     * @param {Edge} edge
     */
    appendEdge: function( edge ) {
      assert && assert( edge instanceof Edge );
      assert && assert( this.endVertex === edge.startVertex );

      this.nextEdge = edge;
    }
  } );

  /**
   * Triangle defined by three edges
   * @private
   * @constructor
   *
   * @param {Edge} aEdge
   * @param {Edge} bEdge
   * @param {Edge} cEdge
   */
  function Triangle( aEdge, bEdge, cEdge ) {
    assert && assert( aEdge instanceof Edge );
    assert && assert( bEdge instanceof Edge );
    assert && assert( cEdge instanceof Edge );

    // Ensure the points are connected in the expected order
    assert && assert( aEdge.endVertex === bEdge.startVertex );
    assert && assert( bEdge.endVertex === cEdge.startVertex );
    assert && assert( cEdge.endVertex === aEdge.startVertex );
    assert && assert( Util.triangleAreaSigned( aEdge.startVertex.point, bEdge.startVertex.point, cEdge.startVertex.point ) > 0,
      'Should be counterclockwise' );

    // @public {Edge}
    this.aEdge = aEdge;
    this.bEdge = bEdge;
    this.cEdge = cEdge;

    this.aEdge.insideTriangle = this;
    this.bEdge.insideTriangle = this;
    this.cEdge.insideTriangle = this;
  }

  inherit( Object, Triangle, {
    /**
     * Returns whether this is an artificial triangle (has an artificial vertex)
     * @public
     *
     * @returns {boolean}
     */
    isArtificial: function() {
      return this.aEdge.startVertex.isArtificial() ||
             this.bEdge.startVertex.isArtificial() ||
             this.cEdge.startVertex.isArtificial();
    }
  } );

  return DelaunayTriangulation;
} );
