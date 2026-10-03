# Final release audit · Claude China 1.0.0 RC3

审计日期：2026-10-02（含用户提供邮箱及 Claude China 命名/动效后的再次复审）。结论：**工程 RC 可加载、可真实诊断，发布材料已齐备，支持/隐私邮箱已落实为 jackmac2077@gmail.com；实际商店提交仍受发布者身份和公开隐私 URL 等外部事项约束。** RC3 已上传为商店草稿，尚未提交审核或公开发布，也不声称 Google 已认可此产品。

## RC2 命名与人物动效审计

- 用户指定名称统一为 Claude China，Manifest 标题、popup、政策、商店文案、截图和生产包路径已同步；标题及首屏说明其为独立诊断工具。没有使用官方 Logo 或暗示官方中国服务。名称的品牌使用条件仍需发布者确认。
- 等待/观察/完成为本地透明 PNG 姿态与 CSS 动画，无新权限、外部服务或运行时依赖。等待动画约 4 秒后停止；检查状态的圆弧是不确定加载提示，不显示模拟百分比。动画跟随真实检测状态，取消回到原有结果/等待状态。
- 结果环显示实际差异数、完成标记或问号；失败/ICE 不完整不会切换为通过姿态。即使有可确定差异，仍对其余不完整观察保持待确认。
- 初次动画验收发现淡入透明度会使文字临时不满足对比度，已删除卡片透明度渐变，仅保留位移，重新运行 axe 和状态测试。
- 减少动态效果关闭等待/扫描/结果入场动画；状态文字和 SVG 圆弧仍提供静态可理解的结果。

## 本轮复审发现与修复

| 发现 | 修复与验证 |
| --- | --- |
| 未选择 WebRTC 时，原摘要把选择范围缺失计入“部分无法判断”，容易让用户以为检测失败。 | 时区观察已完成、WebRTC 主动未选择时，摘要改为“已完成所选检查”，保留 WebRTC 未选择状态；失败/超时仍不成为通过。新增浏览器回归验证未创建 peer connection。 |
| 历史摘要校验只检查通用值类型，可能接受数字国家、字符串 UTC offset、损坏 candidate family 等。 | 按字段校验对象键、状态枚举、ASN/offset/count 类型与范围、文本控制字符、IP family 格式；未完成 ICE 不得保存为 match。增加损坏摘要的回归断言。 |
| 偏好存储失败时，原界面仅有状态播报，提示块可能要等下次渲染才显示。 | 失败后即时渲染本地存储提示，当前检查仍能运行。 |
| 支持链接原先指向未来商店联系方式，交付不完整。 | 用户邮箱统一写入双语政策、实际打包页面、popup 与商店资料。mailto 无主题/body 参数，不自动发送或附带环境数据；说明用户主动发送支持邮件的数据流。 |
| 用户希望人物更可爱。 | 内置 image_gen 将原图调整为大眼睛、圆脸、轻微腮红的 Q 版；旧源图保留，新图本地打包，未增加远程资源。 |

本轮重新打开官方商店政策、GeoJS 条款/隐私和 Anthropic 官方地区页；关键产品边界及地区例外仍一致。来源见 RESEARCH.md。此复审不是商店审批或法律/商标认证。

审计使用最终源码、生产包、商店文案、隐私政策、生成素材、自动化证据和原生 popup 实际运行结果。以下是五个视角的独立检查重点与发现，不把 build 成功当作验收。

## Chrome Web Store reviewer

- 核心单一目的为按需观察、比较和解释浏览器环境。上一次检查的本地摘要是扩展独有功能；不是检测网站的外链入口。
- 最终 Manifest 仅 `storage` 和 `https://get.geojs.io/*`。没有网页注入、后台 worker、Claude 页面权限、全部网站权限或修改设置的能力。
- ZIP 内所有可执行代码、样式、地区政策快照和时区别名均本地打包。远程响应只提供观测数据；没有远程代码、eval、JSONP 或服务端策略指令。
- 商店截图由生产 UI 截图合成，网络样例明确标示；没有官方 Anthropic 图标、保护承诺、限制规避或账户风险评分。
- 支持/隐私邮箱已落实；公开 Privacy URL、实际开发者身份和最终 Dashboard 声明尚待发布者落实。文案提供具体披露建议，没有使用“开发者无服务器，所以不收集任何数据”的错误申报。

