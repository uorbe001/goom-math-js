if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function(require) {
	/**
		Creates a new Vector3D, used to store positions in the 3D world.
		@class Represents a position in the 3D world.
		@property {Number} [x=0] the value in the x-coordinate axis.
		@property {Number} [y=0] the value in the y-coordinate axis.
		@property {Number} [z=0] the value in the z-coordinate axis.
		@param {Number} [x=0] the value in the x-coordinate axis.
		@param {Number} [y=0] the value in the y-coordinate axis.
		@param {Number} [z=0] the value in the z-coordinate axis.
		@exports Vector3D as Math.Vector3D.
	*/
	var Vector3D = (function() {
		function Vector3D(x, y, z) {
			this.x = x !== null && x !== undefined? x: 0;
			this.y = y !== null && y !== undefined? y: 0;
			this.z = z !== null && z !== undefined? z: 0;
		}

		/**
			Sets the three values in this vector.
			@param {number} x the value in the x-coordinate axis.
			@param {number} y the value in the y-coordinate axis.
			@param {number} z the value in the z-coordinate axis.
		*/
		Vector3D.prototype.set = function(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
			return this;
		};

		/**
			Creates a copy of this vector or makes the given destination vector a copy of this.
			@param {Math.Vector3D} [destination] The vector where data will be stored.
			@returns {Math.Vector3D} Copy of this vector.
		*/
		Vector3D.prototype.clone = function(destination) {
			if (destination === null || destination === undefined) destination = new Math.Vector3D();
			destination.x = this.x;
			destination.y = this.y;
			destination.z = this.z;
			return destination;
		};

		/**
			Adds two vectors, if a destination vector is given data is stored in the
			destination matrix and it"s returned, otherwise, it"s stored in this matrix
			and this is returned.
			@param {Math.Vector3D} vector The second vector to add.
			@param {Math.Vector3D} [destination=this] The vector where data will be stored. If none
			given, data is stored in this vector.
			@returns {Math.Vector3D} The vector with the result, this or destination depenting
			on parameters.
		*/
		Vector3D.prototype.add = function(vector, destination) {
			if (destination === null || destination === undefined) destination = this;
			destination.x = this.x + vector.x;
			destination.y = this.y + vector.y;
			destination.z = this.z + vector.z;
			return destination;
		};

		/**
			Multiplies a scalar to the vector.
			@param {Number} scalar The number to scale by.
			@param {Math.Vector3D} [destination=this] The vector where data will be stored. If none
			given, data is stored in this vector.
			@returns {Math.Vector3D} The vector with the result, this or destination depenting
			on parameters.
		*/
		Vector3D.prototype.scale = function(scalar, destination) {
			if (destination === null || destination === undefined) destination = this;
			destination.x = this.x * scalar;
			destination.y = this.y * scalar;
			destination.z = this.z * scalar;
			return destination;
		};

		/**
			Substracts two vectors, if a destination vector is given data is stored in the
			destination matrix and destination matrix is returned, data is stored in the
			first vector and this vector is returned otherwise.
			@param {Math.Vector3D} vector The second vector to substract.
			@param {Math.Vector3D} [destination=this] The vector where data will be stored. If none
			given, data is stored in this vector.
			@returns {Math.Vector3D} The vector with the result, this or destination depenting
			on parameters.
		*/
		Vector3D.prototype.substract = function(vector, destination) {
			if (destination === null || destination === undefined) destination = this;
			destination.x = this.x - vector.x;
			destination.y = this.y - vector.y;
			destination.z = this.z - vector.z;
			return destination;
		};

		/**
			Returns the length of this vector.
			@returns {Number} Length of the vector.
			@see Vector3D#magnitude
		*/
		Vector3D.prototype.length = function() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		};

		/**
			Returns the magnitude of this vector.
			@returns {Number} Magnitude of the vector.
			@see Vector3D#length
		*/
		Vector3D.prototype.magnitude = function() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		};

		/**
			Returns the squared magnitude of this vector.
			@returns {Number} Squared magnitude of the vector.
		*/

		Vector3D.prototype.squaredMagnitude = function() {
			return this.x * this.x + this.y * this.y + this.z * this.z;
		};

		/**
			Calculates vector cross product between this and the given vector,
			if destination vector is given data is stored in destination and that is
			returned, otherwise data is stored in the first matrix and this is returned.
			@param {Math.Vector3D} vector The second vector required for calculation.
			@param {Math.Vector3D} [destination=this] The vector where data will be stored. If none
			given, data is stored in this vector.
			@returns {Math.Vector3D} The vector with the result, this or destination depenting
			on parameters.
		*/
		Vector3D.prototype.crossProduct = function(vector, destination) {
			var x, y;
			if (destination === null || destination === undefined) destination = this;
			x = (this.y * vector.z) - (this.z * vector.y);
			y = (this.z * vector.x) - (this.x * vector.z);
			destination.z = (this.x * vector.y) - (this.y * vector.x);
			destination.x = x;
			destination.y = y;
			return destination;
		};

		/**
			Returns the dot product of the vectors.
			@param {Math.Vector3D} vector The second vector needed for dot product.
			@returns {Number} The dot product.
		*/
		Vector3D.prototype.dotProduct = function(vector) {
			return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
		};

		/**
			Returns the component product of the vectors.
			@param {Math.Vector3D} vector The second vector required for calculation.
			@param {Math.Vector3D} [destination=this] The vector where data will be stored. If none
			given, data is stored in this vector.
			@returns {Math.Vector3D} The vector with the result, this or destination depenting
			on parameters.
		*/
		Vector3D.prototype.componentProduct = function(vector, destination) {
			if (destination === null || destination === undefined) destination = this;
			destination.x = this.x * vector.x;
			destination.y = this.y * vector.y;
			destination.z = this.z * vector.z;
			return destination;
		};

		/**
			Normalizes the vector, normalized values are stored in itself if no
			destination vector is given and this is returned, values are stored in
			the destination vector and that is returned otherwise.
			@param {Math.Vector3D} [destination=this] The vector where data will be stored. If none
			given, data is stored in this vector.
			@returns {Math.Vector3D} the vector with the result, this or destination depenting
			on parameters.
		*/
		Vector3D.prototype.normalize = function(destination) {
			var div_magnitude, magnitude;
			if (destination === null || destination === undefined) destination = this;

			magnitude = this.magnitude();
			div_magnitude = 1 / magnitude;

			if (magnitude === 0) {
				destination.x = 0;
				destination.y = 0;
				destination.z = 0;
				return destination;
			} else if (magnitude === 1) {
				destination.x = this.x;
				destination.y = this.y;
				destination.z = this.z;
				return destination;
			}

			destination.x = this.x * div_magnitude;
			destination.y = this.y * div_magnitude;
			destination.z = this.z * div_magnitude;
			return destination;
		};

		/**
			Sets the vector to be (0,0,0).
			@returns {Math.Vector3D} this.
		*/
		Vector3D.prototype.zero = function() {
			this.x = this.y = this.z = 0;
			return this;
		};

		/**
		@static
		*/
		Vector3D.RIGHT = new Vector3D(1, 0, 0);

		/**
		@static
		*/
		Vector3D.UP = new Vector3D(0, 1, 0);

		/**
		@static
		*/
		Vector3D.LEFT = new Vector3D(-1, 0, 0);

		/**
		@static
		*/
		Vector3D.DOWN = new Vector3D(0, -1, 0);

		/**
		@static
		*/
		Vector3D.Z_AXIS = new Vector3D(0, 0, 1);

		Math.Vector3D = Vector3D;
		return Vector3D;
	})();
});