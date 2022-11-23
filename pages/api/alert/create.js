const db = require('/database/db.js')

export default async function handler(req, res) {
	let payload = JSON.parse(req.body || '{}')

	if(!payload.ticker || !payload.price) {
		res.status(500).json('Please provide all info')
		return
	}

	await db.query('insert into alert (pair_id, price, above, created) values (?, ?, ?, current_timestamp)', [payload.ticker, payload.price, payload.above])
	res.json('ok')
}