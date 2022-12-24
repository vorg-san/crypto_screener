const moment = require('moment')
const ccxt = require ('ccxt')

export default async function handler(req, res) {
	matchTrades()
	res.json('ok')
	return;
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
		myTrades[t['order']]['amount'] += (myTrades[t['order']]['side'] === 'sell' ? -1 : 1) * t['amount']
		myTrades[t['order']]['cost'] += t['cost']
		myTrades[t['order']]['price'] = myTrades[t['order']]['cost'] / myTrades[t['order']]['amount']
	})
	console.log(myTrades)
	

	res.json('ok')
}

const trades = {
	'987190296': {
		datetime: '2022-02-12T11:00:08.696Z',
		side: 'buy',
		amount: 32.5,
		cost: 349.5375,
		price: 10.755
	},
	'1794163296': {
		datetime: '2022-11-30T19:18:03.905Z',
		side: 'buy',
		amount: 3865.7999999999997,
		cost: 6722.6262,
		price: 1.739
	},
	'1794508521': {
		datetime: '2022-12-01T02:23:04.965Z',
		side: 'sell',
		amount: -3898.2999999999997,
		cost: -6728.4658,
		price: 1.726
	},
	'1794508529': {
		datetime: '2022-12-01T02:23:04.965Z',
		side: 'sell',
		amount: -3898.2999999999997,
		cost: -6728.4658,
		price: 1.726
	},
	'1794508539': {
		datetime: '2022-12-05T02:23:04.965Z',
		side: 'sell',
		amount: 3898.2999999999997,
		cost: 6728.4658,
		price: 1.726
	}
}
 
async function matchTrades() {
	let pnl = []
	let amount = 0
	let average_cost = 0
	let last_entry = ''

	Object.keys(trades).map(k => {
		if(trades[k].amount * amount < 0) {
			//closing trade
			let signal = trades[k].amount < 0 ? -1 : 1
			let closing_amount = Math.min(Math.abs(amount), Math.abs(trades[k].amount))

			pnl.push({
				'entry': average_cost / amount, 
				'exit': trades[k].cost / trades[k].amount, 
				'profit': (trades[k].cost / trades[k].amount - average_cost / amount) * closing_amount,
				'exit_when': trades[k].datetime,
				'duration': moment(trades[k].datetime).from(last_entry, true) 
			})

			average_cost *= ((Math.abs(amount) - closing_amount) / Math.abs(amount))
			amount += signal * closing_amount
		} else {
			amount += trades[k].amount
			average_cost += trades[k].cost
			last_entry = trades[k].datetime
		}
		console.log(amount, average_cost, amount !== 0 ? average_cost / amount : 0)
	})

	console.log(pnl);
}
