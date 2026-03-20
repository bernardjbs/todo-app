#!/usr/bin/env node

// PreCompact hook: Extracts key context from session transcript and writes
// a structured markdown backup before auto-compaction occurs.
//
// This is the safety net that fires right before compaction, preserving
// important context that might otherwise be lost.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const backupDir = join(process.cwd(), '.claude', 'backups');

try {
  // Read session data from stdin
  let input = '';
  const chunks = [];

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (chunk) => {
    chunks.push(chunk);
  });

  process.stdin.on('end', () => {
    input = chunks.join('');

    if (!input.trim()) {
      process.exit(0);
    }

    let sessionData;
    try {
      sessionData = JSON.parse(input);
    } catch {
      // If we can't parse the input, try line-by-line JSONL
      const lines = input.trim().split('\n');
      sessionData = lines
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }

    // Extract key context
    const backup = {
      timestamp: new Date().toISOString(),
      filesModified: new Set(),
      decisions: [],
      tasks: [],
      errors: [],
    };

    const entries = Array.isArray(sessionData) ? sessionData : [sessionData];

    for (const entry of entries) {
      // Track file modifications
      if (entry.tool === 'Edit' || entry.tool === 'Write') {
        const filePath = entry.input?.file_path || entry.file_path;
        if (filePath) backup.filesModified.add(filePath);
      }

      // Track user messages for context
      if (entry.role === 'user' && entry.content) {
        const content =
          typeof entry.content === 'string'
            ? entry.content
            : JSON.stringify(entry.content);
        if (content.length > 10 && content.length < 500) {
          backup.tasks.push(content.slice(0, 200));
        }
      }

      // Track errors
      if (entry.error || entry.is_error) {
        const errMsg = entry.error || entry.content;
        if (errMsg) {
          backup.errors.push(
            typeof errMsg === 'string' ? errMsg.slice(0, 200) : 'Error occurred'
          );
        }
      }
    }

    // Generate markdown backup
    const md = [
      `# Context Backup — ${backup.timestamp}`,
      '',
      '## Files Modified',
      ...(backup.filesModified.size > 0
        ? [...backup.filesModified].map((f) => `- ${f}`)
        : ['- None']),
      '',
      '## User Requests',
      ...(backup.tasks.length > 0
        ? backup.tasks.slice(-10).map((t) => `- ${t}`)
        : ['- None captured']),
      '',
      '## Errors Encountered',
      ...(backup.errors.length > 0
        ? backup.errors.slice(-5).map((e) => `- ${e}`)
        : ['- None']),
      '',
    ].join('\n');

    // Write backup
    mkdirSync(backupDir, { recursive: true });
    const filename = `${backup.timestamp.replace(/[:.]/g, '-')}.md`;
    writeFileSync(join(backupDir, filename), md);

    // Keep only last 10 backups
    if (existsSync(backupDir)) {
      const { readdirSync, unlinkSync } = await import('fs');
      const files = readdirSync(backupDir)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .reverse();
      for (const old of files.slice(10)) {
        unlinkSync(join(backupDir, old));
      }
    }
  });
} catch (err) {
  // Hook failures should not block compaction
  console.error('Context backup hook error:', err.message);
  process.exit(0);
}
