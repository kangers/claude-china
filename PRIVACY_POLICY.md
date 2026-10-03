# Claude China Privacy Policy / Claude China 隐私政策

Effective date / 生效日期：2026-10-02 · Version 1.0

## English

Claude China is an independent, read-only network and browser diagnostic extension. No account is required. It has no publisher-operated server, advertising, analytics, or background monitoring. It does not read website content, browsing history, cookies, passwords, Claude accounts, or conversations. It does not change browser or network settings.

**When you click Check.** The extension makes one HTTPS request directly to `https://get.geojs.io/v1/ip/geo.json`, operated by GeoJS. The service receives your source public IP and standard HTTP metadata (which may include browser type and language) and returns an estimated country, ASN/network organization, and timezone. The extension sends no stored history or custom browser diagnostic payload. Requests omit credentials, use no referrer, do not follow redirects, and are not automatically retried. IP geolocation can be inaccurate and this one endpoint does not represent all websites. The service's [privacy policy](https://www.geojs.io/privacy/) describes its logging and Cloudflare infrastructure. GeoJS states that it does not store access logs and does store error logs; Cloudflare infrastructure is involved. Retention is controlled by those providers; Claude China does not promise a deletion period for their logs. The response may also contain approximate city/coordinates and other GeoIP fields; Claude China discards these and does not display or persist them.

**Optional WebRTC observation.** This is off initially. If selected, clicking Check creates a local WebRTC data channel solely to gather ICE candidates and contacts Cloudflare's STUN service at `stun.cloudflare.com:3478`. Cloudflare receives the source IP and STUN protocol metadata of that route, which may differ from the HTTPS route. STUN uses UDP; it is not an HTTPS request and does not carry your browser observation or saved history. No camera, microphone, remote peer, or TURN relay is used. The connection closes when gathering completes, after 6.5 seconds, or on cancellation. See [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/). Browser policies and the network may prevent usable candidates. Claude China does not retain private addresses or mDNS names and never uploads collected candidate addresses to the IP service.

**Local browser data.** Timezone, UTC offset, language/languages, Intl locale, coarse browser brand/version, and platform are read in the extension and processed locally. There is no Canvas, font, WebGL, device enumeration, or precise location permission.

**Local retention.** `chrome.storage.local` holds interface language, theme, WebRTC selection, and at most one previous manual-check summary: timestamp; network observation status, country, ASN, organization and timezone; browser fields listed above; WebRTC completion status, public-candidate count, IP families and comparison state. Raw IPs, candidate addresses, address hashes, SDP, and third-party response bodies are never written to storage. Current raw results exist only in popup memory and are discarded when the popup closes. The summary is ignored after 30 days and removed the next time the popup opens; no background timer deletes it while Chrome is closed. A new completed check, including a partial result, replaces it. Chrome sync is not used. “Clear local data” removes the summary and stored preferences. Uninstalling removes extension storage. The UI may retain the current language/theme in memory until closing after a clear.

**Official policy data.** The Claude.ai region list is bundled with a verification date, compared locally, and becomes stale after 90 days. Claude China sends no requests to Anthropic for diagnosis. Opening an external official-source or provider-policy link is an ordinary browser navigation to that website, subject to its policy.

**Purpose and sharing.** Data is used only for the disclosed diagnostic and previous-check comparison. It is not sold, used for advertising, shared for unrelated purposes, or used to determine creditworthiness or lending eligibility. Use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including Limited Use requirements. The publisher does not automatically receive diagnostic reports. The extension provides no account-risk score or guarantee of service access and is not affiliated with Anthropic.

**Support and changes.** For local data, use Clear local data or uninstall. For GeoJS or Cloudflare logs, contact those providers through their policies. Support and privacy contact: [jackmac2077@gmail.com](mailto:jackmac2077@gmail.com). If you choose to send a support email, the publisher receives the email address and contents you provide solely to address your request; no diagnostics are automatically attached. Your email application/provider handles that communication under its own policies. The extension cannot access the support inbox or control email retention. Material behavior changes require an updated policy and release; additional network destinations must be disclosed before use.

## 简体中文

