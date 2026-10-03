# Claude China

> GitHub 上传状态（2026-10-03）：文本源码已提交，PNG/GIF 素材尚待浏览器文件上传权限开启后补齐。当前 GitHub main 尚不是完整可安装版本。Chrome Web Store 中的 RC3 草稿包是完整包，尚未提交审核或公开发布。

公开隐私政策：https://kangers.github.io/claude-china/privacy/

一个只读、按需运行的 Chrome Manifest V3 环境诊断扩展。**Detect → Compare → Explain。** 无账号、无后台监控、无运行时依赖和后端。

当前交付：**1.0.0 RC3**。可直接加载，更新为原创可爱人物头像。Chrome Web Store 已上传并创建草稿（尚未提交审核或公开发布），最新进度见 [发布记录](publish/README.md)。

## 直接运行

1. 打开 Chrome 的 `chrome://extensions`，开启 Developer mode。
2. 点击 **Load unpacked / 加载已解压的扩展程序**，选择本目录的 `dist/claude-china`（也可选择 `extension`）。
3. 固定 Claude China 图标并打开 popup。打开不会自动联网。
4. 阅读按钮旁的网络披露，点击 **开始检查 / Check my environment**。
5. 需要 WebRTC 时，在“检查选项与隐私”选择该项，再主动检查。运行时保持 popup 打开；关闭会终止尚在进行的观察。
6. 第二次检查会与上一次摘要比较。结果详情可展开；底部检查按钮固定，主体可滚动。

Chrome 120+，建议当前 stable。实际 UI 验收在 Chrome for Testing 153.0.8010.12（macOS，独立 profile）完成。RC2 自动化动画验收和动态预览使用本地测试响应；原生 popup 请求意外绕过测试拦截并触发一次 GeoJS 查询，发现后已停止并补充离线守卫，见验收记录。正式的真实外部 GeoJS/STUN 报告来自此前 RC1。普通 Chrome 手动加载流程与测试浏览器相同。浏览器/企业策略可能限制第三方请求或 WebRTC。

## 产品行为

- Network：本次 HTTPS 请求在 get.geojs.io 呈现的公网 IP、国家/地区、ASN/组织、位置数据库估计的时区。单个请求不是“所有网站看到的 IP”。
- Browser：本地 timezone、UTC offset、language/languages、Intl locale、浏览器品牌/主版本及平台。信息性展示，不据此评估 Claude 风险。
- Comparison：IANA 时区标识比较（处理别名）；HTTP IP 与相同协议族公开、非 relay WebRTC candidate 比较。无法判断、超时或跨 IPv4/IPv6 的证据不会被计为一致。
- Claude Availability：**Claude.ai** 官方地区名单的内置快照、核验日期、官方来源和地区例外。与 API 名单分开；不预测账户访问资格。名单超过 90 天停止给出有效名单状态。
- History：本地只保留一份必要摘要。30 天后逻辑失效，在下次打开时删除。不保存原始 IP、candidate 地址、SDP 或 IP 哈希，因而不比较地址本身的跨次变化。每次主动完成的检查（包括部分失败）覆盖摘要；取消不覆盖。
- 原创人物：待检查打盹、检查中拿放大镜观察、完成后确认；证据不足保持待确认。圆环为不确定加载动画或事实状态，不做虚构进度。闲置动效约 4 秒后停止，尊重系统减少动态效果。
- 默认中文（已选择的 English 偏好会保留）/ English，system / light / dark，语义化键盘操作，reduced motion。

Claude China 为用户指定名称；这是独立工具，与 Anthropic 无关联，也不是官方中国服务。名称中包含第三方品牌，公开提交前需确认品牌使用和商标事项。

没有评分、账号访问保证、Claude 页面注入、指纹修改、代理切换或限制绕过功能。

## 隐私与权限

