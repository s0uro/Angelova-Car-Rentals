// Real guest reviews, sourced verbatim from Tripadvisor. Keep this list to
// quotes actually written by reviewers — don't paraphrase or invent copy.
export const TRIPADVISOR_URL =
  "https://www.tripadvisor.co.uk/ShowUserReviews-g190384-d24972933-r1074132110-Stela_Angelova-Paphos_Paphos_District.html";

export const reviewsSummary = {
  rating: 5.0,
  count: 6,
  source: "Tripadvisor",
};

export type Review = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Sara L",
    rating: 5,
    date: "2 weeks ago",
    text: "Stella was incredibly helpful and flexible, very easy to arrange and the car was in great condition.",
  },
  {
    name: "Kristian G",
    rating: 5,
    date: "1 week ago",
    text: "We honestly couldn't fault the car hire company. The service from start to finish was absolutely five-star — friendly, helpful…",
  },
  {
    name: "Ivo K",
    rating: 5,
    date: "4 weeks ago",
    text: "Super friendly stuff! Very good choice of cars, clean and maintained! With any problems - we got physically help in 10 minutes!!! We their customers 6 years in a row, with minimum 1 and up to 3 months with flexible pricing plans! RECOMMENDED!!!",
  },
  {
    name: "63David",
    rating: 5,
    date: "3 October 2024",
    text: "Brilliant service from Stela, car delivered to hotel on time and collected. Car was a Honda Fit which was lovely, everything explained well, no issues and great customer service. Thank you.",
  },
];
