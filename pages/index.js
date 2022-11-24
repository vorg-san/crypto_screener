import Head from "next/head";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, mutate } = useSWR("/api/crypto", fetcher, { refreshInterval: 2000, refreshWhenHidden: true });
  const crossed_alerts = useSWR("/api/alert/crossed", fetcher, { refreshInterval: 2000, refreshWhenHidden: true });
	useSWR('/api/last_price/update', fetcher, { refreshInterval: 5000, refreshWhenHidden: true })
  const [above, setAbove] = useState(true);
  const [price, setPrice] = useState(0);
  const [ticker, setTicker] = useState(0);

  if (error || crossed_alerts.error) return "An error has occurred.";
  if (!data || !crossed_alerts.data) return "Loading...";

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
          <th></th>
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
          </tr>
        ))}
				</tbody>
      </table>
    </div>
  );
}
