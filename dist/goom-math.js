var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = x + '/package.json';
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

require.define = function (filename, fn) {
    var dirname = require._core[filename]
        ? ''
        : require.modules.path().dirname(filename)
    ;
    
    var require_ = function (file) {
        return require(file, dirname)
    };
    require_.resolve = function (name) {
        return require.resolve(name, dirname);
    };
    require_.modules = require.modules;
    require_.define = require.define;
    var module_ = { exports : {} };
    
    require.modules[filename] = function () {
        require.modules[filename]._cached = module_.exports;
        fn.call(
            module_.exports,
            require_,
            module_,
            module_.exports,
            dirname,
            filename
        );
        require.modules[filename]._cached = module_.exports;
        return module_.exports;
    };
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

if (!process.env) process.env = {};
if (!process.argv) process.argv = [];

require.define("path", function (require, module, exports, __dirname, __filename) {
function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("/vector3d.js", function (require, module, exports, __dirname, __filename) {
/**
	Creates a new Vector3D, used to store positions in the 3D world.
	@class Represents a position in the 3D world.
	@property {Number} [x=0] the value in the x-coordinate axis.
	@property {Number} [y=0] the value in the y-coordinate axis.
	@property {Number} [z=0] the value in the z-coordinate axis.
	@param {Number} [x=0] the value in the x-coordinate axis.
	@param {Number} [y=0] the value in the y-coordinate axis.
	@param {Number} [z=0] the value in the z-coordinate axis.
	@exports Vector3D as Mathematics.Vector3D.
*/
function Vector3D(x, y, z) {
	this.x = x !== null && x !== undefined? x: 0;
	this.y = y !== null && y !== undefined? y: 0;
	this.z = z !== null && z !== undefined? z: 0;
}

/**
	Sets the three values in this vector.
	@param {Number} x the value in the x-coordinate axis.
	@param {Number} y the value in the y-coordinate axis.
	@param {Number} z the value in the z-coordinate axis.
*/
Vector3D.prototype.set = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	return this;
};

/**
	Creates a copy of this vector or makes the given destination vector a copy of this.
	@param {Mathematics.Vector3D} [destination] The vector where data will be stored.
	@returns {Mathematics.Vector3D} Copy of this vector.
*/
Vector3D.prototype.clone = function(destination) {
	if (destination === null || destination === undefined) destination = new Vector3D();
	destination.x = this.x;
	destination.y = this.y;
	destination.z = this.z;
	return destination;
};

/**
	Adds two vectors, if a destination vector is given data is stored in the
	destination matrix and it"s returned, otherwise, it"s stored in this matrix
	and this is returned.
	@param {Mathematics.Vector3D} vector The second vector to add.
	@param {Mathematics.Vector3D} [destination=this] The vector where data will be stored. If none
	given, data is stored in this vector.
	@returns {Mathematics.Vector3D} The vector with the result, this or destination depenting
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
	@param {Number} scalar The Number to scale by.
	@param {Mathematics.Vector3D} [destination=this] The vector where data will be stored. If none
	given, data is stored in this vector.
	@returns {Mathematics.Vector3D} The vector with the result, this or destination depenting
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
	@param {Mathematics.Vector3D} vector The second vector to substract.
	@param {Mathematics.Vector3D} [destination=this] The vector where data will be stored. If none
	given, data is stored in this vector.
	@returns {Mathematics.Vector3D} The vector with the result, this or destination depenting
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
	@param {Mathematics.Vector3D} vector The second vector required for calculation.
	@param {Mathematics.Vector3D} [destination=this] The vector where data will be stored. If none
	given, data is stored in this vector.
	@returns {Mathematics.Vector3D} The vector with the result, this or destination depenting
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
	@param {Mathematics.Vector3D} vector The second vector needed for dot product.
	@returns {Number} The dot product.
*/
Vector3D.prototype.dotProduct = function(vector) {
	return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
};

/**
	Returns the component product of the vectors.
	@param {Mathematics.Vector3D} vector The second vector required for calculation.
	@param {Mathematics.Vector3D} [destination=this] The vector where data will be stored. If none
	given, data is stored in this vector.
	@returns {Mathematics.Vector3D} The vector with the result, this or destination depenting
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
	@param {Mathematics.Vector3D} [destination=this] The vector where data will be stored. If none
	given, data is stored in this vector.
	@returns {Mathematics.Vector3D} the vector with the result, this or destination depenting
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
	@returns {Mathematics.Vector3D} this.
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

module.exports = Vector3D;
});

require.define("/quaternion.js", function (require, module, exports, __dirname, __filename) {
var Vector3D = require("./vector3d");

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

module.exports = Quaternion;
});

require.define("/matrix3d.js", function (require, module, exports, __dirname, __filename) {
var Vector3D = require("./vector3d");

/**
	Creates a new Matrix3D, used through the engine to feed data to the vertex and store
	transformation data.
	@class This is a 3x3 matrix.
	@property {data} [data=identity] Array holding the data in the matrix.
	@exports Matrix3D as Mathematics.Matrix3D
*/
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

module.exports = Matrix3D;
});

require.define("/matrix4d.js", function (require, module, exports, __dirname, __filename) {
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
	this.data[14] = -n2 * far / delta_z;
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
	var size = near * Math.tan((field_of_view / (180 * Math.PI)) / 2);
	return this.makeFrustum(-size, size, -size / aspect_ratio, size / aspect_ratio, near, far);
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

/**
	Makes this matrix a look-at matrix. Not optimized. TODO
	@param {Mathematics.Vector3D} eye Position of the camera
	@param {Mathematics.Vector3D} center Point to look at.
	@param {Mathematics.Vector3D} up Vector pointing "up"
	@returns {Mathematics.Matrix4D} this matrix as a look-at matrix.
*/
Matrix4D.prototype.lookAt = function (eye, center, up) {
	var z_axis = center.substract(eye, new Vector3D()).normalize();
	var x_axis = up.crossProduct(z_axis, new Vector3D()).normalize();
	var y_axis = z_axis.crossProduct(x_axis, new Vector3D());

	this.data[0] = x_axis.x;
	this.data[1] = y_axis.x;
	this.data[2] = z_axis.x;
	this.data[3] = 0;
	this.data[4] = x_axis.y;
	this.data[5] = y_axis.y;
	this.data[6] = z_axis.y;
	this.data[7] = 0;
	this.data[8] = x_axis.z;
	this.data[9] = y_axis.z;
	this.data[10] = z_axis.z;
	this.data[11] = 0;
	this.data[12] = -x_axis.dotProduct(eye);
	this.data[13] = -y_axis.dotProduct(eye);
	this.data[14] = -z_axis.dotProduct(eye);
	this.data[15] = 1;
	return this;
};

module.exports = Matrix4D;
});

require.define("/goom-math.js", function (require, module, exports, __dirname, __filename) {
    var Vector3D = require("./vector3d"), Quaterion = require("./quaternion"), Matrix3D = require("./matrix3d"), Matrix4D = require("./matrix4d");

exports.Vector3D = Vector3D;
exports.Quaternion = Quaternion;
exports.Matrix3D = Matrix3D;
exports.Matrix4D = Matrix4D;
});
require("/goom-math.js");
