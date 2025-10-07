import fetch from 'node-fetch';

export default async function handler(req, res) {
  const response = await fetch('https://api.podpay.com.br/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk_2rjshg0u3wAC9sms4YuzBxWjRqabCsJx9ril'
    },
    body: JSON.stringify({
      amount: 1000,
      description: "Teste de pagamento",
      callback_url: "https://geronimovargas-ce58.vercel.app/"
    })
  });

  const data = await response.json();
  res.status(200).json({ paymentUrl: data.payment_url });
}
