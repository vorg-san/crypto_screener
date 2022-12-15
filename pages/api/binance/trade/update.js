const moment = require('moment')
const ccxt = require ('ccxt')

export default async function handler(req, res) {
	let exchange = new ccxt['binance']()

	if(!exchange.has.fetchMyTrades) {
		res.status(500).json('exchange does not have this method')
		return
	}

	exchange.apiKey = process.env.binance_read_public_key
	exchange.secret = process.env.binance_read_private_key
	
	let myTrades = {}

	let last = moment("1990-01-01")
	const trades = await exchange.fetchMyTrades('NEARUSDT', last.valueOf())
	trades?.map(t => {
		if(!Object.keys(myTrades).includes(t['order'])) {
			myTrades[t['order']] = {datetime: t['datetime'], side: t['side'], amount: 0, cost: 0}
		}
		myTrades[t['order']]['amount'] += t['amount']
		myTrades[t['order']]['cost'] += t['cost']
		myTrades[t['order']]['price'] = (myTrades[t['order']]['cost'] / myTrades[t['order']]['amount']).toFixed(8)
	})
	console.log(myTrades)
	

	res.json('ok')
}