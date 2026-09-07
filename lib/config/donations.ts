/**
 * Centralized Donation & Sponsorship Configuration
 *
 * Uses Dodo Payments as the unified payment gateway (UPI, Cards, Apple Pay, Google Pay)
 * along with GitHub Sponsors for open-source backers.
 */

export interface DonationOption {
  id: "dodo" | "github";
  name: string;
  description: string;
  url: string;
  badge?: string;
}

export const DONATION_CONFIG = {
  // Dodo Payments checkout link (supports UPI in India & Cards/Apple Pay globally)
  dodoPayments:
    process.env.NEXT_PUBLIC_DODO_PAYMENTS_URL ||
    "https://checkout.dodopayments.com",
  // GitHub Sponsors profile
  githubSponsors:
    process.env.NEXT_PUBLIC_GITHUB_SPONSORS_URL ||
    "https://github.com/sponsors/vaaibhavmishra",
};

/**
 * Returns available donation options based on configuration.
 */
export function getDonationOptions(): DonationOption[] {
  const options: DonationOption[] = [];

  // Dodo Payments (Primary for UPI, Cards, Apple Pay, Google Pay)
  if (DONATION_CONFIG.dodoPayments) {
    options.push({
      id: "dodo",
      name: "Dodo Payments",
      description:
        "Support via UPI (Google Pay, PhonePe, Paytm), Apple Pay, or Credit/Debit Cards worldwide",
      url: DONATION_CONFIG.dodoPayments,
      badge: "UPI & Cards",
    });
  }

  // GitHub Sponsors
  if (DONATION_CONFIG.githubSponsors) {
    options.push({
      id: "github",
      name: "GitHub Sponsors",
      description:
        "Sponsor via one-time or monthly contribution with 0% platform fees",
      url: DONATION_CONFIG.githubSponsors,
      badge: "GitHub",
    });
  }

  return options;
}

/**
 * Primary donation URL for direct single-click support links
 */
export const PRIMARY_DONATION_URL =
  DONATION_CONFIG.dodoPayments || DONATION_CONFIG.githubSponsors;
