import type { Dataset } from "./GetNewestDatasets";
import * as path from "path"
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { UnzipDataset, DownloadDataset } from "./DonwloadDatasets";


export async function startDatasetDownload(dataset: Dataset) {
	// We need to get the filename from the dataset url, download the file into the "content" folder 
	// and unzip it there
	const fileName = path.parse(dataset.url).base;
	const targetFileName = path.join(__dirname, "../../content/" + fileName);
	
	DownloadDataset(fileName, targetFileName).then(() => {
		// Extract to content directory
		const dir = path.join(__dirname, "../../content/" + path.parse(dataset.url).name);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		}
		UnzipDataset(targetFileName, dir)
	}).catch()
}

export function isAlreadyDownloaded(dataset: Dataset): boolean {
	let dir = path.join(__dirname, "../../content/", dataset.name)

	if (fs.existsSync(dir)) {
		return true;
	}

	return false;
}