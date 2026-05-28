
export default async function handler(req: any, res: any) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const { messages, model, temperature } = req.body;

    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          // 真正的 Key
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
        },

        body: JSON.stringify({
          model: model || 'qwen-turbo',
          messages,
          temperature: temperature || 0.7,
          stream: false,
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error: any) {

    return res.status(500).json({
      error: error.message,
    });

  }
}