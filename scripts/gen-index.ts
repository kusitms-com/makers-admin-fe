import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, relative } from 'node:path'

const GENERATED_TAG = '// @generated'
const CHECK_ONLY = process.argv.includes('--check')
const COMPONENTS_DIR = join(process.cwd(), 'src/components')
const HOOKS_DIR = join(process.cwd(), 'src/hooks')

interface IndexTarget {
  content: string
  filePath: string
}

const normalizePath = (filePath: string) => {
  return relative(process.cwd(), filePath).replaceAll('\\', '/')
}

const readEntries = async (dir: string) => {
  try {
    return await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

const readFileOrEmpty = async (filePath: string) => {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

const isDirectory = async (dir: string) => {
  try {
    return (await stat(dir)).isDirectory()
  } catch {
    return false
  }
}

const isExportableSourceFile = (fileName: string) => {
  return (
    /\.(ts|tsx)$/.test(fileName) &&
    !fileName.endsWith('.d.ts') &&
    !fileName.endsWith('.test.ts') &&
    !fileName.endsWith('.test.tsx') &&
    !fileName.endsWith('.spec.ts') &&
    !fileName.endsWith('.spec.tsx') &&
    !fileName.endsWith('.stories.ts') &&
    !fileName.endsWith('.stories.tsx') &&
    !fileName.endsWith('.css.ts') &&
    !/^index\.(ts|tsx)$/.test(fileName)
  )
}

const sourceExportPath = (fileName: string) => {
  return `./${basename(fileName, extname(fileName))}`
}

const renderIndex = (exportPaths: string[]) => {
  if (exportPaths.length === 0) {
    return `${GENERATED_TAG}\n\nexport {}\n`
  }

  return `${GENERATED_TAG}\n\n${exportPaths.map((exportPath) => `export * from '${exportPath}'`).join('\n')}\n`
}

const collectFileExports = async (dir: string) => {
  const entries = await readEntries(dir)

  return entries
    .filter((entry) => entry.isFile() && isExportableSourceFile(entry.name))
    .map((entry) => sourceExportPath(entry.name))
    .sort()
}

const collectSegmentTargets = async (rootDir: string): Promise<IndexTarget[]> => {
  const entries = await readEntries(rootDir)
  const segmentDirs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort()

  const targets: IndexTarget[] = []
  const rootExports = await collectFileExports(rootDir)

  for (const segmentDir of segmentDirs) {
    const dirPath = join(rootDir, segmentDir)
    const exportPaths = await collectFileExports(dirPath)

    targets.push({
      content: renderIndex(exportPaths),
      filePath: join(dirPath, 'index.ts'),
    })

    if (exportPaths.length > 0) {
      rootExports.push(`./${segmentDir}`)
    }
  }

  targets.push({
    content: renderIndex(rootExports.sort()),
    filePath: join(rootDir, 'index.ts'),
  })

  return targets
}

const collectTargets = async () => {
  const targets: IndexTarget[] = []

  if (await isDirectory(COMPONENTS_DIR)) {
    targets.push(...(await collectSegmentTargets(COMPONENTS_DIR)))
  }

  if (await isDirectory(HOOKS_DIR)) {
    targets.push(...(await collectSegmentTargets(HOOKS_DIR)))
  }

  return targets
}

const checkTargets = async (targets: IndexTarget[]) => {
  const outdated: string[] = []

  for (const target of targets) {
    const currentContent = await readFileOrEmpty(target.filePath)

    if (currentContent !== target.content) {
      outdated.push(normalizePath(target.filePath))
    }
  }

  if (outdated.length > 0) {
    process.stderr.write(
      ['Generated index files are out of date.', ...outdated.map((path) => `- ${path}`)].join('\n'),
    )
    process.stderr.write('\nRun `pnpm gen:index`.\n')
    process.exitCode = 1
    return
  }

  process.stdout.write(`Generated index files are up to date. (${String(targets.length)} files)\n`)
}

const writeTargets = async (targets: IndexTarget[]) => {
  for (const target of targets) {
    await mkdir(dirname(target.filePath), { recursive: true })
    await writeFile(target.filePath, target.content)
    process.stdout.write(`Generated ${normalizePath(target.filePath)}\n`)
  }

  process.stdout.write(`Generated ${String(targets.length)} index files.\n`)
}

const main = async () => {
  const targets = await collectTargets()

  if (CHECK_ONLY) {
    await checkTargets(targets)
    return
  }

  await writeTargets(targets)
}

await main()
