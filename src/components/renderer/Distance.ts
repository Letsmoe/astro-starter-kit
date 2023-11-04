import type { Line } from "./Line";
import { Vector2D } from "./Vector2D";

export class Distance {
	public static pointLine(pointX: number, pointY: number, line: Line) {
		// Calculate vector from vector1 to vector2
		const vector = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };

		// Calculate vector from point to vector1
		const pointVector = { x: pointX - line.start.x, y: pointY - line.start.y };
	
		// Calculate dot product and projection of pointVector onto vector
		const dotProduct = pointVector.x * vector.x + pointVector.y * vector.y;
		const projPointVectorOnVector = {
			x: (dotProduct / (vector.x ** 2 + vector.y ** 2)) * vector.x,
			y: (dotProduct / (vector.x ** 2 + vector.y ** 2)) * vector.y,
		};
	
		// Calculate vector from point to line
		const vectorToLine = new Vector2D(pointVector.x - projPointVectorOnVector.x, pointVector.y - projPointVectorOnVector.y)
	
		return vectorToLine;
	}
}