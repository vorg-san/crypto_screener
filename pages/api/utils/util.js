const query = require('./query')

export async function candles_last_n_by_timeframe_dict(n, idTimeframe) {
	let candles = await query.candles_last_n_by_timeframe(n, idTimeframe)
	let pairs = await query.pairs()

	let r = {}

	for (let i = 0; i < candles.length; i++) {
		if(!(candles[i].pair_id in r))
			r[candles[i].pair_id] = []
		r[candles[i].pair_id].push(candles[i].close)
	}

	for (let i = 0; i < pairs.length; i++) {
		Object.keys(r).map(c => {
			if(c === pairs[i].id)
				r[c].splice(0, 0, pairs[i].last_price)
		})
	}

	return r
}