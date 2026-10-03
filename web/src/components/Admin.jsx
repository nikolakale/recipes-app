import { useEffect, useState } from "react";
import { loadAdminData, approveRequest, rejectRequest, revokeAccess } from "../firebase.js";

function formatDate(ts){
  const d = ts?.toDate?.();
  return d ? d.toLocaleString("sr-RS", { dateStyle: "medium", timeStyle: "short" }) : "";
}

export default function Admin(){
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null); // email/uid reda koji se trenutno menja

  function refresh(){
    return loadAdminData().then(setData).catch(err => {
      console.error("Učitavanje admin podataka nije uspelo:", err);
      setError(err);
    });
  }
  useEffect(() => { refresh(); }, []);

  async function run(key, action){
    setBusy(key);
    setError(null);
    try { await action(); await refresh(); }
    catch (err){ console.error(err); setError(err); }
    finally { setBusy(null); }
  }

  if (error && !data) return <div className="state-box">Učitavanje nije uspelo. Proveri da li su Firestore pravila deploy-ovana.</div>;
  if (!data) return <div className="state-box">Učitavanje…</div>;

  return (
    <div className="admin">
      {error && <div className="login-error">Akcija nije uspela. Pokušaj ponovo.</div>}

      <h3 className="admin-heading">Zahtevi za pristup ({data.requests.length})</h3>
      {data.requests.length === 0 && <p className="admin-empty">Nema novih zahteva.</p>}
      {data.requests.map(r => (
        <div className="admin-row" key={r.uid}>
          <div className="admin-who">
            <strong>{r.displayName || r.email}</strong>
            <span>{r.email}</span>
            <span className="admin-date">{formatDate(r.requestedAt)}</span>
          </div>
          <div className="admin-actions">
            <button className="admin-btn primary" disabled={busy === r.uid} onClick={() => run(r.uid, () => approveRequest(r))}>Dozvoli</button>
            <button className="admin-btn" disabled={busy === r.uid} onClick={() => run(r.uid, () => rejectRequest(r))}>Odbij</button>
          </div>
        </div>
      ))}

      <h3 className="admin-heading">Odobreni korisnici ({data.allowed.length})</h3>
      {data.allowed.length === 0 && <p className="admin-empty">Niko osim tebe nema pristup.</p>}
      {data.allowed.map(u => (
        <div className="admin-row" key={u.email}>
          <div className="admin-who">
            <strong>{u.displayName || u.email}</strong>
            <span>{u.email}</span>
          </div>
          <div className="admin-actions">
            <button
              className="admin-btn"
              disabled={busy === u.email}
              onClick={() => { if (confirm(`Ukloni pristup za ${u.email}?`)) run(u.email, () => revokeAccess(u.email)); }}
            >Ukloni</button>
          </div>
        </div>
      ))}
    </div>
  );
}
