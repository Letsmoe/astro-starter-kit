export class Matrix {
	public rows: number;
	public cols: number;
	public elements: number[][];

  constructor(rows: number, cols: number, elements: number[][] | null = null) {
    if (elements === null) {
      elements = Array(rows).fill(0).map(() => Array(cols).fill(0));
    }
    this.rows = rows;
    this.cols = cols;
    this.elements = elements;
  }

  get(row: number, col: number) {
    return this.elements[row][col];
  }

  set(row: number, col: number, value: number) {
    this.elements[row][col] = value;
  }

  transpose() {
    let transposed = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        transposed.set(j, i, this.get(i, j));
      }
    }
    return transposed;
  }

  add(other: Matrix) {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error("Matrices must be of the same size to perform addition.");
    }

    let result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) + other.get(i, j));
      }
    }
    return result;
  }

  subtract(other: Matrix) {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error("Matrices must be of the same size to perform subtraction.");
    }

    let result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) - other.get(i, j));
      }
    }
    return result;
  }

  multiply(other: Matrix) {
    if (this.cols !== other.rows) {
      throw new Error("Number of columns in first matrix must match number of rows in second matrix.");
    }

    let result = new Matrix(this.rows, other.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(i, k) * other.get(k, j);
        }
        result.set(i, j, sum);
      }
    }
    return result;
  }

  scale(scalar: number) {
    let result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) * scalar);
      }
    }
    return result;
  }
}
