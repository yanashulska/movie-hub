import './MovieCards.css'
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";


export const MovieCards = ({ contentType, category, addToWatchlist, removeFromWatchlist, watchlist }) => {
    const [apiData, setApiData] = useState([]);
    const leftButtonRef = useRef();
    const rightButtonRef = useRef();
    const cardsRef = useRef();

    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;

    useEffect(() => {
        const fetchCardsData = async () => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${bearerToken}`
                }
            };

            const url = `https://api.themoviedb.org/3/${contentType}/${category}?language=en-US&page=1`

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                setApiData(data.results)
            } catch (error) {
                console.error('Error fetching movie/TV cards: ', error);
            }
        }
        fetchCardsData();
    }, [contentType, category]);



    const handleScroll = () => {
        const scrollLeft = cardsRef.current.scrollLeft;
        const scrollWidth = cardsRef.current.scrollWidth;
        const clientWidth = cardsRef.current.clientWidth;

        if (scrollLeft > 0) {
            leftButtonRef.current.style.display = 'block';
        } else {
            leftButtonRef.current.style.display = 'none'
        }

        if (scrollLeft < scrollWidth - clientWidth) {
            rightButtonRef.current.style.display = 'block'
        } else {
            rightButtonRef.current.style.display = 'none'
        }
    }

    const scrollLeft = () => {
        cardsRef.current.scrollBy({
            left: -900,
            behavior: "smooth"
        })
    }

    const scrollRight = () => {
        cardsRef.current.scrollBy({
            left: 900,
            behavior: "smooth"
        })
    };

    useEffect(() => {
        const cardList = cardsRef.current;
        cardList.addEventListener('scroll', handleScroll);
        return () => {
            cardList.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const getTitle = (card) => {
        return card.original_title || card.name || 'Untitled'
    };

    const renderTitle = () => {
        if (contentType === 'movie') {
            return category === 'now_playing'
                ? 'Now playing'
                : category === 'top_rated'
                    ? 'Top Rated'
                    : category === 'upcoming'
                        ? 'Upcoming'
                        : 'Popular'
        }
        if (contentType === 'tv') {
            return category === 'airing_today'
                ? 'Airing Today TV Shows'
                : category === 'top_rated'
                    ? 'Top Rated TV Shows'
                    : category === 'on_the_air'
                        ? 'Upcoming TV Shows'
                        : 'Popular TV Shows';
        }

        return 'Popular Content';
    };


    const isInWatchlist = (item) => {
        return watchlist.some((watchlistItem) => watchlistItem.id === item.id);
    };




    const handleAddToWatchlist = (e, item) => {
        e.stopPropagation();

        if (isInWatchlist(item)) {
            removeFromWatchlist(item);
        } else {
            addToWatchlist(item);
        }
    }



    return (
        <div className="home-movie-cards">
            <h2>{renderTitle()}</h2>
            <div className="left-btn">
                <button ref={leftButtonRef} onClick={scrollLeft}
                    style={{ display: 'none' }}>{"<"}</button>
            </div>

            <div ref={cardsRef} className="home-card-list">

                {apiData.map((card, index) => {
                    return (
                        < div className="home-card" key={index}>
                            <div onClick={(e) => handleAddToWatchlist(e, card)} className="add-watchlist">
                                {isInWatchlist(card) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                    </svg>
                                )}

                            </div>
                            <Link to={`/${contentType === 'movie' ? 'movie' : 'tv'}/${card.id}`} className="home-card-img-container">

                                <img className="home-card-img" src={`https://image.tmdb.org/t/p/w1920` + card.backdrop_path} alt="" />
                                <div className="home-card-rating">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    {card.vote_average ? card.vote_average.toFixed(1) : ''}
                                </div>
                            </Link>
                            <p>{getTitle(card)}</p>
                        </div>
                    )
                })}

            </div>
            <div className="right-btn">
                <button ref={rightButtonRef} onClick={scrollRight}>{">"}</button>
            </div>
        </div>
    )
}

export default MovieCards