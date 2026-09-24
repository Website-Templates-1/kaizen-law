"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { practices, primaryNav } from "@/lib/site.config";

function isCurrent(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  // Keyed to the current path so the dropdown auto-closes on navigation
  // (no setState-in-effect needed) — mirrors the `openPath`/`open` pattern.
  const [practicesOpenPath, setPracticesOpenPath] = useState<string | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const open = openPath === pathname;
  const practicesOpen = practicesOpenPath === pathname;

  const close = () => {
    setOpenPath(null);
    setPracticesOpenPath(null);
    setDismissed(true);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    if (!open && !practicesOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, practicesOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The admin panel provides its own chrome (PanelNav) — no marketing header.
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <Link href="/" aria-label="Kaizen Law home" className="shrink-0">
        <Logo className="brand-logo transition-[height] duration-300" />
      </Link>

      <nav
        id="main-nav"
        aria-label="Main navigation"
        className={`desktop-nav${open ? " mobile-open" : ""}`}
      >
        {primaryNav.map((item) => {
          if (item.href !== "/practice") {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div
              key={item.href}
              className={`nav-dropdown${practicesOpen ? " is-open" : ""}${dismissed ? " is-dismissed" : ""}`}
              onMouseLeave={() => setDismissed(false)}
            >
              <Link
                href={item.href}
                className="nav-dropdown-desktop"
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                aria-haspopup="true"
                onClick={close}
              >
                {item.label}
                <i className="nav-caret" aria-hidden />
              </Link>
              <button
                type="button"
                className="nav-dropdown-mobile"
                aria-expanded={practicesOpen}
                aria-controls="practice-menu"
                onClick={() =>
                  setPracticesOpenPath(practicesOpen ? null : pathname)
                }
              >
                {item.label}
                <i className="nav-caret" aria-hidden />
              </button>
              <ul id="practice-menu" className="nav-dropdown-menu">
                <li className="nav-dropdown-all">
                  <Link
                    href="/practice"
                    aria-current={pathname === "/practice" ? "page" : undefined}
                    onClick={close}
                  >
                    All practices
                  </Link>
                </li>
                {practices.map((practice) => {
                  const href = `/practice/${practice.slug}`;
                  return (
                    <li key={practice.slug}>
                      <Link
                        href={href}
                        aria-current={pathname === href ? "page" : undefined}
                        onClick={close}
                      >
                        <span className="nav-dropdown-num">{practice.number}</span>
                        {practice.navLabel}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <button
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => {
          setOpenPath(open ? null : pathname);
          setPracticesOpenPath(null);
        }}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <i />
        <i />
      </button>
    </header>
  );
}
