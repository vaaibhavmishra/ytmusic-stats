"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import { CreditCard, ExternalLink, Heart, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DONATION_CONFIG } from "@/lib/config/donations";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl text-card-foreground z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <Heart className="h-5 w-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Support YTMusic Stats</h3>
                <p className="text-xs text-muted-foreground">
                  Free, privacy-focused, and open-source
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              YTMusic Stats is independently maintained. Your support helps
              cover server costs, API usage, and keep the application ad-free!
            </p>

            {/* Options List */}
            <div className="space-y-4">
              {/* Dodo Payments Option (Primary) */}
              {DONATION_CONFIG.dodoPayments && (
                <div className="rounded-xl border border-border/80 bg-muted/40 p-4 transition-all shadow-xs hover:border-primary/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            Dodo Payments
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none"
                          >
                            UPI in India
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none"
                          >
                            Cards & Apple Pay
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Seamless checkout supporting Google Pay, PhonePe,
                          Paytm (UPI), Apple Pay, and Cards worldwide.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full gap-2"
                      size="sm"
                    >
                      <a
                        href={DONATION_CONFIG.dodoPayments}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CreditCard className="h-4 w-4 text-blue-400" />
                        Donate via Dodo Payments
                        <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* GitHub Sponsors Option */}
              {DONATION_CONFIG.githubSponsors && (
                <div className="rounded-xl border border-border/80 bg-muted/40 p-4 transition-all hover:border-primary/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/10 text-foreground">
                        <IconBrandGithub className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            GitHub Sponsors
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-1.5 border-none"
                          >
                            0% Fees
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          One-time or monthly sponsorship directly through
                          GitHub
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full gap-2"
                      size="sm"
                    >
                      <a
                        href={DONATION_CONFIG.githubSponsors}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Heart className="h-4 w-4 text-pink-500" />
                        Sponsor on GitHub
                        <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Thank you for supporting open-source software! 🎶
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
