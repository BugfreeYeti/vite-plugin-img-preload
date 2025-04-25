// vite-plugin-img-preload.js
import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {Object} Options
 * @property {string} [dir='public/images'] 图片目录路径
 * @property {string} [prefix='/images/'] 资源路径前缀
 * @property {(filename: string, filepath: string) => boolean} [filter] 按需过滤函数
 * @property {boolean} [hash=false] 是否处理带哈希的文件名（如 image.123abc.jpg）
 */

/**
 * Vite 图片预加载插件（支持按需加载）
 * @param {Options} options
 */
export default function vitePluginImgPreload(options = {}) {
  const {
    dir = 'public/images',
    prefix = `/${dir.split('/').pop()}/`,
    filter,
    hash = false,
  } = options;

  return {
    name: 'vite-plugin-img-preload',
    enforce: 'pre',
    
    // 开发和生产模式均启用
    apply(config, { command }) {
      return command === 'build' || command === 'serve';
    },

    transformIndexHtml(html, { path: htmlPath, bundle }) {
      
      try {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
          console.warn(`[vite-plugin-img-preload] Directory not found: ${dir}`);
          return html;
        }

        // 1. 读取目录下的图片文件
        const files = fs.readdirSync(dirPath).filter((file) => {
          const isImage = /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(file);
          if (!isImage) return false;         
          // 2. 按需过滤
          if (filter) {
            const filepath = path.join(dirPath, file);
            return filter(file, filepath);
          }
          return true;
        });
       

        if (files.length === 0) {
          console.warn(`[vite-plugin-img-preload] No images matched in: ${dir}`);
          return html;
        }

        // 3. 处理带哈希的文件名（从 bundle 中获取真实路径）
        const resolvedFiles = hash && bundle
          ? resolveHashedFiles(files, bundle, prefix)
          : files.map(file => `${prefix}${file}`);

        // 4. 生成 preload 标签
        const preloadTags = resolvedFiles
          .map(href => `<link rel="preload" href="${href}" as="image" />`)
          .join('\n    ');

        // 5. 插入到 head 中
        return html.replace(
          /(<head[^>]*>)/i,
          `$1\n    <!-- Preload images (vite-plugin-img-preload) -->\n    ${preloadTags}`
        );
        
      } catch (error) {
        console.error('[vite-plugin-img-preload] Error:', error.message);
        return html;
      }
    },
  };
}

/** 处理带哈希的文件名 */
function resolveHashedFiles(files, bundle, prefix) {
  const manifest = Object.entries(bundle).reduce((acc, [key, value]) => {
    if (value.type === 'asset' && /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(key)) {
      const filename = path.basename(key);
      acc[filename] = value.fileName;
    }
    return acc;
  }, {});

  return files.map(file => {
    const hashedFile = manifest[file] || file;
    return `${prefix}${hashedFile}`;
  });
}