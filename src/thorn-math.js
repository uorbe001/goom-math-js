if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./vector3d", "./quaternion", "./matrix3d", "./matrix4d"], function(Vector3D, Quaternion, Matrix3D, Matrix4D) {
	Mathematics = {};
	Mathematics.Vector3D = Vector3D;
	Mathematics.Quaternion = Quaternion;
	Mathematics.Matrix3D = Matrix3D;
	Mathematics.Matrix4D = Matrix4D;
	return Mathematics;
});