# React Router v6 to v7 Migration Guide

This guide walks you through upgrading from React Router v6 to v7 in your project. Follow the steps in order to ensure a smooth migration.

## Prerequisites

Before starting the migration, ensure your project meets the v7 requirements:

- `node@20` ✅ (check with `node --version`)
- `react@18` ✅ (you currently have React 19.1.1)
- `react-dom@18` ✅ (you currently have React DOM 19.1.1)

> **Good News**: Your project already meets all requirements and is using React Router v7 (7.6.0)!

## Migration Strategy

The v7 upgrade has **no breaking changes** if you enable all future flags first. We'll update the app one change at a time.


## Step 2: Enable Future Flags Gradually

### Current Router Setup Analysis

Your current setup in `client/App.tsx` uses:
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
```

### Step 2.1: Migrate to `createBrowserRouter`

First, we need to migrate from the legacy `BrowserRouter` to the modern `createBrowserRouter` API to enable future flags.

**Before (current setup):**
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/apps" element={<Apps />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

**After (with future flags):**
```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/apps",
    element: <Apps />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

const App = () => <RouterProvider router={router} />;
```

### Step 2.2: Enable Individual Future Flags

Enable these flags one by one and test your app after each:

#### 1. `v7_relativeSplatPath`

**What it does**: Changes relative path matching/linking for splat routes like `dashboard/*`.

**Enable the flag:**
```js
createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});
```

**Code changes needed**: None for your current routes (no splat routes detected).

#### 2. `v7_startTransition`

**What it does**: Uses `React.useTransition` instead of `React.useState` for navigation.

**Enable the flag:**
```js
createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
  },
});
```

**Code changes needed**: 
- Move any `React.lazy` imports to module scope (outside components)
- No other changes needed

#### 3. `v7_fetcherPersist`

**What it does**: Changes fetcher lifecycle for idle states.

**Enable the flag:**
```js
createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
  },
});
```

**Code changes needed**: Check any `useFetchers` usage (if any) as they might persist longer than before.

#### 4. `v7_normalizeFormMethod`

**What it does**: Normalizes `formMethod` to uppercase HTTP verbs.

**Enable the flag:**
```js
createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
});
```

**Code changes needed**: Update any form method comparisons to check uppercase HTTP verbs:
```js
// Before
if (formMethod === "post") { ... }
// After  
if (formMethod === "POST") { ... }
```

#### 5. `v7_partialHydration`

**What it does**: Enables partial hydration for SSR or lazy loaded modules.

**Enable the flag:**
```js
createBrowserRouter(routes, {
  future: {
    v7_partialHydration: true,
  },
});
```

**Code changes needed**: 
- Remove any `fallbackElement` props
- Use `HydrateFallback` component instead (if needed)

#### 6. `v7_skipActionErrorRevalidation`

**What it does**: Prevents default revalidation after an action throws/returns a 4xx/5xx status code.

**Enable the flag:**
```js
createBrowserRouter(routes, {
  future: {
    v7_skipActionErrorRevalidation: true,
  },
});
```

**Code changes needed**: To revalidate after errors, use `shouldRevalidate` and `actionStatus`.

## Step 3: Handle Deprecations

### Remove `json` and `defer` Usage

**Before:**
```js
import { json } from "react-router-dom";
return json({ data });
```

**After:**
```js
return { data };
```

For JSON serialization, use native `Response.json()`:
```js
return Response.json({ data });
```

## Step 4: Upgrade to v7

After enabling all future flags and testing your app:

```bash
pnpm install react-router@latest
```

Since you're already on v7.6.0, you can skip this step.

## Step 5: Update Imports (For v7 Migration)

### Replace `react-router-dom` with `react-router`

**Before:**
```tsx
import { useLocation } from "react-router-dom";
```

**After:**
```tsx
import { useLocation } from "react-router";
```

### Batch Update Command

For macOS/BSD sed:
```bash
find ./client \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) -type f -exec sed -i '' 's|from "react-router-dom"|from "react-router"|g' {} +
```

For GNU sed (Linux):
```bash
find ./client \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) -type f -exec sed -i 's|from "react-router-dom"|from "react-router"|g' {} +
```

### Update DOM-Specific Imports

**Before:**
```tsx
import { RouterProvider } from "react-router-dom";
```

**After:**
```tsx
import { RouterProvider } from "react-router/dom";
```

### Files to Update in Your Project

Based on your project structure, you'll need to update these files:

1. **`client/App.tsx`** - Main router setup
2. **`client/pages/*.tsx`** - Any files using router hooks
3. **`client/components/**/*.tsx`** - Components using navigation hooks

## Step 6: Test Your Migration

After each step, run your development server and test:

```bash
pnpm dev
```

Test these areas specifically:
- Navigation between routes (`/`, `/apps`, `/chat`)
- Any forms or data fetching
- 404 handling (catch-all route)
- Browser back/forward navigation

## Your Current Status

✅ **Already on React Router v7.6.0**
❌ **Using legacy BrowserRouter API**
❌ **Importing from react-router instead of react-router-dom**

## Recommended Next Steps

1. **Migrate to `createBrowserRouter`** - Update `client/App.tsx` to use the modern router API
2. **Update imports** - Change from `react-router-dom` to `react-router` (except DOM-specific imports)
3. **Test thoroughly** - Ensure all navigation works correctly

## Common Issues and Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Ensure you've updated all imports and are using the correct router API.

### Issue: Routes not matching
**Solution**: Verify your route configuration in the new array format.

### Issue: TypeScript errors
**Solution**: Update your TypeScript imports and ensure you're using the latest types.

## Additional Resources

- [React Router v7 Documentation](https://reactrouter.com)
- [Migration Changelog](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md)
- [Future Flags Guide](https://reactrouter.com/upgrading/future)

## Need Help?

If you encounter issues during migration:
1. Check the browser console for errors
2. Verify all imports are correct
3. Ensure route configuration matches the new format
4. Test in incognito mode to avoid cache issues

---

**Congratulations!** Once you complete these steps, you'll be fully migrated to React Router v7! 🎉