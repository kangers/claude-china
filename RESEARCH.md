# Research & decisions

核验日期：**2026-10-02（Asia/Shanghai）**。只保留影响实现/发布的来源。它们是当日可访问的一手页面，不代表 Google 或 Anthropic 对此扩展的审核/背书，也不能保证之后不变。


## 发布前复核 · 2026-10-03

重新读取 [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies)、[Anthropic Supported Regions Policy](https://www.anthropic.com/supported-countries)、[GeoJS Terms](https://www.geojs.io/tos/) / [Privacy](https://www.geojs.io/privacy/) 和 [Cloudflare STUN FAQ](https://developers.cloudflare.com/realtime/turn/faq/)。影响当前产品的结论保持一致：商店要求可访问的准确隐私政策、最小权限与自包含 MV3 逻辑；Claude.ai 段落仍为 185 项，Ukraine 五个地区例外仍在；GeoJS 仍声明不保存 access logs、保留 error logs，API 可限流/停止；Cloudflare 仍将 STUN 描述为免费服务。这次是页面复核，没有发送诊断请求，也没有修改扩展中原始快照核验日期。

## Chrome 与商店

| 一手来源 | 直接影响的决定 |
| --- | --- |
| [Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies) | 只读环境诊断是单一目的；上一检查摘要提供扩展独有价值。准确披露数据目的、第三方、最小权限、Limited Use；不预测账号限制或宣传绕过措施。商店审核涵盖描述和素材。没有在此页查到独立的“2026 AI 诊断扩展豁免”；按普通扩展规则审查。 |
| [MV3 overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) / [CSP](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy) | 所有 JS/CSS 本地打包；数据响应只作为数据。无 eval、远程 SDK、iframe、JSONP、远程字体或远程逻辑。无需后台 worker。 |
| [Cross-origin requests](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests) / [Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions) | 仅申请一个明确的 HTTPS 数据主机与 storage；不读标签页/网页/Claude 数据。 |
| [Storage](https://developer.chrome.com/docs/extensions/reference/api/storage) / [Action popup](https://developer.chrome.com/docs/extensions/reference/api/action) | local 摘要，不用 sync。400×600 popup，固定首尾和内部滚动。生命周期内检测，关闭时终止，无后台监控。 |
| [Store image requirements](https://developer.chrome.com/docs/webstore/images) | 128 PNG 图标、440×280 small promo、1280×800 全幅截图；可选 1400×560 marquee。素材为原创，截图明确标示示例网络数据。 |

实际读取了政策的隐私、minimum permission、single purpose、minimum functionality、MV3/remote-code、metadata 和 enforcement 条款。没有把 Chrome Apps 的要求误称为所有扩展专属要求。提交当天必须再次核查 Dashboard 和政策。

## Network：选择 GeoJS，取消初始 IPWHOIS.IO 方案

- [GeoJS Geo endpoint](https://www.geojs.io/docs/v1/endpoints/geo/)：公开 HTTPS JSON，国家代码、ASN 与 organization_name。实测 IPv6 响应含 IANA timezone。只读 `get.geojs.io/v1/ip/geo.json`；不使用查询任意 IP 或 JSONP。
- [General docs](https://www.geojs.io/docs/general/)：有 IPv4/IPv6；当日没有固定限额。V1 只查询双栈主机的一条当前 HTTP 路径，不暗称测到了全部协议族。ToS 仍保留 throttling 权利，因此实现了通用 429/error/timeout，不做自动 retry。
- [Terms](https://www.geojs.io/tos/)：公开 API 使用条款，没有候选供应商的 internal-business-only / redistribution 限制；as-is、禁止滥用，可限流/变更。适用于当前自用 IP 观察和正常前端展示的采用是工程判断，不是供应商专项授权或法律意见。无账号、付费或商用密钥写入包。
- [Privacy](https://www.geojs.io/privacy/)：服务商声明不存 access logs，保留 error logs，并使用 Cloudflare 网络。UI 和政策仍说明服务商收到来源 IP/标准元数据，不宣传“完全不发送数据”。不承诺第三方日志删除时间。
- [GeoJS homepage attribution](https://www.geojs.io/)：其 GeoIP 来源为 MaxMind GeoLite。网络详情提供 GeoJS / GeoLite2 by MaxMind 署名。扩展不镜像或分发数据库；城市、坐标等无关响应字段立即丢弃。

备选调查：[IPWHOIS.IO docs](https://ipwhois.io/documentation) 虽写允许 free 商业使用，但其 [Terms](https://ipwhois.io/terms) 有 personal/internal-business、转发/再分发条款，与商店公开发布需澄清；CORS 域共享额度也不理想。**最终代码无此目的地或 fallback。** [ipapi.is terms](https://ipapi.is/terms.html) 同样有数据再分发/公开查询限制，且匿名 schema 在 2026-09 变化；未采用。[ip.guide](https://ip.guide/) 能返回需要字段，但没有查到足够明确的供应商隐私与展示条款，未采用。

未部署 Cloudflare Worker：当前一条免密钥 HTTPS 调用满足字段需求，额外自有服务会增加运营、日志/数据处理和部署负担。免费 GeoJS 无 SLA 是已接受且明确披露的 V1 限制；不是可无限增长的服务承诺。

## WebRTC 与时区

- [RFC 8828](https://www.rfc-editor.org/rfc/rfc8828.html)：ICE 地址可受路由/多网卡、浏览器隐私策略影响，观察不是所有网站的保证。
- [W3C WebRTC](https://www.w3.org/TR/webrtc/)：使用 RTCIceCandidate 的 address/type、无 media capture 的 data channel，只 gather，不与 remote peer 连接。mDNS/阻断/无响应不会暴露可靠原因，缺少 candidate 不能判安全。
- [Chromium mDNS policy source](https://chromium.googlesource.com/chromium/src/+/376fc41e87a058f7a7b300b0ec3a4982b4ec0960/components/policy/resources/templates/policy_definitions/Miscellaneous/WebRtcLocalIpsAllowedUrls.yaml)：现代 Chrome 可将 local host 地址替换为 mDNS，企业例外存在。该来源说明机制，当前行为另在真实 Chrome 验证；不把旧 flags 指南当作当前默认。
- [Cloudflare STUN FAQ](https://developers.cloudflare.com/realtime/turn/faq/) 和 [privacy](https://www.cloudflare.com/privacypolicy/)：采用文档中的免费 STUN `stun.cloudflare.com:3478`，初始关闭、显式可选。服务端收到该 UDP 路径的 IP；不申请麦克风/摄像头/隐私设置权限。
- [IANA tzdb](https://www.iana.org/time-zones) / [2026e release](https://data.iana.org/time-zones/releases/tzdata2026e.tar.gz)：打包 Link 数据；同名别名不误报差异，当前 offset 相同不认定 zone 相同。浏览器 ICU 规则可能落后，GeoIP timezone 是估计。

本次真实验收曾观察到 HTTP IPv6 与 STUN IPv4，也观察到 HTTP IPv4；收集到 deadline 时仍未完整，最终正确显示 inconclusive。受控 loopback STUN 用真实 UDP Binding Response 和 Chrome RTCPeerConnection 验证 candidate 事件管线，与真实公网线路结论分开。JSON 报告不保留真实地址。

## Claude 场景与同类工具

- [Anthropic Supported Regions Policy](https://www.anthropic.com/supported-countries)：明确分开 Commercial API 与 Claude.ai。只映射 **Claude.ai 185 项**，保存官方名称与 ISO 映射。Ukraine 的 Crimea、Donetsk、Kherson、Luhansk、Zaporizhzhia 例外单独处理，国家级 IP 信息不能判断。官方还有其他资格/实体政策，列入名单不是账号资格证明。
- [Anthropic location explanation](https://privacy.claude.com/en/articles/11186740-does-claude-use-my-location) 与 [Consumer Terms](https://www.anthropic.com/legal/consumer-terms)：公开信息不足以建立浏览器语言/时区/WebRTC 与账号封禁的因果或概率模型，产品不作此推断，不试图规避服务使用限制。
- 观察 [ip.cx/claude](https://ip.cx/claude)、[FuckClaude 原项目](https://github.com/LinXiaoTao/FuckClaude)、[BrowserLeaks](https://browserleaks.com/webrtc) 和 [Google WebRTC Network Limiter](https://chromewebstore.google.com/detail/webrtc-network-limiter/npeicpdbkakmehahjeeohfdhnlpdklia)。这里只借此确认用户关注的事实字段和市场常见误导，不采纳评分、所谓地域指纹推断、恐吓式 leak 话术或自动设置修改，也未复制源码/设计。后者修改路由策略，超出本产品只读边界。

## 未解决的外部条件与不确定性

最终中文首页按用户后续提供的参考结构调整，采用原创人物和米白/陶橙配色。没有采纳参考中的地区指纹权重、0–100 风险分或“Claude 同款检测”推断；没有证据支持“国外用户不会被限制”。默认中文是用户体验选择，不作为账号或国籍判断。第一屏仍准确披露 GeoJS 数据传输。

1. 支持/隐私邮箱已由用户提供并统一为 jackmac2077@gmail.com；商店发布者身份及其控制的公开 Privacy URL 仍需落实，不能由邮箱推断或虚构。实际提交/审核未执行。
2. 所有服务和条款可能变化。提交当天复核 GeoJS/Cloudflare，后续维护不能沿用失效条款。无免费服务 SLA 或所有网络路径覆盖承诺。
3. IP 位置不是物理位置，单站检测不代表 Anthropic 或所有网站。Chrome 扩展 origin 与网页 origin 的 ICE 行为可能不同。
4. 当前 native popup/服务验收在 macOS Chrome for Testing 153；Windows/Linux、最低 Chrome 120、屏幕阅读器的完整人工验收未完成。不将 axe 通过写成全面 accessibility certification。
5. 用户指定产品名称为 **Claude China**（原工作名 EnvLens）。按[商店 Impersonation & Intellectual Property 政策](https://developer.chrome.com/docs/webstore/program-policies/impersonation-and-intellectual-property)，名称、页面和素材不得暗示未经授权的官方关系。当前名称保留在产品中，标题/首屏/描述显式标为独立诊断工具；保留原创图标，无官方 Logo，不声称官方中国服务。名称含第三方品牌；独立声明不等于商标许可，发布者仍须确认品牌使用条件/名称可用性。原工作名的同名 CLI 调查不作为新名称的可用性证明。

## 本地人物动效 · RC2

用户提供的多张截图用于状态变化参考：等待、观察、完成。沿用原创可爱人物，以内置 image_gen 编辑出本地透明 PNG 姿态，CSS 实现短暂打盹/扫描/回应。没有引入动画框架、远程媒体或权限。闲置动画不超过约 4.2 秒，主动检查中的圆弧为不确定加载状态，不显示人为增长的百分比；结果用观察到的差异数、完成标记或问号。失败/未完成不使用完成姿态或完整绿色圆环。尊重 prefers-reduced-motion。
