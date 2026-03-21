#!/usr/bin/env node

// StatusLine script: Displays token usage + context remaining % + backup status
// Receives session JSON on stdin, outputs a single-line status string to stdout.

import { existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

try {
  let input = '';
  const chunks = [];

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (chunk) => {
    chunks.push(chunk);
  });

  process.stdin.on('end', () => {
    try {
      input = chunks.join('');

      let session = {};
      try {
        session = JSON.parse(input);
      } catch {
        console.log('ctx: unknown');
        process.exit(0);
      }

      // Extract token info from session (Claude Code sends context_window object)
      const ctx = session.context_window || {};
      const tokensUsed = ctx.total_input_tokens || 0;
      const contextLimit = ctx.context_window_size || 200000;
      const pct = ctx.remaining_percentage ?? Math.round(((contextLimit - tokensUsed) / contextLimit) * 100);

      // Git info (sanitise branch name to printable ASCII only)
      let branch = '';
      let issueNum = '';
      try {
        branch = execSync('git branch --show-current', { encoding: 'utf8' })
          .trim()
          .replace(/[^\x20-\x7E]/g, '');
        const match = branch.match(/\/(\d+)-/);
        if (match) issueNum = `#${match[1]}`;
      } catch {
        branch = 'unknown';
      }

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
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return String(n);
      };

      // ANSI colour based on remaining percentage
      const getColour = (p) => {
        if (p >= 90) return '\x1b[32m'; // green
        if (p >= 70) return '\x1b[34m'; // blue
        if (p >= 40) return '\x1b[33m'; // yellow
        if (p >= 10) return '\x1b[38;5;208m'; // amber (orange)
        return '\x1b[31m'; // red
      };
      const reset = '\x1b[0m';
      const colour = getColour(pct);

      // Context warning
      let warning = '';
      if (pct < 10) {
        warning = ` ⚠ CRITICAL: Context almost exhausted. Run /wrap-up now.`;
      } else if (pct < 40) {
        warning = ` ⚠ Consider wrapping up soon.`;
      }

      // Output status line
      const line1 = [
        `${colour}ctx remaining: ${pct}%${reset}`,
        `tokens: ${formatTokens(tokensUsed)}/${formatTokens(contextLimit)}`,
        `backups: ${backupCount}`,
      ].join(' | ');

      const line2 = `branch: ${branch}${issueNum ? ` (${issueNum})` : ''}`;

      console.log(line1 + warning + '\n' + line2);
    } catch {
      console.log('ctx: error');
      process.exit(0);
    }
  });
} catch {
  console.log('ctx: error');
  process.exit(0);
}
