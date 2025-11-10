const { useState, useEffect } = React;

// ---------- Config ----------
const API = (path) => `http://127.0.0.1:8000${path}`;

// Images by species
const SPECIES_IMAGES = {
  dog: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop",
  cat: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1200&auto=format&fit=crop",
  cow: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop",
  bird: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=1200&auto=format&fit=crop",
};

// Quotes + purpose
const QUOTES = [
  { text: "The greatness of a nation can be judged by the way its animals are treated.", author: "Mahatma Gandhi" },
  { text: "Until one has loved an animal, a part of one's soul remains unawakened.", author: "Anatole France" },
  { text: "Be kind to every kind, not just mankind.", author: "Anthony Douglas Williams" },
];
const PURPOSE = "StreetCare connects communities with rescuers and vets. Report animals in need, find nearby shelters and hospitals, and track progress with compassion and transparency.";

// Blog seeds
const BLOGS = [
  {
    title: "Compassion on the Curb: Help Street Animals Safely",
    excerpt: "Approach gently, avoid sudden movements, and call a local rescuer when needed. Here are the basics to help without harm.",
    tags: ["Compassion", "How-To", "Safety"],
    cover: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Community Networks Save Lives",
    excerpt: "Location pins, shared vet contacts, and quick coordination drastically reduce response time during emergencies.",
    tags: ["Community", "Rescue", "Tech"],
    cover: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Vaccination & Sterilization Matter",
    excerpt: "Humane, science-backed programs reduce suffering and improve public health outcomes sustainably.",
    tags: ["Awareness", "Health", "Policy"],
    cover: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop",
  },
];

