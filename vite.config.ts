/*
 * This file is part of the Web3 Library developed by mFactory GmbH.
 *
 * Copyright © 2021, mFactory GmbH
 *
 * Solana Reference Stake Pool is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Solana Reference Stake Pool is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 * If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 *
 * You can be released from the requirements of the Affero GNU General Public License
 * by purchasing a commercial license. The purchase of such a license is
 * mandatory as soon as you develop commercial activities using the
 * Solana Reference Stake Pool code without disclosing the source code of
 * your own applications.
 *
 * The developer of this program can be contacted at <info@mfactory.ch>.
 */

import { resolve } from 'path';
import { BuildOptions, DepOptimizationOptions, PluginOption, defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import vue from '@vitejs/plugin-vue';
import visualizer from 'rollup-plugin-visualizer';
import components from 'unplugin-vue-components/vite';
import inject from '@rollup/plugin-inject';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
// import sri from 'rollup-plugin-sri';

import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
// noinspection ES6PreferShortImport
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from './src/config/common';

export default defineConfig(({ mode }) => {
  // const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isReport = mode === 'report';

  const plugins: (PluginOption | PluginOption[])[] = [
    // {
    //   enforce: 'post',
    //   ...sri({ publicPath: '/' }),
    // },
    vue({
      include: [/\.vue$/, /\.md$/],
      template: { transformAssetUrls },
      reactivityTransform: true,
    }),
    quasar({
      // sassVariables: 'src/quasar-variables.sass',
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: SITE_TITLE,
          description: SITE_DESCRIPTION,
          keywords: SITE_KEYWORDS,
        },
      },
    }),
    chunkSplitPlugin({
      // strategy: 'unbundle',
    }),
    // https://github.com/antfu/unplugin-vue-components
    components({
      extensions: ['vue', 'md'],
      dts: 'types/components.d.ts',
    }),
  ];

  const build: BuildOptions = {
    manifest: isProd,
    // sourcemap: false,
    // brotliSize: false,
    // cssCodeSplit: false,
    // polyfillDynamicImport: false,
    // assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      // treeshake: true,
      // output: {
      //   manualChunks(id) {
      //     if (id.includes('/node_modules/')) {
      //       return 'vendors';
      //     }
      //   },
      // },
    },
  };

  if (isReport) {
    plugins.push(
      visualizer({
        filename: './dist/report.html',
        open: true,
        brotliSize: true,
      }),
    );
  }

  const optimizeDeps: DepOptimizationOptions = {
    include: [
      'vue',
      // 'vue-chartjs',
      'vue-chart-3', // TODO: remove
      'chart.js',
      // 'chartjs-adapter-luxon',
      '@quasar/extras/eva-icons',
      'bn.js',
    ],
    exclude: ['vue-demi'],
    esbuildOptions: {
      minify: true,
    },
  };

  return {
    build,
    plugins,
    optimizeDeps,

    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: '@import "@/assets/scss/global.scss";\n',
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
      // TODO https://github.com/vitejs/vite/issues/5833
      charset: false,
    },

    resolve: {
      // browser: true,
      // preferBuiltins: false,
      dedupe: [
        'bn.js',
        'bs58',
        'lodash',
        'buffer',
        'buffer-layout',
        'eventemitter3',
        '@solana/web3.js',
        '@solana/buffer-layout',
      ],
      alias: [
        {
          find: /~(.+)/,
          replacement: resolve('node_modules/$1'),
        },
        { find: '@', replacement: resolve(__dirname, './src') },
      ],
    },

    define: {
      'process.env': process.env,
      // global: 'globalThis',
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      // onFinished() {
      // generateSitemap();
      // },
    },

    // https://github.com/vitest-dev/vitest
    // test: {
    //   include: ['test/**/*.test.ts'],
    //   environment: 'jsdom',
    //   deps: {
    //     inline: ['@vue', '@vueuse', 'vue-demi'],
    //   },
    // },
  };
});
