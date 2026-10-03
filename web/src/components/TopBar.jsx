export default function TopBar({ view, count, onBack, onSignOut, isAdmin, onAdmin }){
  return (
    <div className="topbar">
      {view === "detail" || view === "admin" ? (
        <button className="back-link" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          Svi recepti
        </button>
      ) : (
        <h2><span style={{ fontFamily: 'var(--font-serif)', fontSize: 21, fontWeight: 600 }}>Moji recepti</span></h2>
      )}
      {view === "list" && (
        <span className="topbar-actions">
          <span className="count">{count} {count === 1 ? 'recept' : 'recepata'}</span>
          {isAdmin && <button className="signout-link" onClick={onAdmin}>Admin</button>}
          <button className="signout-link" onClick={onSignOut}>Odjavi se</button>
        </span>
      )}
    </div>
  );
}
