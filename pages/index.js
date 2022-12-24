import Head from "next/head";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const possibleOrderBy = {
	id: 'id', 
	strength_1h: 'strength_1h', 
	alerts: 'alerts'
}

export default function Home() {
//   const { data, error, mutate } = useSWR("/api/crypto", fetcher, { refreshInterval: 2000, refreshWhenHidden: true });
//   const crossed_alerts = useSWR("/api/alert/crossed", fetcher, { refreshInterval: 2000, refreshWhenHidden: true });
// 	const impulse = useSWR('api/candle/impulse/1h', fetcher, { refreshInterval: 5 * 60 * 1000 })
// 	const relative_strength = useSWR('api/candle/relative_strength/1h', fetcher, { refreshInterval: 5 * 60 * 1000 })
	// useSWR('/api/last_price/update', fetcher, { refreshInterval: 5000, refreshWhenHidden: true })
	// useSWR('/api/candle/update/1h', fetcher, { refreshInterval: 20*60*1000, refreshWhenHidden: true })
  const [above, setAbove] = useState(true);
  const [price, setPrice] = useState(0);
  const [ticker, setTicker] = useState(0);
	const [orderBy, setOrderBy] = useState(possibleOrderBy.strength_1h);

  if (error || crossed_alerts.error || impulse.error || relative_strength.error) return "An error has occurred.";
  if (!data || !crossed_alerts.data || !impulse.data || !relative_strength.data) return "Loading...";

  const newAlert = async () => {
		let res = await fetch('/api/alert/create', {
      method: 'POST', 
      body: JSON.stringify({
				'ticker': ticker, 
				'above': above,
				'price': price,
			})
    })
		
		if(res.status === 200)
			mutate()
  }

  const removeAlert = async (id) => {
		let res = await fetch('/api/alert/remove', {
      method: 'POST', 
      body: JSON.stringify({
				'id': id,
			})
    })

		if(res.status === 200)
			mutate()
  }

  const crossAlert = async (id) => {
		let res = await fetch('/api/alert/cross', {
      method: 'POST', 
      body: JSON.stringify({
				'id': id,
			})
    })

		if(res.status === 200)
			mutate()
  }

	const playSound = () => {
		let audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
		audio.play()
	}

	const selectTicker = e => {
		setTicker(e.target.value)
		data.map(c => {
			if(c.id == e.target.value) {
				setPrice(c.last_price)
			}
		})
	}

	data.map(c => {
		c.alerts?.map(a => {
			if((a.above && c.last_price >= a.price) || (!a.above && c.last_price <= a.price)) {
				playSound()
				crossAlert(a.id)
			}
		})

		Object.keys(impulse.data).map(id => {
			if(c.id == id)
				c['impulse'] = impulse.data[id]
		})

		c['relative_strength'] = 0
		Object.keys(relative_strength.data).map(id => {
			if(c.id == id)
				c['relative_strength'] = relative_strength.data[id]
		})
	})

	data.sort((a, b) => {
		switch (orderBy) {
			case possibleOrderBy.id:
				return a.id - b.id 
			case possibleOrderBy.strength_1h:
				return b.relative_strength - a.relative_strength
			case possibleOrderBy.alerts:
				let alert_a = a.alerts.length > 0 ? 1 : 0
				let alert_b = b.alerts.length > 0 ? 1 : 0
				return alert_b - alert_a			
		}
	})

  return (
    <div>
      <Head>
        <title>Crypto Screener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
				<select value={ticker} onChange={selectTicker}>
					{data.map(c => (
						<option value={c.id}>{c.ticker}</option>
					))}
				</select>
        <input
          type="checkbox"
          onChange={() => setAbove(!above)}
          defaultChecked={above}
        ></input>
        <input
          type="number"
          value={price}
          onInput={(e) => setPrice(e.target.value)}
        ></input>
        <button onClick={newAlert}>+</button>
				<br></br><br></br>

				Order by:
				<select value={orderBy} onChange={e => setOrderBy(e.target.value)}>
					{Object.values(possibleOrderBy).map(p => (
						<option value={p}>{p}</option>
					))}
				</select>
      </div>

			<div>
				<ul>
					{crossed_alerts.data?.map(ca => (
						<li key={ca.id}>{ca.base} {ca.above ? 'above' : 'below'} {ca.price}</li>
					))}
				</ul>
			</div>
			
      <table>
				<thead>
        <tr>
          <th>Ticker</th>
          <th>Price</th>
          <th>Alerts</th>
          <th>Impulse 1h</th>
          <th>Strength 1h</th>
        </tr>
				</thead>

				<tbody>
        {data.map((c) => (
          <tr key={c.id}>
            <td>{c.ticker}</td>
            <td>{c.last_price}</td>
            <td>
              <ul>
                {c.alerts?.map((a) => (
                  <li key={a.id}>
                    {a.above ? "above" : "below"} {a.price} 
										<button onClick={e => removeAlert(a.id)}>X</button>
                  </li>
                ))}
              </ul>
            </td>
						<td>{c.impulse}</td>
						<td>{c.relative_strength}</td>
          </tr>
        ))}
				</tbody>
      </table>
    </div>
  );
}
