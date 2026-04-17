// A tiny introduction to tokenization.
//
// Computers don't read text, they read numbers. A "tokenizer" is the layer
// that converts a string into a sequence of integers (tokens) that a model
// can consume. The simplest possible tokenizer is to use the raw UTF-8
// bytes of the string — every character becomes one or more numbers in the
// range 0..255. This file shows that first step, and then takes one more
// step toward Byte Pair Encoding (BPE) by counting how often each pair of
// adjacent bytes appears. BPE builds a vocabulary by repeatedly merging
// the most frequent pair into a new token, which is how tokenizers used by
// models like GPT are trained.

const sampleText = `Hello, how are you today? — Bonjour, comment allez-vous aujourd'hui? — Hola, ¿cómo estás hoy? — Hallo, wie geht es dir heute? — Ciao, come stai oggi? — Olá, como você está hoje? — Привет, как дела сегодня? — مرحباً، كيف حالك اليوم؟ — नमस्ते, आज आप कैसे हैं? — 今日はお元気ですか？ — 你今天好吗？ — 오늘 어떻게 지내세요? — สวัสดี วันนี้เป็นอย่างไรบ้าง? — Xin chào, hôm nay bạn có khỏe không? — Merhaba, bugün nasılsın? — שלום, מה שלומך היום?`

// Step 1: turn the string into a list of UTF-8 byte values.
// Non-ASCII characters (like "—" or "你") take more than one byte, so the
// byte count is usually larger than the character count.
function textToBytes(text: string): number[] {
    const encoder = new TextEncoder()
    return Array.from(encoder.encode(text))
}

// Step 2: count how often each adjacent (left, right) byte pair appears.
// The key to BPE is spotting which pairs are common enough to be worth
// turning into a single new token. For example, in English text the pair
// (t, h) is extremely frequent, so a BPE tokenizer would likely merge
// "th" into one token early on.
type BytePair = readonly [number, number]
type PairCount = { pair: BytePair; count: number }

function countAdjacentPairs(tokens: number[]): PairCount[] {
    const counts = new Map<string, number>()

    for (let i = 0; i < tokens.length - 1; i++) {
        const key = `${tokens[i]},${tokens[i + 1]}`
        counts.set(key, (counts.get(key) ?? 0) + 1)
    }

    return Array.from(counts, ([key, count]) => {
        const [left, right] = key.split(',').map(Number)
        return { pair: [left, right] as const, count }
    }).sort((a, b) => b.count - a.count)
}

// Step 3: find the single most frequent pair. In a real BPE training loop
// this is the pair you would merge next, assigning it a brand new token id
// (e.g. 256, then 257, and so on) and replacing every occurrence in the
// data before counting again.
function findMostFrequentPair(pairs: PairCount[]): PairCount | undefined {
    return pairs[0]
}

const bytes = textToBytes(sampleText)
const pairStats = countAdjacentPairs(bytes)
const topPair = findMostFrequentPair(pairStats)

console.log(`characters: ${sampleText.length}`)
console.log(`bytes:      ${bytes.length}`)
console.log(`unique adjacent byte pairs: ${pairStats.length}`)

if (topPair) {
    const [left, right] = topPair.pair
    console.log(
        `most frequent pair: (${left}, ${right}) appears ${topPair.count} times`
    )
}

console.log('top 5 pairs:')
for (const { pair, count } of pairStats.slice(0, 5)) {
    console.log(`  (${pair[0]}, ${pair[1]}) → ${count}`)
}
