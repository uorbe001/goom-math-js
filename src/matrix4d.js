var Vector3D = require("./vector3d"), Quaternion = require("./quaternion"), Matrix3D = require("./matrix3d");

/**
	Creates a new Matrix4D, used through the engine to feed data to the vertex and store
	transformation data.
	@class This is a 4x4 matrix.
	@property {data} [data=identity] the data in the matrix.
	@exports Matrix4D as Mathematics.Matrix4D
*/
function Matrix4D() {
	if (typeof Float32Array !== undefined && Float32Array !== null) {
		this.data = new Float32Array(16);
	} else {
		this.data = new Array(16);
	}

	this.makeIdentity();
}

/**
	Creates a copy of this matrix or sets the destination matrix to be a copy of this matrix.
	@returns {Mathematics.Matrix4D} Copy of this matrix.
	@param {Mathematics.Matrix4D} [destination] The matrix where data will be stored.
*/
Matrix4D.prototype.clone = function(destination) {
	if (destination === null || destination === undefined) destination = new Matrix4D();
	
	for (var i = 0; i <= 15; i++) {
		destination.data[i] = this.data[i];
	}
	return destination;
};

/**
	Sets this matrix data to the given data.
	@param {Array} data An array holding the new array data.
	@returns {Mathematics.Matrix4D} This matrix with the new data.
*/
Matrix4D.prototype.set = function(data) {
	for (var i = 0; i <= 15; i++) {
		this.data[i] = data[i];
	}
	
	return this;
};

/**
	Sets the diagonal of this matrix to the given values.
	@param {Number} a00 The value for the a00 element of the diagonal.
	@param {Number} a11 The value for the a11 element of the diagonal.
	@param {Number} a22 The value for the a22 element of the diagonal.
	@param {Number} a33 The value for the a33 element of the diagonal.
	@returns {Mathematics.Matrix4D} This matrix with the new data.
*/
Matrix4D.prototype.setDiagonal = function(a00, a11, a22, a33) {
	this.data[0] = a00;
	this.data[5] = a11;
	this.data[10] = a22;
	this.data[15] = a33;
	return this;
};

/**
	Makes this matrix the identity matrix.
	@returns {Mathematics.Matrix4D} This matrix as identity matrix.
*/
Matrix4D.prototype.makeIdentity = function() {
	for (var i = 0; i <= 15; i++) {
		this.data[i] = 0;
	}

	this.data[0] = this.data[5] = 1;
	this.data[10] = this.data[15] = 1;
	return this;
};

/**
	Makes this matrix the translation matrix.
	@param {Number} x The value in the x coordinate axis to translate by.
	@param {Number} y The value in the y coordinate axis to translate by.
	@param {Number} z The value in the z coordinate axis to translate by.
	@returns {Mathematics.Matrix4D} This matrix as a translation matrix.
	@see Matrix4D#translate
*/
Matrix4D.prototype.makeTranslation = function(x, y, z) {
	this.makeIdentity();
	this.data[12] = x;
	this.data[13] = y;
	this.data[14] = z;
	return this;
};

/**
	Translates the matrix, if destination matrix is given, it will store the
	values in it, otherwise values will be stored in the same matrix.
	@param {Number} x The value in the x coordinate axis to translate by.
	@param {Number} y The value in the y coordinate axis to translate by.
	@param {Number} z The value in the z coordinate axis to translate by.
	@param {Mathematics.Matrix4D} [destination=this] The matrix where data will be stored.
	@returns {Mathematics.Matrix4D} This matrix as a translation matrix or destination if
	destination was given.
*/
Matrix4D.prototype.translate = function(x, y, z, destination) {
	if (destination === null || destination === undefined) destination = this;

	for (var i = 0; i <= 11; i++) {
		destination.data[i] = this.data[i];
	}

	destination.data[12] = this.data[0] * x + this.data[4] * y + this.data[8] * z + this.data[12];
	destination.data[13] = this.data[1] * x + this.data[5] * y + this.data[9] * z + this.data[13];
	destination.data[14] = this.data[2] * x + this.data[6] * y + this.data[10] * z + this.data[14];
	destination.data[15] = this.data[3] * x + this.data[7] * y + this.data[11] * z + this.data[15];
	return destination;
};

