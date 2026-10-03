import { useEffect, useState } from "react";

// beforeinstallprompt ne rade pouzdano (ili uopšte) na ovim browser-ima,
// iako neki od njih (Samsung Internet) INSTALLABLE web app UI imaju — samo
// ne kroz standardni event. Za njih pokazujemo ručno uputstvo.
function getManualHint(){
  const ua = window.navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) {
    return <>Dodaj na Home ekran: dodirni <strong>Podeli</strong> pa <strong>Dodaj na Home ekran</strong></>;
  }
  if (/SamsungBrowser/i.test(ua)) {
    return <>Dodaj na Home ekran: dodirni meni (☰) pa <strong>Dodaj stranicu na</strong> → <strong>Početni ekran</strong></>;
  }
  return null;
}

function isStandalone(){
  return window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;
}

export default function InstallPrompt(){
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [manualHint, setManualHint] = useState(null);

  useEffect(() => {
    if (isStandalone()) return;

    function onBeforeInstallPrompt(e){
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    function onInstalled(){
      setDeferredPrompt(null);
      setManualHint(null);
    }
    window.addEventListener("appinstalled", onInstalled);

    setManualHint(getManualHint());

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (dismissed || isStandalone()) return null;
  if (!deferredPrompt && !manualHint) return null;

  async function handleInstall(){
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <div className="install-banner">
      {deferredPrompt ? (
        <>
          <span>Instaliraj aplikaciju na uređaj za brži pristup</span>
          <div className="install-banner-actions">
            <button className="install-banner-button" onClick={handleInstall}>Instaliraj</button>
            <button className="install-banner-dismiss" onClick={() => setDismissed(true)}>✕</button>
          </div>
        </>
      ) : (
        <>
          <span>{manualHint}</span>
          <button className="install-banner-dismiss" onClick={() => setDismissed(true)}>✕</button>
        </>
      )}
    </div>
  );
}
