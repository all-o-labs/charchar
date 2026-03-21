import { readFileSync } from 'fs';
import { join, relative } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';

/**
 * Parse YAML frontmatter from a markdown file content string.
 * Returns { frontmatter: object, body: string }
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const yamlStr = match[1];
  const body = match[2];
  const frontmatter = {};

  let currentKey = null;
  let currentArray = null;
  let currentArrayItem = null;

  for (const line of yamlStr.split('\n')) {
    const trimmed = line.trimEnd();

    // Array item with object properties (e.g., "  - name: value")
    if (/^\s+-\s+\w+:/.test(trimmed) && currentKey) {
      const itemMatch = trimmed.match(/^\s+-\s+(\w+):\s*(.*)$/);
      if (itemMatch) {
        currentArrayItem = { [itemMatch[1]]: parseYamlValue(itemMatch[2]) };
        if (!currentArray) currentArray = [];
        currentArray.push(currentArrayItem);
        frontmatter[currentKey] = currentArray;
      }
      continue;
    }

    // Continuation of array item object (e.g., "    description: value")
    if (/^\s{4,}\w+:/.test(trimmed) && currentArrayItem) {
      const propMatch = trimmed.match(/^\s+(\w+):\s*(.*)$/);
      if (propMatch) {
        currentArrayItem[propMatch[1]] = parseYamlValue(propMatch[2]);
      }
      continue;
    }

    // Top-level key: value
    const kvMatch = trimmed.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const value = kvMatch[2].trim();

      if (value === '') {
        // Could be start of an array or nested object
        currentKey = key;
        currentArray = null;
        currentArrayItem = null;
      } else {
        frontmatter[key] = parseYamlValue(value);
        currentKey = null;
        currentArray = null;
        currentArrayItem = null;
      }
      continue;
    }

    // Simple array item (e.g., "  - value")
    if (/^\s+-\s+/.test(trimmed) && currentKey) {
      const itemValue = trimmed.match(/^\s+-\s+(.*)$/)[1];
      if (!currentArray) currentArray = [];
      currentArray.push(parseYamlValue(itemValue));
      currentArrayItem = null;
      frontmatter[currentKey] = currentArray;
    }
  }

  return { frontmatter, body };
}

function parseYamlValue(str) {
  if (str === 'true') return true;
  if (str === 'false') return false;
  if (str === 'null') return null;
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  if (/^\d+\.\d+$/.test(str)) return parseFloat(str);
  // Remove surrounding quotes
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1);
  }
  return str;
}

/**
 * Read all skill source files from source/skills/ directory.
 * Returns array of { name, dir, skillMd, frontmatter, body, references }
 */
export function readSourceSkills(sourceDir) {
  const skills = [];
  const skillsDir = join(sourceDir, 'skills');

  if (!existsSync(skillsDir)) {
    throw new Error(`Skills source directory not found: ${skillsDir}`);
  }

  const entries = readdirSync(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillDir = join(skillsDir, entry.name);
    const skillMdPath = join(skillDir, 'SKILL.md');

    if (!existsSync(skillMdPath)) {
      console.warn(`Warning: No SKILL.md found in ${skillDir}, skipping.`);
      continue;
    }

    const content = readFileSync(skillMdPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    // Read reference files if they exist
    const references = [];
    const refDir = join(skillDir, 'reference');
    if (existsSync(refDir)) {
      const refEntries = readdirSync(refDir, { withFileTypes: true });
      for (const refEntry of refEntries) {
        if (refEntry.isFile() && refEntry.name.endsWith('.md')) {
          references.push({
            name: refEntry.name,
            path: join(refDir, refEntry.name),
            content: readFileSync(join(refDir, refEntry.name), 'utf-8'),
          });
        }
      }
    }

    skills.push({
      name: entry.name,
      dir: skillDir,
      skillMdPath,
      frontmatter,
      body,
      references,
    });
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Reconstruct a SKILL.md string from frontmatter object and body.
 */
export function buildSkillMd(frontmatter, body) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          const entries = Object.entries(item);
          lines.push(`  - ${entries[0][0]}: ${formatYamlValue(entries[0][1])}`);
          for (let i = 1; i < entries.length; i++) {
            lines.push(`    ${entries[i][0]}: ${formatYamlValue(entries[i][1])}`);
          }
        } else {
          lines.push(`  - ${formatYamlValue(item)}`);
        }
      }
    } else {
      lines.push(`${key}: ${formatYamlValue(value)}`);
    }
  }

  lines.push('---');
  lines.push('');
  lines.push(body);

  return lines.join('\n');
}

function formatYamlValue(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.includes(':') || value.includes('#') || value.includes('"')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  return String(value);
}