/**
	Makes this matrix the scale matrix.
	@param {Number} x The value in the x coordinate axis to scale by.
	@param {Number} y The value in the y coordinate axis to scale by.
	@param {Number} z The value in the z coordinate axis to scale by.
	@returns {Mathematics.Matrix4D} This matrix as a translation matrix.
	@see Matrix4D#scale
*/
Matrix4D.prototype.makeScale = function(x, y, z) {
	this.makeIdentity();
	this.data[0] = x;
	this.data[5] = y;
	this.data[10] = z;
	return this;
};

/**
	Scales the matrix, will store the data in itself and return itself unless
	destination is given.
	@param {Number} x The value in the x coordinate axis to scale by.
	@param {Number} y The value in the y coordinate axis to scale by.
	@param {Number} z The value in the z coordinate axis to scale by.
	@param {Mathematics.Matrix4D} destination The matrix where data will be stored.
	@returns {Mathematics.Matrix4D} This matrix as a translation matrix or destination if
	destination was given.
*/
Matrix4D.prototype.scale = function(x, y, z, destination) {
	if (destination === null || destination === undefined) destination = this;

	destination.data[0] = this.data[0] * x;
	destination.data[1] = this.data[1] * x;
	destination.data[2] = this.data[2] * x;
	destination.data[3] = this.data[3] * x;
	destination.data[4] = this.data[4] * y;
	destination.data[5] = this.data[5] * y;
	destination.data[6] = this.data[6] * y;
	destination.data[7] = this.data[7] * y;
	destination.data[8] = this.data[8] * z;
	destination.data[9] = this.data[9] * z;
	destination.data[10] = this.data[10] * z;
	destination.data[11] = this.data[11] * z;
	destination.data[12] = this.data[12];
	destination.data[13] = this.data[13];
	destination.data[14] = this.data[14];
	destination.data[15] = this.data[15];
	return destination;
};

/**
	Makes this matrix the rotation matrix, expecting a vector to rotate around and
	the radians to rotate by. Beware, for it will normalize the given vector.
	@param {Mathematics.Vector3D} vector The vector to rotate around.
	@param {Number} radians The ammount to rotate by.
	@return {Mathematics.Matrix4D} This matrix as a rotation matrix.
	@see Matrix4D#rotate
*/
Matrix4D.prototype.makeRotation = function(vector, radians) {
	this.makeIdentity();
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var one_minus_cos = 1 - cos;

	if (vector.magnitude() > 0) {
		vector.normalize();
		this.data[0] = (one_minus_cos * (vector.x * vector.x)) + cos;
		this.data[1] = (one_minus_cos * (vector.x * vector.y)) + (vector.z * sin);
		this.data[2] = (one_minus_cos * (vector.z * vector.x)) - (vector.y * sin);
		this.data[4] = (one_minus_cos * (vector.x * vector.y)) - (vector.z * sin);
		this.data[5] = (one_minus_cos * (vector.y * vector.y)) + cos;
		this.data[6] = (one_minus_cos * (vector.z * vector.y)) - (vector.x * sin);
		this.data[8] = (one_minus_cos * (vector.z * vector.x)) + (vector.y * sin);
		this.data[9] = (one_minus_cos * (vector.y * vector.z)) + (vector.x * sin);
		this.data[10] = (one_minus_cos * (vector.z * vector.z)) + cos;
	}
	return this;
};

