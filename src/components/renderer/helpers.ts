import type { Matrix } from "./Matrix";
import { Vector } from "./Vector";

export function vectorMatrixMultiplication(vector: Vector, matrix: Matrix) {
  if (vector.dimension !== matrix.rows) {
    throw new Error("Vector dimension must match matrix row count.");
  }

  let result = new Vector(...new Array(matrix.cols).fill(0));
  for (let j = 0; j < matrix.cols; j++) {
    let sum = 0;
    for (let i = 0; i < matrix.rows; i++) {
      sum += vector.get(i) * matrix.get(i, j);
    }
    result.set(j, sum);
  }
  return result;
}