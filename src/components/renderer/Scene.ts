import type { Renderer2D } from "./Renderer2D";
import EventEmitter from "events";
import type { RenderElement } from "./RenderElement";

export class Scene extends EventEmitter {
	public children: Map<number, RenderElement> = new Map();
	// Represents the index of every element that is entered into the list.
	public i: number = 0;
	public removeNextRun: number[] = [];
	public background: string = "#fff"
	public constructor() {
		super();
	}

	public add(o: RenderElement) {
		o.id = this.i;
		this.children.set(this.i, o);
		this.i++;
	}

	public remove(o: RenderElement) {
		this.children.delete(o.id);
	}

	public render(r: Renderer2D, batchOptimization: boolean = true) {
		// Loop through all elements from back to front (newest elements are drawn on top unless they have a z-index set).
		const children = Array.from(this.children.values()).sort((a,b) => {
			// Prevent comparing undefined z index
			if (a.options.z && b.options.z) {
				return a.options.z - b.options.z
			}
			// Keep order if they're not defined.
			return 0;
		});

		// Batch optimization allows the renderer to make fewer paint strokes while still achieving the full drawing.
		// We can naively sort items that share the same class into buckets and loop through these buckets.
		// However, we must always be aware that some items may need to be drawn at a later point in time than others
		// we will be making x + 1 buckets with the last one being reserved for items that have a z-index > 0
		// we will then sort this bucket from lowest to highest z-index and call the draw methods on each of those.
		if (batchOptimization === true) {
			const buckets: {[key: string]: RenderElement[]} = {};
			const zBucket: RenderElement[] = [];

			const values = Array.from(this.children.values())
			for (let i = 0; i < values.length; i++) {
				const child = values[i];
				// This is a good time to call the `onBeforeRender` method.
				child.onBeforeRender();
				// This will make sure the z-index is not undefined and greater than zero
				if (child.options.z) {
					zBucket.push(child);
					continue;
				}

				if (buckets.hasOwnProperty(child.constructor.name)) {
					buckets[child.constructor.name].push(child)
				} else {
					buckets[child.constructor.name] = [child];
				}
			}

			for (const bucket of Object.values(buckets)) {
				bucket[0]._batch(bucket, r);
			}

			for (const element of zBucket) {
				// Render each element individually.
				element._draw(r)
			}
		} else {
			for (const child of children) {
				child.onBeforeRender()
				child._draw(r);
			}
		}
	}
}