/**
	Makes this matrix its own transpose and returns it.
	@param {Mathematics.Matrix4D} destination The matrix where data will be stored.
	@returns {Mathematics.Matrix4D} This matrix transposed.
*/
Matrix4D.prototype.transpose = function(destination) {
	if (destination === null || destination === undefined) destination = this;

	var tmp = this.data[1];
	destination.data[1] = this.data[4];
	destination.data[4] = tmp;
	tmp = this.data[2];
	destination.data[2] = this.data[8];
	destination.data[8] = tmp;
	tmp = this.data[3];
	destination.data[3] = this.data[12];
	destination.data[12] = tmp;
	tmp = this.data[6];
	destination.data[6] = this.data[9];
	destination.data[9] = tmp;
	tmp = this.data[7];
	destination.data[7] = this.data[13];
	destination.data[13] = tmp;
	tmp = this.data[11];
	destination.data[11] = this.data[14];
	destination.data[14] = tmp;
	return destination;
};

/**
	Makes this matrix a frustum matrix.
	@param {Number} left The left plane of the view frustum.
	@param {Number} right The right plane of the view frustum.
	@param {Number} bottom The bottom plane of the view frustum.
	@param {Number} top The top plane of the view frustum.
	@param {Number} near The near plane of the view frustum.
	@param {Number} far The far plane of the view frustum.
	@returns {Mathematics.Matrix4D} this matrix as a frustum matrix.
*/
Matrix4D.prototype.makeFrustum = function(left, right, bottom, top, near, far) {
	this.makeIdentity();

	var delta_x = right - left;
	var delta_y = top - bottom;
	var delta_z = far - near;
	var n2 = 2 * near;

	this.data[0] = n2 / delta_x;
	this.data[5] = n2 / delta_y;
	this.data[8] = (right + left) / delta_x;
	this.data[9] = (top + bottom) / delta_y;
	this.data[10] = -(far + near) / delta_z;
	this.data[11] = -1;
	this.data[14] = (-n2 * far) / delta_z;
	this.data[15] = 0;
	return this;
};

/**
	Makes this matrix the perspective projection matrix.
	@param {Number} field_of_view The field of view for perspective projection.
	@param {Number} near The near plane of the view frustum.
	@param {Number} far The far plane of the view frustum.
	@param {Number} aspect_ratio Aspect ratio of the canvas.
	@returns {Mathematics.Matrix4D} this matrix as a perspective projection matrix.
*/
Matrix4D.prototype.makePerspective = function(field_of_view, near, far, aspect_ratio) {
	var top = near * Math.tan(field_of_view * Math.PI / 360),
		right = top * aspect_ratio;
	return this.makeFrustum(-right, right, -top, top, near, far);
};

/**
	Makes this matrix the orthographic projection matrix.
	@param {Number} left The left plane of the view frustum.
	@param {Number} right The right plane of the view frustum.
	@param {Number} bottom The bottom plane of the view frustum.
	@param {Number} top The top plane of the view frustum.
	@param {Number} near The near plane of the view frustum.
	@param {Number} far The far plane of the view frustum.
	@returns {Mathematics.Matrix4D} this matrix as a orthographic projection matrix.
*/
Matrix4D.prototype.makeOrthographic = function(left, right, bottom, top, near, far) {
	var rl = (right - left);
	var tb = (top - bottom);
	var fn = (far - near);

	this.data[0] = 2 / rl;
	this.data[1] = 0;
	this.data[2] = 0;
	this.data[3] = 0;
	this.data[4] = 0;
	this.data[5] = 2 / tb;
	this.data[6] = 0;
	this.data[7] = 0;
	this.data[8] = 0;
	this.data[9] = 0;
	this.data[10] = -2 / fn;
	this.data[11] = 0;
	this.data[12] = -(left + right) / rl;
	this.data[13] = -(top + bottom) / tb;
	this.data[14] = -(far + near) / fn;
	this.data[15] = 1;
	return this;
};

