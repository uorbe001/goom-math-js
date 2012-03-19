if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./vector3d"], function(Vector3D) {
	/**
		Creates a new Quaternion, used through the engine to handle rotations.
		@class A quaternion.
		@property {Number} r The r element.
		@property {Number} i The i element.
		@property {Number} j The j element.
		@property {Number} k The k element.
		@param {Number} [r=1] The r element.
		@param {Number} [i=0] The i element.
		@param {Number} [j=0] The j element.
		@param {Number} [k=0] The k element.
		@exports Quaternion as Mathematics.Quaternion
	*/
	var Quaternion = (function() {
		function Quaternion(r, i, j, k) {
			this.r = r !== null && r !== undefined? r : 1;
			this.i = i !== null && i !== undefined? i : 0;
			this.j = j !== null && j !== undefined? j : 0;
			this.k = k !== null && k !== undefined? k : 0;
		}

		/**
			Makes this quaternion the identity quaternion.
			@returns {Mathematics.Quaternion} This quaternion as identity quaternion.
		*/
		Quaternion.prototype.makeIdentity = function() {
			this.r = 1;
			this.i = this.j = this.k = 0;
			return this;
		};

		/**
			Sets the values in this quaternion.
			@param {Number} r
			@param {Number} i
			@param {Number} j
			@param {Number} k
		*/
		Quaternion.prototype.set = function(r, i, j, k) {
			this.r = r;
			this.i = i;
			this.j = j;
			this.k = k;
			return this;
		};

		/**
			Normalizes the quaternion, makeing it a valid orientation quaternion.
			@returns {Mathematics.Quaternion} This quaternion normalized.
		*/
		Quaternion.prototype.normalize = function() {
			var length = this.r * this.r + this.i * this.i + this.j * this.j + this.k * this.k;
			
			if (length === 0) {
				this.r = 1;
				return this;
			}

			length = 1 / Math.sqrt(length);
			this.r *= length;
			this.i *= length;
			this.j *= length;
			this.k *= length;
			return this;
		};

		/**
			Multiplies two quaternions, storing new values on the first one if no destination
			quaternion is given.
			@param {Mathematics.Quaternion} quaternion The quaternion to multiply by.
			@param {Mathematics.Quaternion} [destination=this] The quaternion to store the data in.
			@returns {Mathematics.Quaternion} The quaternion holding the new data.
		*/
		Quaternion.prototype.multiply = function(quaternion, destination) {
			if (destination === null || destination === undefined) destination = this;

			var r = this.r * quaternion.r - this.i * quaternion.i - this.j * quaternion.j - this.k * quaternion.k;
			var i = this.r * quaternion.i + this.i * quaternion.r + this.j * quaternion.k - this.k * quaternion.j;
			var j = this.r * quaternion.j + this.j * quaternion.r + this.k * quaternion.i - this.i * quaternion.k;

			destination.k = this.r * quaternion.k + this.k * quaternion.r + this.i * quaternion.j - this.j * quaternion.i;
			destination.r = r;
			destination.i = i;
			destination.j = j;
			return destination;
		};

		/**
			Rotates the quaternion by a vector.
			@param {Mathematics.Vector3D} vector the vector to rotate by.
			@param {Mathematics.Quaternion} [destination=this] The quaternion to store the data in.
			@returns {Mathematics.Quaternion} The quaternion holding the new data.
		*/
		Quaternion.prototype.rotateByVector = function(vector, destination) {
			if (destination === null || destination === undefined) destination = this;
			var r = -this.i * vector.x - this.j * vector.y - this.k * vector.z;
			var i = this.r * vector.x + this.j * vector.z - this.k * vector.y;
			var j = this.r * vector.y + this.k * vector.x - this.i * vector.z;

			destination.k = this.r * vector.z + this.i * vector.y - this.j * vector.x;
			destination.r = r;
			destination.i = i;
			destination.j = j;
			return destination;
		};

		/**
			Adds the given vector to this.
			@param {Mathematics.Vector3D} vector The vector to add.
			@param {Mathematics.Quaternion} [destination=this] The quaternion to store the data in.
			@returns {Mathematics.Quaternion} The quaternion holding the new data.
		*/
		Quaternion.prototype.addVector = function(vector, destination) {
			if (destination === null || destination === undefined) destination = this;

			var r = -vector.x * this.i - vector.y * this.j - vector.z * this.k;
			var i = vector.x * this.r + vector.y * this.k - vector.z * this.j;
			var j = vector.y * this.r + vector.z * this.i - vector.x * this.k;
			var k = vector.z * this.r + vector.x * this.j - vector.y * this.i;

			destination.r = this.r + r * 0.5;
			destination.i = this.i + i * 0.5;
			destination.j = this.j + j * 0.5;
			destination.k = this.k + k * 0.5;
			return destination;
		};

		return Quaternion;
	})();

	return Quaternion;
});