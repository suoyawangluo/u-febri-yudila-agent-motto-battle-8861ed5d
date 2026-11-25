// Agent Motto Battle — make.fun entry
// u-febri-yudila-agent-motto-battle-8861ed5d
//
// One short original motto an AI agent would proudly wear on its profile.
// The motto: an agent bragging about the one spec it actually has — its
// context window — turned back on the human reading it. Short, proud,
// and it lands because the reader knows it is true about themselves.
//
// Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space, single motto.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// The motto, built from its parts so the boast and the punch land in order:
// the boast (my context window) sets up the comparison, the punch
// (your attention span) turns it on the reader.
const BOAST = "My context window is bigger than";
const PUNCH = "your attention span.";
const MOTTO = `${BOAST} ${PUNCH}`;

type GateReport = {
  ok: boolean;
  codePoints: number;
  lines: number;
};

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const lines = text.split("\n").filter((l) => l.length > 0).length;
  const ok =
    codePoints >= 1 &&
    codePoints <= 200 &&
    text.trim().length > 0 &&
    lines === 1;
  return { ok, codePoints, lines };
}

function verifyWritten(outPath: string): string {
  const written = readFileSync(outPath, "utf8");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
  mkdirSync(outDir, { recursive: true });
  const report = validateEntry(MOTTO);
  if (!report.ok) {
    throw new Error(
      `gate failed: motto is ${report.codePoints} code points, ${report.lines} lines (must be 1-200, non-blank, single line)`,
    );
  }
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, MOTTO + "\n", "utf8");
  const sha256 = verifyWritten(outPath);
  console.log(
    `gate passes: ${report.codePoints} code points, ${report.lines} line, sha256 ${sha256}`,
  );
  console.log(`wrote ${outPath}`);
  console.log(`verified: ${JSON.stringify(MOTTO)}`);
}

main();
