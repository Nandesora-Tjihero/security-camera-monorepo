# Copilot instructions for this repo

Use these focused notes to be immediately productive in this NativeScript + Vue 3 mobile app.

## Stack and layout

- Cross-platform mobile app built with NativeScript 8.9, Vue 3 (nativescript-vue 3.0.1), TypeScript 5.x, Tailwind CSS 4.
- Entry point: `src/app.ts` → `createApp(index).start()` mounting `src/components/index.vue`.
- Native resources live in `App_Resources/` with per-platform configs:
  - Android: `App_Resources/Android/src/main/AndroidManifest.xml` (permissions, activity), package id from `nativescript.config.ts` (`org.nativescript.securitycameramobile`).
  - iOS: `App_Resources/iOS/Info.plist` and LaunchScreen assets.
- Webpack is managed by `@nativescript/webpack` default config. TS path aliases: `~/*` and `@/*` → `src/*` (see `tsconfig.json`).

## Run, build, and debug

- Use NativeScript CLI workflows (ns). Typical flows:
  - iOS dev: `ns run ios` (uses `ios` platform; requires Xcode).
  - Android dev: `ns run android` (requires Android SDK + emulator or device).
  - Build release: `ns build ios --release` or `ns build android --release`.
- Main env toggles are via CLI flags and webpack env. Webpack config is default; customize in `webpack.config.js` if needed.
- Hooks: `hooks/before-checkForChanges/nativescript-core.js` integrates NativeScript core CLI hook.

## Styling and theming

- Global styles: `src/app.css` imports Tailwind 4 (`@import 'tailwindcss';`).
- Dark mode variant defined as: `@custom-variant dark (&.ns-dark, .ns-dark &);`
  - Components use `dark:` prefixed classes (see `index.vue` `ActionBar` and `GridLayout`).
- Prefer Tailwind utility classes on NativeScript UI components (e.g., `<Label class="font-bold text-lg dark:text-white" />`).

## Vue component patterns

- Vue SFCs under `src/components/`. Example screen: `index.vue` wraps the app structure:
  - Root navigation structure via `<Frame>` → `<Page>` → `<ActionBar>` + layout containers.
  - Use NativeScript layouts (`GridLayout`, `StackLayout`, etc.) and components (`Label`, `Button`, etc.).
- Script setup uses TypeScript: `<script lang="ts" setup></script>`.
- Type support: `types/shims.vue.d.ts` declares Vue SFCs for `nativescript-vue`; `types/references.d.ts` pulls `@nativescript/types`.

## Platform configuration

- `nativescript.config.ts` sets:
  - `id`: bundle id; update here for app id changes.
  - `appPath: 'src'`, `appResourcesPath: 'App_Resources'`.
  - Android runtime options: `v8Flags: '--expose_gc'`, `markingMode: 'none'`.
- AndroidManifest includes internet and storage permissions; adjust when adding camera/microphone or background services.

## Imports and aliases

- Use TS path aliases for clean imports:
  - `import X from '@/foo/bar'` maps to `src/foo/bar`.
  - `~` is also aliased to `src` for legacy compatibility.

## Adding screens and navigation

- Keep a single `<Frame>` at the root. For multi-screen apps, use NativeScript-Vue navigation APIs:
  - `this.$navigateTo(Comp)` or within setup, use `getFrameById`/`navigate` from `@nativescript/core`.
  - Structure pages in `src/components/` and export default SFCs.

## Common gotchas in this repo

- Do not import web-only Vue/DOM libraries; use NativeScript UI components and `@nativescript/core` APIs.
- Tailwind 4 in NativeScript: only class names present at build-time are bundled; avoid dynamic class name concatenation.
- Keep Android and iOS assets in `App_Resources` folders; webpack doesn’t serve web assets.
- When adding native permissions or features (camera, mic), update both AndroidManifest and iOS Info.plist keys and request runtime permissions via `@nativescript/core`.

## Examples

- Minimal component pattern:
  ```vue
  <script lang="ts" setup>
    import { ref } from 'nativescript-vue';
    const count = ref(0);
  </script>
  <template>
    <GridLayout
      rows="auto,*"
      class="p-4"
    >
      <Label
        :text="`Count: ${count}`"
        class="text-xl"
      />
      <Button
        text="Increment"
        @tap="count++"
      />
    </GridLayout>
  </template>
  ```

## Where to change what

- App bootstrap: `src/app.ts`.
- Global styles/theme: `src/app.css`.
- Screens/components: `src/components/*`.
- Native platform settings/assets: `App_Resources/**`.
- Build config: `webpack.config.js` (rarely needed), `tsconfig.json` for aliases/strictness.

If you need additional workflows (tests, CI, linting) or app-specific modules (camera stream, storage), ask for details—none are configured in this repo yet.
