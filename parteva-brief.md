# Parteva — 3D Animasyonlu Tanıtım Sitesi (Claude Code Brief)

## 0) Bağlam

**Parteva**, e-ticaret markalarına hizmet veren bir yaratıcı/dijital ajanstır. Bu site, ajansın **kalitesini ilk 5 saniyede** kanıtlamak ve potansiyel müşterileri iletişime geçirmek için bir tanıtım sitesidir.

- Hedef kitle: e-ticaret marka sahipleri, pazarlama yöneticileri, growth lead'ler
- Dil: **Türkçe**
- Marka kimliği: henüz logo yok — "Parteva" ismi büyük zarif serif ile yazılacak
- Hissi: editoryel, premium, sinematik — Apple × Stripe × lüks moda dergisi
- Deploy hedefi: **Cloudflare Pages** (ücretsiz tier)

---

## 1) Tech Stack (kesin, değiştirme)

- **Astro 4+** — static site generator, default zero JS
- **React Three Fiber + @react-three/drei** — sadece 3D bileşenler için React island
- **GSAP + ScrollTrigger** — scroll-scrub ve reveal animasyonları için
- **Lenis** — smooth scroll (ScrollTrigger ile uyumlu)
- **Tailwind CSS v4**
- **TypeScript**
- Paket yöneticisi: **pnpm**
- Deploy target: Cloudflare Pages (static)

Bunların dışında bir kütüphane gerekirse önce sor.

---

## 2) Dosya Yapısı

```
parteva/
├── astro.config.mjs
├── tailwind.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── pages/
│   │   └── index.astro
│   ├── layouts/
│   │   └── Base.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro              (3D island'ı çağırır)
│   │   ├── Manifesto.astro
│   │   ├── Services.astro
│   │   ├── Process.astro
│   │   ├── Work.astro
│   │   ├── ContactCTA.astro
│   │   ├── Footer.astro
│   │   └── three/
│   │       ├── HeroScene.tsx       (R3F sahne kökü)
│   │       ├── ParcelBox.tsx       (kargo kutusu, açılan kapak)
│   │       ├── OrbitingItems.tsx   (telefon, poşet, etiket, kart)
│   │       └── Lighting.tsx
│   ├── lib/
│   │   ├── scroll.ts               (Lenis init + GSAP ScrollTrigger bridge)
│   │   └── motion.ts               (paylaşılan easing, reveal helpers)
│   ├── styles/
│   │   └── global.css
│   └── content/
│       └── copy.ts                 (TÜM Türkçe metinler tek dosyada)
└── public/
    ├── fonts/
    └── og.jpg
```

**Önemli:** Tüm Türkçe metinler `src/content/copy.ts` içinde olacak — müşteri kolay değiştirebilsin.

---

## 3) Tasarım Sistemi

### Renk paleti (CSS değişkenleri olarak `global.css`)

```
--bg:        #0c0a09;   /* sıcak siyah */
--bg-elev:   #161210;   /* yükseltilmiş yüzey */
--text:      #f5f0e8;   /* sıcak ivory */
--text-dim:  #8a7e6f;   /* soluk metin */
--text-faint:#4a4137;   /* sınır, ipucu */
--accent:    #c9a961;   /* yaşlandırılmış altın — TEK aksent */
```

Aksent rengi **az** kullanılacak — eyebrow, italic vurgu, hover state. Asla büyük yüzey değil.

### Tipografi

- Display: **Cormorant Garamond** (Google Fonts), weight 300 (ince, zarif)
- UI/Body: **DM Sans** (Google Fonts), weight 300/400/500
- Başlıklar: `clamp(2.5rem, 6vw, 5rem)` — nefes payı bol
- Eyebrow'lar: `0.7rem`, `letter-spacing: 0.4em`, uppercase, accent renk
- Display başlıklarda italic kelimeler accent renge boyanacak (örn: "Markanız bir *hikâye*")

### Boşluk

- Section padding: `py-32 md:py-48`
- Max width: `max-w-[1280px]` (içerik), `max-w-7xl` (grid)
- Generous negative space — sıkışık olma

