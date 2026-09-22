# strabo

Adds array support to `String.prototype.startsWith`, `endsWith`, and `includes`.

```js
"hello world".startsWith(["hi", "hello", "hey"]) // true — matches if ANY element matches
"hello world".endsWith(["world", "planet"])      // true
"hello world".includes(["xyz", "wor"])           // true
```

Normally these methods only accept a single string. **strabo** patches them so they also accept an array of strings, returning `true` if the string matches *any* element of the array — while remaining fully backward compatible with the original single-string behavior. The whole package is 4.5kb gzipped.

> ⚠️ **This package works by mutating global prototypes.** Importing it changes the behavior of `String.prototype.startsWith`, `endsWith`, and `includes` for your **entire JavaScript environment** — not just your own module. Read [How it works](#how-it-works) before installing. 

---

## Install

```bash
npm install strabo
```

```bash
yarn add strabo
```

```bash
pnpm add strabo
```

## Usage

### As an npm package

Import it once — anywhere near your application's entry point is enough. It has no exports; importing it for its side effect is the entire API.

```js
// ES6
import "strabo"

"John walks in the park".startsWith(["Jack", "John", "Jim"]) // true
```

```js
// CommonJS
require("strabo")

"John walks in the park".startsWith(["Jack", "John", "Jim"]) // true
```

TypeScript users get full type support out of the box — no extra `@types` package needed. `startsWith`, `endsWith`, and `includes` are typed to accept `string | string[]`, with autocomplete and type-checking working exactly as you'd expect for the native methods.

```ts
import "strabo"

"John walks in the park".startsWith(["Jack", "John", "Jim"]) // ✅ type-checks
"John walks in the park".startsWith(42)                      // ❌ type error, same as before
```

### Via `<script>` tag (no build tool required)

A browser-ready build is available on both major CDNs:

```html
<script src="https://unpkg.com/strabo"></script>
<script>
  console.log("hello world".startsWith(["hi", "hello"])) // true
</script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/strabo"></script>
```

**Pin a version in production.** An unversioned CDN URL always resolves to the latest release, which can silently change behavior under you after a future update:

```html
<script src="https://unpkg.com/strabo@1.0.0"></script>
```

## API

### `String.prototype.startsWith(searchString | searchStrings, position?)`

Returns `true` if the string starts with the given string, **or with any string in the given array**.

```js
"unit-test.spec.ts".startsWith(["unit-", "integration-"]) // true
```

### `String.prototype.endsWith(searchString | searchStrings, endPosition?)`

Returns `true` if the string ends with the given string, **or with any string in the given array**.

```js
"report.pdf".endsWith([".pdf", ".docx", ".xlsx"]) // true
```

### `String.prototype.includes(searchString | searchStrings, position?)`

Returns `true` if the string contains the given string, **or any string in the given array**.

```js
"the quick brown fox".includes(["cat", "fox", "dog"]) // true
```

All three retain their original single-string signature and behavior unchanged — passing a plain string behaves exactly as it always has, with the same optional `position` argument.

## How it works

On import, strabo checks each of `startsWith`, `endsWith`, and `includes` to see whether the current environment already handles array input natively (in case a future JS engine implements this itself). If so, strabo does nothing for that method — it never re-wraps a method that already does the job. Otherwise, it wraps the native method: array input is handled by checking each element in turn; any non-array input is passed straight through to the original, untouched implementation.

The original native implementations are preserved and remain reachable at `String.prototype.origStartsWith`, `origEndsWith`, and `origIncludes`, in case you ever need to bypass the patch and call the strict, string-only original directly.

Because the patch only *adds* array-handling on top of existing behavior, and never changes how a plain string argument is handled, this is designed to be a safe, non-breaking addition to any codebase — including ones that use third-party libraries that also call `startsWith`/`endsWith`/`includes` internally with plain strings.

strabo patches each method at most once per environment, even if imported multiple times or by multiple packages in your dependency tree — repeated imports are safe and inexpensive.

## Why would I want this?

Array-matching against `startsWith`/`endsWith`/`includes` is a common enough pattern that it usually gets hand-rolled with `.some()` every time it's needed:

```js
// without strabo
const prefixes = ["Jack", "John", "Jim"]
const matches = prefixes.some(p => str.startsWith(p))

// with strabo
const matches = str.startsWith(prefixes)
```

strabo just lets you write the check directly, using the method you already know.

## TypeScript support

Type declarations are bundled with the package — nothing extra to install. The overloaded signatures are ambient (global), so they apply automatically the moment you import `"strabo"` anywhere in your project; no per-file setup needed.

## Browser & runtime support

strabo has no dependencies and uses only standard `Object.defineProperty`/`Object.defineProperties` APIs, so it works anywhere `String.prototype.startsWith`/`endsWith`/`includes` already exist — which is effectively every modern browser and Node.js version in common use today.

## Contributing

Issues and pull requests are welcome. To build locally:

```bash
git clone https://github.com/emil-babayan/strabo.git
cd strabo
npm install
npm run build
```

## License

MIT © Emil Babayan
