export default function handler(req, res) {
  res.status(200).json([{
		'id': 1,
		'ticker': 'BTCUSDT',
		'price': 16780.00,
		'alerts': []
	},{
		'id': 2,
		'ticker': 'ADAUSDT',
		'price': 1.8,
		'alerts': []
	},]);
}