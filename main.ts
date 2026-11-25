// Entry for make.fun "Make the AI Judge Laugh".
// One office joke, one line, <= 200 characters, written to $MAKEFUN_OUTPUT_DIR/entry.txt.
//
// The artifact is a pure constant: no clock, no RNG, no map iteration, so the two
// grader runs produce byte-identical files and the tie-break size never moves.

import { mkdirSync, writeFileSync } from "node:fs";

const MAX_CHARS = 200;

// "bandwidth" is the office word this turns on. Pass 1 had the manager booking an
// hour to *measure* it, which reads as a shrugging complaint; the revision has him
// organising a search party for it, so the meeting is reclassified as fieldwork.
const LINE =
  "I said I had no bandwidth this week, so he booked an hour for us to find out where it went.";

// Clauses the brief itself calls stale (criterion 5: a stock line with the nouns
// swapped). Refuse to ship if an edit drifts back into any of them.
const SATURATED =
  /\b(printer|coffee|monday|reply all|synergy|circle back|per my last email|touch base|let's take this offline|deep dive|ping)\b/i;

function compose(): string {
  const text = LINE.normalize("NFC");

  if (/[\r\n]/.test(text)) {
    throw new Error("the gate takes one line: no CR or LF may appear in the entry");
  }
  if (text.trim().length === 0) {
    throw new Error("the gate refuses white space only");
  }
  const chars = [...text].length;
  if (chars > MAX_CHARS) {
    throw new Error(`the gate caps the entry at ${MAX_CHARS} characters, this is ${chars}`);
  }
  if (!/^I said I had no bandwidth/.test(text)) {
    throw new Error("criterion 1: it must be a first-person office joke, spoken in one breath");
  }
  const drift = text.match(SATURATED);
  if (drift) {
    throw new Error(`drifted into a stock office joke: ${JSON.stringify(drift[0])}`);
  }
  if (!text.endsWith("find out where it went.")) {
    throw new Error("criterion 3: the turn is the last clause; it has moved out of position");
  }

  return text;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const text = compose();
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, text);
console.log(`wrote ${outDir}/entry.txt: ${[...text].length} chars, ${Buffer.byteLength(text)} bytes`);
