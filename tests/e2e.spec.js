import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ============================================================
// 1. 빌드 시스템 테스트
// ============================================================

test.describe('빌드 시스템', () => {
  test('build.js가 에러 없이 실행되고 19개 스킬을 출력한다', () => {
    const result = execSync('node scripts/build.js', { cwd: ROOT, encoding: 'utf-8' });
    expect(result).toContain('Found 19 skills');
    expect(result).toContain('Build complete!');
  });

  test('빌드 후 dist/claude-code/.claude/skills/ 에 19개 스킬 폴더가 생성된다', () => {
    const skillsDir = join(ROOT, 'dist', 'claude-code', '.claude', 'skills');
    expect(existsSync(skillsDir)).toBe(true);
    const folders = readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory());
    expect(folders.length).toBe(19);
  });

  test('character-design 스킬에 6개 reference 파일이 포함된다', () => {
    const refDir = join(ROOT, 'dist', 'claude-code', '.claude', 'skills', 'character-design', 'reference');
    expect(existsSync(refDir)).toBe(true);
    const files = readdirSync(refDir);
    expect(files.length).toBe(6);
    expect(files.sort()).toEqual([
      'anatomy.md', 'color-theory.md', 'expression.md',
      'proportions.md', 'silhouette.md', 'style-guide.md',
    ]);
  });

  test('모든 빌드된 SKILL.md에 유효한 프론트매터가 있다', () => {
    const skillsDir = join(ROOT, 'dist', 'claude-code', '.claude', 'skills');
    const folders = readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory());

    for (const folder of folders) {
      const skillPath = join(skillsDir, folder.name, 'SKILL.md');
      expect(existsSync(skillPath)).toBe(true);
      const content = readFileSync(skillPath, 'utf-8');
      expect(content.startsWith('---')).toBe(true);
      expect(content).toContain('name:');
      expect(content).toContain('description:');
      expect(content).toContain('user-invocable:');
    }
  });
});

// ============================================================
// 2. 설치 스크립트 테스트
// ============================================================

test.describe('설치 스크립트', () => {
  const testProjectDir = join(ROOT, '.test-install-target');

  test.beforeAll(() => {
    // 빌드가 되어 있어야 함
    if (!existsSync(join(ROOT, 'dist'))) {
      execSync('node scripts/build.js', { cwd: ROOT });
    }
  });

  test.afterAll(() => {
    if (existsSync(testProjectDir)) {
      rmSync(testProjectDir, { recursive: true });
    }
  });

  test('install.js가 타겟 디렉토리에 19개 스킬을 설치한다', () => {
    if (existsSync(testProjectDir)) rmSync(testProjectDir, { recursive: true });
    mkdirSync(testProjectDir, { recursive: true });

    const result = execSync(`node ${join(ROOT, 'scripts', 'install.js')}`, {
      cwd: testProjectDir,
      encoding: 'utf-8',
    });

    expect(result).toContain('charchar');
    expect(result).toContain('Installed: 19 skills');

    const installed = join(testProjectDir, '.claude', 'skills');
    expect(existsSync(installed)).toBe(true);
    const skills = readdirSync(installed, { withFileTypes: true }).filter(d => d.isDirectory());
    expect(skills.length).toBe(19);
  });

  test('이미 설치된 스킬은 건너뛴다 (멱등성)', () => {
    // 위 테스트에서 이미 설치됨 — 다시 실행
    const result = execSync(`node ${join(ROOT, 'scripts', 'install.js')}`, {
      cwd: testProjectDir,
      encoding: 'utf-8',
    });

    expect(result).toContain('Skipped: 19 skills');
    expect(result).toContain('Installed: 0 skills');
  });
});

// ============================================================
// 3. 소스 스킬 품질 테스트
// ============================================================

