# windssea.fun — 设计规格

**日期:** 2026-04-30  
**状态:** 已确认  
**平台:** 移动端优先 · React + Vite · Cloudflare Workers

---

## 1. 整体定位

个人爱好聚合站，移动端首页作为功能入口（类 iOS 桌面），后续持续添加新功能模块。首期上线：摩斯密码训练机。

---

## 2. 视觉风格

- **主题:** 终端绿 / 电报机风
- **背景:** `#0d1117`（近黑）
- **主色:** `#00ff41`（荧光绿）
- **字体:** `Courier New` / 等宽字体
- **圆角:** 图标 14px，卡片 10-12px，按钮 12px
- **发光效果:** 激活元素使用 `box-shadow: 0 0 12px #00ff4155` + SVG `feGaussianBlur` filter
- **非激活元素:** 边框 `#2a2a2a`，文字 `#333`~`#444`，虚线占位

---

## 3. 首页

### 布局
- 全屏深色背景
- 顶部居中：`WINDSSEA.FUN`，小字，`letter-spacing: 3px`，绿色低透明度
- 主体：4列图标网格，`gap: 14px`，`padding: 0 20px`

### 图标规格
- 尺寸：`48×48px`，`border-radius: 14px`
- **已有功能:** `background: #0a2a0a`，`border: 1.5px solid #00ff41`，`box-shadow: 0 0 12px #00ff4155`，图标内 emoji 或自定义图案
- **占位功能:** `background: #111`，`border: 1px dashed #2a2a2a`，无内容
- 图标下方标签：`font-size: 8px`，已有功能 `color: #ccc`，占位 `color: #333`

### 交互
- 点击已有功能图标 → 路由跳转对应页面
- 占位图标不可点击（或点击无响应）

---

## 4. 摩斯密码训练机

### 页面结构（从上到下）

```
┌─────────────────────────┐
│  ‹  MORSE TRAINER  WPM  │  ← 顶部导航栏
├─────────────────────────┤
│                         │
│     决策树 SVG 区域      │  ← 主体，动态聚焦3层
│                         │
├─────────────────────────┤
│  [M]  — —   已输入: HI_ │  ← 当前字母 + 符号 + 文本
├─────────────────────────┤
│   TAP / HOLD 大按钮      │  ← 核心输入按钮
└─────────────────────────┘
```

### 4.1 决策树

- **渲染方式:** SVG，`viewBox` 自适应容器宽度
- **层数:** 始终显示3层（根节点 + L1 + L2 + L3）
- **节点状态:**
  - 当前路径节点：`fill: #0a2a0a`，`stroke: #00ff41`，`stroke-width: 2`，SVG glow filter
  - 非路径节点：`fill: #111`，`stroke: #2a2a2a`，文字 `#444`
  - 淡出节点（路径分叉后的另一侧）：`fill: #0d1117`，`stroke: #111`，文字 `#1a2a1a`，`stroke-dasharray`
- **分支规则:** 左分支 = 点（·），右分支 = 划（—）
- **路径提示:** 树底部小字显示当前路径序列，如 `当前路径: — — → M`
- **重置:** 字母确认后，树恢复初始状态（所有节点等权重显示）

### 4.2 当前字母显示区

- 左侧：`44×44px` 绿色边框方块，显示当前解码字母（大字）
- 中间：横向排列的点划符号（点=小圆，划=短矩形，均为 `#00ff41` 发光）
- 右侧：已输入文本，`color: #00ff4199`，末尾光标 `_`

### 4.3 大按钮

- 占据页面底部，`padding: 14px`，`border-radius: 12px`
- 主文字：`TAP / HOLD`，`letter-spacing: 2px`
- 副文字：`点击 = ·  |  按住 = —`
- 按下状态：背景加深 `#0f3a0f`，发光增强

### 4.4 输入逻辑

| 操作 | 判定 | 阈值 |
|------|------|------|
| 按下后快速松开 | 点（·） | `< 200ms` |
| 按下后长按松开 | 划（—） | `≥ 200ms` |
| 松开后停顿 | 确认当前字母 | `600ms` |
| 确认后继续停顿 | 插入空格 | `1400ms`（从上次确认起） |

- 每次按下：Vibration API 短震（`navigator.vibrate(10)`）
- 每次确认字母：Vibration API 双震（`navigator.vibrate([20, 50, 20])`）
- 无效序列（不存在的摩斯码）：轻微抖动动画 + 清空当前序列

### 4.5 顶部导航

- 左侧：`‹` 返回首页
- 中间：`MORSE TRAINER`
- 右侧：实时 WPM（每分钟单词数），初始显示 `WPM: 0`

---

## 5. 技术方案

### 技术栈
- **框架:** React 18 + Vite
- **语言:** TypeScript
- **样式:** Tailwind CSS（配置终端绿主题色）
- **路由:** React Router v6
- **部署:** Cloudflare Workers，git push 自动触发

### 项目结构
```
src/
  pages/
    Home.tsx          # 首页图标网格
    MorseTrainer.tsx  # 摩斯训练机
  components/
    MorseTree.tsx     # 决策树 SVG 组件
    MorseButton.tsx   # 大按钮组件
    LetterDisplay.tsx # 当前字母+符号显示
  hooks/
    useMorseInput.ts  # 输入计时逻辑
  data/
    morseCode.ts      # 摩斯码映射表 + 树结构数据
  App.tsx
  main.tsx
```

### 摩斯码数据结构
```ts
// 树节点
interface MorseNode {
  letter: string | null  // null = 根节点或无效节点
  dot: MorseNode | null  // 左子树（·）
  dash: MorseNode | null // 右子树（—）
}
```

---

## 6. 扩展性

- 首页图标网格支持任意数量功能，新增功能只需添加图标配置
- 占位图标自动填满当前行，保持网格整齐
- 后续功能模块各自独立路由，不影响现有功能

---

## 7. 不在本期范围内

- 摩斯码音效（Web Audio API）
- 跟练模式 / 听写模式
- 成绩记录 / 历史统计
- 数字（0-9）摩斯码支持（可后续加）
