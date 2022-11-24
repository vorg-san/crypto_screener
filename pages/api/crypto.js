const db = require("/database/db.js");
const query = require('/database/query.js')

export default async function handler(req, res) {
  let cryptos = await db.query(`
		select p.id, concat(p.base, p.quote) as ticker, e.name as exchange, p.last_price
		from pair p 
			join exchange e on e.id = p.exchange_id
		where p.low_volume = 0 
		order by last_volume desc
	`)

	let alerts = await query.alertsActive()

	cryptos.map(c => {
		c.alerts = []
		alerts.map(a => {
			if(c.id === a.pair_id) {
				c.alerts.push(a)
			}
		})	
	})

	cryptos.sort((a, b) => {
		return b.alerts.length - a.alerts.length
	})
  
  res.json(cryptos);
}
