/*
 * This file is part of Solana Reference Stake Pool code.
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
import Vue from '@vitejs/plugin-vue';
import ViteVisualizer from 'rollup-plugin-visualizer';
import Components from 'unplugin-vue-components/vite';
import inject from '@rollup/plugin-inject';

export default defineConfig(({ mode }) => {
  // const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isReport = mode === 'report';

  const plugins: (PluginOption | PluginOption[])[] = [
    createHtmlPlugin({
      inject: {
        data: {
          title: 'staking.kiwi',
          description: 'Solana staking.',
          keywords: 'Solana, SOL',
        },
      },
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
      // reactivityTransform: true,
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      // resolvers: [QuasarResolver()],
      dts: 'src/components.d.ts',
    }),
  ];

  const build: BuildOptions = {
    manifest: isProd,
    sourcemap: false,
    brotliSize: false,
    cssCodeSplit: false,
    polyfillDynamicImport: false,
    chunkSizeWarningLimit: 2500, // 550 TODO: optimize
    assetsInlineLimit: 4096,
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            return 'vendors';
          }
        },
      },
    },
  };

  if (isReport) {
    plugins.push(
      ViteVisualizer({
        filename: './dist/report.html',
        open: true,
        brotliSize: true,
      }),
    );
  }

  const optimizeDeps: DepOptimizationOptions = {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
      'pinia',
      'quasar',
      '@quasar/extras/eva-icons',
      '@solana/spl-stake-pool',
      '@solana/web3.js',
      '@solana/spl-token',
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
      browser: true,
      preferBuiltins: false,
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
      global: 'globalThis',
    },

    // https://github.com/antfu/vite-ssg
    // ssgOptions: {
    //   script: 'async',
    //   formatting: 'minify',
    //   // onFinished() {
    //   // generateSitemap();
    //   // },
    // },

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
