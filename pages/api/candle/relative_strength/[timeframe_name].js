const _ = require('lodash')

const db = require("../../utils/db");
const query = require('../../utils/query')
const utils = require("../../utils/util")


export default async function handler(req, res) {
	const { timeframe_name } = req.query
	const amount_of_candles = 60

	if(!timeframe_name) {
		res.status(500).json('Please provide all info')
		return
	}

	let timeframes = await query.timeframes()
	let timeframe = _.filter(timeframes, {'name': timeframe_name})[0]
  
	let r = await utils.candles_last_n_by_timeframe_dict(amount_of_candles, timeframe.id)

	// Object.keys(r).map(ticker => {
	// 	r[ticker] = getLevel(100 * r[ticker].reduce((acc, current) => acc += , 0) )
	// })

  res.json(r);
}
