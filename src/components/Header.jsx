// Top bar: game title + reserved auth slot (filled later).
export default function Header() {
  return (
    <header className="header">
      <h1 className="title">ASCII CLICKER</h1>
      <div className="auth-slot" aria-hidden="true" />
    </header>
  )
}
