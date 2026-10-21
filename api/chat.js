export default async function handler(req, res) {
  // السماح بطلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // الاتصال بخادم Ollama على Google Colab عبر الرابط العام الجديد
    const response = await fetch('https://quick-rabbits-give.loca.lt/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true' // مهم جداً لتجاوز صفحة التحذير الخاصة بـ localtunnel
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama server error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // إرجاع الرد الحقيقي القادم من نموذج Llama 3
    return res.status(200).json({ reply: data.response });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to connect to AI engine', details: error.message });
  }
}
