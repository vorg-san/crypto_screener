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

export async function read_candles_timeframes() {
	return await db.query(`
		select id, name, minutes 
		from timeframe 
		where read_candles=1
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

export async function pairsShouldUpdate(idTimeframe) {
	return (await db.query(`
		select p.id, case when t.id is null then 1 else max(start) + interval t.minutes minute <= now() end as should_update
		from pair p
			left join candle c on p.id = c.pair_id
			left join (
				select id, minutes
				from timeframe 
				where id = ?
			) t on t.id = c.timeframe_id 
		where p.low_volume = 0
		group by c.pair_id 
		having should_update = 1
	`, [idTimeframe])).map(r => r['id'])
}

export async function isTaskRunning(name) {
	let rows = await db.query(`
		select running and (last_start + interval 10 minute + interval duration minute) > current_timestamp as running
		from task 
		where name = ?
	`, [name])

	return rows.length ? rows[0]['running'] : false
}

export async function startTask(name) {
	let success = !await isTaskRunning(name)
	if(success)
		db.query(`
			update task set running = 1, last_start = current_timestamp, last_end = null where name = ?
		`, [name])
	return success
}

export async function endTask(name) {
	let success = await isTaskRunning(name)
	if(success)
		db.query(`
			update task set running = 0, last_end = current_timestamp, duration = TIMESTAMPDIFF(MINUTE, last_start, current_timestamp) where name = ?
		`, [name])
	return success
}