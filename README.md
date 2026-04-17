# tokenizer

A minimal walkthrough of how text becomes tokens, written in TypeScript.

Language models can't read strings — they read integers. A **tokenizer** is
the small piece of code that converts text into that sequence of integers.
This repo contains a single annotated file, [token.ts](token.ts), that
builds up the idea one step at a time.

## What it shows

1. **Text → bytes.** A string is encoded as UTF-8 bytes using
   `TextEncoder`. Every byte is already a valid token in the range
   `0..255`, so this alone is a working (if naive) tokenizer.
2. **Counting adjacent pairs.** We walk the byte sequence and count how
   often each `(left, right)` pair occurs. Frequent pairs are the
   candidates a real tokenizer would merge into a new token.
3. **Picking the top pair.** The highest-count pair is what Byte Pair
   Encoding (BPE) would merge next, assigning it a new id like `256` and
   repeating the process until the vocabulary reaches the desired size.

The sample string is intentionally multilingual so you can see that
non-ASCII characters take multiple bytes each, and that the byte count is
larger than the character count.

## Run it

```bash
bun run token.ts
# or
npx tsx token.ts
```

You'll see the character count, byte count, number of unique adjacent byte
pairs, and the top 5 most frequent pairs.

## Where to go next

From here, the natural next step is to implement the BPE training loop:
repeatedly find the most frequent pair, replace every occurrence with a
fresh token id, and record the merge so you can later encode new text with
the same rules. That loop, plus a matching decoder, is essentially the
tokenizer used by GPT-family models.

## License

MIT — see [LICENSE](LICENSE).
