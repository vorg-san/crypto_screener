const moment = require('moment')
const ccxt = require ('ccxt')
const _ = require('lodash')

const db = require('../utils/db')
const query = require('../utils/query')

export default async function handler(req, res) {
	let exchanges = await query.exchanges()
	let pairs = await query.pairs()

	await Promise.all(exchanges.map(async e => {
		let exchange = new ccxt[e.name]()
		
		if(!exchange.has.fetchTickers) {
			console.log(`Exchange ${e.name} has no fetchTickers`)
		} else {
			let pairs_list = _.filter(pairs, {'exchange_id' : e.id}).map(p => p.base + '/' + p.quote)

			try {
				let tickers = await exchange.fetchTickers(pairs_list)

				for(let key in tickers) {
					let pair = pairs.find(p => key === p.base + '/' + p.quote)

					if(tickers[key].quoteVolume > 500000)
						db.query(
							"update pair set last_price = ?, last_volume = ? where id = ? ",
							[tickers[key].last, tickers[key].quoteVolume, pair.id]
						)
					else 
						db.query(
							"update pair set low_volume = ?, last_volume = ? where id = ? ",
							[true, tickers[key].quoteVolume, pair.id]
						)

					pair['updated'] = true
				}

				for(let i = 0; i < pairs.length; i++) {
					if(!pairs[i]['updated'])
						db.query(
							"update pair set low_volume = ? where id = ? ",
							[true, pairs[i].id]
						)
				}
			} catch(err) {
				console.error(err)
			}
		}
	}))	
	
	res.json('ok')
}