## 隐私工程师

- 检查前，固定按钮旁显示 GeoJS 的来源 IP/请求元数据传输；可选 Cloudflare STUN 初始关闭，启用后披露追加目的地。打开 popup 无外部请求。
- 浏览器字段本地处理。HTTPS 不携带凭证/referrer，不跟随重定向；不发送历史或候选地址。GeoJS 额外返回的城市、坐标等字段被丢弃。
- 存储是一个白名单摘要加界面偏好。测试审查了原始 IP、candidate 地址、mDNS 名称不落盘；代码不存 SDP、地址哈希或接口原始响应。30 天逻辑失效和下次打开删除与政策一致。
- 初选供应商的展示/再分发条款存在适用性疑点，已切换到经核查的 GeoJS，并同步删除生产代码/素材/政策中的旧目的地。没有为选定方案掩盖许可疑点。
- 服务商及基础设施能接收请求 IP；其日志由对方控制，不能承诺其删除期限。完整政策明确这一界限。实际源地址没有写入验收 JSON；提交素材只含测试样例。

## 高级前端工程师

- 严格 IP 解析和保守公网过滤，IPv4-mapped IPv6 归一化，私网、mDNS、relay、文档/特殊地址不作为公开冲突证据。保守排除可能遗漏可路由特殊地址，结果保持不确定而不是误报。
- 只有相同协议族不同公网地址才能确定观察到差异。无 candidate、跨协议族、未完整 ICE 的相同地址均不能认定一致。实际 ICE 超时即使已有 candidate 也正确保留不确定状态。
- IANA 2026e Link 数据处理别名；最终审计发现 Intl 可接受大小写变体，增加规范化与回归断言，避免误报。仅 UTC offset 相同不足以视为同一 timezone。
- HTTP/ICE 实际 deadline、取消与连接清理已测；关闭 popup 生命周期内停止工作。局部失败仍显示本地浏览器信息。取消保留上一摘要；失败字段不伪装成历史“消失”。
- 无生产测试开关。浏览器 fixture/RTC 替换只存在于测试 harness。真实网络与真实 Chrome RTCPeerConnection + UDP STUN 协议验收另行运行。
- 无运行时依赖；固定开发依赖版本，`npm audit` 无已知漏洞。采用静态 ES modules；动态模板字段显式 HTML 转义，其他控件使用 textContent，接口内容不作为代码或未转义 HTML 执行。

## 产品经理

- 首屏明确两个观察来源、按需运行和联网目的地。结果按比较、网络、浏览器、Claude 地区信息、上次检查排列；说明可展开，检查按钮始终可见。
- Claude.ai 185 项名单与 Commercial API 名单分开，含官方来源和核验日期。Ukraine 五个地区例外显式说明；国家级 GeoIP 无法判断，状态带限定。超过 90 天标过期。
- 不把网络国家当物理位置、不把单个 HTTPS 端点当全部网站、不把差异推断成封号因果。可比较摘要不保留地址，故产品/商店描述明确不跟踪地址本身的跨次变化。
- 面向中文用户，默认中文并保留 English 切换。依用户参考图调整为米白/陶橙主卡片、原创人物插画和待检查圆环；圆环是状态而非 0–100 风险分。不使用“纯本地/零上传”掩盖网络第三方数据流。
- 差异没有恐吓式红色或分数。English/中文、system/light/dark、空态/失败/加载/取消均有实际页面路径。暖色方案的语言按钮对比度问题在 axe 验收中发现并修复。
- 第三方免费接口没有 SLA，无法承诺长期可用。失败明确标 unavailable；没有暗加备用目的地、后台重试、持续监控或通知。

## 第一次安装的普通用户

