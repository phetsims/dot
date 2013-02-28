
define( [
  'DOT/Bounds2',
  'DOT/CanvasTransform',
  'DOT/Dimension2',
  'DOT/LUDecomposition',
  'DOT/Matrix',
  'DOT/Matrix3',
  'DOT/Matrix4',
  'DOT/Permutation',
  'DOT/QRDecomposition',
  'DOT/Ray2',
  'DOT/Ray3',
  'DOT/SingularValueDecomposition',
  'DOT/TemporaryProperty',
  'DOT/Transform3',
  'DOT/Transform4',
  'DOT/Util',
  'DOT/Vector2',
  'DOT/Vector3',
  'DOT/Vector4'
  ], function(
    Bounds2,
    CanvasTransform,
    Dimension2,
    LUDecomposition,
    Matrix,
    Matrix3,
    Matrix4,
    Permutation,
    QRDecomposition,
    Ray2,
    Ray3,
    SingularValueDecomposition,
    TemporaryProperty,
    Transform3,
    Transform4,
    Util,
    Vector2,
    Vector3,
    Vector4
  ) {
  
  var dot = {
    Bounds2: Bounds2,
    CanvasTransform: CanvasTransform,
    Dimension2: Dimension2,
    LUDecomposition: LUDecomposition,
    Matrix: Matrix,
    Matrix3: Matrix3,
    Matrix4: Matrix4,
    Permutation: Permutation,
    QRDecomposition: QRDecomposition,
    Ray2: Ray2,
    Ray3: Ray3,
    SingularValueDecomposition: SingularValueDecomposition,
    TemporaryProperty: TemporaryProperty,
    Transform3: Transform3,
    Transform4: Transform4,
    Util: Util,
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    
    // utility functions
    isArray: Util.isArray,
    clamp: Util.clamp,
    rangeInclusive: Util.rangeInclusive,
    rangeExclusive: Util.rangeExclusive,
    toRadians: Util.toRadians,
    toDegrees: Util.toDegrees
  };
  
  return dot;
} );
