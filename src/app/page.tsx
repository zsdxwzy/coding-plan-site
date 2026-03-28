"use client";

import { useState, useMemo } from "react";
import { platformsData } from "@/lib/data";
import type { Platform } from "@/lib/types";

const badgeColors: Record<string, string> = {
  green: "bg-accent/10 text-accent",
  yellow: "bg-warn/10 text-warn",
  blue: "bg-blue/10 text-blue",
  purple: "bg-purple/10 text-purple",
  red: "bg-red-500/10 text-red-400",
};

const regionLabels = { all: "全部", cn: "🇨🇳 国内", intl: "🌍 国际" };
const categoryLabels = { all: "全部", plan: "Coding Plan", ide: "Agentic IDE", agent: "Agent" };

export default function Home() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<"all" | "cn" | "intl">("all");
  const [category, setCategory] = useState<"all" | "plan" | "ide" | "agent">("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return platformsData.platforms.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (category !== "all" && p.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.models.some((m) => m.toLowerCase().includes(q)) ||
          p.tools.some((t) => t.toLowerCase().includes(q)) ||
          p.badge.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, region, category]);

  const active = activeId ? filtered.find((p) => p.id === activeId) : null;
  const cnCount = platformsData.platforms.filter((p) => p.region === "cn").length;
  const intlCount = platformsData.platforms.filter((p) => p.region === "intl").length;

  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="text-lg font-bold">⌘ Coding<span className="font-mono text-accent">Plan</span></div>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-accent">
            {platformsData.updatedAt} 更新
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-20 text-center">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/[.07] blur-3xl" />
        <h1 className="mb-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight">
          2026 AI Coding Plan
          <br />
          <span className="text-accent">全平台横评</span>
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-base text-text2">
          {cnCount} 大国内平台 + {intlCount} 大国际产品 · 价格/模型/能力全面对比
        </p>
        <div className="flex flex-wrap justify-center gap-12">
          {[
            { n: `${cnCount + intlCount}`, l: "平台对比" },
            { n: "20+", l: "编程模型" },
            { n: "30+", l: "编程工具" },
            { n: "¥7.9", l: "最低首月" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-mono text-3xl font-bold text-accent">{s.n}</div>
              <div className="mt-0.5 text-xs text-text3">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search + Filters */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        {/* Search */}
        <div className="mb-5">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-bg2 px-4 py-2.5 transition-colors focus-within:border-accent/40">
            <svg className="h-4 w-4 shrink-0 text-text3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="搜索平台、模型、工具…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text3"
            />
            {search && (
              <button onClick={() => setSearch("")} className="shrink-0 text-xs text-text3 hover:text-text">✕</button>
            )}
          </div>
        </div>
        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region */}
          <div className="flex overflow-hidden rounded-lg border border-border">
            {(Object.keys(regionLabels) as Array<keyof typeof regionLabels>).map((r) => (
              <button
                key={r}
                onClick={() => { setRegion(r); setActiveId(null); }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${region === r ? "bg-accent/10 text-accent" : "bg-bg3 text-text2 hover:bg-bg4"}`}
              >
                {regionLabels[r]}
              </button>
            ))}
          </div>
          {/* Category */}
          <div className="flex overflow-hidden rounded-lg border border-border">
            {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setActiveId(null); }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${category === c ? "bg-blue/10 text-blue" : "bg-bg3 text-text2 hover:bg-bg4"}`}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-text3">
            {filtered.length} 个平台
            {(search || region !== "all" || category !== "all") && (
              <button onClick={() => { setSearch(""); setRegion("all"); setCategory("all"); }} className="ml-1 text-accent hover:underline">
                清除筛选
              </button>
            )}
          </span>
        </div>
      </section>

      {/* Quick Compare Table */}
      {!search && region === "all" && category === "all" && (
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <h2 className="mb-2 flex items-center gap-2.5 text-xl font-bold">
            <span className="inline-block h-6 w-1 rounded-sm bg-accent" />
            快速对比
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-bg3 text-xs font-semibold uppercase tracking-wider text-text2">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left">平台</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left">类型</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left">入门价</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left">核心模型</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left">上下文</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left">亮点</th>
                </tr>
              </thead>
              <tbody>
                {platformsData.platforms.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-white/[.01] cursor-pointer" onClick={() => setActiveId(p.id)}>
                    <td className="px-4 py-3 font-semibold text-text">
                      {p.region === "cn" ? "🇨🇳" : "🌍"} {p.name}
                    </td>
                    <td className="px-4 py-3 text-text2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.region === "cn" ? "bg-accent/10 text-accent" : "bg-blue/10 text-blue"}`}>
                        {categoryLabels[p.category]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-accent">
                      {p.plans[0]?.price === 0 ? "免费" : p.plans[0]?.priceLabel}
                    </td>
                    <td className="px-4 py-3 text-text2 text-xs">{p.models.slice(0, 3).join(" · ")}{p.models.length > 3 ? "…" : ""}</td>
                    <td className="px-4 py-3 text-text2 text-xs">{p.contextWindow || p.plans[0]?.quota5h || "—"}</td>
                    <td className="px-4 py-3 text-xs font-medium text-accent">{p.badge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Detail Cards / Filtered Grid */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="mb-2 flex items-center gap-2.5 text-xl font-bold">
          <span className="inline-block h-6 w-1 rounded-sm bg-accent" />
          详细方案
        </h2>
        <p className="mb-6 text-sm text-text2">
          {(search || region !== "all" || category !== "all") ? "筛选结果" : "点击快速对比表中的行，或选择平台查看详情"}
        </p>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(activeId === p.id ? null : p.id)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${activeId === p.id ? "bg-accent/10 text-accent border border-accent/30" : "bg-bg3 text-text2 border border-border hover:bg-bg4 hover:text-text"}`}
            >
              {p.region === "cn" ? "🇨🇳" : "🌍"} {p.name}
            </button>
          ))}
          {filtered.length === 0 && <span className="text-sm text-text3">没有匹配的平台</span>}
        </div>

        {/* Show single detail or grid */}
        {active ? (
          <PlatformCard platform={active} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <MiniCard key={p.id} platform={p} onClick={() => setActiveId(p.id)} />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-2 flex items-center gap-2.5 text-xl font-bold">
          <span className="inline-block h-6 w-1 rounded-sm bg-accent" />
          常见问题
        </h2>
        <div className="mt-6 flex flex-col gap-2">
          {faqData.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between bg-bg2 px-5 py-4 text-left text-sm font-semibold transition-colors hover:bg-bg3 select-none"
              >
                {item.q}
                <span className={`font-mono text-lg text-text3 transition-transform ${openFaq === i ? "rotate-45 text-accent" : ""}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px]" : "max-h-0"}`}>
                <p className="px-5 pb-4 text-[13px] leading-7 text-text2">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t border-border px-6 py-10">
        <div className="mb-6 rounded-lg bg-bg3 px-5 py-4 text-xs leading-7 text-text3">
          <p className="mb-2 font-semibold text-text2">📋 免责声明</p>
          <p>本站所有价格数据来源于各平台官网公开信息，仅供参考和对比，我们不保证数据的准确性与时效性，请以各平台官网实际价格为准。</p>
          <p>本站与任何平台无官方关联，不代表任何平台的立场。各平台名称、Logo 均为其各自商标所有权人的财产。</p>
          <p>本站部分外链可能包含推广链接（Affiliate），通过这些链接购买不会增加您的费用，但我们可能获得少量佣金。我们会在有明显推广性质的链接旁予以标注。</p>
        </div>
        <p className="text-center text-xs text-text3">© 2026 CodingPlan.dev · 数据更新于 {platformsData.updatedAt}</p>
      </footer>
    </>
  );
}

/* ─── Mini Card (Grid View) ─── */
function MiniCard({ platform, onClick }: { platform: Platform; onClick: () => void }) {
  const cheapest = platform.plans.find((p) => p.price > 0) || platform.plans[0];
  return (
    <button onClick={onClick} className="group cursor-pointer rounded-xl border border-border bg-bg2 p-5 text-left transition-all hover:border-accent/30 hover:bg-bg3">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-bold">{platform.name}</h3>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColors[platform.badgeColor]}`}>{platform.badge}</span>
      </div>
      <div className="mb-2 flex flex-wrap gap-1 text-[11px] text-text3">
        {platform.region === "cn" ? "🇨🇳 国内" : "🌍 国际"} · {categoryLabels[platform.category]}
        {platform.contextWindow && <> · {platform.contextWindow}</>}
      </div>
      <div className="mb-2 font-mono text-xl font-bold text-accent">
        {cheapest.price === 0 ? "免费" : cheapest.priceLabel}
      </div>
      <div className="text-xs text-text2">{platform.models.slice(0, 4).join(" · ")}</div>
      <div className="mt-3 text-[11px] text-text3">{platform.plans.length} 个套餐 →</div>
    </button>
  );
}

/* ─── Full Platform Card ─── */
function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg2">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-7 py-5">
        <div>
          <button onClick={() => {}} className="cursor-default text-lg font-bold">
            {platform.region === "cn" ? "🇨🇳" : "🌍"} {platform.name}
            <span className={`ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeColors[platform.badgeColor]}`}>
              {platform.badge}
            </span>
            <span className={`ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${platform.region === "cn" ? "bg-accent/10 text-accent" : "bg-blue/10 text-blue"}`}>
              {categoryLabels[platform.category]}
            </span>
          </button>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text3">
            {platform.desc.map((d) => <span key={d}>{d}</span>)}
            {platform.contextWindow && <span>上下文 {platform.contextWindow}</span>}
          </div>
        </div>
      </div>
      <div className="p-7">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {platform.plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-lg border p-5 transition-colors ${plan.popular ? "border-accent/35 bg-gradient-to-br from-bg3 to-accent/[.04]" : "border-border bg-bg3 hover:border-border2"}`}>
              {plan.popular && <span className="absolute -top-px right-4 rounded-b-md bg-accent px-2 py-0.5 text-[10px] font-bold text-bg">推荐</span>}
              <div className="mb-1 text-sm font-semibold">{plan.name}</div>
              <div className="mb-1 font-mono text-2xl font-bold text-accent">
                {plan.firstMonth && <span className="block font-sans text-xs text-warn">{plan.firstMonth}</span>}
                {plan.priceLabel}
              </div>
              {(plan.quota5h || plan.quotaWeek || plan.quotaMonth) && (
                <div className="mb-2 text-[13px] text-text2">
                  {plan.quota5h && <><b className="text-text">{plan.quota5h}</b></>}
                  {plan.quotaWeek && <> · <b className="text-text">{plan.quotaWeek}</b>/周</>}
                  {plan.quotaMonth && <> · <b className="text-text">{plan.quotaMonth}</b>/月</>}
                </div>
              )}
              {plan.tags && (
                <div className="flex flex-wrap gap-1">
                  {plan.tags.map((t) => <span key={t} className="rounded-full bg-white/[.04] px-2 py-0.5 text-[11px] text-text3">{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
        {platform.notice && (
          <div className="mb-4 rounded-lg border-l-[3px] border-warn bg-bg3 px-4 py-3 text-xs leading-relaxed text-text3">{platform.notice}</div>
        )}
        <div className="mb-4 space-y-1 text-[13px] text-text2">
          <div>模型：<strong className="text-text">{platform.models.join(" · ")}</strong></div>
          <div>支持工具：<strong className="text-text">{platform.tools.join(" · ")}</strong></div>
        </div>
        <a href={platform.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-all hover:-translate-y-px hover:bg-accent2">查看详情 →</a>
      </div>
    </div>
  );
}

const faqData = [
  { q: "什么是 Coding Plan？", a: "国内 Coding Plan 是按月订阅的模型额度套餐，兼容 Cursor / Claude Code / Cline 等 AI 编程工具，替代按 token 付费。国际产品则是完整的 AI IDE / Agent 产品。" },
  { q: "国内 Coding Plan 和国际产品有什么区别？", a: "国内 Coding Plan 买的是「模型 API 额度」（配合第三方工具使用），价格低但需自行搭配工具链。国际产品（Cursor、Copilot 等）是完整产品，开箱即用，但价格高 5-10 倍。" },
  { q: "最省钱的使用方式？", a: "Cursor Pro ($20/月) + 国内 Coding Plan (¥29-40/月) ≈ ¥180-210/月。日常用国产模型省钱，复杂推理切回 Claude。或者直接用 Copilot Pro ($10/月) + 通义灵码/百炼 Lite 做补全。" },
  { q: "支持哪些编程工具？", a: "大多数平台支持 Claude Code、Cursor、Cline、Roo Code、Kilo Code、OpenCode 等。智谱 GLM 支持最多（20+ 款），含免费 MCP 工具。" },
  { q: "「5小时限额」是什么意思？", a: "滚动5小时窗口限制。额度随时间自动恢复。部分平台还有周/月限制。一次提问可能触发 5-30 次模型调用。" },
  { q: "2026 年最值得关注的趋势？", a: "① 全部工具都在走向 Agent 模式 ② $200/月成为「AI 全职搭档」价格锚点 ③ 多 Agent 并行（Antigravity）可能改变工作流 ④ 规范驱动开发（Kiro）是被低估的方向 ⑤ 国内厂商的免费窗口正在关闭。" },
];
