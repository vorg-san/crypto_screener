const _ = require('lodash')

const db = require("../../utils/db");
const query = require('../../utils/query')
const utils = require("../../utils/util")


export default async function handler(req, res) {
	const { timeframe_name } = req.query
	const amount_of_candles = 10

	if(!timeframe_name) {
		res.status(500).json('Please provide all info')
		return
	}

	let timeframes = await query.timeframes()
	let timeframe = _.filter(timeframes, {'name': timeframe_name})[0]
  
	let tickers = await utils.candles_last_n_by_timeframe_dict(amount_of_candles, timeframe.id)

	Object.keys(tickers).map(t => {
		for (let i = 0; i < tickers[t].length - 1; i++) {
			tickers[t][i] = (tickers[t][i] / tickers[t][i+1] - 1) * 10000
		}
		tickers[t].splice(tickers[t].length-1, 1)
		tickers[t] = Math.floor(tickers[t].reduce((acc, current, index) => acc + current * 0.96 ** index, 0))
	})

  res.json(tickers);
}
