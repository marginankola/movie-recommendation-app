import { useEffect, useState } from "react";

const KEY = "6d422861";

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(
		function () {
			// we should use it always inside useEffect hook to decrease the amount of unnecessary requests for example,
			// if we're looking for an inception movie, each time we provide a single letter, the new request will be sent
			// which slows down the execution. With this line we'll get the request only for the full name which is inception.

			const controller = new AbortController();

			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError("");
					const res = await fetch(
						`https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
						{ signal: controller.signal }
					);

					// it will work whenever the API address is not correct

					if (!res.ok)
						throw new Error("Something went wrong with fetching movies!");

					const data = await res.json();

					// it will appear whenever there is no movie in the API

					if (data.Response === "False") throw new Error("Movie not found!");

					setMovies(data.Search);
					setError("");
				} catch (err) {
					console.error(err.message); // it will appear whenever we lose our internet connection

					if (err.name !== "AbortError") {
						setError(err.message);
					}
				} finally {
					setIsLoading(false); // the Loading... text will disappear even if there is an error
				}
			}

			// when we provide at least 3 characters of the movie name, we will get some results
			// if they exist, but if not there will be not an error notification

			if (query?.length < 3) {
				setMovies([]);
				setError("");
				return;
			}

			// before we fetch movies, we want to close the watched one window

			// handleCloseMovie();
			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return { movies, isLoading, error };
}
