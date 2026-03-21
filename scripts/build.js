#!/usr/bin/env node

import { rmSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readSourceSkills } from './lib/utils.js';
import { transformClaudeCode } from './lib/transformers/claude-code.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const SOURCE_DIR = join(ROOT, 'source');
const DIST_DIR = join(ROOT, 'dist');

console.log('charchar build started...\n');

// Clean dist
if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true });
}
mkdirSync(DIST_DIR, { recursive: true });

// Read all source skills
const skills = readSourceSkills(SOURCE_DIR);
console.log(`Found ${skills.length} skills:\n`);

for (const skill of skills) {
  const invocable = skill.frontmatter['user-invocable'] ? '/' : ' ';
  const refs = skill.references.length > 0 ? ` (+${skill.references.length} refs)` : '';
  console.log(`  ${invocable} ${skill.name}${refs}`);
}
console.log('');

// Transform for each provider
console.log('Transforming...');
transformClaudeCode(skills, DIST_DIR);

console.log('\nBuild complete!');
