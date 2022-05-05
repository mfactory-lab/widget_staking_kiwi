import { resolve } from 'path';
import { BuildOptions, DepOptimizationOptions, PluginOption, defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
// import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import checker from 'vite-plugin-checker';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import components from 'unplugin-vue-components/vite';
import visualizer from 'rollup-plugin-visualizer';
import inject from '@rollup/plugin-inject';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const isProd = mode === 'production';
  const isReport = mode === 'report';

  const plugins: (PluginOption | PluginOption[])[] = [
    vue({
      include: [/\.vue$/, /\.md$/],
      template: { transformAssetUrls },
      // reactivityTransform: true,
    }),
    quasar(),
    createHtmlPlugin({
      inject: {
        data: {
          title: process.env.VITE_APP_TITLE,
          description: process.env.VITE_APP_DESCRIPTION,
          keywords: process.env.VITE_APP_KEYWORDS,
        },
      },
    }),
    // chunkSplitPlugin(),
    // https://github.com/antfu/unplugin-vue-components
    components({
      extensions: ['vue', 'md'],
      dts: 'types/components.d.ts',
    }),
    // https://github.com/fi3ework/vite-plugin-checker
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
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
    include: ['vue', '@vueuse/core', 'lodash', '@quasar/extras/eva-icons', 'bn.js'],
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
      // global: 'globalThis',
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
