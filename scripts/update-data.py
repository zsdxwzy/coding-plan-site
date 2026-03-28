"""
每日自动更新 Coding Plan 数据的脚本。
运行方式：python scripts/update-data.py
依赖：标准库 + requests（pip install requests）
建议：通过 Windows 任务计划程序或 cron 每天运行一次
"""

import json
import re
import sys
import os
from datetime import date
from urllib.request import urlopen, Request
from urllib.error import URLError

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "data.ts")

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

PLATFORMS = {
    "aliyun": {
        "url": "https://help.aliyun.com/zh/model-studio/coding-plan",
        "patterns": {
            "lite_price": r"¥?(\d+\.?\d*)\s*[/／]\s*月.*?Lite",
            "pro_price": r"¥?(\d+\.?\d*)\s*[/／]\s*月.*?Pro",
            "first_month": r"首月.*?¥\s*(\d+\.?\d*)",
        },
    },
    "zhipu": {
        "url": "https://www.bigmodel.cn/glm-coding",
        "patterns": {
            "lite_price": r"¥\s*(\d+)\s*[/／]\s*月.*?Lite",
            "pro_price": r"¥\s*(\d+)\s*[/／]\s*月.*?Pro",
            "max_price": r"¥\s*(\d+)\s*[/／]\s*月.*?Max",
        },
    },
    "minimax": {
        "url": "https://platform.minimaxi.com/subscribe/token-plan",
        "patterns": {
            "starter_price": r"¥\s*(\d+)\s*[/／]\s*月",
        },
    },
    "kimi": {
        "url": "https://www.kimi.com/code",
        "patterns": {},
    },
    "volcengine": {
        "url": "https://www.volcengine.com/activity/codingplan",
        "patterns": {
            "lite_price": r"¥\s*(\d+)\s*[/／]\s*月",
            "first_month": r"首月.*?¥\s*(\d+\.?\d*)",
        },
    },
}


def fetch_page(url: str, timeout: int = 15) -> str:
    """获取页面文本"""
    req = Request(url, headers=HEADERS)
    try:
        with urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="ignore")
    except URLError as e:
        print(f"  ⚠️ 请求失败: {url} — {e}")
        return ""


def extract(html: str, pattern: str) -> str | None:
    """从 HTML 中提取价格"""
    m = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
    return m.group(1) if m else None


def check_platform(key: str, config: dict) -> dict:
    """检查单个平台，返回发现的变化"""
    changes = {}
    print(f"🔍 检查 {key}...")
    html = fetch_page(config["url"])
    if not html:
        changes["status"] = "fetch_failed"
        return changes

    for field, pattern in config["patterns"].items():
        value = extract(html, pattern)
        if value:
            changes[field] = value
            print(f"  ✅ {field} = {value}")
        else:
            print(f"  ❌ {field} = 未匹配")

    changes["status"] = "ok"
    changes["checked_at"] = date.today().isoformat()
    return changes


def main():
    """主函数：抓取所有平台，输出报告"""
    today = date.today().isoformat()
    print(f"📅 Coding Plan 数据更新 — {today}\n")

    results = {}
    for key, config in PLATFORMS.items():
        results[key] = check_platform(key, config)
        print()

    # 输出摘要
    ok_count = sum(1 for r in results.values() if r.get("status") == "ok")
    print(f"📊 检查完成：{ok_count}/{len(PLATFORMS)} 个平台成功")

    # 保存检查报告
    report_path = os.path.join(os.path.dirname(__file__), "..", "data", f"report-{today}.json")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({"date": today, "results": results}, f, ensure_ascii=False, indent=2)
    print(f"📄 报告已保存: {report_path}")

    # 如果有价格变化，提示更新 data.ts
    all_changes = {k: v for k, v in results.items() if v.get("status") == "ok" and len(v) > 2}
    if all_changes:
        print(f"\n⚠️  发现 {len(all_changes)} 个平台有数据变化，请手动验证后更新 src/lib/data.ts")
        for k, v in all_changes.items():
            print(f"  - {k}: {v}")
    else:
        print("\n✅ 未发现价格变化")


if __name__ == "__main__":
    main()
