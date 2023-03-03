import pkg from "pg";
const { Client } = pkg;

export async function query(sql: string, parameters?: any[]) {
	const client = new Client({
		database: "stack-exchange-offline",
		host: "localhost",
		password: "Lateman47,43,s54",
		user: "stack-exchange",
	});
	await client.connect();
	let result = await client.query(sql, parameters);
	await client.end();
	return result;
}