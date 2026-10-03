import { useState } from "react";
import { signInWithGoogle } from "../firebase.js";

export default function Login(){
  const [error, setError] = useState(null);

  async function handleSignIn(){
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Prijava nije uspela:", err);
      setError("Prijava nije uspela. Pokušaj ponovo.");
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Moji recepti</h1>
        <p>Ova stranica je privatna — prijavi se da nastaviš.</p>
        {error && <div className="login-error">{error}</div>}
        <button className="login-button" onClick={handleSignIn}>
          Prijavi se sa Google nalogom
        </button>
      </div>
    </div>
  );
}