/**
	Creates a matrix from a quaternion.
	@param {Mathematics.Quaternion} quaternion The quaternion to create this matrix from.
	@returns {Mathematics.Matrix4D} This matrix with data from the quaternion.
*/
Matrix4D.prototype.makeFromQuaternion = function(orientation) {
	this.data[0] = 1 - (2 * orientation.j * orientation.j + 2 * orientation.k * orientation.k);
	this.data[1] = 2 * orientation.i * orientation.j - 2 * orientation.k * orientation.r;
	this.data[2] = 2 * orientation.i * orientation.k + 2 * orientation.j * orientation.r;
	this.data[3] = 0;
	this.data[4] = 2 * orientation.i * orientation.j + 2 * orientation.k * orientation.r;
	this.data[5] = 1 - (2 * orientation.i * orientation.i + 2 * orientation.k * orientation.k);
	this.data[6] = 2 * orientation.j * orientation.k - 2 * orientation.i * orientation.r;
	this.data[7] = 0;
	this.data[8] = 2 * orientation.i * orientation.k - 2 * orientation.j * orientation.r;
	this.data[9] = 2 * orientation.j * orientation.k + 2 * orientation.i * orientation.r;
	this.data[10] = 1 - (2 * orientation.i * orientation.i + 2 * orientation.j * orientation.j);
	this.data[11] = 0;
	this.data[12] = this.data[13] = this.data[14] = 0;
	this.data[15] = 1;
	return this;
};

/**
	Creates a matrix from a position vector and orientation quaternion.
	@param {Mathematics.Vector3D} position The vector representing position.
	@param {Mathematics.Quaternion} orientation The quaternion representing orientation.
	@returns {Mathematics.Matrix4D} This matrix.
*/
Matrix4D.prototype.makeFromPositionAndOrientation = function(position, orientation) {
/*	this.data[0] = 1 - (2 * orientation.j * orientation.j + 2 * orientation.k * orientation.k);
	this.data[1] = 2 * orientation.i * orientation.j - 2 * orientation.k * orientation.r;
	this.data[2] = 2 * orientation.i * orientation.k + 2 * orientation.j * orientation.r;
	this.data[3] = 0;
	this.data[4] = 2 * orientation.i * orientation.j + 2 * orientation.k * orientation.r;
	this.data[5] = 1 - (2 * orientation.i * orientation.i + 2 * orientation.k * orientation.k);
	this.data[6] = 2 * orientation.j * orientation.k - 2 * orientation.i * orientation.r;
	this.data[7] = 0;
	this.data[8] = 2 * orientation.i * orientation.k - 2 * orientation.j * orientation.r;
	this.data[9] = 2 * orientation.j * orientation.k + 2 * orientation.i * orientation.r;
	this.data[10] = 1 - (2 * orientation.i * orientation.i + 2 * orientation.j * orientation.j);
	this.data[11] = 0;
	this.data[12] = position.x;
	this.data[13] = position.y;
	this.data[14] = position.z;
	this.data[15] = 1;
*/

	this.data[0] = 1 - (orientation.j * 2 * orientation.j + orientation.k * 2 * orientation.k);
	this.data[1] = (orientation.i * (orientation.j * 2)) + (orientation.r * (2 * orientation.k));
	this.data[2] = orientation.i * 2 * orientation.k - orientation.r * 2 * orientation.j;
	this.data[3] = 0;
	this.data[4] = orientation.i * 2 * orientation.j - orientation.r * 2 * orientation.k;
	this.data[5] = 1 - (orientation.i * 2 * orientation.i + orientation.k * 2 * orientation.k);
	this.data[6] = orientation.j * 2 * orientation.k + orientation.r * 2 * orientation.i;
	this.data[7] = 0;
	this.data[8] = orientation.i * 2 * orientation.k + orientation.r * 2 * orientation.j;
	this.data[9] = orientation.j * 2 * orientation.k - orientation.r * 2 * orientation.i;
	this.data[10] = 1 - (orientation.i * 2 * orientation.i + orientation.j * 2 * orientation.j);
	this.data[11] = 0;
	this.data[12] = position.x;
	this.data[13] = position.y;
	this.data[14] = position.z;
	this.data[15] = 1;
	return this;
};

