import { useState } from "react";
import { KeebsProvider, useKeebs, KeebHint } from "../../src";
import "../../src/styles/keebs.css";
import "./App.css";

function SearchButton() {
  const [searchOpen, setSearchOpen] = useState(false);

  const { ref, isVisible } = useKeebs(
    "Meta+K",
    () => {
      setSearchOpen(true);
      console.log("Search opened!");
    },
    { autoHint: false },
  );

  return (
    <>
      <button ref={ref} onClick={() => setSearchOpen(true)}>
        Search
      </button>
      <KeebHint shortcut="Meta+K" visible={isVisible} />
    </>
  );
}

function NewDocButton() {
  const { ref, isVisible } = useKeebs(
    "Meta+N",
    () => {
      console.log("New document created!");
    },
    { autoHint: false },
  );

  return (
    <>
      <button ref={ref}>New Document</button>
      <KeebHint shortcut="Meta+N" visible={isVisible} />
    </>
  );
}

function SaveButton() {
  const { ref, isVisible } = useKeebs(
    "Meta+S",
    () => {
      console.log("Saved!");
    },
    { autoHint: false },
  );

  return (
    <>
      <button ref={ref}>Save</button>
      <KeebHint shortcut="Meta+S" visible={isVisible} />
    </>
  );
}

function NavItem({ label, shortcut }: { label: string; shortcut: string }) {
  const { ref, isVisible } = useKeebs(
    shortcut,
    () => console.log(`Navigate to ${label}`),
    {
      autoHint: false,
    },
  );

  return (
    <a href="#" ref={ref} className="nav-item">
      <span>{label}</span>
      <KeebHint shortcut={shortcut} visible={isVisible} variant="badge" />
    </a>
  );
}

function App() {
  return (
    <KeebsProvider triggerKeys={["Meta", "Control"]} delay={300}>
      <div className="app">
        <header className="header">
          <h1>Keebs Demo</h1>
          <p className="subtitle">
            Hold <kbd>⌘</kbd> (Mac) or <kbd>Ctrl</kbd> (Windows) for 500ms to
            see keyboard shortcuts
          </p>
        </header>

        <nav className="nav">
          <NavItem label="Home" shortcut="Meta+1" />
          <NavItem label="Dashboard" shortcut="Meta+2" />
          <NavItem label="Settings" shortcut="Meta+3" />
        </nav>

        <main className="main">
          <section className="toolbar">
            <h2>Toolbar</h2>
            <div className="button-group">
              <SearchButton />
              <NewDocButton />
              <SaveButton />
            </div>
          </section>

          <section className="content">
            <h2>Instructions</h2>
            <ol>
              <li>
                Hold down <kbd>⌘</kbd> or <kbd>Ctrl</kbd> for half a second
              </li>
              <li>
                Watch the keyboard shortcuts appear next to buttons and nav
                items
              </li>
              <li>
                Press a shortcut while holding the modifier to trigger the
                action
              </li>
              <li>Release the modifier key to hide the hints</li>
            </ol>
          </section>
        </main>
      </div>
    </KeebsProvider>
  );
}

export default App;
