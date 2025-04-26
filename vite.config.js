import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false, //清空dist
    minify: true, //开启压缩
    lib: {
      entry: "./src/vite-plugin-img-preload.js",
      name: "vite-plugin-img-preload",
      fileName: (format) => {
        return `vite-plugin-img-preload.${format}.js`;
      },
      formats: ["es", "cjs"],
    },
    rollupOptions:{
      // 将所有 Node.js 内置模块标记为外部依赖
      external: [
        'path',
        'fs',
        'node:path',
        'node:fs',
        /node:.*/
      ]
    }
  },
  resolve: {
    extensions: [".ts", ".js"], // 允许导入 TS 和 JS 文件
  },
});
