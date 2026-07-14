// Header auth control: sign-in button when signed out; avatar + name +
// sign-out when signed in.
export default function AuthSlot({ user, onSignIn, onSignOut }) {
  if (!user) {
    return (
      <button type="button" className="signin-btn" onClick={onSignIn}>
        Sign in with Google
      </button>
    )
  }

  const name = user.displayName || user.email || 'Player'
  return (
    <div className="auth-user">
      {user.photoURL && (
        <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
      )}
      <span className="auth-name">{name}</span>
      <button type="button" className="signout-btn" onClick={onSignOut}>
        Sign out
      </button>
    </div>
  )
}
