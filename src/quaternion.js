if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./vector3d"], function(require) {
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
		@exports Quaternion as Math.Quaternion
	*/
	var Quaternion = (function() {
		function Quaternion(r, i, j, k) {
			this.r = r? r : 1;
			this.i = i? i : 0;
			this.j = j? j : 0;
			this.k = k? k : 0;
		}

		/**
			Makes this quaternion the identity quaternion.
			@returns {Math.Quaternion} This quaternion as identity quaternion.
		*/
		Quaternion.prototype.makeIdentity = function() {
			this.r = 1;
			this.i = this.j = this.k = 0;
			return this;
		};

		/**
			Normalizes the quaternion, makeing it a valid orientation quaternion.
			@returns {Quaternion} This quaternion normalized.
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
			@param {Quaternion} quaternion The quaternion to multiply by.
			@param {Quaternion} [destination=this] The quaternion to store the data in.
			@returns {Quaternion} The quaternion holding the new data.
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
			@param {Vector3D} vector the vector to rotate by.
			@param {Quaternion} [destination=this] The quaternion to store the data in.
			@returns {Quaternion} The quaternion holding the new data.
		*/
		Quaternion.prototype.rotateByVector = function(vector, destination) {
			if (destination === null || destination === undefined) destination = this;

			var r = -vector.x * destination.i - vector.y * destination.j - vector.z * destination.k;
			var i = vector.x * destination.r + vector.y * destination.k - vector.z * destination.j;
			var j = vector.y * destination.r + vector.z * destination.i - vector.x * destination.k;

			destination.k = vector.z * destination.r + vector.x * destination.j - vector.y * destination.i;
			destination.r = r;
			destination.i = i;
			destination.j = j;
			return destination;
		};

		/**
			Adds the given vector to this.
			@param {Vector3D} vector The vector to add.
			@param {Quaternion} [destination=this] The quaternion to store the data in.
			@returns {Quaternion} The quaternion holding the new data.
		*/
		Quaternion.prototype.addVector = function(vector, destination) {
			if (destination === null || destination === undefined) destination = this;

			var r = -vector.x * this.i - vector.y * this.j - vector.z * this.k;
			var i = vector.x * this.r + vector.y * this.k - vector.z * this.j;
			var j = vector.y * this.r + vector.z * this.i - vector.x * this.k;
			var k = vector.z * this.r + vector.x * this.j - vector.y * this.i;

			destination.r += r * 0.5;
			destination.i += i * 0.5;
			destination.j += j * 0.5;
			destination.k += k * 0.5;
			return destination;
		};

		Math.Quaternion = Quaternion;
		return Quaternion;
	})();
});