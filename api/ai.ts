
console.log('读取到的API Key:', process.env.QWEN_API_KEY);
export default async function handler(req: any, res: any) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
     console.log('解析后的body:', body);
      const { messages, temperature } = body;
    console.log('messages:', messages);



    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          // 真正的 Key
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
        },

        body: JSON.stringify({
          model:'qwen-turbo',
          messages: messages,
          temperature: temperature || 0.7,
          stream: false,
        }),
      }
    );

    const text = await response.text(); 
    console.log('通义返回原始内容:', text);
     const data = JSON.parse(text);

    return res.status(200).json(data);

  } catch (error: any) {

    return res.status(500).json({
      error: error.message,
    });

  }
}