const moment = require('moment')
const ccxt = require ('ccxt')
const _ = require('lodash')

const db = require('/database/db.js')
const query = require('/database/query.js')

export default async function handler(req, res) {
	let rows = await query.exchanges()
	
	await Promise.all(rows.map(async row => {
    let exchange = new ccxt[row.name]()
    let markets = await exchange.load_markets()

		_.each(markets, async m => {
			if(m.quote === 'USDT' && m.base !== 'BUSD') 
    		await savePair(row.id, m.base, m.quote)
    })
	}))

	res.json('ok')
}

async function savePair(idExchange, base, quote) {
	let rows = await db.query(
		"select id from pair where exchange_id = ? and base = ? and quote = ? ",
		[idExchange, base, quote]
	)

	if(!rows.length)
		db.query(
			"insert into pair (exchange_id, base, quote, low_volume) " +
			"values(?, ?, ?, 0) ",
			[idExchange, base, quote]
		)
}