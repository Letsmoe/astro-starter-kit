import { Circle, Collision, Line, Renderer2D, Vector2D } from "./renderer";
import { Loop } from "./renderer/Loop";
import { Scene } from "./renderer/Scene";
import { Distance } from "./renderer/Distance"
import { Angle } from "./renderer/Angle";
import { shared } from "./shared";
import { Rectangle } from "./renderer/Rectangle";
import { TextElement } from "./renderer/TextElement";

export function initCanvas(canvas: HTMLCanvasElement) {
	const renderer = new Renderer2D(canvas, {
		enableBatchOptimization: false
	});
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const scene = new Scene();
	const loop = new Loop(scene);
	renderer.setAnimationLoop(loop);

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	function removeSupports() {
		for (const [id, item] of scene.children) {
			if (item.data.isSupport) {
				scene.remove(item);
			}
		}
	}

	function startCycle({ x: startX, y: startY }: {x: number, y: number}) {
			let endX = startX, endY = startY;
			const previewLine = new Line(startX, startY, endX, endY, {
				z: 1,
				width: 1.5,
				color: "blue"
			}, { isSupport : true });
			previewLine.reactive = [
				() => [startX, startY, endX, endY]
			]

			scene.add(previewLine)
	
			// Support lines
			const supportLines = Array(8).fill(0).map((x, i) => {
				const angle = i * Math.PI / 4;
	
				const line = new Line(startX, startY, startX, renderer.height * 4, {
					z: 0,
					color: "#aaa",
					dashStyle: [5,5],
					width: 0.5
				}, { isSupport : true });
	
				line.reactive = [
					() => [startX, startY, startX, renderer.height * 4],
					() => line.rotate([startX, startY], angle)
				];
				scene.add(line)
				return line;
			})

			let currentReferenceLines: Line[] = [];
			const onMouseMove = ({ x, y, event }: { x: number, y: number, event: MouseEvent }) => {
				currentReferenceLines.map(x => scene.remove(x));
				currentReferenceLines = [];
				// If the ctrl key is pressed we are not going to attach the lines to placeholders.
				const ctrl = event.ctrlKey;
				if (ctrl) {
					endX = x;
					endY = y;
				} else {
					const tolerance = 25;
					// If the cursor is within `tolerance` pixel of a line, stomp it directly on there.
					const distances = supportLines.map(line => {
						const vec = Distance.pointLine(x, y, line);
						return vec;
					});
					let closestDistance = distances.sort(
						(a, b) => (a.magnitude() - b.magnitude())
					)[0];
					// Find all reference lines that roughly intersect with the current coordinates.
					for (const [id, child] of scene.children) {
						if (!(child instanceof Line) || child.data.isSupport) {
							continue;
						}
						
						// Check if the distance is less than our tolerance
						if (closestDistance.magnitude() < tolerance) {
							// Attach it to the line.
							// Figure out where we need to attach it.
							endX = x - closestDistance.x;
							endY = y - closestDistance.y
						} else {
							// Draw normal
							endX = x;
							endY = y;
						}

						let currentPoint = new Vector2D(endX, endY);

						// Calculate the angle between the current point and both the start and end points of the line.
						const startAngle = Angle.betweenPoints(currentPoint, child.start) * 180 / Math.PI;

						// Tolerance ~4° for best results
						if (startAngle % 45 <= 4 && startAngle % 45 >= -4) {
							// We don't want to attach the guiding line to our cursor,
							// instead we want to attach the end position to an imaginary
							// line going out from the starting point in the direction
							// of the support line.
							let helperLine = new Line(child.start.x, child.start.y, renderer.width, child.start.y, {
								width: 1,
								color: "#aaa"
							}, { isSupport : true })
							helperLine.rotate([child.start.x, child.start.y], Math.round(startAngle / 45) * 45 * Math.PI / 180);
							const vec = Distance.pointLine(endX, endY, helperLine);
							//endX = endX - vec.x;
							//endY = endX - vec.y

							let support = new Line(child.start.x, child.start.y, endX, endY, {
								color: "#aaa",
								dashStyle: [5,5],
								width: 1
							}, { isSupport : true })

							currentReferenceLines.push(support);

							scene.add(support)
						}
					}
	
					
				}
				// Draw thick blue line from start to end
				// Draw a little annotation above the cursor with the current coordinates.
				//drawTextBox(`${x} ${y}`, x, y, ctx);
			};

			const onMouseUp = (e: MouseEvent) => {
				// Append the line to our scene
				const line = new Line(startX, startY, endX, endY);
				scene.add(line);
				scene.off("mousemove", onMouseMove)
				scene.off("keydown", onKeydown)
				// Remove support lines
				removeSupports()
				// Restart it so we can draw a square
				startCycle({x: endX, y: endY})
			}
	
			scene.once("mouseup", onMouseUp)

			const onKeydown = ({ event }: { event: KeyboardEvent }) => {
				if (event.key == "Escape") {
					scene.off("mousemove", onMouseMove)
					scene.off("keydown", onKeydown)
					scene.off("mouseup", onMouseUp)
					// Remove support lines
					removeSupports();
					scene.once("mousedown", mousedownHandler)	
				}
			}

			scene.on("keydown", onKeydown)
			scene.on("mousemove", onMouseMove)
	}

	function drawRectangleCycle({ x: startX, y: startY }: { x: number, y: number }) {
		let endX = startX, endY = startY;
		const previewRectangle = new Rectangle(startX, startY, endX, endY, {
			z: 1,
			borderColor: "#333333",
			fillColor: "#eeeeee",
			borderWidth: 2
		}, { isSupport : true });

		previewRectangle.reactive = [
			() => [startX, startY, endX - startX, endY - startY]
		]

		scene.add(previewRectangle)

		const onMouseMove = ({ x, y, event }: { x: number, y: number, event: MouseEvent }) => {
			endX = x;
			endY = y;
		};

		const onMouseUp = (e: MouseEvent) => {
			// Append the line to our scene
			const rectangle = new Rectangle(startX, startY, endX - startX, endY - startY, {
				borderColor: "#333333",
				fillColor: "#eeeeee",
				borderWidth: 2
			});
			// Check if it interferes with any rectangles already placed.
			for (const [i, rect] of scene.children) {
				if (!(rect instanceof Rectangle) || rect.data.isSupport) {
					continue
				}
				if (Collision.twoRectangles(rectangle, rect)) {
					scene.once("mousedown", mousedownHandler);
					return
				}
			}
			scene.add(rectangle);
			scene.off("mousemove", onMouseMove)
			scene.off("keydown", onKeydown)
			// Remove support lines
			removeSupports()
			scene.once("mousedown", mousedownHandler)	
		}

		scene.once("mouseup", onMouseUp)

		const onKeydown = ({ event }: { event: KeyboardEvent }) => {
			if (event.key == "Escape") {
				scene.off("mousemove", onMouseMove)
				scene.off("keydown", onKeydown)
				scene.off("mouseup", onMouseUp)
				// Remove support lines
			
				scene.once("mousedown", mousedownHandler)	
			}
		}

		scene.on("keydown", onKeydown)
		scene.on("mousemove", onMouseMove)
	}

	const mousedownHandler = (e: MouseEvent) => {
		if (shared.drawMode.data == "rectangle") {
			drawRectangleCycle(e)
		} else if (shared.drawMode.data == "line") {
			startCycle(e)
		}
	}

	const frameTimeCounter = new TextElement(renderer.width - 55, 20, "0ms");

	frameTimeCounter.reactive = [
		() => [renderer.width - 55, 20, `${Math.round(loop.lastMeasuredFrameTimeMs)}ms`]
	]

	scene.add(frameTimeCounter)

	scene.on("keydown", ({ event }) => {
		if (event.key == "1") {
			shared.drawMode.update("line");
		} else if (event.key == "2") {
			shared.drawMode.update("rectangle")
		}
	})

	scene.once("mousedown", mousedownHandler)

	loop.start(10)

	return loop;
}
