import Link from "next/link";
import cs from "@/texts/cs";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: cs.nav.home,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    href: "/faktury",
    label: cs.nav.invoices,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M9 12h7M9 16h7" />
      </svg>
    ),
  },
  {
    href: "/zakaznici",
    label: cs.nav.customers,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.8 3 2.6 3.5 5.2" />
      </svg>
    ),
  },
  {
    href: "/vice",
    label: cs.nav.more,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    ),
  },
];

interface BottomNavProps {
  active: "/" | "/faktury" | "/zakaznici" | "/vice";
}

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav
      aria-label="Hlavní menu"
      className="grid grid-cols-4 border-t border-line bg-paper pb-5"
    >
      {navItems.map((item) => {
        const isActive = item.href === active;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex flex-col items-center gap-0.5 pt-2.5 min-h-[56px] text-caption font-semibold no-underline",
              isActive
                ? "text-signal-strong border-t-[3px] border-signal -mt-px"
                : "text-ink-muted border-t-[3px] border-transparent -mt-px",
            ].join(" ")}
            aria-current={isActive ? "page" : undefined}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
