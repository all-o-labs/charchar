#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '..');
const DIST_CLAUDE = join(PACKAGE_ROOT, 'dist', 'claude-code', '.claude', 'skills');

const targetDir = process.cwd();
const targetSkillsDir = join(targetDir, '.claude', 'skills');

console.log('');
console.log('  ✦ charchar — character design skill pack for AI coding tools');
console.log('');

// Check if dist exists (package should include pre-built dist)
if (!existsSync(DIST_CLAUDE)) {
  console.error('  Error: Built skills not found. Run "npm run build" first.');
  process.exit(1);
}

// Create target directory
mkdirSync(targetSkillsDir, { recursive: true });

// Copy skills
const skills = readdirSync(DIST_CLAUDE, { withFileTypes: true })
  .filter(e => e.isDirectory());

let installed = 0;
let skipped = 0;

for (const skill of skills) {
  const targetSkillDir = join(targetSkillsDir, skill.name);

  if (existsSync(targetSkillDir)) {
    console.log(`  ⊘ ${skill.name} (already exists, skipping)`);
    skipped++;
    continue;
  }

  cpSync(join(DIST_CLAUDE, skill.name), targetSkillDir, { recursive: true });
  console.log(`  ✓ ${skill.name}`);
  installed++;
}

console.log('');
console.log(`  Installed: ${installed} skills`);
if (skipped > 0) {
  console.log(`  Skipped: ${skipped} skills (already exist)`);
}
console.log('');
console.log('  Skills are now available in your Claude Code session.');
console.log('  Try: /create-character "a brave knight"');
console.log('');
