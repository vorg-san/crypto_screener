import Head from "next/head";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/crypto", fetcher);
  const [above, setAbove] = useState(true);
  const [price, setPrice] = useState(0);
  const [ticker, setTicker] = useState(0);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";

  const newAlert = () => {
    console.log(above);
    console.log(price);
  };

  return (
    <div>
      <Head>
        <title>Crypto Screener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
				<select>
					
				</select>
        <input
          type="checkbox"
          onChange={() => setAbove(!above)}
          defaultChecked={above}
        ></input>
        <input
          type="number"
          step="0.001"
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

        {data.map((d) => (
          <tr key={d.id}>
            <td>{d.ticker}</td>
            <td>{d.price}</td>
            <td>
              <ul>
                {d.alerts.map((a) => (
                  <li key={a.id}>
                    {a.above ? "above" : "below"} {a.price}
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
