import type { APIRoute } from "astro";
import { error, success } from "../../lib/APIResponse";
import { startDatasetDownload } from "../../lib/Datasets";

export const post: APIRoute = async ({ request }) => {
	const body = await request.json();

	if (!body.url) {
		return error(["Missing required field: url"])
	}

	startDatasetDownload(body);

	return success()
} 