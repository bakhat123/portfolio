import ChatUI from "@/components/ChatUI";
import profile from "@/data/profile.json";

export default function Home() {
  const repoProfile = "https://github.com/bakhat123";
  const starRepo = "https://github.com/bakhat123/digital_protfolio";
  const linkedin = "https://www.linkedin.com/in/muhammad-bakhat-nasar-a61ba3379/";
  const email = "mailto:bakhatnasar246@gmail.com";

  return (
    <div className="min-h-screen text-slate-100">
      <nav className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 shadow" />
            <div>
              <div className="text-sm uppercase tracking-widest text-slate-300">Li Wang Zhang Liu Yang Zhao Huang Wu</div>
              <div className="text-xs text-slate-400">AI Portfolio of {profile.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={repoProfile}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/30 bg-slate-500/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-500/20"
              title="GitHub Profile"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 opacity-80 group-hover:opacity-100"><path fill="currentColor" d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.24.49-2.71-1.08-2.71-1.08-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.83 1.22.83.71 1.22 1.86.86 2.31.66.07-.52.28-.86.5-1.06-1.79-.2-3.68-.9-3.68-4a3.1 3.1 0 0 1 .83-2.16 2.86 2.86 0 0 1 .08-2.13s.68-.22 2.23.82A7.7 7.7 0 0 1 8 4.72a7.7 7.7 0 0 1 2.03.27c1.55-1.04 2.23-.82 2.23-.82.45 1.02.17 1.78.08 2.13.52.57.83 1.31.83 2.16 0 3.11-1.89 3.8-3.69 4 .29.25.54.74.54 1.5v2.22c0 .21.15.45.55.38A8 8 0 0 0 8 .2"/></svg>
              <span>GitHub</span>
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-500/10 px-3 py-1.5 text-sm text-sky-200 hover:bg-sky-500/20"
              title="LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 opacity-80 group-hover:opacity-100"><path fill="currentColor" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 11.28h-3v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.6z"/></svg>
              <span>LinkedIn</span>
            </a>
            <a
              href={email}
              className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-sm text-rose-200 hover:bg-rose-500/20"
              title="Email"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 opacity-80 group-hover:opacity-100"><path fill="currentColor" d="M12 13.065 1.5 6h21L12 13.065zM12 15.435 1.5 8.37V18h21V8.37L12 15.435z"/></svg>
              <span>Email</span>
            </a>
            <a
              href={starRepo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-200 hover:bg-amber-500/20"
              title="Star the repo"
            >
              <span className="text-amber-300">★</span>
              <span>Star Repo</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <ChatUI />
      </main>
    </div>
  );
}
