import { fleet, taxiServices, pricingNotes } from "@/app/lib/placeholder-data";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Pricing</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        An overview of our car rental and taxi rates.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Car rentals</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price / day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fleet.map((car) => (
                <tr key={car.id}>
                  <td className="px-4 py-3 text-slate-900">{car.name}</td>
                  <td className="px-4 py-3 text-slate-600">{car.category}</td>
                  <td className="px-4 py-3 font-medium text-brand-dark">
                    €{car.pricePerDay}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Taxi rates</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {taxiServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3 text-slate-900">{service.name}</td>
                  <td className="px-4 py-3 font-medium text-brand-dark">
                    {service.priceNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ul className="mt-10 list-disc space-y-2 pl-5 text-sm text-slate-600">
        {pricingNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
