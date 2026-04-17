// tokenizer-test.ts
const str = `Hello, how are you today? — Bonjour, comment allez-vous aujourd'hui? — Hola, ¿cómo estás hoy? — Hallo, wie geht es dir heute? — Ciao, come stai oggi? — Olá, como você está hoje? — Привет, как дела сегодня? — مرحباً، كيف حالك اليوم؟ — नमस्ते, आज आप कैसे हैं? — 今日はお元気ですか？ — 你今天好吗？ — 오늘 어떻게 지내세요? — สวัสดี วันนี้เป็นอย่างไรบ้าง? — Xin chào, hôm nay bạn có khỏe không? — Merhaba, bugün nasılsın? — שלום, מה שלומך היום?`

const encoder = new TextEncoder()
const bytes = encoder.encode(str)

console.log([...bytes].length, 'bytes')



