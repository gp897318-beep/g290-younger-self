// One Line to Your Younger Self — make.fun entry.
// Writes a single line for the writer's younger self to /output/entry.txt.
// The line is the winner of 10 compared variants (see younger-self-variants.md):
// "Keep the letters. One day his handwriting will be the only voice of his
// you have left." — a concrete object (the letters), a turn in the second
// sentence (handwriting becomes a voice), and a sting that stays after one
// reading. 86 characters, inside the competition gate of 1-200.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Keep the letters. One day his handwriting will be the only voice of his you have left.";

// The grader runs the program with /output as the output directory; outside
// the grader, MAKEFUN_OUTPUT_DIR may point somewhere else, so honour it.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Gate from the competition rules: entry.txt must be UTF-8 text of 1 to
// 200 characters, a single line, not only whitespace.
function checkLine(text: string): number {
  const n = [...text].length;
  if (n < 1) throw new Error("gate: entry is empty");
  if (n > 200) throw new Error(`gate: ${n} characters, over the 200 limit`);
  if (text.trim().length === 0) throw new Error("gate: entry is only whitespace");
  if (/[\r\n]/.test(text)) throw new Error("gate: entry must be one line");
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    throw new Error("gate: entry holds control characters");
  }
  return n;
}

// Writes the line with no trailing newline, then reads it back to prove
// the file on disk is exactly the line that passed the gate.
function emit(line: string): void {
  const n = checkLine(line);
  mkdirSync(OUT_DIR, { recursive: true });
  const target = `${OUT_DIR}/entry.txt`;
  writeFileSync(target, line, "utf8");
  const back = readFileSync(target, "utf8");
  if (back !== line) throw new Error("round-trip: entry.txt differs from LINE");
  checkLine(back);
  console.log(`wrote ${target} (${n} characters)`);
  console.log(line);
}

emit(LINE);
