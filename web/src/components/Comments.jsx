import { useEffect, useState } from "react";
import { loadComments, addComment, deleteComment, getCurrentUser, isAdminUser } from "../firebase.js";

const MAX_LENGTH = 1000;

function formatDate(ts){
  const d = ts?.toDate?.();
  return d ? d.toLocaleDateString("sr-RS", { day: "numeric", month: "short", year: "numeric" }) : "";
}

function Avatar({ name, photoURL }){
  const [failed, setFailed] = useState(false);
  if (photoURL && !failed){
    // Google ponekad odbije slike kad stigne Referer sa tuđeg domena
    return <img className="avatar" src={photoURL} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
  }
  return <span className="avatar avatar-fallback" aria-hidden="true">{(name || "?").trim().charAt(0).toUpperCase()}</span>;
}

export default function Comments({ recipeId }){
  const user = getCurrentUser();
  const isAdmin = isAdminUser(user);
  const [comments, setComments] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  function refresh(){
    return loadComments(recipeId)
      .then(setComments)
      .catch(err => { console.error("Učitavanje komentara nije uspelo:", err); setComments([]); setError(true); });
  }

  useEffect(() => {
    setComments(null);
    setError(false);
    refresh();
  }, [recipeId]);

  async function submit(e){
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError(false);
    try {
      await addComment(recipeId, trimmed);
      setText("");
      await refresh();
    } catch (err){
      console.error("Slanje komentara nije uspelo:", err);
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id){
    if (!confirm("Obriši komentar?")) return;
    try { await deleteComment(recipeId, id); await refresh(); }
    catch (err){ console.error(err); setError(true); }
  }

  return (
    <section className="comments">
      <h3 className="sec">Komentari {comments && comments.length > 0 && <span className="hint">{comments.length}</span>}</h3>

      <form className="comment-form" onSubmit={submit}>
        <Avatar name={user?.displayName || user?.email} photoURL={user?.photoURL} />
        <div className="comment-input">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={MAX_LENGTH}
            rows={2}
            placeholder="Dodaj komentar…"
          />
          <button type="submit" className="admin-btn primary" disabled={busy || !text.trim()}>Objavi</button>
        </div>
      </form>

      {error && <div className="login-error">Nešto nije uspelo. Pokušaj ponovo.</div>}
      {comments === null && <p className="admin-empty">Učitavanje…</p>}
      {comments && comments.length === 0 && !error && <p className="admin-empty">Još nema komentara.</p>}

      <ul className="comment-list">
        {(comments || []).map(c => (
          <li className="comment" key={c.id}>
            <Avatar name={c.authorName} photoURL={c.photoURL} />
            <div className="comment-body">
              <div className="comment-head">
                <strong>{c.authorName}</strong>
                <span className="comment-date">{formatDate(c.createdAt)}</span>
                {(c.uid === user?.uid || isAdmin) && (
                  <button type="button" className="signout-link" onClick={() => remove(c.id)}>Obriši</button>
                )}
              </div>
              <p>{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
