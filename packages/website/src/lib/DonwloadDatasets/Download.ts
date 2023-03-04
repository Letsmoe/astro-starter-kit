import axios from "axios";
import * as fs from "fs";
import { WebSocketClient } from "../Socket";

export async function DownloadDataset(
	name: string,
	target: string
): Promise<boolean> {
	const socket = new WebSocketClient("ws://localhost:8080");
	let lastProgressTime = (new Date()).getTime();
	let lastProgressBytes = 0;
	return new Promise((resolve, reject) => {
		socket.on("open", async () => {
			// Create a writestream to pipe the file to
			const writeStream = fs.createWriteStream(target);
			// Emit a start event
			socket.emit("dataset:download:start", { file: name })
			axios.request({
				method: "get",
				url: "https://archive.org/download/stackexchange/" + name,
				onDownloadProgress: (progress) => {
					// There might not be a content-length header on the resource we're trying to fetch.
					let percent = 0;
					if (progress.total) {
						percent = Math.round((progress.loaded * 100) / progress.total);
					}

					// Get the speed by calculating how many bytes we have received since the last time
					let time = (new Date()).getTime();
					// Speed per second.
					const speed = (progress.loaded - lastProgressBytes) / (time - lastProgressTime) * 1000; 
					// Get eta by dividing content size and speed (eta in seconds);
					const eta = ((progress.total || 0) - progress.loaded) / speed;

					lastProgressTime = time;
					lastProgressBytes = progress.loaded

					socket.emit("dataset:download:progress", { progress: percent, speed, eta, file: name })
				},
				responseType: "stream"
			}).then(response => {
				response.data.pipe(writeStream);
				let error: Error;
				writeStream.on('error', (err: Error) => {
					socket.emit("dataset:download:error", { file: name, errors: [] })
					error = err;
					writeStream.close();
					reject(err);
				});
				writeStream.on('close', () => {
					// If no error occured, we can safely send a success event to the websocket and resolve true.
					if (!error) {
						socket.emit("dataset:download:success", { file: name })
						resolve(true);
					}
				});
			})
		});
	});
}
