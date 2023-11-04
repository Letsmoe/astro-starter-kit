
<script lang="ts">
  import { onMount } from "svelte";
  import { initCanvas } from "./canvas";
  import type { Loop } from "./renderer/Loop";
	import Toolbar from "./Toolbar.svelte";


	let canvas: HTMLCanvasElement;
	let loop: Loop;

	onMount(() => {
		loop = initCanvas(canvas)
	})
</script>

<Toolbar></Toolbar>
<canvas bind:this={canvas}></canvas>