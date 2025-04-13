import { useEffect, useState } from 'react'
import DetailsNavbar from '../../components/DetailsNavbar/DetailsNavbar';
import './Search.css'
import { Link } from 'react-router-dom';

const Search = () => {
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
        setHistory(savedHistory);
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('history', JSON.stringify(history));
        }
    }, [history]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchInput.trim()) {
                fetchSuggestions(searchInput);
            } else {
                setSuggestions([])
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchInput])

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    const fetchSuggestions = async (query) => {
        setIsSuggestionsLoading(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`
            );
            const data = await response.json();
            const uniqueSuggestions = Array.from(new Set(data.results.map((a) => a.title || a.name))).map((title) =>
                data.results.find((a) => a.title === title || a.name === title))
            setSuggestions(uniqueSuggestions.slice(0, 5) || [])
        } catch (error) {
            console.error('Error fetching the suggestions:', error)
        }
        setIsSuggestionsLoading(false)
    }





    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    }



    const fetchSearchResults = async (query) => {
        if (query.trim()) {
            try {
                const movieResponse = await fetch(
                    `https://api.themoviedb.org/3/search/movie?query=${searchInput}&api_key=${apiKey}`
                );
                const tvResponse = await fetch(
                    `https://api.themoviedb.org/3/search/tv?query=${searchInput}&api_key=${apiKey}`
                );

                const movieData = await movieResponse.json();
                const tvData = await tvResponse.json();

                const combinedResults = [
                    ...movieData.results.map((result) => ({
                        ...result,
                        contentType: 'movie',
                    })),
                    ...tvData.results.map((result) => ({
                        ...result,
                        contentType: 'tv',
                    })),
                ];

                if (combinedResults.length > 0) {
                    setSearchResults(combinedResults);
                    setNoResults(false);
                } else {
                    setSearchResults([]);
                    setNoResults(true);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setNoResults(true);
            }
        }
    }
    const handleSearchSubmit = async () => {

        if (searchInput.trim()) {
            setIsSearched(true);
            setSuggestions([])
            setHistory((prevHistory) => {
                const updatedHistory = [searchInput, ...prevHistory.filter((item) => item !== searchInput)];
                localStorage.setItem('history', JSON.stringify(updatedHistory));
                return updatedHistory.slice(0, 3);
            });
            fetchSearchResults(searchInput);

            setSuggestions([]);

        }
    };

    const handleDeleteHistoryItem = (item) => {
        setHistory((prevHistory) => {
            const updatedHistory = prevHistory.filter((historyItem) => historyItem !== item);
            localStorage.setItem('history', JSON.stringify(updatedHistory));
            if (searchInput === item) {
                setSearchInput('');
            }
            return updatedHistory;
        });
    };

    const handleHistoryClick = (item) => {
        setSearchInput(item);
        setIsSearched(true);


    };


    const handleSuggestionClick = (suggestion) => {
        setSearchInput(suggestion.title || suggestion.name);
        setSuggestions([])
        handleSearchSubmit(suggestion.title || suggestion.name)

        fetchSearchResults(suggestion.title || suggestion.name);
        setIsSearched(true);

    }

    useEffect(() => {
        if (searchInput) {
            fetchSearchResults(searchInput);
        }
    }, [searchInput]);

    const getYearFromDate = (date) => {
        if (!date) return '';
        return date.split('-')[0];
    };


    const MAX_HISTORY_LENGTH = 20;
    const truncateText = (text) => {
        if (text.length > MAX_HISTORY_LENGTH) {
            return text.slice(0, MAX_HISTORY_LENGTH) + '...';
        }
        return text;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) => {
                if (prevIndex < suggestions.length - 1) {
                    return prevIndex + 1;
                }
                return prevIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => {
                if (prevIndex > 0) {
                    return prevIndex - 1;
                }
                return prevIndex;
            })
        } else if (e.key === 'Enter') {
            if (highlightedIndex !== -1) {
                handleSuggestionClick(suggestions[highlightedIndex]);
            } else {
                handleSearchSubmit()
            }


        }
    }

    const handleClearInput = () => {
        setSearchInput('');
        setSearchResults([])
        setIsSearched(false)
    }





    const fallbackIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-file-earmark-image-fill" viewBox="0 0 16 16">
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
            <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z" />
        </svg>

    )



    return (
        <>
            <DetailsNavbar />
            <div className='search'>
                <div className='search-container'>
                    <svg onClick={handleSearchSubmit} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                    <input className='search-input'
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        type="text" placeholder='Write here' />
                    <div onClick={handleClearInput} className='clear-input-icon-container'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                    </div>

                    <div className={`suggestions-container ${searchInput && suggestions.length > 0 && !isSearched
                        ? 'active' : ''}`}>
                        {isSuggestionsLoading ? (
                            <div></div>
                        ) : (
                            searchInput && suggestions.length > 0 && (
                                <ul className='suggestions-list'>
                                    {suggestions.map((suggestion, index) => (
                                        <li key={suggestion.id}
                                            onClick={() => {
                                                handleSuggestionClick(suggestion)
                                            }}
                                            onMouseEnter={() => setHighlightedIndex(index)} className={highlightedIndex === index ? 'highlighted' : ''}>
                                            {suggestion.title || suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                    </div>
                </div>


                <div className='history'>

                    {history.length > 0 ? (
                        history.map((item, index) => (
                            <div
                                className='history-item'
                                key={index}

                            >
                                <svg onClick={() => handleHistoryClick(item)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-clock-history"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                                </svg>
                                <span onClick={() => handleHistoryClick(item)}>
                                    {truncateText(item)}
                                </span>
                                <svg
                                    onClick={() => handleDeleteHistoryItem(item)}
                                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="delete-item" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </div>
                        ))
                    ) : (
                        <div>No search history yet</div>
                    )}
                </div>

                <div className="search-results">
                    {isSearched && noResults ? (
                        <div className='noresults-msg'>No results found for "{searchInput}"</div>
                    ) : (
                        searchResults.length > 0 &&
                        searchResults.map((content) => {
                            return (<Link to={`/${content.contentType === 'movie' ? 'movie' : 'tv'}/${content.id}`} key={content.id} className="result-card">
                                <div className='result-card-img-container'>

                                    {content.poster_path ? (
                                        <img className='result-card-img'
                                            src={`https://image.tmdb.org/t/p/w500${content.poster_path}`}
                                            alt={content.title || content.name}
                                        />
                                    ) : (
                                        <div className='result-card-fallback'>{fallbackIcon}</div>
                                    )}

                                    <div className="search-rating">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                        {content.vote_average ? content.vote_average.toFixed(1) : ''}
                                    </div>
                                </div>
                                <div className='result-card-title'>{content.title || content.name}</div>
                                <div className='result-card-yesr'>{getYearFromDate(content.release_date || content.first_air_date)}</div>
                            </Link>

                            )

                        })
                    )}
                </div>
            </div>
        </>
    )
}

export default Search