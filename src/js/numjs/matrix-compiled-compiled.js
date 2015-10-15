"use strict";

var _slicedToArray = function _slicedToArray(arr, i) {
	if (Array.isArray(arr)) {
		return arr;
	} else if (Symbol.iterator in Object(arr)) {
		var _arr = [];for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
			_arr.push(_step.value);if (i && _arr.length === i) break;
		}return _arr;
	} else {
		throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}
};

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var key in props) {
			var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
		}Object.defineProperties(target, props);
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

var _classCallCheck = function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
};

// naive matrix implementation

var Matrix = (function () {
	function Matrix(w, h) {
		_classCallCheck(this, Matrix);

		// data should be stored in initial slots, attributes
		// should be cached to take less slots, arrays are expensive
		this.data = new Array(h);
		for (var i = 0; i < h; i++) {
			this.data[i] = new Array(w);
		}
	}

	_createClass(Matrix, {
		shape: {
			value: function shape() {
				return [this.data.length, this.data[0].length];
			}
		},
		set: {
			value: function set(x, y, v) {
				this.data[x][y] = v;
			}
		},
		setRow: {
			value: function setRow(i, val) {
				this.data[i] = val;
			}
		},
		setCol: {
			value: function setCol(j, vals) {
				var height = this.shape()[0],
				    isValsArray = vals instanceof Array;

				for (var i = 0; i < height; i++) {
					if (isValsArray) {
						this.data[i][j] = vals[i];
					} else {
						this.data[i][j] = vals;
					}
				}
			}
		},
		getRow: {
			value: function getRow(x) {
				return this.data[x];
			}
		},
		getCol: {
			value: function getCol(j) {
				var col = [];
				for (var i = 0; i < this.shape()[0]; i++) {
					col.push(this.data[i][j]);
				}

				return col;
			}
		},
		at: {
			value: function at(x, y) {
				return this.data[x][y];
			}
		},
		add: {
			value: function add(other) {
				var m = new Matrix(this.data.length, this.data[0].length);
				for (var i = 0; i < this.data.length; i++) {
					for (var j = 0; j < this.data[0].length; j++) {
						m.data[i][j] = this.data[i][j] + other.data[i][j];
					}
				}
				return m;
			}
		},
		clone: {
			value: function clone() {
				var _shape = this.shape();

				var _shape2 = _slicedToArray(_shape, 2);

				var height = _shape2[0];
				var width = _shape2[1];

				var m = new Matrix(height, width);
				for (var i = 0; i < height; i++) {
					for (var j = 0; j < width; j++) {
						m.data[i][j] = this.data[i][j];
					}
				}
				return m;
			}
		},
		pow: {
			value: function pow(n) {
				// this is so naive I'm offended, not even squaring
				var m = this.clone();
				for (var i = 0; i < n; i++) {
					m = m.mul(this);
				}
				return m;
			}
		},
		smul: {
			value: function smul(scalar) {
				var m = new Matrix(this.data.length, this.data[0].length);
				for (var i = 0; i < this.data.length; i++) {
					for (var j = 0; j < this.data[0].length; j++) {
						m.data[i][j] = this.data[i][j] * scalar;
					}
				}
			}
		},
		mul: {
			value: function mul(other) {
				// this should definitely be at least Strassen
				// n[i][j] = Sum
				var m = new Matrix(this.data.length, this.data[0].length);
				for (var i = 0; i < this.data.length; i++) {
					for (var j = 0; j < this.data[0].length; j++) {
						m.data[i][j] = this.data[i][j] + other.data[i][j];
					}
				}
				return m;
			}
		},
		row: {
			value: function row(i) {
				return this.data[i];
			}
		},
		col: {
			value: function col(j) {
				var column = new Array(this.data[0].length);
				for (var i = 0; i < this.data[0].length; i++) {
					column[i] = this.data[i][j];
				}
				return column;
			}
		},
		transpose: {
			value: function transpose() {
				var m = new Matrix(this.data.length, this.data[0].length);
				for (var i = 0; i < this.data.length; i++) {
					for (var j = 0; j < this.data[0].length; j++) {
						m.data[i][j] = this.data[j][i];
					}
				}
				return m;
			}
		},
		sub: {
			value: function sub(other) {
				var m = new Matrix(this.data.length, this.data[0].length);
				for (var i = 0; i < this.data.length; i++) {
					for (var j = 0; j < this.data[0].length; j++) {
						var row = this.data[i];
						var col = other.col(j);
						var sum = 0;
						for (var k = 0; k < row.length; k++) {
							sum += row[k] * col[k];
						}
						m.data[i][j] = sum;
					}
				}
				return m;
			}
		},
		sum: {
			value: function sum() {
				var _shape = this.shape();

				var _shape2 = _slicedToArray(_shape, 2);

				var width = _shape2[0];
				var height = _shape2[1];

				var sum = 0;
				for (var i = 0; i < width; i++) {
					for (var j = 0; j < height; j++) {
						sum += this.data[i][j];
					}
				}
				return num;
			}
		},
		toString: {
			value: function toString() {
				var rows = this.data.length;
				var str = "{";
				for (var i = 0; i < rows; i++) {
					str += "[" + this.row(i).toString() + "]";
					if (i < rows - 1) {
						str += ",";
					}
				}
				return str + "}";
			}
		},
		toArray: {
			value: function toArray() {
				var rows = this.data.length;
				var arr = new Array(rows);
				for (var i = 0; i < rows; i++) {
					arr[i] = this.row(i);
				}
				return arr;
			}
		},
		minor: {
			value: function minor(row, col) {
				var rows = this.data.length;
				var cols = this.data[0].length;
				if (row > rows || col > cols || row < 0 || col < 0) {
					return;
				}

				var minorRow = 0;
				var minorCol = 0;
				var arr = new Array(rows - 1);

				for (var i = 0; i < rows; i++) {
					if (i == row) continue;
					minorCol = 0; //go back to first col upon reaching a new row
					arr[minorRow] = new Array(cols - 1);
					var matrixRow = this.row(i);

					for (var j = 0; j < cols; j++) {
						if (j == col) continue;
						arr[minorRow][minorCol] = matrixRow[j];
						minorCol++;
					}

					minorRow++;
				}

				return Matrix.fromArray(arr);
			}
		}
	});

	return Matrix;
})();

Matrix.eye = function (size) {
	var m = new Matrix(size, size);
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (i === j) m.data[i][j] = 1;else m.data[i][j] = 0;
		}
	}
	return m;
};
Matrix.zeros = function (size, csize) {
	var m;
	if (!csize) {
		csize = size;
	}
	m = new Matrix(size, csize);

	for (var i = 0; i < size; i++) {
		for (var j = 0; j < csize; j++) {
			m.data[i][j] = 0;
		}
	}
	return m;
};

Matrix.fromArray = function (arr) {
	//TODO: check input is valid (non zero size array etc.)
	if (arr && arr[0]) {
		var rows = arr.length;
		var cols = arr[0].length;
		var m = new Matrix(rows, cols);
		for (var i = 0; i < rows; i++) {
			m.data[i] = arr[i];
		}
		return m;
	}
};

module.exports = Matrix;

//# sourceMappingURL=matrix-compiled-compiled.js.map