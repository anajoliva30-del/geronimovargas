export default async function handler(req, res) {
  // ======== CORS ========
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end(); // Pré-flight

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { amount, description } = req.body;
    if (!amount || !description) return res.status(400).json({ error: 'Valor ou descrição faltando' });

    // ======== Requisição para PodPay ========
    const podpayResponse = await fetch('https://api.podpay.com.br/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_alA_xQSiPJdZ_MhAZsreZ8nYPzblE4P-kCIkjdva0BwoZDAe'
      },
      body: JSON.stringify({
        amount,
        description,
        callback_url: "https://geronimovargas.vercel.app"
      })
    });

    let data;
    try {
      data = await podpayResponse.json();
    } catch (e) {
      // Se a PodPay responder algo que não é JSON
      return res.status(500).json({ error: 'Resposta da PodPay não é JSON', details: await podpayResponse.text() });
    }

    if (!data.payment_url) return res.status(500).json({ error: 'Resposta da PodPay inválida', da_
