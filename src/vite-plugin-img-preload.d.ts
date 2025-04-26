// vite-plugin-img-preload.d.ts

import { Plugin } from 'vite';

export interface ImgPreloadOptions {
  /**
   * 图片目录路径，相对于项目根目录
   * @default 'public/images'
   */
  dir?: string;
  
  /**
   * 资源路径前缀，用于生成图片的 URL
   * @default 自动从 dir 推断
   */
  prefix?: string;
  
  /**
   * 按需过滤函数，返回 true 表示预加载该图片
   */
  filter?: (filename: string, filepath: string) => boolean;
  
  /**
   * 是否处理带哈希的文件名（如 image.123abc.jpg）
   * @default false
   */
  hash?: boolean;
  
  /**
   * 是否在开发环境中启用预加载功能
   * @default false
   */
  enableInDev?: boolean;
}

/**
 * Vite 图片预加载插件（支持按需加载）
 * 
 * 自动扫描指定目录下的图片文件，并在 HTML 的 head 中添加 preload 标签
 * 
 * @param options 插件配置选项
 * @returns Vite 插件实例
 */
export default function vitePluginImgPreload(options?: ImgPreloadOptions): Plugin;