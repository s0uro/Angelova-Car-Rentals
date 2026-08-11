import { siteConfig } from "@/app/lib/site-config";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Have a question about a rental or ride? Get in touch — or head
        straight to the{" "}
        <a href="/booking" className="font-medium text-slate-900 underline">
          booking page
        </a>
        .
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div className="space-y-4 text-slate-700">
          <div>
            <p className="text-sm font-semibold text-slate-900">Phone</p>
            <p>{siteConfig.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Email</p>
            <p>{siteConfig.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Address</p>
            <p>{siteConfig.address}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Hours</p>
            <p>{siteConfig.hours}</p>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">
          Map placeholder
        </div>
      </div>
    </div>
  );
}