### Görsel doku

- Body üstüne çok hafif (~0.04 opacity) SVG noise overlay (mix-blend: overlay)
- Hiç parlak gradient, neon, glassmorphism YOK
- Mat finish, sıcak gölgeler

---

## 4) Sayfa Yapısı

### A. NAV (sticky, transparent)
Sol: "Parteva" wordmark (Cormorant). Sağ: Vizyon · Hizmetler · İşlerimiz · İletişim. Mobilde hamburger menü.

### B. HERO — 3D Showpiece (en önemli kısım)

**Boyut:** `height: 280vh` outer, içeride sticky `100vh` stage.

**Sahne içeriği:**
- Ortada: **stilize, low-poly mat finish kargo kutusu** (kapağı kapalı), hafif yukarı tilt
- Kutunun arkasında/üstünde: "Parteva" wordmark (HTML, R3F'in üzerinde, ortalı)
- Aydınlatma: warm key light (üst-sağ, ~3000K), soft fill (alt-sol), ortam çok düşük

**Scroll progress 0 → 1 koreografisi:**

| Progress | Olay |
|---|---|
| 0.00 – 0.20 | Kamera hafif dolly-in. Kutu yavaşça kendi etrafında 15° döner. "Parteva" + altta küçük caps "Yaratıcı E-Ticaret Ajansı" görünür. |
| 0.20 – 0.45 | Kutunun **kapağı açılır** (Y ekseninde 110° rotation, ease.outBack). İçinden ışık taşar (glow billboard). |
| 0.45 – 0.70 | İçinden 6-8 stilize 3D nesne **patlama** şeklinde dışarı çıkar: alışveriş poşeti, telefon, kredi kartı, etiket, küçük ürün kutusu, koli bandı makarası. Her biri farklı easing, farklı süre, farklı varış noktasıyla yörüngeye yerleşir (orbital). |
| 0.70 – 1.00 | Kamera yavaş geri çekilir. Nesneler bir **konstelasyon** halinde Parteva yazısının etrafında yavaş yavaş döner. "Parteva" altında tagline değişir: *"E-ticarette markaları büyütüyoruz."* |

**3D stil yönergeleri:**
- Düşük poligon (low-poly), keskin köşeler
- MeshStandardMaterial, roughness 0.7-0.9 (mat), metalness 0
- Renk paleti: dimmed warm tones (kahve, krem, yaşlandırılmış altın, koyu bordo)
- Gerçekçi texture/PBR YOK — flat color + lighting'in oluşturduğu gradient
- Her nesne ~500-2000 tris, toplam sahne <30k tris

**Modeller:** Eğer mevcut hazır modeller bulamazsan, **R3F primitives ile prosedürel inşa et**:
- Kargo kutusu: 6 yüzlü BoxGeometry + edge highlight
- Poşet: extruded shape + curve
- Telefon: rounded box + ekran plane
- Kart: thin box + chamfer
- Etiket: thin plane + string (tube geometry)
- Bant makarası: TorusGeometry + CylinderGeometry

Hazır model kullanmak istersen (tercih edilirse): Sketchfab CC0 modelleri ara, `public/models/` altına `.glb` olarak koy, useGLTF ile yükle.

**Performans:**
- `<Canvas dpr={[1, 2]}>` clamp
- `<PerformanceMonitor>` ile dpr düşürme fallback
- Mobilde nesne sayısı yarıya, post-processing yok
- `prefers-reduced-motion: reduce` → animasyonu statik son frame'de tut, scroll-scrub'ı kapat
- `<Suspense>` ile asset yükleme, fallback minimal

### C. MANIFESTO
Tek bölüm, tek büyük italic cümle. Center aligned. Yavaş fade-up.
> *"E-ticaret artık mağaza değil, deneyim. Biz o deneyimi tasarlıyoruz."*

### D. SERVICES (4 hizmet)
2x2 grid (mobilde 1 sütun). Her kart: numara (i, ii, iii, iv) + başlık + 2 satır açıklama. Hover'da arkaplan `--bg-elev`'a geçiş, hafif scale(1.01).

1. **Marka & Ambalaj** — Logo, kimlik, e-ticarete özel ürün ambalajı
2. **Mağaza Tasarımı & Geliştirme** — Shopify özelleştirme, custom Next.js storefront, performans optimizasyonu
3. **Performans Pazarlama** — Meta, Google, TikTok reklamları, analytics, attribution
4. **İçerik & Ürün Prodüksiyon** — Ürün fotoğrafı, video, sosyal medya içeriği

### E. SÜREÇ (Process)
Numaralı timeline (yatay scroll veya dikey). 5 adım:
01 Strateji → 02 Tasarım → 03 Geliştirme → 04 Lansman → 05 Büyütme

Her adım: numara (büyük, italic serif), başlık, 1 cümle açıklama. Aktif adımda hafif altın çizgi.

### F. İŞLERİMİZ (Work)
3 sütun grid, 6 placeholder proje. Her kart:
- Görsel placeholder (`bg-bg-elev` + ortada 3D mini ikon veya placeholder image)
- Marka adı (serif, büyük)
- Sektör + tek metric (örn: "Moda · Dönüşüm %180 ↑")

Hover'da görsel hafif scale, başlık altın renge geçer.

### G. İLETİŞİM CTA
Büyük serif başlık + 3 eylem:
- E-mail: `hello@parteva.com` (büyük, alt çizgi)
- Form: ad, e-mail, şirket, mesaj — Formspree veya benzeri
- Sosyal: Instagram, LinkedIn link'leri

### H. FOOTER
Sade. Wordmark, kısa motto, copyright, sosyal iconlar (Lucide).

---

## 5) Animasyon Sistemi

### Genel kurallar
- **Easing:** Default `power3.out` (GSAP). Heroda `expo.inOut`. Hover'da `power2.out`.
- **Reveal:** Tüm section'larda IntersectionObserver tabanlı GSAP reveal — text fade-up (y: 30 → 0, opacity 0 → 1, stagger 0.05s, duration 0.8s).
- **Page load:** İlk 1 saniye koreografik açılış: nav fade → hero text fade → 3D sahne suspense bittiğinde reveal.
- **Cursor:** Custom cursor — küçük dolu nokta + büyük outline daire. Hover'da outline 2x büyür ve text-color'a boyanır. Mobilde kapalı.

### Smooth scroll
Lenis kullan. ScrollTrigger ile bridge için resmi snippet'i kullan:
```js
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
```

### Performans
- Tüm scroll listener'lar `requestAnimationFrame` içinde
- 3D Canvas hero görünürken aktif, scroll'da görünmediğinde `frameloop="demand"` veya pause
- Mobilde tüm 3D'yi düşür (DPR=1, gölge yok, post-processing yok)

---

## 6) İçerik (`src/content/copy.ts`)

```typescript
export const copy = {
  brand: 'Parteva',
  brandTagline: 'Yaratıcı E-Ticaret Ajansı',
  heroOpenLine: 'Parteva',
  heroClosingLine: 'E-ticarette markaları büyütüyoruz.',
  
  manifesto: 'E-ticaret artık mağaza değil, deneyim. Biz o deneyimi tasarlıyoruz.',
  
  services: [
    { num: 'i',   title: 'Marka & Ambalaj',           body: '...' },
    { num: 'ii',  title: 'Mağaza Tasarımı',           body: '...' },
    { num: 'iii', title: 'Performans Pazarlama',      body: '...' },
    { num: 'iv',  title: 'İçerik & Prodüksiyon',      body: '...' },
  ],
  
  process: [
    { num: '01', title: 'Strateji',     body: '...' },
    // ...
  ],
  
  work: [
    { brand: 'Marka A', sector: 'Moda', metric: 'Dönüşüm %180 ↑' },
    // ... 6 adet placeholder
  ],
  
  contact: {
    email: 'hello@parteva.com',
    location: 'İstanbul · Türkiye',
    instagram: 'https://instagram.com/parteva',
    linkedin: 'https://linkedin.com/company/parteva',
  },
};
```

Tüm metinleri *plausible Türkçe* doldur — ajansın gerçekten yazabileceği gibi, klişe değil.

---

## 7) Performans Hedefleri

- Lighthouse Performance ≥ 90 (mobil)
- LCP < 2.5s
- CLS < 0.05
- 3D bundle hero görünene kadar lazy load
- Tüm görseller WebP, `loading="lazy"` (hero hariç), explicit width/height
- Astro static export — `dist/` build edilebilir

---

## 8) SEO & Erişilebilirlik

- Türkçe `<html lang="tr">`
- Meta description, Open Graph, Twitter card
- JSON-LD: Organization schema (name, url, logo, sameAs)
- Favicon set (16, 32, apple-touch)
- Tüm interaktif elementler keyboard erişilebilir
- Tüm 3D'nin `prefers-reduced-motion` fallback'i var
- Tüm imajların alt text'i (anlamlı)

---

## 9) Yapma Listesi (kesin yasaklar)

- ❌ **Mor gradient** arkaplan veya UI element
- ❌ **Inter font** (DM Sans kullan, Inter Tight olur)
- ❌ **shadcn/ui** veya benzeri prefab UI library — tüm component'ler özel
- ❌ **Glassmorphism** (frosted glass)
- ❌ **Emoji** UI'da
- ❌ **Stock photo** hissi veren generic görseller — ya soyut, ya 3D, ya boş bırak
- ❌ **Aşırı micro-interaction** — odak hero'da kalsın, başka yerlerde sade
- ❌ **Auto-playing video** veya ses
- ❌ **Cookie banner** (gerekirse en sade haliyle, sadece zorunluysa)

---

## 10) Implementasyon Sırası (önerilen)

Bu sırayı takip et — her adımda çalışan bir şey üret, sonraya bırakma:

1. **Setup:** Astro + Tailwind + TS init, dosya yapısını kur, fontları yükle
2. **Tasarım sistemi:** `global.css`'e CSS değişkenleri, base typography, noise overlay
3. **Static iskelet:** Tüm bölümleri *3D olmadan* statik HTML olarak inşa et — layout, içerik, tipografi otursun
4. **Smooth scroll + reveal:** Lenis + GSAP ScrollTrigger, basit fade-up reveal'ları her bölüme bağla
5. **3D hero — sade hali:** R3F Canvas, kutu + 4-5 nesne statik konumda, lighting kur
6. **3D hero — animasyon:** Scroll progress'i `useFrame`'e bağla, koreografiyi kademeli inşa et (önce kapak açılması, sonra patlama, sonra orbital)
7. **Performans pass:** Lighthouse, mobil test, throttle test, prefers-reduced-motion
8. **Deploy:** Cloudflare Pages bağlantısı, build script, README'de talimatlar

Her adımdan sonra dev server'da çalıştığını test et. Bir bölüm bozarsa devam etme — onar, sonra ilerle.

---

## 11) README.md (sen oluştur)

İçinde olsun:
- Proje açıklaması
- `pnpm install`, `pnpm dev`, `pnpm build` komutları
- Cloudflare Pages deploy adımları (build command: `pnpm build`, output dir: `dist`)
- `src/content/copy.ts`'i nasıl düzenleyeceğine dair not
- Hangi modellerin nereden geldiği (atıf gerekiyorsa)

---

## 12) Çıktı

Bittiğinde elimde:
- Tam çalışan dev server
- `pnpm build` ile temiz `dist/` klasörü
- Lighthouse mobil ≥ 90
- README ile dokümante edilmiş kurulum
- Tek dosyada (`copy.ts`) düzenlenebilir tüm metinler

Soruların varsa **şimdi** sor; varsayım yapma. Tasarım kararlarını net ver, "tarafsız" olma. Eğer bir kütüphane bu brief'te yoksa eklemeden önce gerekçesiyle sor.
