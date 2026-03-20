#!/usr/bin/env node

// StatusLine script: Displays token usage + context remaining % + backup status
// Receives session JSON on stdin, outputs a single-line status string to stdout.

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

try {
  let input = '';
  const chunks = [];

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (chunk) => {
    chunks.push(chunk);
  });

  process.stdin.on('end', () => {
    input = chunks.join('');

    let session = {};
    try {
      session = JSON.parse(input);
    } catch {
      // If parsing fails, output minimal status
      console.log('ctx: unknown');
      process.exit(0);
    }

    // Extract token info from session (Claude Code sends context_window object)
    const ctx = session.context_window || {};
    const tokensUsed = ctx.total_input_tokens || 0;
    const contextLimit = ctx.context_window_size || 200000;
    const pct = ctx.remaining_percentage ?? Math.round(((contextLimit - tokensUsed) / contextLimit) * 100);

    // Check backup status
    const backupDir = join(process.cwd(), '.claude', 'backups');
    let backupCount = 0;
    if (existsSync(backupDir)) {
      backupCount = readdirSync(backupDir).filter((f) =>
        f.endsWith('.md')
      ).length;
    }

    // Format token count for display
    const formatTokens = (n) => {
      if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
      return String(n);
    };

    // Output status line
    const parts = [
      `ctx remaining: ${pct}%`,
      `tokens: ${formatTokens(tokensUsed)}/${formatTokens(contextLimit)}`,
      `backups: ${backupCount}`,
    ];

    console.log(parts.join(' | '));
  });
} catch {
  console.log('ctx: error');
  process.exit(0);
}
