import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const { amount, description } = req.body;

    if(!amount || !description){
      return res.status(400).json({ error: 'Valor ou descrição faltando' });
    }

    const response = await fetch('https://api.podpay.com.br/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_2rjshg0u3wAC9sms4YuzBxWjRqabCsJx9ril-EUtdyKTQQQv' // <- substitua aqui
      },
      body: JSON.stringify({
        amount: amount, // valor em centavos
        description: description,
        callback_url: "https://geronimovargas-ce58.vercel.app/" // seu site de retorno
      })
    });

    const data = await response.json();
    res.status(200).json({ paymentUrl: data.payment_url });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar pagamento', details: error.message });
  }
}
