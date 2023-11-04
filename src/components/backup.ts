interface Line {
	endX: number;
	endY: number;
	startX: number;
	startY: number;
	type: "line";
}

export function initCanvas(canvas: HTMLCanvasElement) {

	const lines: Line[] = [];
	let endX = 0;
	let endY = 0;

	function render() {
		clear();
		drawAllLines(lines, ctx);
	}

	function startSquareCycle(pointX: number, pointY: number) {
		// Draw a point in every direction from the point of entrance
		render();
		drawOutgoingLines(pointX, pointY, ctx);

		const onMouseMove = (moveEvent: MouseEvent) => {
			let x = moveEvent.clientX - canvas.getBoundingClientRect().left;
			let y = moveEvent.clientY - canvas.getBoundingClientRect().top;
			// If the ctrl key is pressed we are not going to attach the lines to placeholders.
			const ctrl = moveEvent.ctrlKey;
			render();
			drawOutgoingLines(pointX, pointY, ctx);
			if (ctrl) {
				endX = x;
				endY = y;
			} else {
				const tolerance = 25;
				// If the cursor is within `tolerance` pixel of a line, stomp it directly on there.
				const distances = calculateLineDistance(pointX, pointY, x, y, ctx);
				let [closestDistance, direction] = distances.sort(
					(a, b) => a[0] - b[0]
				)[0];
				// Find all reference lines that roughly intersect with the current coordinates.
				const intersectingLines = findIntersectingLines(
					lines,
					x,
					y,
					ctx,
					tolerance
				);
				// If we found an intersecting line we need to draw support lines for it
				// we only take the first line so the cursor doesn't jump around all crazy.
				if (intersectingLines.length > 0) {
					let line = intersectingLines[0];
					drawOutgoingLines(line.startX, line.startY, ctx, "#aaa");
					let intersectionPoint = line_intersect(
						line.startX,
						line.startY,
						line.endX,
						line.endY,
						pointX,
						pointY,
						endX,
						endY
					);
					if (intersectionPoint) {
						endX = intersectionPoint.x;
						endY = intersectionPoint.y;
					}
				}

				// Check if the distance is less than our tolerance
				if (closestDistance < tolerance) {
					// Attach it to the line.
					// Figure out where we need to attach it.
					switch (direction) {
						// Right
						case "x":
							endX = x;
							endY = pointY;
							break;
						case "y":
							endX = pointX;
							endY = y;
							break;
						case "rt":
							// TODO: rt, rb, lt, lb
							drawLine(pointX, pointY, x, y, ctx);
							break;
					}
				} else {
					// Draw normal
					endX = x;
					endY = y;
				}
			}
			// Draw thick blue line from start to end
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = "blue";
			ctx.moveTo(pointX, pointY);
			ctx.lineTo(endX, endY);
			ctx.stroke();
			ctx.restore();
			// Draw a little annotation above the cursor with the current coordinates.
			drawTextBox(`${x} ${y}`, x, y, ctx);
		};

		const onMouseUp = (mouseEvent: MouseEvent) => {
			// Append the line to our line array
			lines.push({
				endX: endX,
				endY: endY,
				type: "line",
				startX: pointX,
				startY: pointY,
			});

			// Remove move listener
			clear();
			drawAllLines(lines, ctx);
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("mouseup", onMouseUp);
			document.removeEventListener("keydown", onKeydown);

			// Restart it so we can draw a square
			startSquareCycle(endX, endY);
		};

		const onKeydown = (keyEvent: KeyboardEvent) => {
			console.log(keyEvent);
			if (keyEvent.key == "Escape") {
				render();
				canvas.removeEventListener("mousemove", onMouseMove);
				canvas.removeEventListener("mouseup", onMouseUp);
				canvas.removeEventListener("mousedown", onMouseDown);
				document.removeEventListener("keydown", onKeydown);
				attachListener();
			}
		};

		document.addEventListener("keydown", onKeydown);
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseup", onMouseUp);
	}

	const onMouseDown = (downEvent: MouseEvent) => {
		let pointX = downEvent.clientX - canvas.getBoundingClientRect().left;
		let pointY = downEvent.clientY - canvas.getBoundingClientRect().top;
		startSquareCycle(pointX, pointY);
		canvas.removeEventListener("mousedown", onMouseDown);
	};

	function attachListener() {
		canvas.addEventListener("mousedown", onMouseDown);
	}
	attachListener();
}

