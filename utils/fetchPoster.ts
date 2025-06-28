import { movieTitles } from "./movieTitles";

export type MovieData = {
  title: string;
  posterUrl: string;
  year: string;
};

export const fetchRandomMoviePoster = async (): Promise<MovieData | null> => {
  const random = movieTitles[Math.floor(Math.random() * movieTitles.length)];
  const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(random)}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`);
  const data = await res.json();

  if (data.Response === "False") return null;

  return {
    title: data.Title,
    posterUrl: data.Poster,
    year: data.Year,
  };
};