/* ---------------- Header ---------------- */
function Header({ onNav, view }) {
  return (
    <div className="container header">
      <div className="brand" onClick={() => onNav("home")} style={{cursor:"pointer"}}>
        <span className="brand-dot"></span>
        <span className="brand-name">StreetCare</span>
      </div>
      <nav>
        {["home","report","centers","blog","login"].map(v => (
          <a key={v} className={`nav-link ${view===v ? "active" : ""}`} href="#" onClick={(e)=>{e.preventDefault();onNav(v)}}>
            {v === "home" ? "Home" :
             v === "report" ? "Report" :
             v === "centers" ? "Centers" :
             v === "blog" ? "Blog" : "Volunteer"}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ goReport, goCenters }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(()=>setI(p=>(p+1)%QUOTES.length), 3800); return ()=>clearInterval(id); }, []);
  const q = QUOTES[i];
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-inner">
          <h1>StreetCare</h1>
          <p>{PURPOSE}</p>
          <div className="hero-cta">
            <button className="btn" onClick={goReport}>Report Now</button>
            <button className="btn alt pill" onClick={goCenters}>Find Shelters</button>
            <button className="btn alt pill" onClick={goCenters}>Find Rescue Centers</button>
            <button className="btn alt pill" onClick={goCenters}>Find Vet Hospitals</button>
          </div>
          <div className="badges">
            <span className="badge">Nearest shelters & vets</span>
            <span className="badge">Fast, simple reporting</span>
            <span className="badge">Built by the community</span>
          </div>
          <div className="quote-card">
            <div style={{fontSize:"18px"}}>“</div>
            <div>
              <div className="quote">{q.text}</div>
              <div className="quote-author">— {q.author}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Animal Cards ---------------- */
function AnimalCard({ a }) {
  const src = a.image_url?.trim()
    ? a.image_url
    : SPECIES_IMAGES[(a.species || "").toLowerCase()] || SPECIES_IMAGES.default;
  return (
    <div className="card">
      <img src={src} alt={a.species || "animal"} />
      <div className="meta">
        <strong>{(a.species || "Unknown").toUpperCase()}</strong>
        <span style={{color:"#9db4d6"}}>{a.status || "reported"}</span>
      </div>
      <p className="small" style={{color:"#cfe2ff"}}>{a.description || "No description provided."}</p>
      <p className="small" style={{color:"#9db4d6"}}>Location: {a.lat ?? "?"}, {a.lng ?? "?"}</p>
    </div>
  );
}

function Gallery({ animals }) {
  const pics = (animals.slice(0, 8).map(a =>
    a.image_url?.trim()
      ? a.image_url
      : SPECIES_IMAGES[(a.species || "").toLowerCase()] || SPECIES_IMAGES.default
  ));
  const fallbacks = [SPECIES_IMAGES.dog, SPECIES_IMAGES.cat, SPECIES_IMAGES.cow, SPECIES_IMAGES.bird];
  const imgs = pics.length ? pics : fallbacks;
  return (
    <div className="container">
      <div className="section-title">📸 Recent Sightings</div>
      <div className="grid">
        {imgs.map((src, i)=>(
          <div key={i} className="card">
            <img src={src} alt="street animal" />
            <div className="small" style={{color:"#9db4d6"}}>Community submission</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Pages ---------------- */
function Home({ goReport, goCenters }) {
  const [animals, setAnimals] = useState([]);
  useEffect(() => { fetch(API("/animals")).then(r=>r.json()).then(setAnimals).catch(()=>setAnimals([])); }, []);
  return (
    <>
      <Hero goReport={goReport} goCenters={goCenters} />
      <div className="container">
        <div className="section-title">🐾 Nearby Street Animals</div>
        <div className="grid">
          {animals.map(a => <AnimalCard key={a.id} a={a} />)}
        </div>
      </div>
      <Gallery animals={animals} />
    </>
  );
}

function ReportForm() {
  const [form, setForm] = useState({ reporter_name:"", contact:"", species:"", description:"", lat:"", lng:"", image_url:"" });
  const [busy, setBusy] = useState(false);
  const update = (k,v)=> setForm(prev=>({...prev,[k]:v}));

  const submit = async () => {
    setBusy(true);
    try{
      const payload = {
        ...form,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null
      };
      const r = await fetch(API("/reports"), { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      const j = await r.json();
      if (j.id) { alert("Report submitted. Thank you!"); setForm({ reporter_name:"", contact:"", species:"", description:"", lat:"", lng:"", image_url:"" }); }
      else { alert("Failed to submit. Check fields and try again."); }
    } catch(e){ alert("Failed to submit. Try again."); }
    finally{ setBusy(false); }
  };

  return (
    <div className="container">
      <div className="section-title">📣 Report a Street Animal</div>
      <div className="card" style={{display:"grid", gap:10}}>
        <div className="row">
          <input className="input" placeholder="Your name (optional)" value={form.reporter_name} onChange={e=>update("reporter_name", e.target.value)} />
          <input className="input" placeholder="Contact (optional)" value={form.contact} onChange={e=>update("contact", e.target.value)} />
        </div>
        <div className="row">
          <select className="input" value={form.species} onChange={e=>update("species", e.target.value)}>
            <option value="">Select species</option>
            <option>dog</option><option>cat</option><option>cow</option><option>bird</option><option>other</option>
          </select>
          <input className="input" placeholder="Latitude" value={form.lat} onChange={e=>update("lat", e.target.value)} />
          <input className="input" placeholder="Longitude" value={form.lng} onChange={e=>update("lng", e.target.value)} />
        </div>
        <input className="input" placeholder="Image URL (optional)" value={form.image_url} onChange={e=>update("image_url", e.target.value)} />
        <textarea className="textarea" rows="4" placeholder="Describe the situation" value={form.description} onChange={e=>update("description", e.target.value)} />
        <div className="row">
          <button className="btn" onClick={submit} disabled={busy}>{busy ? "Submitting..." : "Submit Report"}</button>
          <a className="btn alt" href="https://www.google.com/maps/search/?api=1&query=vet+hospital+near+me" target="_blank" rel="noreferrer">Open Maps</a>
        </div>
      </div>
    </div>
  );
}

function Centers() {
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLoc(null),
      { enableHighAccuracy:true, timeout:5000 }
    );
  }, []);

  const qs = (q) => {
    if (loc) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}&query_place_id=&center=${loc.lat},${loc.lng}`;
    return `https://www.google.com/maps/search/${encodeURIComponent(q)}+near+me`;
  };

  return (
    <div className="container">
      <div className="section-title">🗺️ Find Nearby Help</div>
      <div className="card">
        <p className="small" style={{color:"#cfe2ff", marginTop:0}}>
          Use these quick actions to discover the nearest <strong>animal shelters</strong>, <strong>rescue centers</strong>, and <strong>vet hospitals</strong>.
          We’ll use your browser location if allowed; otherwise, we’ll search near you.
        </p>
        <div className="row">
          <a className="btn" href={qs("animal shelter")} target="_blank" rel="noreferrer">Find Shelters</a>
          <a className="btn alt" href={qs("animal rescue centre")} target="_blank" rel="noreferrer">Find Rescue Centers</a>
          <a className="btn alt" href={qs("veterinary hospital")} target="_blank" rel="noreferrer">Find Vet Hospitals</a>
        </div>
      </div>
    </div>
  );
}

function Blog() {
  return (
    <div className="container">
      <div className="section-title">📝 Voices of Kindness — Blog</div>
      <div className="blog-grid">
        {BLOGS.map((b, i)=>(
          <article key={i} className="blog">
            <img src={b.cover} alt={b.title} style={{width:"100%", height:160, objectFit:"cover", borderRadius:12}} />
            <h4>{b.title}</h4>
            <p>{b.excerpt}</p>
            <div className="tags">{b.tags.map((t,j)=>(<span key={j} className="tag">#{t}</span>))}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------------- App ---------------- */
function App(){
  const [view, setView] = useState("home");
  const goReport = () => setView("report");
  const goCenters = () => setView("centers");

  return (
    <>
      <Header onNav={setView} view={view} />
      {view === "home"    && <Home goReport={goReport} goCenters={goCenters} />}
      {view === "report"  && <ReportForm />}
      {view === "centers" && <Centers />}
      {view === "blog"    && <Blog />}
      {view === "login"   && <Login />}
      <footer>StreetCare • Be kind, always. 🐾</footer>
    </>
  );
}

/* --------- Simple Login kept from earlier (unchanged core) ---------- */
function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [token,setToken] = useState("");
  const [animal,setAnimal] = useState({ species:"", description:"", lat:"", lng:"", image_url:"" });
  const update = (k,v)=> setAnimal(prev=>({...prev,[k]:v}));

  const login = async () => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const r = await fetch(API("/auth/token"), { method:"POST", body: form });
    const j = await r.json();
    if (j.access_token) { setToken(j.access_token); alert("Logged in! Token acquired."); }
    else alert("Login failed. Check credentials.");
  };

  const createAnimal = async () => {
    if (!token) { alert("Login first"); return; }
    const payload = { ...animal, lat: animal.lat?parseFloat(animal.lat):null, lng: animal.lng?parseFloat(animal.lng):null };
    const r = await fetch(API("/animals"), {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":"Bearer " + token },
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    if (j.id) alert("Created animal id: " + j.id);
    else alert("Failed to create animal (check console).");
  };

  return (
    <div className="container">
      <div className="section-title">🔐 Volunteer / Admin</div>
      <div className="card" style={{display:"grid", gap:10}}>
        <div className="row">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn alt" onClick={login}>Login</button>
        </div>
        {token && <div className="small" style={{color:"#9db4d6"}}>Token acquired ✔</div>}
      </div>

      <div className="card" style={{display:"grid", gap:10}}>
        <div className="section-title" style={{margin:"0 0 6px"}}>➕ Create Animal (auth required)</div>
        <div className="row">
          <input className="input" placeholder="Species" value={animal.species} onChange={e=>update("species", e.target.value)} />
          <input className="input" placeholder="Latitude" value={animal.lat} onChange={e=>update("lat", e.target.value)} />
          <input className="input" placeholder="Longitude" value={animal.lng} onChange={e=>update("lng", e.target.value)} />
        </div>
        <input className="input" placeholder="Image URL (optional)" value={animal.image_url} onChange={e=>update("image_url", e.target.value)} />
        <textarea className="textarea" rows="3" placeholder="Description" value={animal.description} onChange={e=>update("description", e.target.value)} />
        <div><button className="btn" onClick={createAnimal}>Create</button></div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
