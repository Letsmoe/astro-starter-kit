import EventEmitter from "events";
import type { Loop } from "./Loop";
import type { Scene } from "./Scene";

interface RendererOptions {
	enableBatchOptimization?: boolean;
}

export class Renderer2D extends EventEmitter {
	public canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	// Whether the renderer should automatically clear it's output before drawing the next frame.
	public autoClear: boolean = true;
	// If `autoClear` is enabled, sets the default background to clear with.
	public autoClearColor: string = "#fff";

	public renderOnResize: boolean = true;

	private currentScene: Scene | null = null;

	public options: RendererOptions;

	public mouseX: number = 0;
	public mouseY: number = 0;

	public constructor(canvas: HTMLCanvasElement, options: RendererOptions = {}) {
		super();
		const defaults: RendererOptions = {
			enableBatchOptimization: true
		}
		this.options = Object.assign(defaults, options);
		this.canvas = canvas;
		let context = canvas.getContext("2d");
		if (!context) {
			throw new Error("Could not get context from canvas.");
		}
		this.ctx = context;

		const mouseEventHandler = (name: string, e: MouseEvent) => {
			let bBox = this.canvas.getBoundingClientRect();
			if (this.currentScene) {
				this.currentScene.emit(name, {
					x: e.clientX - bBox.left,
					y: e.clientY - bBox.top,
					event: e
				});
			}
		}

		this.canvas.addEventListener("mousemove", (e) => {
			let bBox = this.canvas.getBoundingClientRect();
			this.mouseX = e.clientX - bBox.left;
			this.mouseY = e.clientY - bBox.top;
			mouseEventHandler("mousemove", e)
		})

		const eventNames = ["mousedown", "mouseup", "mouseout", "mouseleave", "mouseenter", "click"]
		for (const name of eventNames) {
			this.canvas.addEventListener(name, (e) => mouseEventHandler(name, e as MouseEvent))
		}

		const keyboardEvents = ["keydown", "keyup"];
		for (const name of keyboardEvents) {
			document.addEventListener(name, (e: Event) => {
				this.currentScene?.emit(name, {event: e})
			})
		}
	}

	public setAnimationLoop(loop: Loop) {
		loop.on("update", () => {
			if (loop.scene) {
				this.render(loop.scene)
			}
		})
	}

	public get width(): number {
		return this.canvas.width;
	}

	public get height(): number {
		return this.canvas.height;
	}
	
	/**
	 * Executes the callback function inside a `save`, `restore` block.
	 * @date 3/1/2023 - 10:13:46 PM
	 *
	 * @private
	 * @param {() => void} callback
	 * @returns {void) => void}
	 */
	public whileSaved(callback: (ctx: CanvasRenderingContext2D) => void): void {
		this.ctx.save();
		callback(this.ctx);
		this.ctx.restore()
	}

	public clear(color: string = this.autoClearColor) {
		this.clearArea(0, 0, this.canvas.width, this.canvas.height, this.autoClearColor)
	}

	public clearArea(x: number, y: number, width: number, height: number, color: string = this.autoClearColor) {
		this.whileSaved(() => {
			this.ctx.fillStyle = color;
			this.ctx.clearRect(x, y, width, height);
		})
	}

	public render(scene: Scene): Renderer2D {
		// Check if we should clear the context.
		if (this.autoClear) {
			this.clear(this.autoClearColor)
		}

		scene.render(this, this.options.enableBatchOptimization);
		this.currentScene = scene;
		return this;
	}
}