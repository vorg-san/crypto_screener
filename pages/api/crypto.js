const db = require('./utils/db')
const query = require('./utils/query')

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
  
  res.json(cryptos);
}
