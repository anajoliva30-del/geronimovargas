import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    // Vercel parseia JSON automaticamente em req.body
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const { amount, description } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Valor ou descrição faltando' });
    }

    // Chamada para a PodPay
    const podpayResponse = await fetch('https://api.podpay.com.br/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 
sk_2rjshg0u3wAC9sms4YuzBxWjRqabCsJx9ril-EUtdyKTQQQv
'
      },
      body: JSON.stringify({
        amount: amount,
        description: description,
        callback_url: "
https://geronimovargas-ce58.vercel.app"
      })
    });

    // Tenta transformar a resposta em JSON
    let data;
    try {
      data = await podpayResponse.json();
    } catch (e) {
      return res.status(500).json({ error: 'Resposta da PodPay não é JSON', details: await podpayResponse.text() });
    }

    if (!data.payment_url) {
      return res.status(500).json({ error: 'Resposta da PodPay inválida', data });
    }

    res.status(200).json({ paymentUrl: data.payment_url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno da função', details: error.message });
  }
}