/**
	Adds the given matrix to this matrix, if destination is given it will store
	the new matrix in destination and return it, otherwise it will store and
	return this matrix.
	@param {Mathematics.Matrix4D} matrix The matrix to compute with.
	@param {Mathematics.Matrix4D} destination The matrix where result is stored.
	@returns {Mathematics.Matrix4D} Result of the addition, this unless destination
	is given.
*/
Matrix4D.prototype.add = function(matrix, destination) {
	if (destination === null || destination === undefined) destination = this;

	for (var i = 0; i <= 15; i++) {
		destination.data[i] = this.data[i] + matrix.data[i];
	}

	return destination;
};

/**
	Multiplies given matrix to this matrix, ig destination is given it will store
	the new matrix in the destination matrix and return it, it will store and
	return this matrix otherwise.
	@param {Mathematics.Matrix4D} matrix The matrix to compute with.
	@param {Mathematics.Matrix4D} destination The matrix where result is stored.
	@returns {Mathematics.Matrix4D} Result of the multiplication, this unless destination
	is given.
*/
Matrix4D.prototype.multiply = function(matrix, destination) {
	if (destination === null || destination === undefined) destination = this;

	var a00 = (this.data[0 * 4 + 0] * matrix.data[0 * 4 + 0]) + (this.data[1 * 4 + 0] * matrix.data[0 * 4 + 1]) + (this.data[2 * 4 + 0] * matrix.data[0 * 4 + 2]) + (this.data[3 * 4 + 0] * matrix.data[0 * 4 + 3]);
	var a01 = (this.data[0 * 4 + 1] * matrix.data[0 * 4 + 0]) + (this.data[1 * 4 + 1] * matrix.data[0 * 4 + 1]) + (this.data[2 * 4 + 1] * matrix.data[0 * 4 + 2]) + (this.data[3 * 4 + 1] * matrix.data[0 * 4 + 3]);
	var a02 = (this.data[0 * 4 + 2] * matrix.data[0 * 4 + 0]) + (this.data[1 * 4 + 2] * matrix.data[0 * 4 + 1]) + (this.data[2 * 4 + 2] * matrix.data[0 * 4 + 2]) + (this.data[3 * 4 + 2] * matrix.data[0 * 4 + 3]);
	var a03 = (this.data[0 * 4 + 3] * matrix.data[0 * 4 + 0]) + (this.data[1 * 4 + 3] * matrix.data[0 * 4 + 1]) + (this.data[2 * 4 + 3] * matrix.data[0 * 4 + 2]) + (this.data[3 * 4 + 3] * matrix.data[0 * 4 + 3]);
	
	var a10 = (this.data[0 * 4 + 0] * matrix.data[1 * 4 + 0]) + (this.data[1 * 4 + 0] * matrix.data[1 * 4 + 1]) + (this.data[2 * 4 + 0] * matrix.data[1 * 4 + 2]) + (this.data[3 * 4 + 0] * matrix.data[1 * 4 + 3]);
	var a11 = (this.data[0 * 4 + 1] * matrix.data[1 * 4 + 0]) + (this.data[1 * 4 + 1] * matrix.data[1 * 4 + 1]) + (this.data[2 * 4 + 1] * matrix.data[1 * 4 + 2]) + (this.data[3 * 4 + 1] * matrix.data[1 * 4 + 3]);
	var a12 = (this.data[0 * 4 + 2] * matrix.data[1 * 4 + 0]) + (this.data[1 * 4 + 2] * matrix.data[1 * 4 + 1]) + (this.data[2 * 4 + 2] * matrix.data[1 * 4 + 2]) + (this.data[3 * 4 + 2] * matrix.data[1 * 4 + 3]);
	var a13 = (this.data[0 * 4 + 3] * matrix.data[1 * 4 + 0]) + (this.data[1 * 4 + 3] * matrix.data[1 * 4 + 1]) + (this.data[2 * 4 + 3] * matrix.data[1 * 4 + 2]) + (this.data[3 * 4 + 3] * matrix.data[1 * 4 + 3]);

	var a20 = (this.data[0 * 4 + 0] * matrix.data[2 * 4 + 0]) + (this.data[1 * 4 + 0] * matrix.data[2 * 4 + 1]) + (this.data[2 * 4 + 0] * matrix.data[2 * 4 + 2]) + (this.data[3 * 4 + 0] * matrix.data[2 * 4 + 3]);
	var a21 = (this.data[0 * 4 + 1] * matrix.data[2 * 4 + 0]) + (this.data[1 * 4 + 1] * matrix.data[2 * 4 + 1]) + (this.data[2 * 4 + 1] * matrix.data[2 * 4 + 2]) + (this.data[3 * 4 + 1] * matrix.data[2 * 4 + 3]);
	var a22 = (this.data[0 * 4 + 2] * matrix.data[2 * 4 + 0]) + (this.data[1 * 4 + 2] * matrix.data[2 * 4 + 1]) + (this.data[2 * 4 + 2] * matrix.data[2 * 4 + 2]) + (this.data[3 * 4 + 2] * matrix.data[2 * 4 + 3]);
	var a23 = (this.data[0 * 4 + 3] * matrix.data[2 * 4 + 0]) + (this.data[1 * 4 + 3] * matrix.data[2 * 4 + 1]) + (this.data[2 * 4 + 3] * matrix.data[2 * 4 + 2]) + (this.data[3 * 4 + 3] * matrix.data[2 * 4 + 3]);

	var a30 = (this.data[0 * 4 + 0] * matrix.data[3 * 4 + 0]) + (this.data[1 * 4 + 0] * matrix.data[3 * 4 + 1]) + (this.data[2 * 4 + 0] * matrix.data[3 * 4 + 2]) + (this.data[3 * 4 + 0] * matrix.data[3 * 4 + 3]);
	var a31 = (this.data[0 * 4 + 1] * matrix.data[3 * 4 + 0]) + (this.data[1 * 4 + 1] * matrix.data[3 * 4 + 1]) + (this.data[2 * 4 + 1] * matrix.data[3 * 4 + 2]) + (this.data[3 * 4 + 1] * matrix.data[3 * 4 + 3]);
	var a32 = (this.data[0 * 4 + 2] * matrix.data[3 * 4 + 0]) + (this.data[1 * 4 + 2] * matrix.data[3 * 4 + 1]) + (this.data[2 * 4 + 2] * matrix.data[3 * 4 + 2]) + (this.data[3 * 4 + 2] * matrix.data[3 * 4 + 3]);
	var a33 = (this.data[0 * 4 + 3] * matrix.data[3 * 4 + 0]) + (this.data[1 * 4 + 3] * matrix.data[3 * 4 + 1]) + (this.data[2 * 4 + 3] * matrix.data[3 * 4 + 2]) + (this.data[3 * 4 + 3] * matrix.data[3 * 4 + 3]);
	
	destination.data[0] = a00;
	destination.data[1] = a01;
	destination.data[2] = a02;
	destination.data[3] = a03;
	destination.data[4] = a10;
	destination.data[5] = a11;
	destination.data[6] = a12;
	destination.data[7] = a13;
	destination.data[8] = a20;
	destination.data[9] = a21;
	destination.data[10] = a22;
	destination.data[11] = a23;
	destination.data[12] = a30;
	destination.data[13] = a31;
	destination.data[14] = a32;
	destination.data[15] = a33;
	return destination;
};

