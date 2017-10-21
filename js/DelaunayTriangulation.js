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
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
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

    // @private {Array.<Vertex>}
    this.vertices = points.map( function( point, index ) {
      return new Vertex( point, index );
    } );
    this.vertices.sort( DelaunayTriangulation.vertexComparison );

    // @private {Array.<Vertex>} - Our initialization will handle our first vertex
    this.remainingVertices = this.vertices.slice( 1 );

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
    this.triangles.push( new Triangle( this.artificialMinVertex, this.artificialMaxVertex, this.vertices[ 0 ],
                         this.edges[ 1 ], this.edges[ 2 ], this.edges[ 0 ] ) );

    // @private {Edge} - The start of our front (the edges at the front of the sweep-line)
    this.firstFrontEdge = this.edges[ 1 ];
    this.edges[ 1 ].connectAfter( this.edges[ 2 ] );

    // @private {Edge} - The start of our hull (the edges at the back, making up the convex hull)
    this.firstHullEdge = this.edges[ 0 ];
  }

  dot.register( 'DelaunayTriangulation', DelaunayTriangulation );

  inherit( Object, DelaunayTriangulation, {
    /**
     * Moves the triangulation forward by a vertex.
     * @private
     */
    step: function() {
      // TODO: reverse the array prior to this?
      var vertex = this.remainingVertices.shift();

      var x = vertex.point.x;

      var frontEdge = this.firstFrontEdge;
      while ( frontEdge ) {
        // TODO: epsilon needed here?
        if ( x > frontEdge.endVertex.point.x ) {
          var edge1 = new Edge( frontEdge.startVertex, vertex );
          var edge2 = new Edge( vertex, frontEdge.endVertex );
          edge1.connectAfter( edge2 );
          this.edges.push( edge1 );
          this.edges.push( edge2 );
          this.triangles.push( new Triangle( frontEdge.endVertex, frontEdge.startVertex, vertex,
                                             edge1, edge2, frontEdge ) );
          var previousEdge = frontEdge.previousEdge;
          var nextEdge = frontEdge.nextEdge;
          if ( previousEdge ) {
            previousEdge.disconnectAfter();
            previousEdge.connectAfter( edge1 );
          }
          else {
            this.firstFrontEdge = edge1;
          }
          if ( nextEdge ) {
            frontEdge.disconnectAfter();
            edge2.connectAfter( nextEdge );
          }
          this.legalizeEdge( frontEdge );
          return;
        }
        else if ( x === frontEdge.endVertex.x ) {
          // TODO: remember to legalize?
          throw new Error( 'Left case unimplemented so far' );
        }
        frontEdge = frontEdge.nextEdge;
      }

      throw new Error( 'Did not find matching front edge?' );
    },

    /**
     * Checks an edge to see whether its two adjacent triangles satisfy the delaunay condition (the far point of one
     * triangle should not be contained in the other triangle's circumcircle), and if it is not satisfied, flips the
     * edge so the condition is satisfied.
     * @private
     *
     * @param {Edge} edge
     */
    legalizeEdge: function( edge ) {
      assert && assert( edge.triangles.length === 2 );

      var triangle1 = edge.triangles[ 0 ];
      var triangle2 = edge.triangles[ 1 ];

      var farVertex1 = triangle1.getVertexOppositeFromEdge( edge );
      var farVertex2 = triangle2.getVertexOppositeFromEdge( edge );

      if ( Util.pointInCircleFromPoints( triangle1.aVertex.point, triangle1.bVertex.point, triangle1.cVertex.point, farVertex2.point ) ||
           Util.pointInCircleFromPoints( triangle2.aVertex.point, triangle2.bVertex.point, triangle2.cVertex.point, farVertex1.point ) ) {
        // TODO: better helper functions for adding/removing triangles (takes care of the edge stuff)
        triangle1.remove();
        triangle2.remove();
        arrayRemove( this.triangles, triangle1 );
        arrayRemove( this.triangles, triangle2 );
        arrayRemove( this.edges, edge );

        var newEdge = new Edge( farVertex1, farVertex2 );
        this.edges.push( newEdge );

        // Construct the new triangles with the correct orientations
        this.triangles.push( new Triangle( farVertex1, farVertex2, triangle1.getVertexBefore( farVertex1 ),
                                           triangle2.getEdgeOppositeFromVertex( triangle2.getVertexBefore( farVertex2 ) ),
                                           triangle1.getEdgeOppositeFromVertex( triangle1.getVertexAfter( farVertex1 ) ),
                                           newEdge ) );
        this.triangles.push( new Triangle( farVertex2, farVertex1, triangle2.getVertexBefore( farVertex2 ),
                                           triangle1.getEdgeOppositeFromVertex( triangle1.getVertexBefore( farVertex1 ) ),
                                           triangle2.getEdgeOppositeFromVertex( triangle2.getVertexAfter( farVertex2 ) ),
                                           newEdge ) );
      }
    }
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
    assert && assert( startVertex !== endVertex, 'Should be different vertices' );

    // @public {Vertex}
    this.startVertex = startVertex;
    this.endVertex = endVertex;

    // @public {Array.<Triangle>} - Adjacent triangles to the edge
    this.triangles = [];

    // @public {Edge|null} - Linked list for the front of the sweep-line (or in the back for the convex hull)
    this.nextEdge = null;
    this.previousEdge = null;
  }

  inherit( Object, Edge, {
    /**
     * Appends the edge to the end of this edge (for our linked list).
     * @public
     *
     * @param {Edge} edge
     */
    connectAfter: function( edge ) {
      assert && assert( edge instanceof Edge );
      assert && assert( this.endVertex === edge.startVertex );

      this.nextEdge = edge;
      edge.previousEdge = this;
    },

    // TODO: doc
    disconnectAfter: function()  {
      this.nextEdge.previousEdge = null;
      this.nextEdge = null;
    },

    /**
     * Adds an adjacent triangle.
     * @public
     *
     * @param {Triangle} triangle
     */
    addTriangle: function( triangle ) {
      assert && assert( triangle instanceof Triangle );
      assert && assert( this.triangles.length <= 1 );

      this.triangles.push( triangle );
    },

    /**
     * Removes an adjacent triangle.
     * @public
     *
     * @param {Triangle} triangle
     */
    removeTriangle: function( triangle ) {
      assert && assert( triangle instanceof Triangle );
      assert && assert( _.includes( this.triangles, triangle ) );

      arrayRemove( this.triangles, triangle );
    }
  } );

  /**
   * Triangle defined by three vertices (with edges)
   * @private
   * @constructor
   *
   * @param {Vertex} aVertex
   * @param {Vertex} bVertex
   * @param {Vertex} cVertex
   * @param {Edge} aEdge - Edge opposite the 'a' vertex
   * @param {Edge} bEdge - Edge opposite the 'b' vertex
   * @param {Edge} cEdge - Edge opposite the 'c' vertex
   */
  function Triangle( aVertex, bVertex, cVertex, aEdge, bEdge, cEdge ) {
    // Type checks
    assert && assert( aVertex instanceof Vertex );
    assert && assert( bVertex instanceof Vertex );
    assert && assert( cVertex instanceof Vertex );
    assert && assert( aEdge instanceof Edge );
    assert && assert( bEdge instanceof Edge );
    assert && assert( cEdge instanceof Edge );

    // Ensure each vertex is NOT in the opposite edge
    assert && assert( aVertex !== aEdge.startVertex && aVertex !== aEdge.endVertex, 'Should be an opposite edge' );
    assert && assert( bVertex !== bEdge.startVertex && bVertex !== bEdge.endVertex, 'Should be an opposite edge' );
    assert && assert( cVertex !== cEdge.startVertex && cVertex !== cEdge.endVertex, 'Should be an opposite edge' );

    // Ensure each vertex IS in its adjacent edges
    assert && assert( aVertex === bEdge.startVertex || aVertex === bEdge.endVertex, 'aVertex should be in bEdge' );
    assert && assert( aVertex === cEdge.startVertex || aVertex === cEdge.endVertex, 'aVertex should be in cEdge' );
    assert && assert( bVertex === aEdge.startVertex || bVertex === aEdge.endVertex, 'bVertex should be in aEdge' );
    assert && assert( bVertex === cEdge.startVertex || bVertex === cEdge.endVertex, 'bVertex should be in cEdge' );
    assert && assert( cVertex === aEdge.startVertex || cVertex === aEdge.endVertex, 'cVertex should be in aEdge' );
    assert && assert( cVertex === bEdge.startVertex || cVertex === bEdge.endVertex, 'cVertex should be in bEdge' );

    assert && assert( Util.triangleAreaSigned( aVertex.point, bVertex.point, cVertex.point ) > 0,
      'Should be counterclockwise' );

    // @public {Vertex}
    this.aVertex = aVertex;
    this.bVertex = bVertex;
    this.cVertex = cVertex;

    // @public {Edge}
    this.aEdge = aEdge;
    this.bEdge = bEdge;
    this.cEdge = cEdge;

    this.aEdge.addTriangle( this );
    this.bEdge.addTriangle( this );
    this.cEdge.addTriangle( this );
  }

  inherit( Object, Triangle, {
    /**
     * Returns the vertex that is opposite from the given edge.
     * @public
     *
     * @param {Edge} edge
     * @returns {Vertex}
     */
    getVertexOppositeFromEdge: function( edge ) {
      assert && assert( edge instanceof Edge );
      assert && assert( edge === this.aEdge || edge === this.bEdge || edge === this.cEdge,
        'Should be an edge that is part of this triangle' );

      if ( edge === this.aEdge ) {
        return this.aVertex;
      }
      else if ( edge === this.bEdge ) {
        return this.bVertex;
      }
      else {
        return this.cVertex;
      }
    },

    /**
     * Returns the edge that is opposite from the given vertex.
     * @public
     *
     * @param {Vertex} vertex
     * @returns {Edge}
     */
    getEdgeOppositeFromVertex: function( vertex ) {
      assert && assert( vertex instanceof Vertex );
      assert && assert( vertex === this.aVertex || vertex === this.bVertex || vertex === this.cVertex,
        'Should be a vertex that is part of this triangle' );

      if ( vertex === this.aVertex ) {
        return this.aEdge;
      }
      else if ( vertex === this.bVertex ) {
        return this.bEdge;
      }
      else {
        return this.cEdge;
      }
    },

    /**
     * Returns the vertex that is just before the given vertex (in counterclockwise order).
     * @public
     *
     * @param {Vertex} vertex
     * @returns {Vertex}
     */
    getVertexBefore: function( vertex ) {
      assert && assert( vertex instanceof Vertex );
      assert && assert( vertex === this.aVertex || vertex === this.bVertex || vertex === this.cVertex );

      if ( vertex === this.aVertex ) {
        return this.cVertex;
      }
      else if ( vertex === this.bVertex ) {
        return this.aVertex;
      }
      else {
        return this.bVertex;
      }
    },

    /**
     * Returns the vertex that is just after the given vertex (in counterclockwise order).
     * @public
     *
     * @param {Vertex} vertex
     * @returns {Vertex}
     */
    getVertexAfter: function( vertex ) {
      assert && assert( vertex instanceof Vertex );
      assert && assert( vertex === this.aVertex || vertex === this.bVertex || vertex === this.cVertex );

      if ( vertex === this.aVertex ) {
        return this.bVertex;
      }
      else if ( vertex === this.bVertex ) {
        return this.cVertex;
      }
      else {
        return this.aVertex;
      }
    },

    /**
     * Returns whether this is an artificial triangle (has an artificial vertex)
     * @public
     *
     * @returns {boolean}
     */
    isArtificial: function() {
      return this.aVertex.isArtificial() || this.bVertex.isArtificial() || this.cVertex.isArtificial();
    },

    // TODO: doc
    remove: function() {
      this.aEdge.removeTriangle( this );
      this.bEdge.removeTriangle( this );
      this.cEdge.removeTriangle( this );
    }
  } );

  return DelaunayTriangulation;
} );
