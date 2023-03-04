import Seven from "7zip-min";
import * as fs from "fs";
import { WebSocketClient } from "../Socket";

export async function UnzipDataset(file: string, target: string): Promise<boolean> {
	const socket = new WebSocketClient("ws://localhost:8080");
	
	return new Promise((resolve, reject) => {
		socket.on("open", async () => {
			Seven.unpack(file, target, (err) => {
				if (err) {
					console.log(err.message);
					fs.rmdirSync(target, { recursive: true })
					return;
				}
		
				fs.rmSync(file);
			});
		})
	})
}