// MERA theme client module — paints the "Diagram Mermaid" persona over the
// built-in light/dark palettes by stacking one alias-token override layer via
// ctx.theme.overrideTokens. The user's Appearance preference (light / dark /
// system) stays untouched, so OS scheme flips keep working; disabling the
// plugin (or removing the layer) restores the built-in colors instantly.
//
// Persona: MERA / 玫拉 — the Mermaid.js gijinka. Raspberry rose #FF3670,
// pearl white, ink navy #111827. Calm, precise, friendly engineer.
window.__ModuleLoader__.load({
  id: 'dsh-mera-theme',
  factory() {
    // Every entry must carry both palette modes (overrideTokens contract):
    // light =「珍珠白 · 工作台」, dark =「墨蓝 · 夜间编译」.
    const MERA_TOKENS = {
      // Surfaces
      '--dsw-alias-bg-base': { light: '#FDFAFB', dark: '#10141F' },
      '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#161C2C' },
      '--dsw-alias-bg-layer-2': { light: '#FFFFFF', dark: '#1B2234' },
      '--dsw-alias-bg-overlay': { light: '#F8EEF1', dark: '#273048' },
      '--dsw-alias-bg-module-platform': { light: '#F9F3F5', dark: '#1A2133' },
      '--dsw-alias-bg-multi-select': { light: '#F9F3F5', dark: '#1C2436' },
      '--dsw-specific-selector': { light: '#F8F1F3', dark: '#1D2538' },
      '--dsw-specific-tip': { light: '#F8F1F3', dark: '#1D2538' },
      '--dsw-specific-input-major': { light: '#FFFFFF', dark: '#171E2F' },
      '--dsw-specific-login-input': { light: '#FFFFFF', dark: '#131A29' },
      '--dsw-alias-card-fill': { light: '#FBF6F7', dark: '#181F30' },
      '--dsw-alias-card-fill-hover': { light: '#F7EEF1', dark: '#1E2639' },
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
      '--dsw-alias-label-secondary': { light: '#566074', dark: '#AEB8CB' },
      '--dsw-alias-label-tertiary': { light: '#6B7280', dark: '#8792A6' },
      '--dsw-alias-label-primary-bluish': { light: '#16233F', dark: '#DCE6FA' },
      '--dsw-alias-menu-icon': { light: '#3A4358', dark: '#C3CCDC' },
      // Borders and interaction
      '--dsw-alias-border-l1': { light: 'rgba(17, 24, 39, 0.05)', dark: 'rgba(255, 255, 255, 0.07)' },
      '--dsw-alias-border-l2': { light: 'rgba(17, 24, 39, 0.10)', dark: 'rgba(255, 255, 255, 0.13)' },
      '--dsw-alias-border-selected': { light: '#FF7AA0', dark: '#FF7AA0' },
      '--dsw-alias-interactive-bg-active': { light: 'rgba(255, 54, 112, 0.12)', dark: 'rgba(255, 92, 138, 0.18)' },
      '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(255, 54, 112, 0.14)', dark: 'rgba(255, 92, 138, 0.22)' },
      // Sidebar
      '--dsw-specific-sidebar-fill': { light: '#F9F2F4', dark: '#0C101A' },
      '--dsw-specific-sidebar-nav-item-active': { light: '#F3E6EB', dark: '#212A40' },
      '--dsw-specific-sidebar-nav-item-active-accent': { light: '#FFE0EB', dark: 'rgba(255, 54, 112, 0.22)' },
      '--dsw-specific-sidebar-right-flash': { light: '#FF3670', dark: '#FF5C8A' },
      // Conversation and code
      '--dsw-specific-bubble': { light: '#FFECF2', dark: '#33202F' },
      '--dsw-specific-bubble-highlight': { light: '#FFD7E4', dark: '#432A3C' },
      '--dsw-alias-markdown-code-block': { light: '#F8F3F5', dark: '#131A2A' },
      '--dsw-alias-markdown-code-block-banner': { light: '#FBF7F8', dark: '#161D2E' },
      '--dsw-alias-markdown-inline-code': { light: '#FAF5F7', dark: '#1C2436' },
      '--dsw-alias-markdown-citation': { light: '#F5EDEF', dark: '#1A2234' },
      '--dsw-alias-markdown-tag': { light: '#F7EDF1', dark: '#1A2234' },
      '--dsw-alias-markdown-placeholder': { light: '#F6EFF2', dark: '#181F30' },
      '--dsw-alias-turn-trigger-bg': { light: '#F8F3F5', dark: '#161D2E' },
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
      },
    };
  },
});
