<script lang="ts">
  import type { Dataset } from "../lib/GetNewestDatasets";
  import Popin from "./Popin.svelte";

	export let open: (dataset: Dataset) => void;
	let isOpen = false;
	let currentDataset: Dataset;
	open = (dataset: Dataset) => {
		currentDataset = dataset;
		isOpen = true;
	}

	let showPopin: (message: string) => {};

	const startDownload = async () => {
		isOpen = false;
		const result = await fetch("/api/dataset", {
			method: "POST",
			body: JSON.stringify(currentDataset)
		})

		const json = await result.json()
		if (json.success == true) {
			showPopin("Started download, you can see it in the downloads section now.")
		} else {
			showPopin("Something went wrong!");
		}
	}
</script>

{#if isOpen}
<dialog class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg z-50 shadow-md border border-slate-300" open={isOpen}>
	<p>Are you sure you want to download <code>{currentDataset.url}</code>? It's {(currentDataset.size / 1024 ** 3).toFixed(2)}GB in size! This might take a while depending on your connection speed.</p>
	<p>This operation will download the required files from "archive.org" and store them in the "persistent" folder.</p>
	<p>The files will be added do your "downloads" section where you can see the progress of the installation.</p>
	<p>After that a database will be created and the content will be uploaded to it.</p>
	<div class="flex flex-row gap-4 mt-4">
		<button on:click={startDownload} class="rounded-lg px-4 py-2 bg-slate-200">Download</button>
		<button on:click={() => {
			isOpen = false;
		}} class="rounded-lg px-4 py-2 bg-red-600 text-white">Cancel</button>
	</div>
</dialog>
<div class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-10"></div>
{/if}
<Popin bind:show={showPopin}></Popin>