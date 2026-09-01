// Real guest reviews, transcribed verbatim from the business's Google profile.
// Keep this list to quotes actually written by reviewers — don't paraphrase or
// invent copy. Only lightly trimmed (trailing initials / stray characters).
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/S.Angelova+Car+Rentals/@34.7453819,32.4254676,17z/data=!4m6!3m5!1s0x14e707cb8ade0f3d:0xcb4fc30a95d62aca!8m2!3d34.7453819!4d32.4280425!16s%2Fg%2F11z9bx1dxz!18m1!1e1";

export const reviewsSummary = {
  rating: 5.0,
  count: 48,
  source: "Google",
  /**
   * Has the owner confirmed `rating` and `count` against the live Google
   * Business Profile?
   *
   * These numbers were transcribed from the listing and have never been
   * checked since, and reviews accumulate over time. Google requires review
   * rich results to reflect genuine, current reviews, and publishing figures
   * we cannot vouch for risks a manual action against the whole site — so
   * components/JsonLd.tsx omits AggregateRating while this is false. The
   * Reviews section still displays the numbers either way.
   *
   * To turn star ratings on in search results: check the profile, correct
   * `rating` and `count` above, and set this to true.
   *
   * Confirmed by the owner against the live profile on 2026-09-01: 5.0 from
   * 48 reviews. Re-check it when the count is noticeably out of date.
   */
  confirmed: true,
};

export type Review = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Mick Edis",
    rating: 5,
    date: "a month ago",
    text: "Best car hire I have ever used, very friendly nice family and business. They changed my car to a bigger one with no problem and even dropped us at the airport when we took the car back. Always helping out.",
  },
  {
    name: "Ken Grinsted",
    rating: 5,
    date: "a month ago",
    text: "Initially went in for a taxi to Aphrodite Hills for golf, Stella advised it would be cheaper to hire a car for the day, so we did. Great advice. We then hired again for two days to see a bit more of Cyprus. Great, friendly service. Recommended!!",
  },
  {
    name: "Dan S",
    rating: 5,
    date: "2 weeks ago",
    text: "Great service! Highly recommend. Stella and her son were super helpful from the start and helped us find a same-day rental at a fair price in peak season. Cars are clean, well maintained and perfect for hopping around the island. Will be back!",
  },
  {
    name: "Marc Lee",
    rating: 5,
    date: "2 weeks ago",
    text: "Brilliant service start to finish, Stella is lovely and sorted me a great car for 4 days at a very reasonable price. She also recommended some great places to go that would have been impossible without a car! Would definitely recommend and not hesitate to use again. Thanks Stella.",
  },
  {
    name: "Jonathan Franke",
    rating: 5,
    date: "a week ago",
    text: "Hired a Suzuki Jimny for a day - Stella was most helpful and accommodating, the vehicle was great and just what we wanted. Very simple process - when I return I shall definitely get a car from here!",
  },
  {
    name: "Andy Stewart",
    rating: 5,
    date: "a week ago",
    text: "Rented a small Mazda for a couple of days, it was a nice clean car and they are a lovely family that run the business. I would definitely go back here next time I'm in Paphos.",
  },
  {
    name: "Hans-Jörg Mönnich",
    rating: 5,
    date: "2 weeks ago",
    text: "Very friendly and polite family company. Everything was great, the car, the price and the service. If you are in the area and if you look for a car, this is the place you should try.",
  },
  {
    name: "Martin Tomlinson",
    rating: 5,
    date: "2 weeks ago",
    text: "Very friendly service and very quick to arrange our rental car. Was in and out in 5 minutes.",
  },
  {
    name: "Ovod Poursanidis",
    rating: 5,
    date: "2 months ago",
    text: "Best car rental service in Paphos, very clean cars and very budget friendly prices!",
  },
];
