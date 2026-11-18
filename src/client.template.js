// MERA theme client module — paints the "Diagram Mermaid" persona over the
// built-in light/dark palettes by stacking one alias-token override layer via
// ctx.theme.overrideTokens, and paints the wallpapers into the app backdrop.
// The user's Appearance preference (light / dark / system) stays untouched,
// so OS scheme flips keep working; disabling the plugin (or removing the
// layer) restores the built-in colors and the plain backdrop instantly.
//
// Persona: MERA / 玫拉 — the Mermaid.js gijinka. Raspberry rose #FF3670,
// pearl white, ink navy #111827. Calm, precise, friendly engineer.
//
// Wallpapers: light =「白天晴朗」sunny day, dark =「雨夜 NIGHTCODE」rainy night.
// They are embedded as base64 WebP data URLs by scripts/build.mjs; the
// placeholders below are replaced at build time. Do not hand-edit client.js.
window.__ModuleLoader__.load({
  id: 'dsh-mera-theme',
  factory() {
    // Injected by scripts/build.mjs as data URLs.
    const WALLPAPER = {
      light: '__MERA_WALLPAPER_LIGHT__',
      dark: '__MERA_WALLPAPER_DARK__',
    };

    // Every entry must carry both palette modes (overrideTokens contract):
    // light =「珍珠白 · 工作台」, dark =「墨蓝 · 夜间编译」. Surface tokens are
    // translucent so the wallpaper reads through the panels while text stays
    // on a calm, low-noise ground.
    const MERA_TOKENS = {
      // Surfaces (translucent over the wallpaper; base is a near-transparent
      // veil so the artwork is the canvas). Raised/panel surfaces that carry
      // text (cards, diffs, dialogs, inputs) stay near-opaque for readability;
      // the conversation canvas paints bg-base, so the wallpaper still reads.
      '--dsw-alias-bg-base': { light: 'rgba(253, 250, 251, 0.10)', dark: 'rgba(16, 20, 31, 0.15)' },
      '--dsw-alias-bg-layer-1': { light: 'rgba(255, 255, 255, 0.92)', dark: 'rgba(22, 28, 44, 0.93)' },
      '--dsw-alias-bg-layer-2': { light: 'rgba(255, 255, 255, 0.93)', dark: 'rgba(27, 34, 52, 0.94)' },
      '--dsw-alias-bg-overlay': { light: 'rgba(248, 238, 241, 0.88)', dark: 'rgba(39, 48, 72, 0.88)' },
      '--dsw-alias-bg-module-platform': { light: 'rgba(249, 243, 245, 0.80)', dark: 'rgba(26, 33, 51, 0.82)' },
      '--dsw-alias-bg-multi-select': { light: 'rgba(249, 243, 245, 0.80)', dark: 'rgba(28, 36, 54, 0.82)' },
      '--dsw-specific-selector': { light: 'rgba(248, 241, 243, 0.80)', dark: 'rgba(29, 37, 56, 0.82)' },
      '--dsw-specific-tip': { light: 'rgba(248, 241, 243, 0.80)', dark: 'rgba(29, 37, 56, 0.82)' },
      '--dsw-specific-input-major': { light: 'rgba(255, 255, 255, 0.82)', dark: 'rgba(23, 30, 47, 0.84)' },
      '--dsw-specific-login-input': { light: 'rgba(255, 255, 255, 0.82)', dark: 'rgba(19, 26, 41, 0.84)' },
      '--dsw-alias-card-fill': { light: 'rgba(251, 246, 247, 0.50)', dark: 'rgba(24, 31, 48, 0.55)' },
      '--dsw-alias-card-fill-hover': { light: 'rgba(247, 238, 241, 0.62)', dark: 'rgba(30, 38, 57, 0.66)' },
      '--dsw-alias-card-tile-fill': { light: 'color-mix(in srgb, #FFFFFF 55%, transparent)', dark: 'color-mix(in srgb, #FFFFFF 6%, transparent)' },
      // Brand: raspberry rose
      '--dsw-alias-brand-primary': { light: '#FF3670', dark: '#FF3670' },
      '--dsw-alias-brand-text': { light: '#DB2763', dark: '#F5F7FB' },
      '--dsw-alias-brand-primary-invert': { light: '#FFFFFF', dark: '#FFFFFF' },
      '--dsw-alias-brand-primary-new-colorprimary-new-color': { light: '#FF3670', dark: '#FF5C8A' },
      '--dsw-alias-button-primary-hover': { light: '#E02B62', dark: '#FF5C8A' },
      '--dsw-alias-button-primary-dimmed': { light: '#FFE4EE', dark: 'rgba(255, 54, 112, 0.18)' },
      '--dsw-alias-button-info-fill': { light: '#FF3670', dark: '#FF4780' },
      '--dsw-alias-button-info-hover': { light: '#FF5C8A', dark: '#FF3670' },
      '--dsw-alias-state-business-primary': { light: '#DB2763', dark: '#FF5C8A' },
      '--dsw-alias-state-business-tertiary': { light: '#FFEBF2', dark: 'rgba(255, 54, 112, 0.16)' },
      '--dsw-alias-link': { light: '#DB2763', dark: '#FF7AA0' },
      '--dsw-alias-label-deep-diving': { light: 'color-mix(in srgb, #FF3670 70%, #4A0D22)', dark: 'color-mix(in srgb, #FF7AA0 55%, #9AA6BC)' },
      '--dsw-alias-label-deep-diving-shimmer': { light: 'color-mix(in srgb, #FF3670 30%, #4A0D22)', dark: 'color-mix(in srgb, #FF7AA0 65%, #FFC2D6)' },
      // Ink: light uses navy, dark uses pearl white
      '--dsw-alias-label-primary': { light: '#111827', dark: '#F2F5FB' },
      '--dsw-alias-label-secondary': { light: '#4A5468', dark: '#AEB8CB' },
      // Tertiary carries the small step labels ("分析" etc.) directly on the
      // translucent chat canvas: light mode needs a darker gray to stay legible
      // over the bright wallpaper.
      '--dsw-alias-label-tertiary': { light: '#4B5563', dark: '#8792A6' },
      '--dsw-alias-label-caption': { light: '#6B7280', dark: '#8792A6' },
      '--dsw-alias-label-primary-bluish': { light: '#16233F', dark: '#DCE6FA' },
      '--dsw-alias-menu-icon': { light: '#3A4358', dark: '#C3CCDC' },
      // Borders and interaction
      '--dsw-alias-border-l1': { light: 'rgba(17, 24, 39, 0.05)', dark: 'rgba(255, 255, 255, 0.07)' },
      '--dsw-alias-border-l2': { light: 'rgba(17, 24, 39, 0.10)', dark: 'rgba(255, 255, 255, 0.13)' },
      '--dsw-alias-border-selected': { light: '#FF7AA0', dark: '#FF7AA0' },
      '--dsw-alias-interactive-bg-active': { light: 'rgba(255, 54, 112, 0.12)', dark: 'rgba(255, 92, 138, 0.18)' },
      '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(255, 54, 112, 0.14)', dark: 'rgba(255, 92, 138, 0.22)' },
      // Sidebar (a light glass column over the wallpaper)
      '--dsw-specific-sidebar-fill': { light: 'rgba(249, 242, 244, 0.35)', dark: 'rgba(12, 16, 26, 0.42)' },
      '--dsw-specific-sidebar-nav-item-active': { light: 'rgba(243, 230, 235, 0.70)', dark: 'rgba(33, 42, 64, 0.75)' },
      '--dsw-specific-sidebar-nav-item-active-accent': { light: '#FFE0EB', dark: 'rgba(255, 54, 112, 0.22)' },
      '--dsw-specific-sidebar-right-flash': { light: '#FF3670', dark: '#FF5C8A' },
      // Conversation and code (solid where text lives)
      '--dsw-specific-bubble': { light: 'rgba(255, 236, 242, 0.88)', dark: 'rgba(51, 32, 47, 0.88)' },
      '--dsw-specific-bubble-highlight': { light: 'rgba(255, 215, 228, 0.92)', dark: 'rgba(67, 42, 60, 0.92)' },
      '--dsw-alias-markdown-code-block': { light: '#F8F3F5', dark: '#131A2A' },
      '--dsw-alias-markdown-code-block-banner': { light: '#FBF7F8', dark: '#161D2E' },
      '--dsw-alias-markdown-inline-code': { light: '#FAF5F7', dark: '#1C2436' },
      '--dsw-alias-markdown-citation': { light: '#F5EDEF', dark: '#1A2234' },
      '--dsw-alias-markdown-tag': { light: '#F7EDF1', dark: '#1A2234' },
      '--dsw-alias-markdown-placeholder': { light: '#F6EFF2', dark: '#181F30' },
      '--dsw-alias-turn-trigger-bg': { light: 'rgba(248, 243, 245, 0.55)', dark: 'rgba(22, 29, 46, 0.60)' },
      '--dsw-alias-trajectory-accent': { light: '#FF3670', dark: '#FF5C8A' },
      // Charts (diagram persona)
      '--dsw-alias-chart-messages': { light: '#FF5C8A', dark: '#FF5C8A' },
      '--dsw-alias-chart-tools': { light: '#F472B6', dark: '#E58BB8' },
      // Menus, toasts, tooltips
      '--dsw-menu-surface-fill': { light: 'rgba(253, 249, 250, 0.72)', dark: 'rgba(22, 28, 44, 0.68)' },
      '--dsw-alias-menu-group-header-fill': { light: 'rgba(249, 242, 244, 0.94)', dark: 'rgba(18, 24, 38, 0.94)' },
      '--dsw-specific-menu': { light: 'var(--dsw-menu-surface-fill)', dark: 'var(--dsw-menu-surface-fill)' },
      '--dsw-alias-tooltip-bg': { light: '#1C2740', dark: '#232D45' },
      '--dsw-alias-toast-bg': { light: '#1C2740', dark: '#232D45' },
      '--dsw-alias-toast-action': { light: '#FF7AA0', dark: '#FF7AA0' },
      '--dsw-alias-hovercard-bg': { light: '#1C2740', dark: '#232D45' },
      // Scrollbar
      '--dsw-alias-scrollbar-bg-l1': { light: '#EBE0E4', dark: '#39445E' },
      '--dsw-alias-scrollbar-hover-l1': { light: '#DCCCD3', dark: '#4A566F' },
      // Decorative illustration layers
      '--dsw-alias-illustration-background': { light: '#FBF3F5', dark: '#1B1620' },
      '--dsw-alias-illustration-surface': { light: '#F6E7EC', dark: '#332535' },
      '--dsw-alias-illustration-backing': { light: '#E9CFD8', dark: '#45304A' },
      '--dsw-alias-illustration-detail': { light: '#E9CFD8', dark: '#5A3F62' },
    };

    return {
      inject: ['theme'],
      apply(ctx) {
        if (typeof ctx.theme.overrideTokens !== 'function') {
          console.warn('[dsh-mera-theme] ctx.theme.overrideTokens is unavailable in this DSH build; theme not applied');
          return;
        }
        // One layer, source-keyed by this package: composing folds the MERA
        // values into the active snapshot per color scheme; the disposer
        // (run on plugin disable) restores the built-in palette.
        ctx.effect(() => ctx.theme.overrideTokens('dsh-mera-theme', MERA_TOKENS), 'mera-theme: token layer');

        // The OS-scheme sync below switches to these ids; setTheme refuses an
        // unregistered id, so they exist even though all their color work rides
        // the token layer above.
        const meraLight = { id: 'mera-light', colorScheme: 'light', tokens: {} };
        const meraDark = { id: 'mera-dark', colorScheme: 'dark', tokens: {} };
        const disposeLight = ctx.theme.register(meraLight);
        const disposeDark = ctx.theme.register(meraDark);
        ctx.effect(() => () => {
          disposeLight();
          disposeDark();
        }, 'mera-theme: registered themes');

        // Wallpaper backdrop: light「白天晴朗」for the light palette, rainy
        // night「雨夜 NIGHTCODE」for the dark palette (body[data-ds-dark-theme]).
        // Two paint paths on purpose: a body background-image (plain, no
        // attachment) plus a page-level fixed layer. A body image with
        // `background-attachment: fixed` is unreliable inside transparent
        // macOS vibrancy windows, where Chromium may skip painting it.
        ctx.effect(() => {
          if (typeof document === 'undefined') return undefined;
          const style = document.createElement('style');
          style.dataset.meraWallpaper = '';
          style.textContent = [
            'html, body {',
            `  --mera-wallpaper: url("${WALLPAPER.light}");`,
            `  background-image: url("${WALLPAPER.light}");`,
            '  background-size: cover;',
            '  background-position: center;',
            '  background-repeat: no-repeat;',
            '}',
            'body[data-ds-dark-theme] {',
            `  --mera-wallpaper: url("${WALLPAPER.dark}");`,
            `  background-image: url("${WALLPAPER.dark}");`,
            '}',
            // The settings dialog keeps a near-opaque surface: its text rows sit
            // directly on the panel, so wallpaper showing through would hurt
            // readability. It portals to body with this marker attribute.
            'body [data-shortcut-modal="settings"] {',
            '  background: rgba(255, 255, 255, 0.97);',
            '}',
            'body[data-ds-dark-theme] [data-shortcut-modal="settings"] {',
            '  background: rgba(27, 34, 52, 0.97);',
            '}',
            // The composer capsule floats over the message scroller: content
            // scrolling behind it must not read through the input, so the
            // card frosts its backdrop (with a more opaque fill token too).
            'body [data-composer-card] {',
            '  -webkit-backdrop-filter: blur(18px) saturate(1.15);',
            '  backdrop-filter: blur(18px) saturate(1.15);',
            '}',
          ].join('\n');
          document.head.appendChild(style);

          const layer = document.createElement('div');
          layer.setAttribute('aria-hidden', 'true');
          layer.dataset.meraWallpaper = '';
          layer.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;'
            + 'background-image:var(--mera-wallpaper);background-size:cover;'
            + 'background-position:center;background-repeat:no-repeat;';
          document.body.appendChild(layer);

          return () => {
            layer.remove();
            style.remove();
          };
        }, 'mera-theme: wallpaper layer');

        // Windows only: follow the OS app mode (PowerToys' light switch, or a
        // manual Windows theme change) even when the Electron shell's
        // prefers-color-scheme is stale. The Host exposes the registry value at
        // /mera/os-scheme and injects __MERA_HOST__ on Windows only; macOS and
        // every other platform never see that origin, so their native
        // light/dark switching is untouched.
        ctx.effect(() => {
          if (typeof window === 'undefined' || typeof fetch !== 'function') return undefined;
          if (!/Windows/i.test(navigator.userAgent)) return undefined;
          const hostOrigin = typeof window.__MERA_HOST__ === 'string' && window.__MERA_HOST__ !== ''
            ? window.__MERA_HOST__
            : (typeof location !== 'undefined' && location.protocol.startsWith('http') ? location.origin : undefined);
          if (hostOrigin === undefined) return undefined;

          // 'system' = follow the OS; 'light'/'dark' = the user picked one, so
          // the watcher stands down until they pick "follow system" again.
          let intent = 'system';
          let stopped = false;

          const applyScheme = (scheme) => {
            const current = ctx.theme.getTheme();
            const id = current.active.id;
            // Leave a foreign theme (e.g. catppuccin) alone; it owns the palette.
            if (id !== 'light' && id !== 'dark' && id.lastIndexOf('mera-', 0) !== 0) return;
            if (current.active.colorScheme === scheme) return;
            // Third-party ids stay in memory, so the durable preference (system
            // included) is never rewritten by this sync.
            ctx.theme.setTheme('mera-' + scheme);
          };

          const poll = async () => {
            if (stopped || intent !== 'system') return;
            try {
              const response = await fetch(hostOrigin + '/mera/os-scheme', { cache: 'no-store', credentials: 'omit' });
              if (!response.ok) return;
              const body = await response.json();
              if (body.scheme === 'light' || body.scheme === 'dark') applyScheme(body.scheme);
            } catch { /* host unreachable in this window; retry on the next tick */ }
          };

          const onThemeChange = (snapshot) => {
            const preference = snapshot.preference;
            if (preference !== 'light' && preference !== 'dark' && preference !== 'system') return;
            intent = preference;
            if (preference === 'system') void poll();
          };
          ctx.on('theme/change', onThemeChange);

          const current = ctx.theme.getTheme();
          if (current.preference === 'light' || current.preference === 'dark') intent = current.preference;

          void poll();
          const timer = window.setInterval(() => { void poll(); }, 6000);
          const onVisible = () => { if (document.visibilityState === 'visible') void poll(); };
          document.addEventListener('visibilitychange', onVisible);
          return () => {
            stopped = true;
            window.clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisible);
          };
        }, 'mera-theme: os-scheme sync');
      },
    };
  },
});