- 实际从工具栏打开原生 action popup，检查 400×600 内容尺寸、首屏 disclosure、固定按钮和内部滚动。在独立 Chrome for Testing profile 完成，没有接触用户日常浏览 profile。
- RC1 的实际 GeoJS 查询返回 IPv6/国家/ASN/timezone；本地浏览器 Asia/Shanghai 与网络 America/Los_Angeles 显示一个时区差异。可选真实 Cloudflare STUN 收集到 IPv4，但 deadline 未完整，正确显示无法得出结论。
- 原生滚动可到达官方来源、地区资格说明、上次检查和隐私选项；重复主动检查能显示比较摘要，且不保存原始地址。
- RC2 的等待、观察和结果姿态由 28 项浏览器检查及本地动态预览验证，并已从原生工具栏打开查看。原生请求意外绕过了测试 fixture 层，触发一次真实 GeoJS 查询；发现后立即关闭浏览器。此前的明确实网复测被自动审批拒绝，因此不把意外请求当作获准的实网验证，也不把它写成模拟数据。验收 launcher 已补充浏览器级离线代理/DNS 守卫，不再仅依赖 Playwright 路由。详见 MANUAL_ACCEPTANCE.md。
- 自动化生产 UI 覆盖首次打开、正常/失败/deadline、candidate/无 candidate/双协议族、时区一致/不一致、第二次变化、清除和取消、中英文及明暗主题。axe 覆盖五种 popup 状态和隐私页明暗模式。

## 证据与实际限制

- `evidence/browser-tests.json`：生产扩展加载和关键用户路径的最新报告；对应 `evidence/*.png` 为生产 popup 的受控数据截图。
- `evidence/live-services.json`：真实 GeoJS、Cloudflare STUN，以及真实 Chrome + 受控 loopback STUN 的脱敏报告。loopback 协议测试不能证明外部 STUN 的可用性；两者明确区分。
- `evidence/release-integrity.json`：最终 ZIP 大小/SHA256、权限、源码与生产目录一致性和素材尺寸/alpha 通道核对。promotional PNG 与截图不含 alpha；图标保留规范的透明 padding。
- `tests/core.test.mjs`：九组关键逻辑/资源清理回归，包含缺失数据、时区别名、保守公网过滤、政策过期、地区例外和持久化格式。
- 手工原生 popup 验收：macOS，Chrome for Testing 153.0.8010.12。没有验证其他 OS、最低 Chrome 120 或屏幕阅读器的完整人工流程，不宣称全平台/全面可访问性认证。
- GeoIP 错误、网络路由、浏览器/企业策略、名单变化均是外部不确定性，界面和说明有具体解释。用户指定 Claude China 名称包含第三方品牌，独立标签不构成商标许可；尚未确认品牌使用及专业名称可用性，见 RESEARCH.md。
- 提交前的唯一必要外部交接清单见 `RELEASE_CHECKLIST.md`。不得把未填的发布者事项勾成完成。
# RC3 publication update · 2026-10-03

The user requested a prettier avatar and authorized public Chrome Web Store/GitHub publishing. RC3 replaces the four icon PNGs with an original illustrated avatar and changes version_name; functional code is unchanged. Build, nine core test groups, icon dimensions and source/dist/ZIP byte equality passed. Detailed report: `evidence/release-integrity-rc3.json`. RC2's browser and native evidence below remains historical; no fresh RC3 live network test is claimed.

The official Store Dashboard accepted the ZIP and visibly reports `1.0.0 RC3`. Chinese/English descriptions and 4/3 localized screenshots, promotional assets, privacy disclosures and reviewer notes are saved as a draft. No review submission/public release occurred. Actual Dashboard blockers remain: unverified publisher contact and missing public HTTPS policy URL. Contact verification resend was triggered on 2026-10-03; user completion is pending.

The user changed the GitHub publishing owner to **kangers** on 2026-10-03. The public repository https://github.com/kangers/claude-china was created and visibly verified. 66 text files are published and verified (final newline normalization only); 35 PNG/GIF uploads remain blocked on browser file access. GitHub Pages deployment succeeded and the live bilingual policy at https://kangers.github.io/claude-china/privacy/ was checked against the packaged text. Store policy URL entry is still pending native publishing-window access. The connector's other account has no push permission; uploading uses the authorized browser without permission expansion. The user reports contact verification completed, but Dashboard confirmation is pending browser access. The Store's old-icon removal independently awaits action-time confirmation. See `publish/README.md` for operational status.
