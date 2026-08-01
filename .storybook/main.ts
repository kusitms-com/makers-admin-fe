import path from 'path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import type { StorybookConfig } from '@storybook/react-vite'
import type { PluginOption } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Storybook의 Vite 빌더는 root vite.config.ts를 자동으로 불러와 병합한다.
// 거기 포함된 reactRouter() 플러그인은 react-router dev/build CLI 밖에서 실행되면
// "The React Router Vite plugin requires the use of a Vite config file" 에러로 빌드가
// 깨지므로, 이름이 react-router로 시작하는 플러그인을 재귀적으로 제거한다.
async function withoutReactRouterPlugins(
  plugins: PluginOption[] | undefined,
): Promise<PluginOption[]> {
  const result: PluginOption[] = []
  for (const item of plugins ?? []) {
    const plugin = await item
    if (Array.isArray(plugin)) {
      result.push(await withoutReactRouterPlugins(plugin))
      continue
    }
    if (
      plugin &&
      typeof plugin === 'object' &&
      'name' in plugin &&
      plugin.name.startsWith('react-router')
    ) {
      continue
    }
    result.push(plugin)
  }
  return result
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = await withoutReactRouterPlugins(viteConfig.plugins)
    viteConfig.plugins.push(tailwindcss())
    viteConfig.resolve ??= {}
    viteConfig.resolve.alias = {
      '@': path.resolve(dirname, '../src'),
      '@api': path.resolve(dirname, '../src/api'),
      '@components': path.resolve(dirname, '../src/components'),
      '@hooks': path.resolve(dirname, '../src/hooks'),
      '@lib': path.resolve(dirname, '../src/lib'),
      '@pages': path.resolve(dirname, '../src/pages'),
    }
    if (process.env.STORYBOOK_BASE_PATH) {
      viteConfig.base = process.env.STORYBOOK_BASE_PATH
    }
    return viteConfig
  },
}
export default config
