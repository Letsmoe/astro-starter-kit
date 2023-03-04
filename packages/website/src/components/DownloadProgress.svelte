<script lang="ts">
	import { WebSocketClient } from "../lib/BrowserSocket";
	const client = new WebSocketClient("ws://localhost:8080");

	const downloads: {
		[key: string]: {
			status: "started" | "downloading" | "error" | "success",
			progress?: number,
			eta?: number,
			file?: string,
			speed?: number
		}
	} = {};

	client.on("open", () => {
		client.subscribe("dataset:download:start", (data: { file: string }) => {
			downloads[data.file] = {
				status: "downloading",
				file: data.file
			};
		})

		// progress in percent, speed in KB/s, eta in seconds
		client.subscribe("dataset:download:progress",(data: { progress: number, speed: number, eta: number, file: string }) => {
			downloads[data.file] = {
				status: "downloading",
				file: data.file,
				progress: data.progress,
				eta: data.eta,
				speed: data.speed
			};
			
		})
		
		client.subscribe("dataset:download:success", (data: { file: string, time: number }) => {
			downloads[data.file] = {
				status: "success",
				file: data.file
			};
		})

		client.subscribe("dataset:download:error", (data: { errors: string[], file: string }) => {
			downloads[data.file] = {
				status: "error",
				file: data.file,
			};
		})

		client.subscribe("dataset:unzip:start", (data: { file: string }) => {
			console.log(data)
		})

		// progress in percent, speed in KB/s, eta in seconds
		client.subscribe("dataset:unzip:progress",(data: { progress: number, speed: number, eta: number }) => {
			console.log(data)
		})

		client.subscribe("dataset:unzip:success", (data: { files: string[], time: number }) => {
			console.log(data)
		})

		client.subscribe("dataset:unzip:error", (data: { errors: string[] }) => {
			console.log(data)
		})
	})
</script>

<div class="mb-4 flex flex-col gap-4">
	{#each Object.values(downloads) as download}
		{#if download.status == "downloading" || download.status == "started"}
		<div class="flex flex-row w-full gap-4 items-center">
			<span class="text-sm text-slate-600">{download.file}</span>
			<div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
				<div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style="width: {download.progress || 0}%"> {download.progress}%</div>
			</div>
			<span class="text-sm text-slate-600">{Math.round(download.eta || 0).toFixed(0).padStart(6, " ")}s</span>
		</div>
		{:else if download.status == "error"}
		<div class="flex flex-row w-full gap-4 items-center">
			<span class="text-sm text-slate-600">{download.file}</span>
			<div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
				<div class="bg-red-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full w-full">Error</div>
			</div>
		</div>
		{:else if download.status == "success"}
		<div class="flex flex-row w-full gap-4 items-center">
			<span class="text-sm text-slate-600">{download.file}</span>
			<div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
				<div class="bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full w-full">Success</div>
			</div>
		</div>
		{/if}
	{/each}
</div>