function findIntersectingLines(
	lines: Line[],
	x: number,
	y: number,
	ctx: CanvasRenderingContext2D,
	tolerance: number = 25
) {
	// Draw support lines in each direction for every line and calculate the distance from the point to each line.
	const distances = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const supportLines = calculateSupportingLines(
			line.startX,
			line.startY,
			ctx
		);
		for (let j = 0; j < supportLines.length; j++) {
			const supportLine = supportLines[j];
			// Calculate the distance from the support line to the current x and y coordinates.
			const distance = pDistance(
				x,
				y,
				supportLine.startX,
				supportLine.startY,
				supportLine.endX,
				supportLine.endY
			);
			if (distance < tolerance) {
				distances.push(line);
				break;
			}
		}
	}
	return distances;
}

function calculateSupportingLines(
	x: number,
	y: number,
	ctx: CanvasRenderingContext2D
): Line[] {
	const lines: Line[] = [
		// Line to right edge of screen
		{ startX: x, startY: y, endX: ctx.canvas.width, endY: y, type: "line" },
		// Line to left edge of screen
		{ startX: x, startY: y, endX: 0, endY: y, type: "line" },
		// Line to top edge of screen
		{ startX: x, startY: y, endX: x, endY: 0, type: "line" },
		// Line to bottom edge of screen
		{ startX: x, startY: y, endX: x, endY: ctx.canvas.height, type: "line" },
		// Line 45°
		{ startX: x, startY: y, endX: x + y, endY: 0, type: "line" },
		// Line 135°
		{ startX: x, startY: y, endX: ctx.canvas.width, endY: y, type: "line" },
		// Line 225°
		{ startX: x, startY: y, endX: 0, endY: x + y, type: "line" },
		// Line 315°
		{ startX: x, startY: y, endX: x - y, endY: 0, type: "line" },
	];
	return lines;
}

function drawTextBox(
	text: string,
	x: number,
	y: number,
	ctx: CanvasRenderingContext2D
) {
	ctx.save();
	ctx.beginPath();
	ctx.font = "16px sans";
	let metrics = ctx.measureText(text);
	let textHeight =
		metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	let textWidth = metrics.width;
	let padding = [4, 8];

	let posX = x - textWidth / 2 - 2 * padding[1];
	let posY = y - 10 - textHeight - 2 * padding[0];
	// Draw a rectangle with some distance to cursor
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(
		posX,
		posY,
		textWidth + 2 * padding[1],
		textHeight + 2 * padding[0]
	);
	ctx.fillStyle = "#000000";
	ctx.fillText(`${x} ${y}`, posX + padding[1], posY + padding[0] + textHeight);
	ctx.restore();
}

function pDistance(
	pointX: number,
	pointY: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	var A = pointX - x1;
	var B = pointY - y1;
	var C = x2 - x1;
	var D = y2 - y1;

	var dot = A * C + B * D;
	var len_sq = C * C + D * D;
	var param = -1;
	if (len_sq != 0)
		//in case of 0 length line
		param = dot / len_sq;

	var xx, yy;

	if (param < 0) {
		xx = x1;
		yy = y1;
	} else if (param > 1) {
		xx = x2;
		yy = y2;
	} else {
		xx = x1 + param * C;
		yy = y1 + param * D;
	}

	var dx = pointX - xx;
	var dy = pointY - yy;
	return Math.sqrt(dx * dx + dy * dy);
}

function calculateLineDistance(
	startX: number,
	startY: number,
	x: number,
	y: number,
	ctx: CanvasRenderingContext2D
): [number, string][] {
	let distances = [
		[pDistance(x, y, startX, startY, ctx.canvas.width, startY), "x"],
		[pDistance(x, y, startX, startY, 0, startY), "x"],
		[pDistance(x, y, startX, startY, startX, 0), "y"],
		[pDistance(x, y, startX, startY, startX, ctx.canvas.height), "y"],
		[pDistance(x, y, startX, startY, startX + startY, 0), "rt"],
		[pDistance(x, y, startX, startY, 0, startX + startY), "rb"],
		[pDistance(x, y, startX, startY, startX - startY, 0), "lt"],
	];

	return distances;
}

const drawLine = (
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	ctx: CanvasRenderingContext2D
) => {
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
};

function drawOutgoingLines(
	x: number,
	y: number,
	ctx: CanvasRenderingContext2D,
	color: string = "#000000"
) {
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.setLineDash([5, 5]);
	const supportLines = calculateSupportingLines(x, y, ctx);
	for (const line of supportLines) {
		drawLine(line.startX, line.startY, line.endX, line.endY, ctx);
	}
	ctx.stroke();
	ctx.restore();
}

function line_intersect(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
	x4: number,
	y4: number
) {
	var ua,
		ub,
		denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	if (denom == 0) {
		return null;
	}
	ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
	ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
	return {
		x: x1 + ua * (x2 - x1),
		y: y1 + ua * (y2 - y1),
		seg1: ua >= 0 && ua <= 1,
		seg2: ub >= 0 && ub <= 1,
	};
}
