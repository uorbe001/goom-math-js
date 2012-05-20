if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./vector3d"], function(Vector3D) {
	/**
		Creates a new Matrix3D, used through the engine to feed data to the vertex and store
		transformation data.
		@class This is a 3x3 matrix.
		@property {data} [data=identity] Array holding the data in the matrix.
		@exports Matrix3D as Mathematics.Matrix3D
	*/
	var Matrix3D = (function() {
		function Matrix3D() {
			if (typeof Float32Array !== "undefined" && Float32Array !== null) {
				this.data = new Float32Array(9);
			} else {
				this.data = new Array(9);
			}

			this.makeIdentity();
		}

		/**
			Creates a copy of this matrix or copies this matrix's data into the given matrix.
			@param {Mathematics.Matrix3D} [destination=this] The matrix to store the data.
			@returns {Mathematics.Matrix3D} Copy of this matrix.
		*/
		Matrix3D.prototype.clone = function(destination) {
			if (destination === null || destination === undefined) destination = new Matrix3D();
			
			for (var i = 0; i <= 8; i++) {
				destination.data[i] = this.data[i];
			}

			return destination;
		};

		/**
			Sets this matrix data to the given data.
			@param {Array} data An array holding the new array data.
			@returns {Mathematics.Matrix3D} This matrix with the new data.
		*/
		Matrix3D.prototype.set = function(data) {
			for (var i = 0; i <= 8; i++) {
				this.data[i] = data[i];
			}
			
			return this;
		};

		/**
			Sets the diagonal of this matrix to the given values.
			@param {Number} a00 The value for the a00 element of the diagonal.
			@param {Number} a11 The value for the a11 element of the diagonal.
			@param {Number} a22 The value for the a22 element of the diagonal.
			@returns {Mathematics.Matrix3D} This matrix with the new data.
		*/
		Matrix3D.prototype.setDiagonal = function(a00, a11, a22) {
			this.data[0] = a00;
			this.data[4] = a11;
			this.data[8] = a22;
			return this;
		};

		/**
			Makes this matrix a matrix created from 3 vectors.
			@param {Mathematics.Vector3D} vector1 The first vector to create the matrix from.
			@param {Mathematics.Vector3D} vector2 The second vector to create the matrix from.
			@param {Mathematics.Vector3D} vector3 The third vector to create the matrix from.
			@returns {Mathematics.Matrix3D} This matrix with the new data.
		*/
		Matrix3D.prototype.makeFromVectors = function(vector1, vector2, vector3) {
			this.data[0] = vector1.x;
			this.data[1] = vector1.y;
			this.data[2] = vector1.z;
			this.data[3] = vector2.x;
			this.data[4] = vector2.y;
			this.data[5] = vector2.z;
			this.data[6] = vector3.x;
			this.data[7] = vector3.y;
			this.data[8] = vector3.z;
			return this;
		};

		/**
			Makes this matrix a skew symmetric based on the given vector.
			@param {Mathematics.Vector3D} vector The vector to base this matrix on.
			@return {Mathematics.Matrix3D} This matrix transformed into the skew symmetric.
		*/
		Matrix3D.prototype.makeSkewSymmetric = function(vector) {
			this.data[0] = this.data[4] = this.data[8] = 0;
			this.data[1] = vector.z;
			this.data[2] = -vector.y;
			this.data[3] = -vector.z;
			this.data[5] = vector.x;
			this.data[6] = vector.y;
			this.data[7] = -vector.x;
			return this;
		};

		/**
			Makes this matrix the identity matrix.
			@returns {Mathematics.Matrix3D} This matrix as identity matrix.
		*/
		Matrix3D.prototype.makeIdentity = function() {
			for (var i = 0; i <= 8; i++) {
				this.data[i] = 0;
			}
			
			this.data[0] = this.data[4] = this.data[8] = 1;
			return this;
		};

		/**
			Makes this matrix its own transpose and returns it.
			@param {Mathematics.Matrix3D} [destination=this] The matrix to store the data.
			@returns {Mathematics.Matrix3D} This matrix transposed.
		*/
		Matrix3D.prototype.transpose = function(destination) {
			if (destination === null || destination === undefined) destination = this;
			
			var tmp = this.data[1];
			destination.data[1] = this.data[3];
			destination.data[3] = tmp;
			tmp = this.data[2];
			destination.data[2] = this.data[6];
			destination.data[6] = tmp;
			tmp = this.data[5];
			destination.data[5] = this.data[7];
			destination.data[7] = tmp;
			destination.data[0] = this.data[0];
			destination.data[4] = this.data[4];
			destination.data[8] = this.data[8];
			return destination;
		};

		/**
			Calculates this matrix's inverse and returns it.
			@param {Mathematics.Matrix3D} [destination=this] The matrix to store the data.
			@returns {Mathematics.Matrix3D} The matrix with the inversed data.
		*/
		Matrix3D.prototype.inverse = function(destination) {
			if (destination === null || destination === undefined) destination = this;
			var t1 = this.data[0] * this.data[4];
			var t2 = this.data[0] * this.data[7];
			var t3 = this.data[3] * this.data[1];
			var t4 = this.data[6] * this.data[1];
			var t5 = this.data[3] * this.data[2];
			var t6 = this.data[6] * this.data[2];
			var det = t1 * this.data[8] - t2 * this.data[5] - t3 * this.data[8] + t4 * this.data[5] + t5 * this.data[7] - t6 * this.data[4];
			
			if (det === 0) {
				destination.data[0] = this.data[0];
				destination.data[1] = this.data[1];
				destination.data[2] = this.data[2];
				destination.data[3] = this.data[3];
				destination.data[4] = this.data[4];
				destination.data[5] = this.data[5];
				destination.data[6] = this.data[6];
				destination.data[7] = this.data[7];
				destination.data[8] = this.data[8];
				return destination;
			}
			
			var invDet = 1 / det;
			var a00 = (this.data[4] * this.data[8] - this.data[7] * this.data[5]) * invDet;
			var a01 = -(this.data[1] * this.data[8] - this.data[7] * this.data[2]) * invDet;
			var a02 = (this.data[1] * this.data[5] - this.data[4] * this.data[2]) * invDet;
			var a10 = -(this.data[3] * this.data[8] - this.data[6] * this.data[5]) * invDet;
			var a11 = (this.data[0] * this.data[8] - t6) * invDet;
			var a12 = -(this.data[0] * this.data[5] - t5) * invDet;
			var a20 = (this.data[3] * this.data[7] - this.data[6] * this.data[4]) * invDet;
			var a21 = -(t2 - t4) * invDet;
			var a22 = (t1 - t3) * invDet;

			destination.data[0] = a00;
			destination.data[1] = a01;
			destination.data[2] = a02;
			destination.data[3] = a10;
			destination.data[4] = a11;
			destination.data[5] = a12;
			destination.data[6] = a20;
			destination.data[7] = a21;
			destination.data[8] = a22;
			return destination;
		};

		/**
			Adds the given matrix to this matrix, if destination is given it will store
			the new matrix in destination and return it, otherwise it will store and
			return this matrix.
			@param {Mathematics.Matrix3D} matrix The matrix to compute with.
			@param {Mathematics.Matrix3D} destination The matrix where result is stored.
			@returns {Mathematics.Matrix3D} Result of the addition, this unless destination is given.
		*/
		Matrix3D.prototype.add = function(matrix, destination) {
			if (destination === null || destination === undefined) destination = this;

			for (var i = 0; i <= 8; i++) {
				destination.data[i] = this.data[i] + matrix.data[i];
			}
			return destination;
		};

		/**
			Multiplies given matrix to this matrix, ig destination is given it will store
			the new matrix in the destination matrix and return it, it will store and
			return this matrix otherwise.
			@param {Mathematics.Matrix3D} matrix The matrix to compute with.
			@param {Mathematics.Matrix3D} [destination] The matrix where result is stored.
			@returns {Mathematics.Matrix3D} Result of the multiplication, this unless destination
			is given.
		*/
		Matrix3D.prototype.multiply = function(matrix, destination) {
			if (destination === null || destination === undefined) destination = this;

			var a00 = (this.data[0 * 3 + 0] * matrix.data[0 * 3 + 0]) + (this.data[1 * 3 + 0] * matrix.data[0 * 3 + 1]) + (this.data[2 * 3 + 0] * matrix.data[0 * 3 + 2]);
			var a01 = (this.data[0 * 3 + 1] * matrix.data[0 * 3 + 0]) + (this.data[1 * 3 + 1] * matrix.data[0 * 3 + 1]) + (this.data[2 * 3 + 1] * matrix.data[0 * 3 + 2]);
			var a02 = (this.data[0 * 3 + 2] * matrix.data[0 * 3 + 0]) + (this.data[1 * 3 + 2] * matrix.data[0 * 3 + 1]) + (this.data[2 * 3 + 2] * matrix.data[0 * 3 + 2]);

			var a10 = (this.data[0 * 3 + 0] * matrix.data[1 * 3 + 0]) + (this.data[1 * 3 + 0] * matrix.data[1 * 3 + 1]) + (this.data[2 * 3 + 0] * matrix.data[1 * 3 + 2]);
			var a11 = (this.data[0 * 3 + 1] * matrix.data[1 * 3 + 0]) + (this.data[1 * 3 + 1] * matrix.data[1 * 3 + 1]) + (this.data[2 * 3 + 1] * matrix.data[1 * 3 + 2]);
			var a12 = (this.data[0 * 3 + 2] * matrix.data[1 * 3 + 0]) + (this.data[1 * 3 + 2] * matrix.data[1 * 3 + 1]) + (this.data[2 * 3 + 2] * matrix.data[1 * 3 + 2]);

			var a20 = (this.data[0 * 3 + 0] * matrix.data[2 * 3 + 0]) + (this.data[1 * 3 + 0] * matrix.data[2 * 3 + 1]) + (this.data[2 * 3 + 0] * matrix.data[2 * 3 + 2]);
			var a21 = (this.data[0 * 3 + 1] * matrix.data[2 * 3 + 0]) + (this.data[1 * 3 + 1] * matrix.data[2 * 3 + 1]) + (this.data[2 * 3 + 1] * matrix.data[2 * 3 + 2]);
			var a22 = (this.data[0 * 3 + 2] * matrix.data[2 * 3 + 0]) + (this.data[1 * 3 + 2] * matrix.data[2 * 3 + 1]) + (this.data[2 * 3 + 2] * matrix.data[2 * 3 + 2]);

			destination.data[0] = a00;
			destination.data[1] = a01;
			destination.data[2] = a02;
			destination.data[3] = a10;
			destination.data[4] = a11;
			destination.data[5] = a12;
			destination.data[6] = a20;
			destination.data[7] = a21;
			destination.data[8] = a22;
			return destination;
		};

		/**
			Scales this amtrix by the given scalar.
			@param {Number} scalar The Number to scale the matrix by.
			@param {Mathematics.Matrix3D} [destination=this] The matrix where result is stored.
			@returns {Mathematics.Matrix3D} Scaled matrix, this unless destination
			is given.
		*/
		Matrix3D.prototype.scale = function(scalar, destination) {
			if (destination === null || destination === undefined) destination = this;

			for (var i = 0; i <= 8; i++) {
				destination.data[i] = scalar * this.data[i];
			}

			return destination;
		};

		/**
			Transforms the given vector by this matrix.
			@param {Mathematics.Vector3D} vector The vector to be transformed by this matrix.
			@param {Mathematics.Vector3D} [destination] The vector where result is stored.
			@returns {Mathematics.Vector3D} The transformed vector.
		*/
		Matrix3D.prototype.transformVector = function(vector, destination) {
			if (destination === null || destination === undefined) destination = vector;
			var x = vector.x * this.data[0] + vector.y * this.data[3] + vector.z * this.data[6];
			var y = vector.x * this.data[1] + vector.y * this.data[4] + vector.z * this.data[7];
			destination.z = vector.x * this.data[2] + vector.y * this.data[5] + vector.z * this.data[8];
			destination.x = x;
			destination.y = y;
			return destination;
		};

		/**
			Transforms the given vector by the transpose of this matrix.
			@param {Mathematics.Vector3D} vector The vector to be transformed.
			@param {Mathematics.Vector3D} [destination] The vector where result is stored.
			@returns {Mathematics.Vector3D} The transformed vector.
		*/
		Matrix3D.prototype.transformTransposeVector = function(vector, destination) {
			if (destination === null || destination === undefined) destination = vector;
			var x = vector.x * this.data[0] + vector.y * this.data[1] + vector.z * this.data[2];
			var y = vector.x * this.data[3] + vector.y * this.data[4] + vector.z * this.data[5];
			destination.z = vector.x * this.data[6] + vector.y * this.data[7] + vector.z * this.data[8];
			destination.x = x;
			destination.y = y;
			return destination;
		};

		/**
			Returns a vector representing the first three values in one of the matrix's rows.
			@param	{Number} index The row to return.
			@param {Mathematics.Vector3D} destination The vector where result is stored.
			@returns {Mathematics.Vector3D} Vector represeting the first three values in the row.
		*/
		Matrix3D.prototype.row = function(index, destination) {
			if (destination === null || destination === undefined) destination = new Vector3D();
			return destination.set(this.data[index], this.data[index + 1], this.data[index + 2]);
		};

		return Matrix3D;
	})();

	return Matrix3D;
});