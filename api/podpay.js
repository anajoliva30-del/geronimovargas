export default async function handler(req, res) {
  // Permite chamadas de qualquer origem (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // responde pré-flight
  }

  try {
    // resto do código...
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    // Permitir apenas POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    // Recebe dados do frontend
    const { amount, description } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Valor ou descrição faltando' });
    }

    // Chamada para a PodPay usando a nova chave privada
    const podpayResponse = await fetch('https://api.podpay.com.br/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_alA_xQSiPJdZ_MhAZsreZ8nYPzblE4P-kCIkjdva0BwoZDAe'
      },
      body: JSON.stringify({
        amount: amount,                     // valor em centavos
        description: description,           // descrição do pagamento
        callback_url: "https://geronimovargas-ce58.vercel.app" // seu site de retorno
      })
    });

    let data;
    try {
      data = await podpayResponse.json();
    } catch (e) {
      // Se a PodPay retornar algo que não seja JSON
      return res.status(500).json({ error: 'Resposta da PodPay não é JSON', details: await podpayResponse.text() });
    }

    // Verifica se existe payment_url
    if (!data.payment_url) {
      return res.status(500).json({ error: 'Resposta da PodPay inválida', data });
    }

    // Retorna URL do pagamento para o frontend
    res.status(200).json({ paymentUrl: data.payment_url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno da função', details: error.message });
  }
}
