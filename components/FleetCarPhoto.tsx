import Image from "next/image";

export default function FleetCarPhoto({
  images,
  name,
  className = "",
  sizes,
  priority = false,
}: {
  images: string[];
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = images[0];

  if (!src) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-slate-100 ${className}`}
      >
        <div className="px-4 text-center">
          <svg
            className="mx-auto h-8 w-8 text-slate-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13M4 13h16v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="7.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="16.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Photo coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      priority={priority}
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
      className={`object-cover ${className}`}
    />
  );
}
