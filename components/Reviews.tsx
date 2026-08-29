import { reviews, reviewsSummary, TRIPADVISOR_URL } from "@/app/lib/reviews-data";
import styles from "@/components/Reviews.module.css";

const AVATAR_COLORS = ["#a98607", "#334155", "#047857", "#92400e"];

function initialsOf(name: string): string {
  const letters = name.replace(/[^a-zA-Z\s]/g, "").trim();
  const initials = letters
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || name[0]?.toUpperCase() || "?";
}

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--brand-gold-dark)" aria-hidden="true">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

function ReviewCard({ review, index }: { review: (typeof reviews)[number]; index: number }) {
  return (
    <div className="flex w-[clamp(260px,75vw,320px)] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start gap-2.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
        >
          {initialsOf(review.name)}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-900">{review.name}</p>
          <div className="mt-0.5 flex items-center gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} />
            ))}
          </div>
        </div>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{review.text}&rdquo;</p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Verified Tripadvisor review</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}

export default function Reviews() {
  const track = [...reviews, ...reviews];

  return (
    <section id="reviews" className="scroll-mt-32 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
              Reviews
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Why people love us.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.round(reviewsSummary.rating) }).map((_, i) => (
                <Star key={i} />
              ))}
              <span className="ml-1 text-sm font-bold text-slate-900">
                {reviewsSummary.rating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">
                · {reviewsSummary.count} reviews
              </span>
            </div>
            <a
              href={TRIPADVISOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400"
            >
              View all reviews on Tripadvisor
            </a>
          </div>
        </div>
      </div>

      <div className={`mx-auto max-w-6xl px-4 ${styles.viewport}`}>
        <div className={styles.track}>
          {track.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
