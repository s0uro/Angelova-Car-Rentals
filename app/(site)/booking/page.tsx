import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Book a Car or Taxi</h1>
      <p className="mt-2 text-slate-600">
        Fill out the form below and we&apos;ll confirm your reservation by
        phone or email.
      </p>
      <div className="mt-10">
        <BookingForm />
      </div>
    </div>
  );
}
