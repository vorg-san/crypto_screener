const db = require('../utils/db')

export default async function handler(req, res) {
	let payload = JSON.parse(req.body || '{}')

	if(!payload.id) {
		res.status(500).json('Please provide all info')
		return
	}

	await db.query('update alert set removed = current_timestamp where id = ?', [payload.id])
	res.json('ok')
}