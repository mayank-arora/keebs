# Keebs

React keyboard shortcut management with visual discoverability. Hold ⌘/Ctrl for 300ms to reveal hints.

## Installation

```bash
npx jsr add @mayankarora/keebs
```

## Quick Start

```tsx
import { KeebsProvider, useKeebs, KeebHint } from "@mayankarora/keebs";
// No CSS import needed - styles are auto-injected!

function App() {
  return (
    <KeebsProvider>
      <SearchButton />
    </KeebsProvider>
  );
}

function SearchButton() {
  const { ref, isVisible } = useKeebs(
    "Meta+K",
    () => {
      console.log("Search!");
    },
    { autoHint: false },
  );

  return (
    <button ref={ref}>
      Search
      <KeebHint shortcut="Meta+K" visible={isVisible} />
    </button>
  );
}
```

## API

### KeebsProvider

```tsx
<KeebsProvider
  delay={300} // ms before hints show
  disabled={false} // globally disable
/>
```

### useKeebs

```tsx
const { ref, isVisible } = useKeebs("Meta+K", handler, { autoHint: false });
```

### useKeebsControl

```tsx
const { setDisabled, updateShortcut } = useKeebsControl();
setDisabled(true); // pause during modals
updateShortcut("search", "Meta+P"); // user customization
```

## Styling

Override with CSS variables:

```css
:root {
  --keebs-hint-color: #666;
  --keebs-hint-bg: transparent;
}
```

## License

MIT © [Mayank Arora](https://github.com/mayank-arora)
