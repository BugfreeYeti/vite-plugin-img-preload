### vite-plugin-img-preload

[

](https://www.npmjs.com/package/vite-plugin-img-preload)


一个用于自动生成图片预加载标签的 Vite 插件，帮助提升网站首屏加载性能和用户体验。

## 功能特点

- ✨ 自动扫描指定目录下的图片文件
- 🚀 在 HTML 中添加 `<link rel="preload">` 标签实现图片预加载
- 🔍 支持按需过滤，只预加载特定图片
- 🔄 支持处理带哈希文件名的图片资源
- 🛠️ 可控制在开发环境中是否启用
- 🌐 开发和生产环境均可配置


## 安装

```shellscript
# npm
npm install vite-plugin-img-preload --save-dev

# yarn
yarn add vite-plugin-img-preload -D

# pnpm
pnpm add vite-plugin-img-preload -D
```

## 基本使用

在 `vite.config.js` 或 `vite.config.ts` 中配置插件：

```javascript
import { defineConfig } from 'vite';
import imgPreload from 'vite-plugin-img-preload';

export default defineConfig({
  plugins: [
    imgPreload()
  ]
});
```

这将自动扫描 `public/images` 目录下的所有图片，并在 HTML 的 `<head>` 中添加预加载标签。默认情况下，插件只在生产环境中启用。

## 配置选项

### 完整配置示例

```javascript
import { defineConfig } from 'vite';
import imgPreload from 'vite-plugin-img-preload';

export default defineConfig({
  plugins: [
    imgPreload({
      // 图片目录路径，相对于项目根目录
      dir: 'public/assets/images',
      
      // 资源路径前缀，通常与 dir 的最后一部分对应
      prefix: '/assets/images/',
      
      // 是否处理带哈希的文件名
      hash: true,
      
      // 是否在开发环境中启用预加载
      enableInDev: false,
      
      // 按需过滤函数
      filter: (filename, filepath) => {
        // 只预加载首屏关键图片
        return filename.includes('hero') || 
               filename.includes('logo') || 
               filename.startsWith('banner-');
      }
    })
  ]
});
```

### 选项详解

| 选项 | 类型 | 默认值 | 描述
|-----|-----|-----|-----
| `dir` | `string` | `'public/images'` | 图片目录路径，相对于项目根目录
| `prefix` | `string` | 自动从 `dir` 推断 | 资源路径前缀，用于生成图片的 URL
| `hash` | `boolean` | `false` | 是否处理带哈希的文件名（如 `image.123abc.jpg`）
| `enableInDev` | `boolean` | `false` | 是否在开发环境中启用预加载功能
| `filter` | `Function` | `undefined` | 按需过滤函数，返回 `true` 表示预加载该图片


#### filter 函数

`filter` 函数接收两个参数：

```typescript
filter: (filename: string, filepath: string) => boolean
```

- `filename`: 图片文件名（如 `logo.png`）
- `filepath`: 图片文件的完整路径（如 `/path/to/project/public/images/logo.png`）


返回 `true` 表示该图片将被预加载，返回 `false` 则跳过。

#### enableInDev 选项

`enableInDev` 控制插件在开发环境中是否启用：

- `false`（默认）：插件仅在生产环境（build）中启用，开发环境（dev/serve）中不生效
- `true`：插件在开发环境和生产环境中都启用


在开发环境中启用预加载可能会影响热更新性能，但对于测试预加载功能很有用。

## 使用场景

### 1. 预加载首屏关键图片

```javascript
imgPreload({
  filter: (filename) => {
    // 只预加载首屏关键图片
    const criticalImages = ['hero.jpg', 'logo.svg', 'banner.png'];
    return criticalImages.includes(filename);
  }
})
```

### 2. 按图片类型过滤

```javascript
imgPreload({
  filter: (filename) => {
    // 只预加载 WebP 和 AVIF 格式的图片
    return /\.(webp|avif)$/i.test(filename);
  }
})
```

### 3. 多目录配置

如果需要预加载多个目录下的图片，可以注册多个插件实例：

```javascript
plugins: [
  imgPreload({ dir: 'public/images' }),
  imgPreload({ dir: 'public/icons', prefix: '/icons/' })
]
```

### 4. 在开发环境中启用预加载

```javascript
imgPreload({
  dir: 'public/images',
  enableInDev: true // 在开发环境中也启用预加载
})
```

## 工作原理

1. 插件在构建过程中扫描指定目录下的图片文件
2. 根据配置和过滤条件选择需要预加载的图片
3. 在 HTML 的 `<head>` 中插入 `<link rel="preload" as="image">` 标签
4. 浏览器加载 HTML 时会提前请求这些图片资源


生成的 HTML 代码示例：

```html
<head>
  <!-- 其他 head 标签 -->
  
  <!-- Preload images (vite-plugin-img-preload) -->
  <link rel="preload" href="/images/logo.png" as="image" />
  <link rel="preload" href="/images/hero.jpg" as="image" />
  <link rel="preload" href="/images/banner.webp" as="image" />
</head>
```

## 最佳实践

1. **只预加载关键图片**：过多的预加载会占用带宽，影响其他资源加载
2. **优先考虑首屏图片**：优先预加载首屏可见的关键图片
3. **考虑图片大小**：避免预加载过大的图片，建议限制在 200KB 以内
4. **结合图片格式优化**：使用现代图片格式如 WebP、AVIF 可以减小文件大小
5. **开发环境谨慎启用**：开发环境中通常不需要预加载，除非需要测试预加载功能


## 常见问题

### 图片未被预加载

1. 检查目录路径是否正确
2. 确认图片文件扩展名是否受支持（支持 png, jpg, jpeg, gif, webp, avif, svg）
3. 如果使用了 `filter` 函数，检查过滤条件是否正确
4. 如果在开发环境中测试，确认已设置 `enableInDev: true`


### 带哈希文件名的图片路径不正确

确保设置了 `hash: true` 选项，插件会尝试从构建产物中解析正确的文件路径。

### 开发环境中预加载不生效

默认情况下，插件在开发环境中不启用。如需在开发环境中测试预加载功能，请设置 `enableInDev: true`。

## 与其他插件的兼容性

本插件与大多数 Vite 插件兼容，包括但不限于：

- `@vitejs/plugin-vue`
- `@vitejs/plugin-react`
- `vite-plugin-pwa`
- `vite-plugin-html`


## 浏览器兼容性

`<link rel="preload">` 在现代浏览器中得到广泛支持：

- Chrome 50+
- Firefox 56+
- Safari 11.1+
- Edge 17+


## 贡献指南

欢迎提交 Issues 和 Pull Requests！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request


## 许可证

MIT

## 相关资源

- [MDN: Link 类型: preload](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types/preload)
- [Vite 插件 API](https://cn.vitejs.dev/guide/api-plugin.html)
- [图片优化最佳实践](https://web.dev/fast/#optimize-your-images)


---

如果您觉得这个插件有用，请给它一个 ⭐️！