/**
	Returns a vector representing the first three values in one of the matrix's columns.
	@param	{Number} index The column to return.
	@param {Mathematics.Vector3D} destination The vector where result is stored.
	@returns {Mathematics.Vector3D} Vector represeting the first three values in the column.
*/
Matrix4D.prototype.axisVector = function(index, destination) {
	if (destination === null || destination === undefined) destination = new Vector3D();
	return destination.set(this.data[index * 4], this.data[index * 4 + 1], this.data[index * 4 + 2]);
};

/**
	Transforms the given vector by this matrix.
	@param {Mathematics.Vector3D} vector The vector to be transformed by this matrix.
	@param {Mathematics.Vector3D} [destination] The vector where result is stored.
	@returns {Mathematics.Vector3D} The transformed vector.
*/
Matrix4D.prototype.transformVector = function(vector, destination) {
	if (destination === null || destination === undefined) destination = vector;
	var x = vector.x * this.data[0] + vector.y * this.data[4] + vector.z * this.data[8] + this.data[12];
	var y = vector.x * this.data[1] + vector.y * this.data[5] + vector.z * this.data[9] + this.data[13];
	destination.z = vector.x * this.data[2] + vector.y * this.data[6] + vector.z * this.data[10] + this.data[14];
	destination.x = x;
	destination.y = y;
	return destination;
};