仅 `storage` 和 `https://get.geojs.io/*`。没有 `tabs`、`activeTab`、`cookies`、`history`、`webRequest`、`proxy`、`debugger`、`scripting`、`privacy` 或 `<all_urls>`。

主动检查连接 GeoJS；可选观察连接 Cloudflare STUN。服务商能看到相应路径的来源 IP。完整数据流、存储内容和第三方保留限制见 [Privacy Policy](PRIVACY_POLICY.md)。原始结果仅在 popup 内存中存在，无远程代码和远程字体。

## 支持与隐私联系

[jackmac2077@gmail.com](mailto:jackmac2077@gmail.com)。扩展内“检查选项与隐私”提供同一入口；不会自动附带诊断数据或发送邮件。

## 开发与验证

```sh
npm ci
npx playwright install chromium
npm run assets          # 原创本地人物/图标 → 必需尺寸 PNG
npm test                # IP/IPv6、时区、地区、历史、超时与清理逻辑
npm run build           # 静态源码校验、权限校验、生产 ZIP 和 SHA256
npm run test:browser    # 实际安装生产扩展，fixture 驱动关键路径和 axe 审计
node tests/live.mjs     # 真实外部 API/STUN，无 fixture；仅保存脱敏证据
npm run store-assets   # 从测试截图生成 1280×800 商店图
```

`node scripts/live-browser.mjs .test-profile-native` 启动工具栏验收浏览器：使用浏览器级离线 HTTP 代理/DNS 守卫；普通页面使用本地示例，原生 popup 请求可能显示不可用，请保持 WebRTC 未选择。守卫修改未在本轮再次原生触发请求。`node scripts/motion-preview.mjs`（需本机 ffmpeg）从真实生产 popup 生成 `evidence/motion-preview.gif`，仅用于动画预览，网络数据为示例。

Node 22+。开发依赖仅 Playwright、axe 和 sharp；不会进入扩展。网络边界测试用 fixture，避免为了每个分支更改系统网络。真实 API/STUN 验收另行记录，不能与模拟的确定性验证混淆。

`npm run check` 执行单元测试、构建与浏览器场景。`evidence/` 有测试报告与 popup 成品截图；`FINAL_AUDIT.md` 记录五个视角的最终审计与限制。

## 结构

```text
extension/            可直接加载的完整源码（ES modules、原生 DOM/CSS）
  lib/ip.js           保守的公网识别、IPv6 归一化、candidate 过滤
  lib/compare.js      纯判断逻辑、历史摘要、政策 freshness
  lib/diagnostics.js  HTTP / STUN 适配器、超时、清理
  lib/storage.js      本地存储、格式校验、逻辑过期
  lib/i18n.js         中文 / English 文案
  data/               经核验的 Claude.ai 名单与 IANA tzdb Link 数据
scripts/              构建与原创素材生成
tests/                关键逻辑、扩展端到端、真实服务验证
assets/store/         可提交的图标、截图、small promo、marquee 及源素材
dist/claude-china/         最终 Load unpacked 目录
```

详细工程说明：[ARCHITECTURE.md](docs/ARCHITECTURE.md)。重要一手来源：[RESEARCH.md](RESEARCH.md)。商店文案：[STORE_LISTING.md](STORE_LISTING.md)。

## 更新与维护

官方地区名单可能变化，不能只更改核验日期。保存新官方 Claude.ai 段落，审查 ISO 映射和例外后更新数据、测试和 RESEARCH。IANA Link 数据可以按 `docs/DATA_MAINTENANCE.md` 更新。新代码仅通过扩展包更新分发，不在运行时拉取任何逻辑。

GeoJS 免费服务无 SLA，当前文档没有固定限额，但服务商保留限流/停服权利；失败会显式标为 unavailable。V1 不做自动重试或备用第三方请求。供应商条款或额度发生变化时，发布者须重新核查适用条件并更新产品披露；不要添加未经披露的 fallback 或把密钥写入扩展。
