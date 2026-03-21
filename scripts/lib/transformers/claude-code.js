import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';
import { buildSkillMd } from '../utils.js';

/**
 * Transform source skills into Claude Code format.
 * Output: dist/claude-code/.claude/skills/{skill-name}/SKILL.md
 */
export function transformClaudeCode(skills, distDir) {
  const outputBase = join(distDir, 'claude-code', '.claude', 'skills');
  mkdirSync(outputBase, { recursive: true });

  let count = 0;

  for (const skill of skills) {
    const skillOutDir = join(outputBase, skill.name);
    mkdirSync(skillOutDir, { recursive: true });

    // Build the SKILL.md content
    const content = buildSkillMd(skill.frontmatter, skill.body);
    writeFileSync(join(skillOutDir, 'SKILL.md'), content, 'utf-8');

    // Copy reference files if they exist
    if (skill.references.length > 0) {
      const refOutDir = join(skillOutDir, 'reference');
      mkdirSync(refOutDir, { recursive: true });

      for (const ref of skill.references) {
        writeFileSync(join(refOutDir, ref.name), ref.content, 'utf-8');
      }
    }

    count++;
  }

  console.log(`  Claude Code: ${count} skills → ${outputBase}`);
  return count;
}