/**
	Transforms the given vector by the transformational inverse of tis matrix.
	@note This function relies on the fact that the inverse of
	a pure rotation matrix is its transpose. It separates the
	translational and rotation components, transposes the
	rotation, and multiplies out. If the matrix is not a
	scale and shear free transform matrix, then this function
	will not give correct results.
	@param {Mathematics.Vector3D} vector The vector to be transformed by this matrix.
	@param {Mathematics.Vector3D} [destination] The vector where result is stored.
	@returns {Mathematics.Vector3D} The transformed vector.
*/
Matrix4D.prototype.transformInverseVector = function(vector, destination) {
	if (destination === null || destination === undefined) destination = vector;
	var data = this.data;
	var x = vector.x - data[12];
	var y = vector.y - data[13];
	var z = vector.z - data[14];
	destination.x = x * data[0] + y * data[1] + z * data[2];
	destination.y = x * data[4] + y * data[5] + z * data[6];
	destination.z = x * data[8] + y * data[9] + z * data[10];
	return destination;
};

/**
	Transforms the inertia tensor by the rotational elements in this matrix.
	@param {Mathematics.Matrix3D} matrix The matrix to transform by this matrix.
	@param {Mathematics.Matrix3D} [destination] The matrix where the updated data will be stored.
	@returns {Mathematics.Matrix3D} The transformed matrix.
*/
Matrix4D.prototype.transformInertiaTensor = function(matrix, destination) {
	if (destination === null || destination === undefined) destination = matrix;
	var data = this.data;
	var mat_data = matrix.data;

	var a00 = (data[0] * mat_data[0 * 3 + 0]) + (data[4] * mat_data[0 * 3 + 1]) + (data[8] * mat_data[0 * 3 + 2]);
	var a01 = (data[1] * mat_data[0 * 3 + 0]) + (data[5] * mat_data[0 * 3 + 1]) + (data[9] * mat_data[0 * 3 + 2]);
	var a02 = (data[2] * mat_data[0 * 3 + 0]) + (data[6] * mat_data[0 * 3 + 1]) + (data[10] * mat_data[0 * 3 + 2]);

	var a10 = (data[0] * mat_data[1 * 3 + 0]) + (data[4] * mat_data[1 * 3 + 1]) + (data[8] * mat_data[1 * 3 + 2]);
	var a11 = (data[1] * mat_data[1 * 3 + 0]) + (data[5] * mat_data[1 * 3 + 1]) + (data[9] * mat_data[1 * 3 + 2]);
	var a12 = (data[2] * mat_data[1 * 3 + 0]) + (data[6] * mat_data[1 * 3 + 1]) + (data[10] * mat_data[1 * 3 + 2]);

	var a20 = (data[0] * mat_data[2 * 3 + 0]) + (data[4] * mat_data[2 * 3 + 1]) + (data[8] * mat_data[2 * 3 + 2]);
	var a21 = (data[1] * mat_data[2 * 3 + 0]) + (data[5] * mat_data[2 * 3 + 1]) + (data[9] * mat_data[2 * 3 + 2]);
	var a22 = (data[2] * mat_data[2 * 3 + 0]) + (data[6] * mat_data[2 * 3 + 1]) + (data[10] * mat_data[2 * 3 + 2]);

	var b00 = data[0];
	var b01 = data[4];
	var b02 = data[8];
	var b10 = data[1];
	var b11 = data[5];
	var b12 = data[9];
	var b20 = data[2];
	var b21 = data[6];
	var b22 = data[10];

	destination.data[0] = (a00 * b00) + (a10 * b01) + (a20 * b02);
	destination.data[1] = (a01 * b00) + (a11 * b01) + (a21 * b02);
	destination.data[2] = (a02 * b00) + (a12 * b01) + (a22 * b02);
	destination.data[3] = (a00 * b10) + (a10 * b11) + (a20 * b12);
	destination.data[4] = (a01 * b10) + (a11 * b11) + (a21 * b12);
	destination.data[5] = (a02 * b10) + (a12 * b11) + (a22 * b12);
	destination.data[6] = (a00 * b20) + (a10 * b21) + (a20 * b22);
	destination.data[7] = (a01 * b20) + (a11 * b21) + (a21 * b22);
	destination.data[8] = (a02 * b20) + (a12 * b21) + (a22 * b22);
	return destination;
};

