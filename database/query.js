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
