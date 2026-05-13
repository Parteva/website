# Parteva

Yaratıcı e-ticaret ajansı tanıtım sitesi. 3D animasyonlu, scroll-driven, premium editöryal tasarım.

## Tech Stack

- **Astro 4** — static site generator
- **React Three Fiber + @react-three/drei** — 3D hero sahnesi
- **GSAP + ScrollTrigger** — scroll animasyonları
- **Lenis** — smooth scroll
- **Tailwind CSS v4**
- **TypeScript**

## Kurulum

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # dist/ klasörüne statik çıktı
pnpm preview    # dist/ önizleme
```

## İçerik Düzenleme

Tüm Türkçe metinler tek dosyada:

```
src/content/copy.ts
```

Bu dosyayı açın; hizmetler, süreç adımları, çalışmalar ve iletişim bilgilerini doğrudan düzenleyin.

## Cloudflare Pages Deploy

1. GitHub'a push edin
2. Cloudflare Pages → "Create a project" → repository seçin
3. Build settings:
   - **Build command:** `pnpm build`
   - **Output directory:** `dist`
   - **Node.js version:** `18`
4. Deploy edin

## 3D Modeller

Tüm 3D nesneler (`ParcelBox`, `OrbitingItems`) React Three Fiber primitifleriyle prosedürel olarak inşa edilmiştir. Dış model dosyası (`.glb`) kullanılmamıştır — atıf gerekmez.

## Özelleştirme Notları

- Renk paleti: `src/styles/global.css` → `:root` değişkenleri
- Font değişikliği: `global.css` Google Fonts import + `tailwind.config.ts` fontFamily
- İletişim formu: `ContactCTA.astro` içindeki Formspree action URL'ini güncelleyin
