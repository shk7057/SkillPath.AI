import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Login", href: "/login" }
];

export function Navbar() {
  return (
    <header className="page-wrap pt-4">
      <div className="page-max surface-section px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-2xl text-slate-900">
              SkillPath.AI
            </Link>
            <Link href="/signup" className="btn-ghost lg:hidden">
              Start Free
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-8">
              <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center gap-3 lg:flex">
              <Link href="/signup" className="btn-secondary rounded-full px-5 py-2.5">
                Start Free
              </Link>
              <Link href="/dashboard" className="btn-primary rounded-full px-5 py-2.5">
                Try Demo
              </Link>
              </div>
            </div>
          </div>
      </div>
    </header>
  );
}
