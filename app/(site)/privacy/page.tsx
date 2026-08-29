import { siteConfig } from "@/app/lib/site-config";

export const metadata = {
  title: "Privacy",
  description: "How Angelova Car Rentals handles the details you give us when you book.",
};

// TODO (owner): have this checked against your GDPR obligations before launch —
// retention period and any third parties you share data with (see FOLLOWUP.md).
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Privacy</h1>
      <div className="mt-6 space-y-4 text-slate-700">
        <p>
          When you send a booking request we store your name, age, phone number, email
          (if you give one), the dates and locations of your trip, and any notes you add.
          We use them for one thing: to arrange and confirm your booking.
        </p>
        <p>
          We do not sell your details or share them for marketing. Our website is hosted
          by Vercel and the booking data is stored in a Supabase database, both inside the
          EU. If you agree to it in the cookie notice, anonymous, aggregated visit
          statistics are collected by Vercel Analytics — no tracking cookies, no personal
          profile. Choose &ldquo;I do not agree&rdquo; and nothing is loaded. You can
          change your mind any time by clearing this site&rsquo;s data in your browser.
        </p>
        <p>
          You can ask us to see, correct or delete the details we hold about you at any
          time. Write to{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-brand-text underline">
            {siteConfig.email}
          </a>{" "}
          or call {siteConfig.phone}.
        </p>
        <p className="text-sm text-slate-500">
          {siteConfig.name}, {siteConfig.address}.
        </p>
      </div>
    </div>
  );
}
