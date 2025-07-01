"use client";
import { useState, useEffect, useRef } from "react";
import { fetchRandomMoviePoster } from "@/utils/fetchPoster"; 
import Image from "next/image";
import Link from "next/link";
import { contact } from "@/utils/techImage";

type Label = {
  Name: string;
  Confidence: number;
};

const ROUND_TIME = 20;
const MAX_SKIPS = 3;

export default function Home() {
  const [poster, setPoster] = useState<string | null>(null);
  const [yearHint, setYearHint] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [rekognitionHints, setRekognitionHints] = useState<Label[]>([]);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [blurred, setBlurred] = useState(true);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState<number>(10);
  const [status, setStatus] = useState<
    "playing" | "correct" | "wrong" | "gameover" | "showAnswer"
  >("playing");
  const [usedTitles, setUsedTitles] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [skipsLeft, setSkipsLeft] = useState(MAX_SKIPS);
  // const [showPopup, setShowPopup] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopwords = ["the", "a", "an", "and", "of", "in", "on", "at"];
  const blockedLabels = [
    "Poster",
    "Advertisement",
    "Flyer",
    "Brochure",
    "Paper",
    "Text",
    "Document",
    "Label",
    "Graphics",
    "Font",
    "Logo",
    "Banner",
    "Person",
    "People",
    "Face",
    "Head",
    "Clothing",
    "Publication",
    "Nature",
    "Adult",
    "Book",
    "Banned",
    "Male",
    "Female",
    "Man",
    "Woman",
    "Photography",
    "Ban",
  ];

  const cleanText = (text: string) =>
    text
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word && !stopwords.includes(word));

  useEffect(() => {
    if (score <= 0 && status !== "gameover") {
      setStatus("gameover");
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [score, status]);

  useEffect(() => {
    if (status !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return ROUND_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const loadPoster = async () => {
    setStatus("playing");
    setBlurred(true);
    setGuess("");
    setRevealedHints(0);
    setRekognitionHints([]);
    setTimeLeft(ROUND_TIME);

    let movie = null;
    const maxTries = 20;
    let tries = 0;

    while (!movie && tries < maxTries) {
      const candidate = await fetchRandomMoviePoster();
      if (candidate && !usedTitles.includes(candidate.title.toLowerCase())) {
        movie = candidate;
        setUsedTitles((prev) => [...prev, candidate.title.toLowerCase()]);
      }
      tries++;
    }

    if (!movie) {
      alert("Couldn't find a new movie. Please refresh.");
      return;
    }

    setPoster(movie.posterUrl);
    setYearHint(movie.year);
    setTitle(movie.title);

    const imgRes = await fetch(movie.posterUrl);
    const blob = await imgRes.blob();

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];
      const rekogRes = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64String }),
      });
      const rekogData = await rekogRes.json();
      const usefulLabels = (rekogData.labels || [])
        .filter(
          (label: Label) =>
            label.Confidence > 80 && !blockedLabels.includes(label.Name)
        )
        .slice(0, 10);
      setRekognitionHints(usefulLabels);
    };

    reader.readAsDataURL(blob);
  };

  useEffect(() => {
    loadPoster();
  }, []);

  // useEffect(() => {
  //   setShowPopup(true);
  // }, []);

  const handleTimeOut = () => {
    setScore((prev) => Math.max(0, prev - 5));
    setBlurred(false);
    setStatus("showAnswer");
  };

  const handleSubmit = () => {
    if (!title) return;

    const guessWords = cleanText(guess);
    const titleWords = cleanText(title);

    const guessSet = new Set(guessWords);
    const titleSet = new Set(titleWords);

    const isExactMatch =
      guessSet.size === titleSet.size &&
      [...guessSet].every((word) => titleSet.has(word));
    const hasPartialMatch = guessWords.some((word) => titleSet.has(word));

    if (isExactMatch || hasPartialMatch) {
      setScore((prev) => prev + (isExactMatch ? 10 : 5));
      setStatus("correct");
      setBlurred(false);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      setStatus("wrong");
      setBlurred(false);
    }
  };

  const getMoreHint = () => {
    if (revealedHints < rekognitionHints.length) {
      setRevealedHints((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSkip = () => {
    if (skipsLeft <= 0) return;
    setSkipsLeft((prev) => prev - 1);
    handleTimeOut();
  };

  const nextRound = () => {
    setStatus("playing");
    setBlurred(true);
    setGuess("");
    setRevealedHints(0);
    setRekognitionHints([]);
    setTimeLeft(ROUND_TIME);
    loadPoster();
  };

  const restartGame = () => {
    setScore(10);
    setSkipsLeft(MAX_SKIPS);
    setUsedTitles([]);
    setStatus("playing");
    setBlurred(true);
    setGuess("");
    setRevealedHints(0);
    setRekognitionHints([]);
    setTimeLeft(ROUND_TIME);
    loadPoster();
  };

  // Shared classes for buttons when enabled
  const enabledBtnClasses =
    "px-6 py-2 rounded-full transition duration-300 transform hover:scale-105 hover:font-bold";
  
  const getYear = new Date().getFullYear()

  

  return (
    <main className="p-6 max-w-[70%] md:max-w-[50%] bg-[#c8a116] mx-auto text-center space-y-6 font-gabarito min-h-screen my-12 rounded-4xl shadow-[0_0_20px_6px_rgba(255,255,0,0.4)]">
      <h1 className="text-2xl sm:text-4xl lg:text-7xl font-medium text-blue-900 font-monoton">
        Guess the Movie
      </h1>

      <div className="flex justify-evenly w-full">
        <div>
          <p className="md:text-xl text-md text-gray-700 font-bold">Score</p>
          <span className="font-bold text-4xl md:text-5xl">{score}</span>
        </div>
        <div>
          <p className="md:text-xl text-md text-gray-700 font-bold">Time Left</p>
          <span className="font-bold text-4xl md:text-5xl">{timeLeft}s</span>
        </div>
      </div>

      {poster && (
        <div
          className={`relative mx-auto mt-6 w-full max-w-[250px] md:max-w-[400px] transition-all duration-500 ${
            blurred ? "filter blur-sm" : ""
          }`}
        >
          <div className="relative w-full" style={{ paddingTop: "150%" }}>
            <Image
              src={poster}
              alt="Movie poster"
              fill
              className="object-cover rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {yearHint && <p className="mt-4 text-xs md:text-lg">Released Year: {yearHint}</p>}

      {revealedHints > 0 && (
        <div className="mt-4 p-3 rounded max-h-32 overflow-auto text-left">
          {rekognitionHints.slice(0, revealedHints).map((label) => (
            <p key={label.Name}>{label.Name}</p>
          ))}
        </div>
      )}

      {status === "playing" && (
        <>
          <input
            type="text"
            className="border border-gray-300 rounded-full p-2 w-full mt-4 text-center text-lg"
            placeholder="Enter your guess"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />

          <div className="flex flex-col md:flex-row justify-center gap-1.5 sm:gap-4 mt-2 sm:mt-4 flex-wrap">
            <button
              onClick={handleSubmit}
              className={`${enabledBtnClasses} bg-blue-900 text-white hover:bg-blue-700 hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.4)] md:text-2xl px-14`}
            >
              Go
            </button>

            <button
              onClick={handleSkip}
              disabled={skipsLeft <= 0}
              className={`${
                skipsLeft > 0
                  ? `border border-blue-900 text-blue-900 hover:bg-yellow-500 hover:text-white hover:border-none duration-500 hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.4)] md:text-lg ${enabledBtnClasses}`
                  : "border border-blue-900 text-blue-900 hover:bg-yellow-500 hover:text-white hover:border-none duration-500 cursor-not-allowed hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.4)]"
              } rounded-full px-6 py-2 md:text-lg`}
            >
              Skip ({skipsLeft})
            </button>

            <button
              onClick={getMoreHint}
              disabled={revealedHints >= rekognitionHints.length}
              className={`${
                revealedHints < rekognitionHints.length
                  ? `hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.4)] border border-blue-900 text-blue-900 hover:bg-yellow-500 hover:border-none hover:text-white hover:scale-105 md:text-lg duration-500 hover:font-bold ${enabledBtnClasses}`
                  : "hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.4)] border border-blue-900 text-blue-900 hover:bg-yellow-500 hover:border-none hover:text-white hover:font-bold duration-500 cursor-not-allowed hover:scale-105 md:text-lg"
              } rounded-full px-6 py-2`}
            >
              Get Hint
            </button>
          </div>
        </>
      )}

      {(status === "correct" || status === "wrong" || status === "showAnswer") && (
        <>
          <p className="text-sm md:text-xl font-bold mt-4">
            {status === "correct"
              ? "Correct! It's"
              : status === "wrong"
              ? "Oops! It's:"
              : "Time's up! It's:"}
          </p>
          <p className="text-3xl md:text-6xl font-bold mt-2">{title}</p>

          <button
            onClick={nextRound}
            className="mt-6 px-6 py-2 bg-yellow-500 rounded-full font-bold text-blue-900 hover:scale-105 transition duration-300 hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.4)]"
          >
            Next
          </button>
        </>
      )}

      {status === "gameover" && (
        <>
          <p className="text-sm md:text-xl font-bold mt-4">Game Over! It's</p>
          <p className="text-3xl md:text-6xl font-bold mt-2 md:text-6xl">{title}</p>
          <button
            onClick={restartGame}
            className="mt-6 px-6 py-2 bg-red-700 rounded-full font-bold text-white hover:scale-105 transition duration-300 hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.4)] md:text-lg"
          >
            Restart Game
          </button>
        </>
      )}

      <div className="md:mt-12 mt-4">
        <Link href="/about">
         <button className="font-monoton text-2xl sm:text-3xl text-blue-800 hover:scale-105 duration-500">About</button>
        </Link>
      </div>

      {/* FOOTER */}
      <div className='md:mt-8 mt-4'>
        <div className='flex justify-center gap-14'>
          {contact.map(({ name, icon, link }) => (
            <Link key={name} href={link} target="">
              <Image
                src={icon}
                alt={name}
                width={25}
                height={25}
                
              />
            </Link>
          ))}
        </div>
        <div>
          <p className="text-[10px] lg:text-[14px] mt-4">
            © {getYear} Guess the Movie. All rights reserved.
          </p>
        </div>
      </div>

      
      {/* POPUP WINDOW */}
      {/* {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 ">
          <div className="bg-[#c8a116] text-white p-8 rounded-2xl max-w-md text-center sm:space-y-8 sm:space-x-8 shadow-[0_0_20px_6px_rgba(255,255,0,0.3)]">
            <h2 className=" font-monoton text-5xl">Welcome!</h2>
            <p className="text-lg mt-4">Let's see how to get the score.</p>

            <div className="text-2xl  mt-4">
              <p>Start: <span className="font-bold text-4xl">10 </span>scores</p>
            <p>Fully Correct: <span className="font-bold text-4xl">+10</span></p>
              <p>Partially Correct: <span className="font-bold text-4xl">+5</span></p>
              <p>Time's up: <span className="font-bold text-4xl">-5</span></p>
            </div>
            


            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 mt-6 hover:scale-105 duration-500 hover:shadow-[0_0_6px_1px_rgba(255,255,0,0.2)]"
              onClick={() => setShowPopup(false)}
            >
              Start
            </button>
          </div>
        </div>
      )} */}
    </main>
  );
}
