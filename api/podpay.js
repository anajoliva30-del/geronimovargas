import fetch from 'node-fetch';

export default async function handler(req, res) {
  // ======== CORS ========
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Pré-flight request
    return res.status(200).end();
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const { amount, description } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Valor ou descrição faltando' });
    }

    // ======== Chamada PodPay ========
    const podpayResponse = await fetch('https://api.podpay.com.br/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_alA_xQSiPJdZ_MhAZsreZ8nYPzblE4P-kCIkjdva0BwoZDAe'
      },
      body: JSON.stringify({
        amount: amount,
        description: description,
        callback_url: "https://geronimovargas.vercel.app"
      })
    });

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