var __helperVector = new Vector3D();
var __helperVector2 = new Vector3D();

/**
	Makes this matrix a look-at matrix. Not optimized. TODO
	@param {Mathematics.Vector3D} eye Position of the camera
	@param {Mathematics.Vector3D} center Point to look at.
	@param {Mathematics.Vector3D} up Vector pointing "up"
	@returns {Mathematics.Matrix4D} this matrix as a look-at matrix.
*/
Matrix4D.prototype.makeLookAt = function (eye, center, up) {
	var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
		eyex = eye.x,
		eyey = eye.y,
		eyez = eye.z,
		upx = up.x,
		upy = up.y,
		upz = up.z,
		centerx = center.x,
		centery = center.y,
		centerz = center.z;

	if (eyex === centerx && eyey === centery && eyez === centerz) {
		return this.makeIdentity();
	}

	z0 = eyex - centerx;
	z1 = eyey - centery;
	z2 = eyez - centerz;

	len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	z0 *= len;
	z1 *= len;
	z2 *= len;

	x0 = upy * z2 - upz * z1;
	x1 = upz * z0 - upx * z2;
	x2 = upx * z1 - upy * z0;
	len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

	if (!len) {
		x0 = 0;
		x1 = 0;
		x2 = 0;
	} else {
		len = 1 / len;
		x0 *= len;
		x1 *= len;
		x2 *= len;
	}

	y0 = z1 * x2 - z2 * x1;
	y1 = z2 * x0 - z0 * x2;
	y2 = z0 * x1 - z1 * x0;

	len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

	if (!len) {
		y0 = 0;
		y1 = 0;
		y2 = 0;
	} else {
		len = 1 / len;
		y0 *= len;
		y1 *= len;
		y2 *= len;
	}

	this.data[0] = x0;
	this.data[1] = y0;
	this.data[2] = z0;
	this.data[3] = 0;
	this.data[4] = x1;
	this.data[5] = y1;
	this.data[6] = z1;
	this.data[7] = 0;
	this.data[8] = x2;
	this.data[9] = y2;
	this.data[10] = z2;
	this.data[11] = 0;
	this.data[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	this.data[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	this.data[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	this.data[15] = 1;

	return this;
};

module.exports = Matrix4D;