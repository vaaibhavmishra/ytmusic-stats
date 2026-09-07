"use client";

import { Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DonationModal } from "@/components/DonationModal";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth/client";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavItems,
} from "./ui/resizable-navbar";

/**
 * Navigation Component
 *
 * Responsive navigation bar that adapts to both desktop and mobile viewports.
 * Displays different navigation items based on user authentication status:
 * - Authenticated: Dashboard, Upload, and Sign Out options
 * - Unauthenticated: Features, How It Works, Login, and Get Started options
 */
export function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  // Hide navigation on /wrapped page
  if (pathname === "/wrapped") {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "How It Works",
      link: "#how-it-works",
    },
  ];

  return (
    <>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          {isAuthenticated && !isLoading ? (
            <>
              <NavItems
                items={[
                  { name: "Dashboard", link: "/dashboard" },
                  { name: "Wrapped", link: "/wrapped" },
                  { name: "Upload", link: "/upload" },
                ]}
              >
                <button
                  type="button"
                  onClick={() => setIsDonationOpen(true)}
                  className="group relative ml-2 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.12)] backdrop-blur-md transition-all duration-300 hover:border-rose-500/60 hover:bg-rose-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"
                  title="Support YTMusic Stats"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 transition-transform duration-300 group-hover:scale-125" />
                  <span>Sponsor</span>
                </button>
              </NavItems>
              <div className="relative z-20 flex items-center gap-3">
                <NavbarButton variant="primary" onClick={handleSignOut}>
                  <div className="flex items-center justify-center gap-2">
                    <LogOut />
                    SignOut
                  </div>
                </NavbarButton>
              </div>
            </>
          ) : (
            <>
              <NavItems items={navItems}>
                <button
                  type="button"
                  onClick={() => setIsDonationOpen(true)}
                  className="group relative ml-2 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.12)] backdrop-blur-md transition-all duration-300 hover:border-rose-500/60 hover:bg-rose-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"
                  title="Support YTMusic Stats"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 transition-transform duration-300 group-hover:scale-125" />
                  <span>Sponsor</span>
                </button>
              </NavItems>
              <div className="relative z-20 flex items-center gap-3">
                <NavbarButton variant="secondary" as={Link} href="/auth/signin">
                  Login
                </NavbarButton>
                <NavbarButton variant="primary" as={Link} href="/auth/signup">
                  Get Started
                </NavbarButton>
              </div>
            </>
          )}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {isAuthenticated && !isLoading ? (
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  as={Link}
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Dashboard
                </NavbarButton>
                <NavbarButton
                  as={Link}
                  href="/wrapped"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Wrapped
                </NavbarButton>
                <NavbarButton
                  as={Link}
                  href="/upload"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Upload
                </NavbarButton>
                <NavbarButton
                  variant="secondary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDonationOpen(true);
                  }}
                  className="w-full text-rose-400 hover:text-rose-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                    Support / Donate
                  </div>
                </NavbarButton>
                <NavbarButton
                  variant="primary"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  <div className="flex items-center justify-center gap-2">
                    <LogOut />
                    SignOut
                  </div>
                </NavbarButton>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.link}
                    href={item.link}
                    {...(item.link.startsWith("http") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative text-neutral-600 dark:text-neutral-300 py-2"
                  >
                    <span className="block">{item.name}</span>
                  </a>
                ))}
                <NavbarButton
                  variant="secondary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDonationOpen(true);
                  }}
                  className="w-full text-rose-400 hover:text-rose-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                    Support / Donate
                  </div>
                </NavbarButton>
                <NavbarButton
                  as={Link}
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  as={Link}
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Get Started
                </NavbarButton>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
}
