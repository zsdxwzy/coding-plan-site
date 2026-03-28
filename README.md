# AI Coding Plan 横评站

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 项目结构

```
src/
├── app/
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 首页（所有 UI）
│   └── globals.css     # 全局样式 + Tailwind
├── lib/
│   ├── types.ts        # TypeScript 类型
│   └── data.ts         # ⭐ 核心数据（定价/套餐/模型）
scripts/
└── update-data.py      # 每日数据抓取脚本
data/
└── report-*.json       # 每日抓取报告
```

## 每日自动更新

### 手动运行
```bash
python scripts/update-data.py
```

### 自动化（Windows 任务计划）
```powershell
# 创建每天早上 9 点运行的定时任务
schtasks /create /tn "CodingPlan-Update" /tr "python C:\path\to\scripts\update-data.py" /sc daily /st 09:00
```

### 工作原理
1. 脚本抓取各平台官方定价页
2. 用正则提取价格信息
3. 保存报告到 `data/report-YYYY-MM-DD.json`
4. 如果发现价格变化，提示人工确认后更新 `src/lib/data.ts`

### 添加新平台
1. 在 `scripts/update-data.py` 的 `PLATFORMS` 字典中添加配置
2. 在 `src/lib/data.ts` 的 `platforms` 数组中添加对应数据
3. 重新 build

## 部署到 Vercel
```bash
npx vercel
```

## 数据更新策略
- **有 API 的平台**：优先使用 API（目前国内 Coding Plan 均无公开 API）
- **无 API 的平台**：抓取官方页面 + 正则提取
- **兜底**：每日脚本检查，人工确认后更新
