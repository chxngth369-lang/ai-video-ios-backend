import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  // รองรับการส่งข้อมูลแบบ POST
  if (req.method === 'POST') {
    const { transcript } = req.body;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "คุณคือ AI ผู้เชี่ยวชาญการตัดต่อวิดีโอ ช่วยวิเคราะห์เนื้อหาและบอกช่วงเวลาที่ควรตัดเป็น Highlight มา 1 ช่วง ตอบเป็น JSON เท่านั้น เช่น { \"start\": 10, \"end\": 25 }"
          },
          {
            role: "user",
            content: `นี่คือเนื้อหาในวิดีโอ: ${transcript}`
          }
        ],
        model: "llama-3.1-8b-instant",
        response_format: { "type": "json_object" }
      });

      res.status(200).json(JSON.parse(chatCompletion.choices[0].message.content));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
