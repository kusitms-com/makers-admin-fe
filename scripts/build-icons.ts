import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { transform } from '@svgr/core'
import jsxPlugin from '@svgr/plugin-jsx'
import svgoPlugin from '@svgr/plugin-svgo'
import { format } from 'prettier'

const GENERATED_TAG = '// @generated'
const ICON_ROOT = join(process.cwd(), 'src/assets/icons')
const CURRENT_COLOR_SOURCE_DIR = join(ICON_ROOT, 'svg')
const PRESERVE_COLOR_SOURCE_DIR = join(ICON_ROOT, 'svg-preserve')
const OUTPUT_DIR = join(ICON_ROOT, 'generated')
const CHECK_ONLY = process.argv.includes('--check')

interface IconSource {
  componentName: string
  fileName: string
  filePath: string
  preserveColors: boolean
}

const svgrPlugins = [svgoPlugin, jsxPlugin]

const toPascalCase = (value: string) => {
  return value
    .replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_, _separator: string, char: string) =>
      char.toUpperCase(),
    )
    .replace(/[^a-zA-Z0-9]/g, '')
}

const toComponentName = (fileName: string) => {
  const baseName = basename(fileName, extname(fileName))
  const pascalName = toPascalCase(baseName)

  if (!pascalName) {
    throw new Error(`Invalid icon file name: ${fileName}`)
  }

  if (/(Icon|Logo|Brand|Symbol|Wordmark)$/.test(pascalName)) {
    return pascalName
  }

  return `${pascalName}Icon`
}

const normalizeToCurrentColor = (svg: string) => {
  return svg
    .replace(
      /\s(fill|stroke)=["'](?!none|currentColor|transparent|url\()[^"']+["']/gi,
      ' $1="currentColor"',
    )
    .replace(/style=["'][^"']*["']/gi, '')
}

const readIconSources = async (
  sourceDir: string,
  preserveColors: boolean,
): Promise<IconSource[]> => {
  let entries

  try {
    entries = await readdir(sourceDir, { withFileTypes: true })
  } catch {
    return []
  }

  return entries
    .filter((entry) => entry.isFile() && extname(entry.name).toLowerCase() === '.svg')
    .map((entry) => ({
      componentName: toComponentName(entry.name),
      fileName: entry.name,
      filePath: join(sourceDir, entry.name),
      preserveColors,
    }))
    .sort((left, right) => left.componentName.localeCompare(right.componentName))
}

const renderComponent = async (source: IconSource) => {
  const rawSvg = await readFile(source.filePath, 'utf8')
  const svg = source.preserveColors ? rawSvg : normalizeToCurrentColor(rawSvg)
  const componentCode = await transform(
    svg,
    {
      expandProps: 'end',
      icon: false,
      plugins: svgrPlugins,
      prettier: false,
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          'removeDimensions',
        ],
      },
      typescript: true,
    },
    { componentName: source.componentName },
  )

  return format(`${GENERATED_TAG}\n${componentCode}`, {
    parser: 'typescript',
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  })
}

const renderIndex = async (sources: IconSource[]) => {
  const exports = sources
    .map(
      (source) => `export { default as ${source.componentName} } from './${source.componentName}'`,
    )
    .join('\n')

  return format(
    `${GENERATED_TAG}\n\nexport type { SVGProps as IconProps } from 'react'\n\n${exports}\n`,
    {
      parser: 'typescript',
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
    },
  )
}

const readExistingGeneratedFiles = async () => {
  let entries

  try {
    entries = await readdir(OUTPUT_DIR, { withFileTypes: true })
  } catch {
    return []
  }

  const generatedFiles: string[] = []

  for (const entry of entries) {
    if (!entry.isFile() || !['.ts', '.tsx'].includes(extname(entry.name))) {
      continue
    }

    const filePath = join(OUTPUT_DIR, entry.name)
    const content = await readFile(filePath, 'utf8')

    if (content.startsWith(GENERATED_TAG)) {
      generatedFiles.push(filePath)
    }
  }

  return generatedFiles
}

const readFileOrEmpty = async (filePath: string) => {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

const assertUniqueComponentNames = (sources: IconSource[]) => {
  const seen = new Map<string, string>()

  for (const source of sources) {
    const previous = seen.get(source.componentName)

    if (previous) {
      throw new Error(
        `Duplicate icon component name "${source.componentName}" from ${previous} and ${source.fileName}`,
      )
    }

    seen.set(source.componentName, source.fileName)
  }
}

const main = async () => {
  const sources = [
    ...(await readIconSources(CURRENT_COLOR_SOURCE_DIR, false)),
    ...(await readIconSources(PRESERVE_COLOR_SOURCE_DIR, true)),
  ].sort((left, right) => left.componentName.localeCompare(right.componentName))

  assertUniqueComponentNames(sources)

  const expectedFiles = new Map<string, string>()

  for (const source of sources) {
    expectedFiles.set(
      join(OUTPUT_DIR, `${source.componentName}.tsx`),
      await renderComponent(source),
    )
  }

  if (sources.length > 0) {
    expectedFiles.set(join(OUTPUT_DIR, 'index.ts'), await renderIndex(sources))
  }

  const existingGeneratedFiles = await readExistingGeneratedFiles()
  const staleFiles = existingGeneratedFiles.filter((filePath) => !expectedFiles.has(filePath))
  const changedFiles: string[] = []

  for (const [filePath, content] of expectedFiles) {
    const currentContent = await readFileOrEmpty(filePath)

    if (currentContent !== content) {
      changedFiles.push(filePath)
    }
  }

  if (CHECK_ONLY) {
    if (changedFiles.length > 0 || staleFiles.length > 0) {
      process.stderr.write(
        ['Icon generated files are out of date.', ...changedFiles, ...staleFiles]
          .map((line) => `- ${line}`)
          .join('\n'),
      )
      process.stderr.write('\nRun `pnpm icons:build`.\n')
      process.exitCode = 1
      return
    }

    process.stdout.write(
      `Icon generated files are up to date. (${String(sources.length)} SVG files)\n`,
    )
    return
  }

  await mkdir(OUTPUT_DIR, { recursive: true })

  for (const filePath of staleFiles) {
    await rm(filePath)
  }

  for (const [filePath, content] of expectedFiles) {
    await writeFile(filePath, content)
  }

  process.stdout.write(`Generated ${String(sources.length)} icon components.\n`)
}

await main()
