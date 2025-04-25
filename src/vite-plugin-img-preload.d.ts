import { Plugin } from 'vite';

interface Options {
  /** 图片目录路径（默认 'public/images'） */
  dir?: string;
  /** 资源路径前缀（默认 '/images/'） */
  prefix?: string;
  /** 按需过滤函数（返回 true 表示需要预加载） */
  filter?: (filename: string, filepath: string) => boolean;
  /** 是否处理带哈希的文件名（如 image.123abc.jpg，默认 false） */
  hash?: boolean;
}

declare function vitePluginImgPreload(options?: Options): Plugin;

export default vitePluginImgPreload;