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
import { injectHtml, minifyHtml } from 'vite-plugin-html';
import Vue from '@vitejs/plugin-vue';
// import ViteLegacy from '@vitejs/plugin-legacy';
import ViteVisualizer from 'rollup-plugin-visualizer';

import Components from 'unplugin-vue-components/vite';
import { QuasarResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isReport = mode === 'report';

  const base = isProd ? '/staling-kiwi/' : '/';

  const plugins: (PluginOption | PluginOption[])[] = [
    injectHtml({
      data: {
        title: 'JStaking',
        description: 'Solana staking.',
        keywords: 'Solana, SOL',
      },
    }),
    minifyHtml({
      // collapseBooleanAttributes: true,
      // collapseWhitespace: true,
      // minifyCSS: true,
      // minifyJS: true,
      // minifyURLs: true,
      // removeAttributeQuotes: true,
      // removeComments: true,
      // removeEmptyAttributes: true,
      // html5: true,
      // keepClosingSlash: true,
      // removeRedundantAttributes: true,
      // removeScriptTypeAttributes: true,
      // removeStyleLinkTypeAttributes: true,
      // useShortDoctype: true,
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    // ViteComponents({
    //   customComponentResolvers: [resolveQuasar],
    // }
    // AutoImport({
    //   resolvers: [QuasarResolver()],
    // }),
    Components({
      resolvers: [QuasarResolver()],
    }),
  ];

  const build: BuildOptions = {
    manifest: false,
    cssCodeSplit: false, // true,
    sourcemap: false,
    polyfillDynamicImport: false,
    brotliSize: false,
    chunkSizeWarningLimit: 2000, //550
    assetsInlineLimit: 4096,
    minify: 'terser',
    terserOptions: {
      compress: {
        // drop_console: true,
        drop_debugger: true,
      },
    },
  };

  if (isProd) {
    build.manifest = true;

    // TODO: charset error
    // plugins.push(
    //   /**
    //    * DESC:
    //    * provides support for legacy browsers
    //    * that do not support native ESM
    //    */
    //   ViteLegacy({
    //     targets: ['defaults', 'not IE 11'],
    //   }),
    // );
  }

  if (isReport) {
    plugins.push(
      /**
       * DESC:
       * visualize bundle
       */
      ViteVisualizer({
        filename: './dist/report.html',
        open: true,
        brotliSize: true,
      }),
    );
  }

  let optimizeDeps: DepOptimizationOptions = {};

  if (isDev) {
    /**
     * DESC:
     * dependency pre-bundling
     */
    optimizeDeps = {
      include: ['quasar', 'lodash', '@vue/runtime-core', '@vueuse/core', '@vueuse/head'],
      exclude: ['vue-demi'],
    };
  }

  return {
    base,

    build,
    plugins,
    optimizeDeps,

    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: '@import "@/assets/scss/_variables.scss";\n',
        },
      },
      // TODO https://github.com/vitejs/vite/issues/5833
      charset: false,
    },

    resolve: {
      alias: [
        {
          find: /~(.+)/,
          replacement: resolve('node_modules/$1'),
        },
        { find: '@', replacement: resolve(__dirname, './src') },
      ],
    },

    server: {
      fs: {
        strict: true,
      },
    },

    // https://github.com/antfu/vite-ssg
    // ssgOptions: {
    //   script: 'async',
    //   formatting: 'minify',
    // },

    // support node libraries
    define: {
      'process.env': process.env,
      global: 'window',
    },
  };
});
