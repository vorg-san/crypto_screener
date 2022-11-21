const db = require("/banco/db.js");

export default async function handler(req, res) {
  let cryptos = await db.query(`
		select p.id, concat(p.base, p.quote) as ticker, e.name as exchange, p.last_price
		from pair p 
			join exchange e on e.id = p.exchange_id 
		order by concat(p.base, p.quote)
	`)

	let alerts = await db.query(`
		select id, pair_id, price, above, crossed
		from alert
		where removed is null
	`)

	cryptos.map(c => {
		alerts.map(a => {
			if(c.id === a.pair_id) {
				if(!c.alerts)
					c.alerts = []
				c.alerts.push(a)
			}
		})	
	})
  
  res.json(cryptos);
}
