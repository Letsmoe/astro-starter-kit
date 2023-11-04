import EventEmitter from "events";
import type { Scene } from "./Scene";

export class Loop extends EventEmitter {
	public scene: Scene;
	public frameTimeGoal: number = 0;
	public lastMeasuredFrameTimeMs = 0;
	private timer: number = 0;
	private lastTime: number = 0;
	private isStopped: boolean = false;

	public constructor(scene: Scene) {
		super();
		this.scene = scene;
	}

	public tick(timestamp: number) {
		// Advance the animation loop by one frame.
		// Check each time if the target framerate has been reached. Otherwise don't update just yet.
		if (this.isStopped) {
			return
		}
		
		let deltaTime = timestamp - this.lastTime;
		this.lastTime = timestamp;
		// The timer has surpassed the frame time goal, we need to render the next frame.
		if (this.timer > this.frameTimeGoal) {
			this.emit("update")
			this.lastMeasuredFrameTimeMs = this.timer
			this.timer = 0;
		} else {
			this.timer += deltaTime;
		}

		requestAnimationFrame(() => this.tick.bind(this)(performance.now()));
	}

	
	/**
	 * Starts the animation loop with a frameTime to achieve. This will allow optimization for a broad spectrum of computers.
	 * @date 3/2/2023 - 10:34:20 AM
	 *
	 * @public
	 * @param {number} [frameTime=16] Time to next frame in milliseconds.
	 */
	public start(frameTime: number = 16) {
		this.frameTimeGoal = frameTime;
		this.isStopped = false;
		this.tick(performance.now());
	}

	public stop() {
		this.isStopped = true;
	}
}