import Head from "next/head";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, mutate } = useSWR("/api/crypto", fetcher);
  const [above, setAbove] = useState(true);
  const [price, setPrice] = useState(0);
  const [ticker, setTicker] = useState(0);
	
  if (error) return "An error has occurred.";
  if (!data) return "Loading...";

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

  return (
    <div>
      <Head>
        <title>Crypto Screener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
				<select value={ticker} onChange={e => setTicker(e.target.value)}>
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

      <table>
        <tr>
          <th>Ticker</th>
          <th>Price</th>
          <th>Alerts</th>
          <th></th>
        </tr>

        {data.map((c) => (
          <tr key={c.id}>
            <td>{c.ticker}</td>
            <td>{c.price}</td>
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
      </table>
    </div>
  );
}