test.describe('소스 스킬 품질', () => {
  const sourceSkillsDir = join(ROOT, 'source', 'skills');

  test('19개 소스 스킬이 존재한다', () => {
    const folders = readdirSync(sourceSkillsDir, { withFileTypes: true }).filter(d => d.isDirectory());
    expect(folders.length).toBe(19);
  });

  test('character-design은 user-invocable: false (자동 로드)', () => {
    const content = readFileSync(join(sourceSkillsDir, 'character-design', 'SKILL.md'), 'utf-8');
    expect(content).toMatch(/user-invocable:\s*false/);
  });

  test('나머지 18개 스킬은 user-invocable: true', () => {
    const folders = readdirSync(sourceSkillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name !== 'character-design');

    for (const folder of folders) {
      const content = readFileSync(join(sourceSkillsDir, folder.name, 'SKILL.md'), 'utf-8');
      expect(content).toMatch(/user-invocable:\s*true/);
    }
  });

  test('모든 스킬에 category 필드가 있다', () => {
    const validCategories = ['생성', '스타일', '강화', '품질', '시스템', 'system'];
    const folders = readdirSync(sourceSkillsDir, { withFileTypes: true }).filter(d => d.isDirectory());

    for (const folder of folders) {
      const content = readFileSync(join(sourceSkillsDir, folder.name, 'SKILL.md'), 'utf-8');
      expect(content).toContain('category:');
    }
  });

  test('모든 유저 호출 스킬에 Do/Don\'t 패턴이 포함되어 있다', () => {
    const folders = readdirSync(sourceSkillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name !== 'character-design');

    for (const folder of folders) {
      const content = readFileSync(join(sourceSkillsDir, folder.name, 'SKILL.md'), 'utf-8');
      const hasDoDont = content.includes('## Do') || content.includes('### Do')
        || content.includes('**Do**') || content.includes('Do/Don\'t');
      expect(hasDoDont).toBe(true);
    }
  });

  test('각 reference 파일이 최소 50줄 이상이다', () => {
    const refDir = join(sourceSkillsDir, 'character-design', 'reference');
    const files = readdirSync(refDir);

    for (const file of files) {
      const content = readFileSync(join(refDir, file), 'utf-8');
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThanOrEqual(50);
    }
  });
});

// ============================================================
// 4. 랜딩 페이지 E2E 테스트
// ============================================================

test.describe('랜딩 페이지', () => {
  test('페이지가 정상 로드되고 타이틀이 올바르다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/charchar/);
  });

  test('히어로 섹션이 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-badge')).toContainText('Skill Pack for Claude Code');
    await expect(page.locator('.hero-title')).toContainText('stunning characters');
    await expect(page.locator('.hero-subtitle')).toContainText('19 slash commands');
  });

  test('설치 명령어가 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.install-cmd').first()).toContainText('npx charchar');
  });

  test('네비게이션 링크가 동작한다', async ({ page }) => {
    await page.goto('/');
    // Skills 앵커 링크
    const skillsLink = page.locator('.nav-links a[href="#skills"]');
    await expect(skillsLink).toBeVisible();

    // Cheatsheet 링크
    const cheatsheetLink = page.locator('.nav-links a[href="cheatsheet.html"]');
    await expect(cheatsheetLink).toBeVisible();

    // GitHub 링크
    const githubLink = page.locator('.nav-links a[href*="github.com"]');
    await expect(githubLink).toBeVisible();
  });

  test('4개 섹션이 모두 표시된다 (01~04)', async ({ page }) => {
    await page.goto('/');
    const sections = ['01', '02', '03', '04'];
    for (const num of sections) {
      await expect(page.locator(`.section-num:text("${num}")`)).toBeVisible();
    }
  });

  test('5개 스킬 카테고리가 표시된다', async ({ page }) => {
    await page.goto('/');
    const categories = ['Create', 'Style', 'Enhance', 'Quality', 'System'];
    for (const cat of categories) {
      await expect(page.locator(`.category-label:text("${cat}")`)).toBeVisible();
    }
  });

  test('18개 유저 스킬 카드가 표시된다 (자동 로드 제외)', async ({ page }) => {
    await page.goto('/');
    const skillCards = page.locator('.skill-card');
    await expect(skillCards).toHaveCount(18);
  });

  test('Without/With charchar 비교 카드가 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.compare-bad h3')).toContainText('Without charchar');
    await expect(page.locator('.compare-good h3')).toContainText('With charchar');
  });

  test('3단계 How It Works가 표시된다', async ({ page }) => {
    await page.goto('/');
    const steps = page.locator('.step');
    await expect(steps).toHaveCount(3);
    await expect(page.locator('.step h3:text("Install")')).toBeVisible();
    await expect(page.locator('.step h3:text("Auto-loaded")')).toBeVisible();
    await expect(page.locator('.step h3:text("Slash commands")')).toBeVisible();
  });

  test('푸터가 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.footer')).toContainText('all-o-labs');
    await expect(page.locator('.footer')).toContainText('MIT');
  });
});

// ============================================================
// 5. 다크모드/라이트모드 전환 테스트
// ============================================================

