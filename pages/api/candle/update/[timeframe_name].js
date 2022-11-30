const moment = require('moment')
const ccxt = require ('ccxt')
const _ = require('lodash')

const db = require('../../utils/db')
const query = require('../../utils/query')

let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms))

export default async function handler(req, res) {
	const { timeframe_name } = req.query

	if(!timeframe_name) {
		res.status(500).json('Please provide all info')
		return
	}

	let timeframes = await query.timeframes()
	let timeframe = _.filter(timeframes, {'name': timeframe_name})[0]
	let exchanges = await query.exchanges()
	let pairs = await query.pairs()

	await Promise.all(exchanges.map(async e => {
		let exchange = new ccxt[e.name]()
		let exchange_pairs = _.filter(pairs, {'exchange_id' : e.id})
		
		let last = moment("1990-01-01")
		let wait, count = 0
	
		for(let pair of exchange_pairs) {
			wait = exchange.rateLimit * 1.1 - moment().diff(last)
			if(wait > 0)
				await sleep(wait)
				last = moment()
			
			try {
				let lastCandle = await nextCandleStart(pair.id, timeframe)
				let candles = await exchange.fetchOHLCV(pair.base + '/' + pair.quote, timeframe.name) //use one more param to get older candles moment(old).valueOf()
				let totalReceived = candles.length
				
				console.log(++count + '/' + _.keys(pairs).length, pair.id, pair.base + '/' + pair.quote, totalReceived, lastCandle.format('YYYY-MM-DD HH:mm:SS'))
						
				_.each(candles, async c => {
					if(moment(c[0]).isSameOrAfter(lastCandle)) 
						saveCandle(pair.id, c[0], c[1], c[2], c[3], c[4], c[5], timeframe.id, timeframe.minutes)
				})
			} catch(err) {
				console.error(err)
			}
		}
	}))	
	
	res.json('ok')
}

async function nextCandleStart(idPar, timeframe)	 {
	let rows = await db.query(
		"select max(start) as last " +
		"from candle " +
		"where pair_id = ? and timeframe_id = ? ",
		[idPar, timeframe.id]
	)
	
	if(!rows.length || !rows[0].last)
		return moment("1990-01-01")
	else
		return moment(rows[0].last).add(timeframe.minutes * (-1) * 600, 'minutes')
}

async function saveCandle(idPar, time, open, high, low, close, volume, idTtimeframe, minutes) {
	let rows = await db.query(
		"select id from candle where pair_id = ? and timeframe_id = ? and start = ? ",
		[idPar, idTtimeframe, moment(time).format('YYYY-MM-DD HH:mm:SS')]
	)

	if(!rows.length)
		db.query(
			"insert into candle (pair_id, start, end, timeframe_id, open, high, low, close, volume) " +
			"values(?, ?, ?, ?, ?, ?, ?, ?, ?) ",
			[idPar, moment(time).format('YYYY-MM-DD HH:mm:SS'), moment(time).add(minutes,'m').format('YYYY-MM-DD HH:mm:SS'), 
			idTtimeframe, open, high, low, close, volume]
		)
}
