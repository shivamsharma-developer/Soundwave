import { useState, useEffect, useRef } from "react";

const API = "http://localhost:3000/api";

// ─── API helpers ────────────────────────────────────────────────────────────
const api = {
  post: (path, body) =>
    fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  postForm: (path, formData) =>
    fetch(`${API}${path}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((r) => r.json()),

  get: (path) =>
    fetch(`${API}${path}`, { credentials: "include" }).then((r) => r.json()),
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    play: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    ),
    pause: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
    ),
    music: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    album: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    upload: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    next: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 15,12 5,21" />
        <rect x="17" y="3" width="2" height="18" />
      </svg>
    ),
    prev: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="19,3 9,12 19,21" />
        <rect x="5" y="3" width="2" height="18" />
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const res = await api.post(path, body);
      if (res.user || res.message?.toLowerCase().includes("success")) {
        onLogin(res.user || { username: form.username, role: form.role });
      } else {
        setError(res.message || "Something went wrong");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div style={styles.authBg}>
      <div style={styles.authNoise} />
      <div style={styles.authCard}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <Icon name="music" size={28} />
          </div>
          <span style={styles.logoText}>Soundwave</span>
        </div>

        <h2 style={styles.authTitle}>
          {mode === "login" ? "Welcome back" : "Join Soundwave"}
        </h2>
        <p style={styles.authSub}>
          {mode === "login" ? "Sign in to your account" : "Create your free account"}
        </p>

        <form onSubmit={handle} style={styles.form}>
          {mode === "register" && (
            <input
              style={styles.input}
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {mode === "register" && (
            <div style={styles.roleRow}>
              {["user", "artist"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{
                    ...styles.roleBtn,
                    ...(form.role === r ? styles.roleBtnActive : {}),
                  }}
                >
                  {r === "user" ? "🎧 Listener" : "🎤 Artist"}
                </button>
              ))}
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            style={styles.switchLink}
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── Player Bar ───────────────────────────────────────────────────────────────
function PlayerBar({ track, tracks, onNext, onPrev }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current && track) {
      audioRef.current.src = track.uri;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [track]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const p = (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
    setProgress(p);
  };

  const seek = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = x * audioRef.current.duration;
  };

  if (!track) return (
    <div style={styles.playerBar}>
      <p style={{ color: "#555", margin: 0, fontSize: 13 }}>Select a track to play</p>
    </div>
  );

  return (
    <div style={styles.playerBar}>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={onNext} />
      <div style={styles.playerInfo}>
        <div style={styles.playerThumb}><Icon name="music" size={18} /></div>
        <div>
          <div style={styles.playerTitle}>{track.title}</div>
          <div style={styles.playerArtist}>{track.artist?.username || "Unknown"}</div>
        </div>
      </div>
      <div style={styles.playerControls}>
        <button style={styles.ctrlBtn} onClick={onPrev}><Icon name="prev" size={16} /></button>
        <button style={styles.playBtn} onClick={toggle}>
          <Icon name={playing ? "pause" : "play"} size={20} />
        </button>
        <button style={styles.ctrlBtn} onClick={onNext}><Icon name="next" size={16} /></button>
      </div>
      <div style={styles.progressWrap} onClick={seek}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!title || !file) return setMsg("Title and file required");
    setLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("music", file);
    const res = await api.postForm("/music/upload", fd);
    setLoading(false);
    if (res.message?.toLowerCase().includes("success") || res._id || res.music) {
      onUploaded();
      onClose();
    } else {
      setMsg(res.message || "Upload failed");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>Upload Track</h3>
        <input style={styles.input} placeholder="Track title" value={title} onChange={e => setTitle(e.target.value)} />
        <label style={styles.fileLabel}>
          {file ? `✓ ${file.name}` : "Choose audio file"}
          <input type="file" accept="audio/*" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
        </label>
        {msg && <div style={styles.error}>{msg}</div>}
        <div style={styles.modalBtns}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.submitBtn} onClick={submit} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Album Modal ───────────────────────────────────────────────────────
function AlbumModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!title) return setMsg("Title required");
    setLoading(true);
    const res = await api.post("/music/album", { title });
    setLoading(false);
    if (res._id || res.album) { onCreated(); onClose(); }
    else setMsg(res.message || "Failed");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>Create Album</h3>
        <input style={styles.input} placeholder="Album title" value={title} onChange={e => setTitle(e.target.value)} />
        {msg && <div style={styles.error}>{msg}</div>}
        <div style={styles.modalBtns}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.submitBtn} onClick={submit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home"); // home | albums | album
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const fetchTracks = async () => {
    const res = await api.get("/music/");
    if (Array.isArray(res.musics)) setTracks(res.musics);
  };

  const fetchAlbums = async () => {
    const res = await api.get("/music/albums");
    if (Array.isArray(res.albums)) setAlbums(res.albums);
  };

  useEffect(() => {
    if (user) {
      fetchTracks();
      if (user.role === "user") fetchAlbums();
    }
  }, [user]);

  const playTrack = (track, idx) => {
    setCurrentTrack(track);
    setCurrentIdx(idx);
  };

  const next = () => {
    const idx = (currentIdx + 1) % tracks.length;
    setCurrentIdx(idx);
    setCurrentTrack(tracks[idx]);
  };

  const prev = () => {
    const idx = (currentIdx - 1 + tracks.length) % tracks.length;
    setCurrentIdx(idx);
    setCurrentTrack(tracks[idx]);
  };

  const logout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  };

  if (!user) return <AuthPage onLogin={setUser} />;

  return (
    <div style={styles.appWrap}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}><Icon name="music" size={22} /></div>
          <span style={styles.logoText}>Soundwave</span>
        </div>

        <nav style={styles.nav}>
          <button style={{ ...styles.navItem, ...(view === "home" ? styles.navActive : {}) }}
            onClick={() => setView("home")}>
            <Icon name="home" size={18} /> Home
          </button>
          {user.role === "user" && (
            <button style={{ ...styles.navItem, ...(view === "albums" ? styles.navActive : {}) }}
              onClick={() => { setView("albums"); fetchAlbums(); }}>
              <Icon name="album" size={18} /> Albums
            </button>
          )}
        </nav>

        {user.role === "artist" && (
          <div style={styles.artistActions}>
            <p style={styles.sectionLabel}>Artist Tools</p>
            <button style={styles.actionBtn} onClick={() => setShowUpload(true)}>
              <Icon name="upload" size={16} /> Upload Track
            </button>
            <button style={styles.actionBtn} onClick={() => setShowAlbum(true)}>
              <Icon name="plus" size={16} /> New Album
            </button>
          </div>
        )}

        <div style={styles.sidebarBottom}>
          <div style={styles.userChip}>
            <div style={styles.userAvatar}><Icon name="user" size={14} /></div>
            <div>
              <div style={styles.userName}>{user.username || user.email}</div>
              <div style={styles.userRole}>{user.role}</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={logout} title="Logout">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {view === "home" && (
          <>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>All Tracks</h1>
              <span style={styles.trackCount}>{tracks.length} songs</span>
            </div>
            <div style={styles.trackList}>
              {tracks.length === 0 && (
                <div style={styles.empty}>No tracks yet. {user.role === "artist" ? "Upload one!" : ""}</div>
              )}
              {tracks.map((t, i) => (
                <div
                  key={t._id}
                  style={{ ...styles.trackRow, ...(currentTrack?._id === t._id ? styles.trackRowActive : {}) }}
                  onClick={() => playTrack(t, i)}
                >
                  <div style={styles.trackNum}>{currentTrack?._id === t._id ? <Icon name="play" size={14} /> : i + 1}</div>
                  <div style={styles.trackThumb}><Icon name="music" size={16} /></div>
                  <div style={styles.trackMeta}>
                    <div style={styles.trackName}>{t.title}</div>
                    <div style={styles.trackArtist}>{t.artist?.username || "Unknown Artist"}</div>
                  </div>
                  <div style={styles.trackEmail}>{t.artist?.email}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "albums" && user.role === "user" && (
          <>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Albums</h1>
            </div>
            <div style={styles.albumGrid}>
              {albums.length === 0 && <div style={styles.empty}>No albums available.</div>}
              {albums.map((a) => (
                <div
                  key={a._id}
                  style={styles.albumCard}
                  onClick={async () => {
                    const res = await api.get(`/music/album/${a._id}`);
                    setSelectedAlbum(res.album || a);
                    setView("album");
                  }}
                >
                  <div style={styles.albumCover}><Icon name="album" size={40} /></div>
                  <div style={styles.albumTitle}>{a.title}</div>
                  <div style={styles.albumArtist}>{a.artist?.username || "Artist"}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "album" && selectedAlbum && (
          <>
            <div style={styles.pageHeader}>
              <button style={styles.backBtn} onClick={() => setView("albums")}>← Back</button>
              <h1 style={styles.pageTitle}>{selectedAlbum.title}</h1>
              <span style={styles.trackCount}>by {selectedAlbum.artist?.username}</span>
            </div>
            <div style={styles.trackList}>
              {(selectedAlbum.musics || []).length === 0 && <div style={styles.empty}>No tracks in this album.</div>}
              {(selectedAlbum.musics || []).map((t, i) => (
                <div key={t._id || i} style={styles.trackRow} onClick={() => playTrack(t, i)}>
                  <div style={styles.trackNum}>{i + 1}</div>
                  <div style={styles.trackThumb}><Icon name="music" size={16} /></div>
                  <div style={styles.trackMeta}>
                    <div style={styles.trackName}>{t.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Player */}
      <PlayerBar track={currentTrack} tracks={tracks} onNext={next} onPrev={prev} />

      {/* Modals */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={fetchTracks} />}
      {showAlbum && <AlbumModal onClose={() => setShowAlbum(false)} onCreated={fetchAlbums} />}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0f",
  surface: "#111118",
  surfaceHover: "#1a1a25",
  border: "#1e1e2e",
  accent: "#6366f1",
  accentHover: "#818cf8",
  text: "#e2e2f0",
  muted: "#5a5a7a",
  success: "#22d3a5",
  error: "#f87171",
};

const styles = {
  // Auth
  authBg: {
    minHeight: "100vh",
    background: C.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
  },
  authNoise: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  authCard: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
    position: "relative",
    zIndex: 1,
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff",
  },
  logoText: { fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" },
  authTitle: { fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 6px" },
  authSub: { fontSize: 14, color: C.muted, margin: "0 0 24px" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    background: "#16161f",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "12px 14px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  roleRow: { display: "flex", gap: 8 },
  roleBtn: {
    flex: 1, padding: "10px", borderRadius: 10,
    background: "#16161f", border: `1px solid ${C.border}`,
    color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit",
    transition: "all 0.2s",
  },
  roleBtnActive: {
    background: "rgba(99,102,241,0.15)", borderColor: C.accent, color: C.text,
  },
  error: {
    background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: 8, padding: "8px 12px", color: C.error, fontSize: 13,
  },
  submitBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 10, padding: "13px",
    color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit", transition: "opacity 0.2s",
  },
  switchText: { textAlign: "center", color: C.muted, fontSize: 13, marginTop: 16 },
  switchLink: { color: C.accent, cursor: "pointer", fontWeight: 600 },

  // App layout
  appWrap: {
    display: "flex", height: "100vh", background: C.bg,
    fontFamily: "'Sora', 'Segoe UI', sans-serif", color: C.text,
    overflow: "hidden",
  },
  sidebar: {
    width: 240, background: C.surface,
    borderRight: `1px solid ${C.border}`,
    display: "flex", flexDirection: "column",
    padding: "24px 16px", flexShrink: 0,
  },
  nav: { display: "flex", flexDirection: "column", gap: 4, marginTop: 24 },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 10,
    background: "none", border: "none",
    color: C.muted, cursor: "pointer", fontSize: 14,
    fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
  },
  navActive: { background: "rgba(99,102,241,0.15)", color: C.text },
  artistActions: { marginTop: 32 },
  sectionLabel: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 4px" },
  actionBtn: {
    display: "flex", alignItems: "center", gap: 8,
    width: "100%", padding: "10px 12px", borderRadius: 10,
    background: "rgba(99,102,241,0.1)", border: `1px solid rgba(99,102,241,0.2)`,
    color: C.accent, cursor: "pointer", fontSize: 13,
    fontFamily: "inherit", marginBottom: 8, transition: "all 0.15s",
  },
  sidebarBottom: { marginTop: "auto", display: "flex", alignItems: "center", gap: 8 },
  userChip: { display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  userAvatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "rgba(99,102,241,0.2)", display: "flex",
    alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  userRole: { fontSize: 11, color: C.muted, textTransform: "capitalize" },
  logoutBtn: {
    background: "none", border: "none", color: C.muted,
    cursor: "pointer", padding: 6, borderRadius: 8, display: "flex",
  },

  // Main
  main: { flex: 1, overflow: "auto", padding: "32px 36px", paddingBottom: 100 },
  pageHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  pageTitle: { fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" },
  trackCount: { fontSize: 13, color: C.muted, background: C.surfaceHover, padding: "4px 10px", borderRadius: 20 },
  backBtn: {
    background: "none", border: `1px solid ${C.border}`, color: C.muted,
    padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13,
    fontFamily: "inherit",
  },
  empty: { color: C.muted, fontSize: 15, padding: "40px 0", textAlign: "center" },

  // Track list
  trackList: { display: "flex", flexDirection: "column", gap: 2 },
  trackRow: {
    display: "flex", alignItems: "center", gap: 16,
    padding: "10px 14px", borderRadius: 10, cursor: "pointer",
    transition: "background 0.15s",
  },
  trackRowActive: { background: "rgba(99,102,241,0.12)" },
  trackNum: { width: 24, textAlign: "center", color: C.muted, fontSize: 13, flexShrink: 0 },
  trackThumb: {
    width: 40, height: 40, borderRadius: 8,
    background: "linear-gradient(135deg, #1e1e30, #2a2a45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: C.muted, flexShrink: 0,
  },
  trackMeta: { flex: 1, minWidth: 0 },
  trackName: { fontSize: 14, fontWeight: 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  trackArtist: { fontSize: 12, color: C.muted, marginTop: 2 },
  trackEmail: { fontSize: 12, color: C.muted },

  // Albums
  albumGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 20 },
  albumCard: {
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 14, padding: 16, cursor: "pointer",
    transition: "all 0.2s",
  },
  albumCover: {
    width: "100%", paddingTop: "100%", position: "relative",
    background: "linear-gradient(135deg, #1a1a30, #2d1f5e)",
    borderRadius: 10, marginBottom: 12, overflow: "hidden",
  },
  albumTitle: { fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  albumArtist: { fontSize: 12, color: C.muted, marginTop: 4 },

  // Player
  playerBar: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    height: 72, background: "#0d0d16",
    borderTop: `1px solid ${C.border}`,
    display: "flex", alignItems: "center", gap: 24, padding: "0 28px",
    zIndex: 100,
  },
  playerInfo: { display: "flex", alignItems: "center", gap: 12, width: 220, flexShrink: 0 },
  playerThumb: {
    width: 44, height: 44, borderRadius: 8,
    background: "linear-gradient(135deg, #1e1e30, #2a2a45)",
    display: "flex", alignItems: "center", justifyContent: "center", color: C.muted,
  },
  playerTitle: { fontSize: 13, fontWeight: 600, color: C.text },
  playerArtist: { fontSize: 12, color: C.muted, marginTop: 2 },
  playerControls: { display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "center" },
  ctrlBtn: { background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 4, display: "flex" },
  playBtn: {
    width: 44, height: 44, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  progressWrap: {
    flex: 1, height: 4, background: "#1e1e2e",
    borderRadius: 2, cursor: "pointer", maxWidth: 300,
  },
  progressBar: { height: "100%", background: C.accent, borderRadius: 2, transition: "width 0.1s" },

  // Modals
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 16, padding: 28, width: 380,
    display: "flex", flexDirection: "column", gap: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: 700, margin: 0, color: C.text },
  fileLabel: {
    background: "#16161f", border: `1px dashed ${C.border}`,
    borderRadius: 10, padding: "14px", color: C.muted,
    cursor: "pointer", fontSize: 13, textAlign: "center",
  },
  modalBtns: { display: "flex", gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, padding: "11px", borderRadius: 10,
    background: "none", border: `1px solid ${C.border}`,
    color: C.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit",
  },
};