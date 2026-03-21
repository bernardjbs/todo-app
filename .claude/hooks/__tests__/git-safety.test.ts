import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';

const hookPath = join(__dirname, '..', 'git-safety.sh');

function runHook(command: string): { stdout: string; exitCode: number } {
  const stdin = JSON.stringify({ command });
  try {
    const stdout = execSync(`bash ${hookPath}`, {
      input: stdin,
      encoding: 'utf8',
      env: { ...process.env, PATH: process.env.PATH },
    });
    return { stdout, exitCode: 0 };
  } catch (err) {
    const error = err as { stdout: string; status: number };
    return { stdout: error.stdout ?? '', exitCode: error.status };
  }
}

describe('git-safety hook', () => {
  describe('commit to main protection', () => {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const onMain = branch === 'main' || branch === 'master';

    it.skipIf(!onMain)('blocks git commit on main branch', () => {
      const result = runHook('git commit -m "test"');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
      expect(result.stdout).toContain('Cannot commit directly to');
    });

    it.skipIf(!onMain)('blocks git commit with flags before commit keyword', () => {
      const result = runHook('git -c user.name=test commit -m "test"');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });

    it.skipIf(onMain)('allows git commit on feature branch', () => {
      const result = runHook('git commit -m "test"');

      expect(result.exitCode).toBe(0);
    });
  });

  describe('force push protection', () => {
    it('blocks git push --force', () => {
      const result = runHook('git push --force origin main');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
      expect(result.stdout).toContain('Force push');
    });

    it('blocks git push -f', () => {
      const result = runHook('git push -f origin main');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });

    it('blocks --force-with-lease', () => {
      const result = runHook('git push --force-with-lease origin main');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });

    it('blocks git push -f mid-command', () => {
      const result = runHook('git push -f origin feature/test');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });

    it('allows normal git push', () => {
      const result = runHook('git push origin feature/test');

      expect(result.exitCode).toBe(0);
    });
  });

  describe('.env file protection', () => {
    it('blocks staging .env', () => {
      const result = runHook('git add .env');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
      expect(result.stdout).toContain('.env');
    });

    it('blocks staging .env.local', () => {
      const result = runHook('git add .env.local');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });

    it('blocks staging .env in subdirectory', () => {
      const result = runHook('git add config/.env');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });

    it('blocks staging .env.production', () => {
      const result = runHook('git add .env.production');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });
  });

  describe('broad staging protection', () => {
    it('blocks git add .', () => {
      const result = runHook('git add .');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
      expect(result.stdout).toContain('Broad staging');
    });

    it('blocks git add -A', () => {
      const result = runHook('git add -A');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });

    it('blocks git add --all', () => {
      const result = runHook('git add --all');

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain('BLOCKED');
    });
  });

  describe('allowed commands', () => {
    it('allows staging specific files', () => {
      const result = runHook('git add apps/api/src/index.ts');

      expect(result.exitCode).toBe(0);
    });

    it('allows staging multiple specific files', () => {
      const result = runHook('git add apps/api/src/index.ts packages/shared/src/index.ts');

      expect(result.exitCode).toBe(0);
    });

    it('allows non-git commands', () => {
      const result = runHook('npm test');

      expect(result.exitCode).toBe(0);
    });

    it('allows git status', () => {
      const result = runHook('git status');

      expect(result.exitCode).toBe(0);
    });

    it('allows git diff', () => {
      const result = runHook('git diff');

      expect(result.exitCode).toBe(0);
    });

    it('allows staging .env.example', () => {
      const result = runHook('git add .env.example');

      expect(result.exitCode).toBe(0);
    });
  });
});