test.describe('테마 전환', () => {
  test('기본 테마는 dark이다', async ({ page }) => {
    await page.goto('/');
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  test('테마 토글 버튼 클릭 시 light로 전환된다', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('light');
  });

  test('다시 클릭하면 dark로 돌아간다', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    await page.click('.theme-toggle');
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  test('테마 선택이 localStorage에 저장된다', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    const stored = await page.evaluate(() => localStorage.getItem('charchar-theme'));
    expect(stored).toBe('light');
  });

  test('저장된 테마가 재방문 시 유지된다', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle'); // light로
    await page.goto('/'); // 재방문
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});

// ============================================================
// 6. 반응형 레이아웃 테스트
// ============================================================

test.describe('반응형 레이아웃', () => {
  test('데스크톱 (1280px) 에서 그리드 레이아웃이 동작한다', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const compareGrid = page.locator('.compare-grid');
    const gridStyle = await compareGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    // 2열 그리드여야 함
    expect(gridStyle.split(' ').length).toBeGreaterThanOrEqual(2);
  });

  test('모바일 (375px) 에서 단일 컬럼이 된다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const compareGrid = page.locator('.compare-grid');
    const gridStyle = await compareGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    // 1열이어야 함
    expect(gridStyle.split(' ').length).toBe(1);
  });

  test('태블릿 (768px) 에서 네비게이션이 표시된다', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('.nav')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
  });
});

// ============================================================
// 7. 치트시트 페이지 E2E 테스트
// ============================================================

test.describe('치트시트 페이지', () => {
  test('페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    await expect(page).toHaveTitle(/Cheatsheet/);
    await expect(page.locator('h1')).toContainText('Cheatsheet');
  });

  test('6개 카테고리가 표시된다', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    const categories = page.locator('.cs-category');
    await expect(categories).toHaveCount(6);
  });

  test('총 19개 행이 표시된다 (1 auto-load + 18 commands)', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    const rows = page.locator('.cs-table tbody tr');
    await expect(rows).toHaveCount(19);
  });

  test('검색 기능이 동작한다 — pixel 검색 시 관련 스킬만 표시', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    await page.fill('#search', 'pixel');
    // pixel-art 관련 행만 보여야 함
    const visibleRows = page.locator('.cs-table tbody tr:not(.cs-hidden)');
    const count = await visibleRows.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThan(20);
  });

  test('검색 초기화 시 모든 행이 다시 표시된다', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    await page.fill('#search', 'pixel');
    await page.fill('#search', '');
    const visibleRows = page.locator('.cs-table tbody tr:not(.cs-hidden)');
    await expect(visibleRows).toHaveCount(19);
  });

  test('검색에 매칭되는 카테고리가 없으면 해당 카테고리가 숨겨진다', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    await page.fill('#search', 'xyznonexistent');
    const visibleCategories = page.locator('.cs-category:not(.cs-hidden)');
    await expect(visibleCategories).toHaveCount(0);
  });

  test('Home 링크가 메인 페이지로 이동한다', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    await page.click('a[href="/"]');
    await expect(page).toHaveTitle(/charchar — Character Design/);
  });

  test('치트시트에서도 테마 전환이 동작한다', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    await page.click('.theme-toggle');
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});

// ============================================================
// 8. 페이지 간 네비게이션 테스트
// ============================================================

test.describe('페이지 간 네비게이션', () => {
  test('메인 → 치트시트 이동', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="cheatsheet.html"]');
    await expect(page).toHaveTitle(/Cheatsheet/);
  });

  test('치트시트 → 메인 이동', async ({ page }) => {
    await page.goto('/cheatsheet.html');
    await page.click('a[href="/"]');
    await expect(page).toHaveTitle(/charchar — Character Design/);
  });

  test('Skills 앵커 링크가 스킬 섹션으로 스크롤한다', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#skills"]');
    const section = page.locator('#skills');
    await expect(section).toBeInViewport();
  });
});

// ============================================================
// 9. npm 패키지 테스트
// ============================================================

test.describe('npm 패키지', () => {
  test('npm pack이 에러 없이 동작한다', () => {
    const result = execSync('npm pack --dry-run 2>&1', { cwd: ROOT, encoding: 'utf-8' });
    expect(result).toContain('charchar-1.0.0.tgz');
    expect(result).toContain('dist/');
    expect(result).toContain('scripts/');
  });

  test('package.json에 필수 필드가 있다', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('charchar');
    expect(pkg.version).toBe('1.0.0');
    expect(pkg.bin.charchar).toBe('./scripts/install.js');
    expect(pkg.files).toContain('dist/');
    expect(pkg.files).toContain('scripts/');
    expect(pkg.license).toBe('MIT');
  });

  test('README.md에 설치 방법과 스킬 목록이 있다', () => {
    const readme = readFileSync(join(ROOT, 'README.md'), 'utf-8');
    expect(readme).toContain('npx charchar');
    expect(readme).toContain('/create-character');
    expect(readme).toContain('/pixel-art');
    expect(readme).toContain('/animate-char');
    expect(readme).toContain('/polish-char');
  });

  test('LICENSE 파일이 MIT 라이선스이다', () => {
    const license = readFileSync(join(ROOT, 'LICENSE'), 'utf-8');
    expect(license).toContain('MIT License');
  });
});