Claude China 是独立、只读的网络与浏览器环境诊断扩展。无需账号，没有开发者自有服务端、广告、分析追踪或后台监控。不读取网页内容、浏览历史、Cookie、密码、Claude 账号或对话，也不修改浏览器或网络设置。

**主动检查时：** 点击检查会直接向 GeoJS 的 `https://get.geojs.io/` 发起一次 HTTPS 请求。对方会收到该请求的来源公网 IP 和标准 HTTP 元数据（可能包含浏览器类型、语言），返回估计的国家/地区、ASN/网络组织和时区。不发送已保存历史或自定义浏览器诊断数据；请求不携带凭证、不携带 referrer、不跟随重定向，不自动重试。单个接口不能代表所有网站的网络路径，IP 位置估计可能不准确。其[隐私政策](https://www.geojs.io/privacy/)说明不保存访问日志，可能保留错误日志，并使用 Cloudflare 基础设施。第三方日志保留时间由其控制，本扩展不承诺第三方删除期限。响应还可能包含估计的城市/坐标等 GeoIP 字段，扩展会丢弃，不显示或保存。

**可选 WebRTC 观察：** 初始关闭。选择后，检查会通过本地 WebRTC data channel 收集 ICE candidate，并连接 Cloudflare 的 `stun.cloudflare.com:3478`。Cloudflare 会收到该路径的来源 IP 和 STUN 协议元数据，可能不同于 HTTPS 路径。STUN 使用 UDP，不是 HTTPS；不携带浏览器观察或历史摘要。不使用摄像头、麦克风、远端 peer 或 TURN 中继。收集完成、6.5 秒超时或取消时关闭连接。见 [Cloudflare 隐私政策](https://www.cloudflare.com/privacypolicy/)。浏览器策略或网络可能阻止可用 candidate。不保留私网地址、mDNS 名称，也不将 candidate 地址上传至 IP 服务。

**本地浏览器数据：** 时区、UTC 偏移、语言/语言列表、Intl locale、粗粒度浏览器品牌/版本与平台均在扩展内读取和处理。不检测 Canvas、字体、WebGL、媒体设备或精确位置。

**本地保存：** `chrome.storage.local` 仅保存界面语言、主题、WebRTC 选择，以及一份上次主动检查摘要：时间、网络观察状态、国家/地区、ASN、组织与时区；上述浏览器字段；WebRTC 完成状态、公开 candidate 数量、IP 协议族和比较状态。不保存原始 IP、candidate 地址、地址哈希、SDP 或原始接口响应。当前原始结果只在 popup 内存中存在，关闭即丢弃。摘要超过 30 天不再使用，在下次打开 popup 时删除；浏览器关闭期间没有后台定时器执行删除。每次完成的检查（包括部分结果）覆盖摘要。不使用 Chrome sync。“清除本地数据”删除摘要和已保存偏好；卸载也会移除扩展存储。清除后，当前界面的语言/主题可能在内存中保持至关闭。

**官方政策信息：** Claude.ai 地区名单随扩展打包，带核验日期，在本地比较；超过 90 天标为过期。诊断不连接 Anthropic。点击外部来源/服务商政策链接属于正常网页导航，适用目标网站的政策。

**用途与共享：** 数据仅用于已披露的诊断与检查比较。不出售，不用于广告或无关用途，不用于信用或贷款资格判断。对 Google API 信息的使用遵守 Chrome Web Store User Data Policy 的 Limited Use 要求。开发者不会自动收到诊断报告。扩展不评估账号风险，不保证服务可访问，与 Anthropic 无关联。

**支持与变更：** 本地数据可自行清除或卸载。第三方日志问题请联系对应服务商。支持与隐私联系方式：[jackmac2077@gmail.com](mailto:jackmac2077@gmail.com)。若你主动发送支持邮件，开发者会收到你提供的邮件地址及内容，仅用于处理该请求；扩展不会自动附带任何诊断数据。邮件由你使用的应用及服务商按其政策处理，本扩展不能读取支持邮箱或管理邮件保留。行为发生实质变化时将更新政策和版本；新增网络目的地须在使用前披露。
