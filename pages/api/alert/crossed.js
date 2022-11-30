const db = require("../utils/db");

export default async function handler(req, res) {
	let alerts = await db.query(`
		select a.id, p.base, a.price, a.above
		from alert a
			join pair p on a.pair_id = p.id
		where a.removed is null
			and a.crossed is not null
		order by crossed desc
		limit 5
	`)
  
  res.json(alerts);
}
