const db = require('./db.js')

export async function exchanges() {
	return await db.query(`
		select id, name
		from exchange 
	`)
}

export async function pairs() {
	return await db.query(`
		select id, exchange_id, base, quote, last_price 
		from pair 
		where low_volume = 0 
		order by last_volume desc
	`)
}

export async function timeframes() {
	return await db.query(`
		select id, name, minutes 
		from timeframe 
	`)
}

export async function candles_last_n_by_timeframe(n, idTimeframe) {
	return await db.query(`
		select pair_id, start, close
		from ( 
			select pair_id, start, close, ROW_NUMBER() OVER (PARTITION BY pair_id, timeframe_id ORDER BY start DESC) AS n 
			from candle
			where timeframe_id = ? 
		) t
		where n <= ?
		order by pair_id, start desc 
	`, [idTimeframe, n])
}

export async function alertsActive() {
	return await db.query(`
		select id, pair_id, price, above, crossed
		from alert
		where removed is null
			and crossed is null
	`)
}
