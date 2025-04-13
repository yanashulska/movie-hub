import './Actor.css'
import DetailsNavbar from '../../components/DetailsNavbar/DetailsNavbar'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Modal from '../../components/Modal/Modal'


const Actor = () => {
    const [actorData, setActorData] = useState(null);
    const [movies, setMovies] = useState([]);
    const [credits, setCredits] = useState([]);
    const [filter, setFilter] = useState('all');
    const [totalCredits, setTotalCredits] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
    const [modalContent, setModalContent] = useState(null);

    const [watchlist, setWatchlist] = useState(() => {
        const savedWatchlist = localStorage.getItem('watchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    });
    const removeFromWatchlist = (item) => {
        setWatchlist((prevWatchlist) => {
            const newWatchlist = prevWatchlist.filter((watchlistItem) => watchlistItem.id !== item.id)

            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
            return newWatchlist;
        })
    }

    const addToWatchlist = (item) => {
        setWatchlist((prevWatchlist) => {
            const isAlreadyInWatchlist = prevWatchlist.some((watchlistItem) => watchlistItem.id === item.id);
            let newWatchlist;
            if (isAlreadyInWatchlist) {
                newWatchlist = prevWatchlist.filter((watchlistItem) => watchlistItem.id !== item.id)
            } else {
                newWatchlist = [...prevWatchlist, item];
            }
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
            return newWatchlist;
        })
    }

    useEffect(() => {

        if (watchlist) {
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
        }
    }, [watchlist]);

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

    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;

    const fetchActorDetails = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        };

        const url = `https://api.themoviedb.org/3/person/${id}?language=en-US`

        const moviesUrl = `https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`;

        const tvShowsUrl = `https://api.themoviedb.org/3/person/${id}/tv_credits?language=en-US`;


        try {
            const response = await fetch(url, options);
            const data = await response.json();

            const moviesResponse = await fetch(moviesUrl, options);
            const moviesData = await moviesResponse.json();

            const tvShowsResponse = await fetch(tvShowsUrl, options);
            const tvShowsData = await tvShowsResponse.json();

            setActorData(data);


            const combinedCredits = [
                ...moviesData.cast.map(movie => ({
                    ...movie,
                    media_type: 'movie',
                    release_date: movie.release_date
                })),
                ...tvShowsData.cast.map(tvShow => ({
                    ...tvShow,
                    media_type: 'tv',
                    release_date: tvShow.first_air_date
                }))
            ]

            setCredits(combinedCredits);
            setTotalCredits(combinedCredits.length);


            const newCredits = combinedCredits.sort((a, b) => {
                const dateA = a.release_date || '';
                const dateB = b.release_date || '';
                return new Date(dateB) - new Date(dateA)
            })

            setMovies(newCredits.slice(0, 4))
        } catch (error) {
            console.error('error fetching content', error)
        }
    };


    useEffect(() => {
        fetchActorDetails();
    }, []);

    if (!actorData) {
        return <div>No data</div>
    }

    const handleFilterChange = (type) => {
        setFilter(type)
    }

    const filteredCredits = credits
        .filter((credit) => {
            if (filter === 'movies') {
                return credit.media_type === 'movie';
            }
            if (filter === 'tv') {
                return credit.media_type === 'tv';
            }
            return true;
        })
        .filter(
            (credit, index, self) =>
                index === self.findIndex(
                    (c) => c.id === credit.id && c.media_type === credit.media_type
                )
        );

    const fallbackIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-file-earmark-image-fill" viewBox="0 0 16 16">
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
            <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z" />
        </svg>

    )

    const openModal = (credit) => {
        setModalContent(credit);
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null)
    }

    const getRandomMovieBackdrop = () => {
        const randomIndex = Math.floor(Math.random() * movies.length);
        return movies[randomIndex].backdrop_path;
    }

    const movieBackdrop = getRandomMovieBackdrop();

    const getUniquePhotos = (items) => {
        const seen = new Set();
        return items.filter((item) => {
            if (item.backdrop_path && !seen.has(item.backdrop_path)) {
                seen.add(item.backdrop_path);
                return true;
            }
            return false;
        })
    }

    return (
        <>
            <DetailsNavbar />
            <div className='actor-page'>
                <div className='actor-container' >
                    <div className='hero-container'
                        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movieBackdrop})` }}>
                    </div>

                    <div className="actor">

                        <div className='actor-img'>
                            <img className='actor-hero-img' src={`https://image.tmdb.org/t/p/original${actorData.profile_path}`} alt={actorData.name} />
                        </div>
                        <div className="actor-video-container">
                            <div className="actor-details">
                                <div className="actor-name">
                                    <p className='actor-name-title'>{actorData.name}</p>
                                    <p className='actor-name-items'>{actorData.known_for_department}<span> | </span>
                                        Additional Crew</p>
                                </div>
                            </div >
                        </div>
                    </div>
                </div>

                <div className="actor-movie-container">
                    <div className='page-title'>
                        New
                    </div>
                    <div className='actor-movie-cards-list'>
                        {movies.length
                            > 0 ? (
                            movies.map((movie) => (
                                <Link to={`/${movie.media_type ? 'movie' : 'tv'}/${movie.id}`} key={`new-${movie.id}`} className='actor-movie-card'>
                                    <div className="add-watchlist" onClick={(e) => handleAddToWatchlist(e, movie)}>
                                        {isInWatchlist(movie) ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                                            </svg>
                                        ) : (

                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
                                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                            </svg>
                                        )}

                                    </div>
                                    <div className='actor-img-movie-container'>

                                        {movie.poster_path && movie.poster_path !== "" ? (
                                            <img className='actor-img-movie' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title || movie.name} />) :
                                            (<div className='actor-img-movie-fallback'>{fallbackIcon}</div>)
                                        }

                                    </div>
                                    <div className='actor-details-movie'>
                                        <p className='actor-movie-title'>{movie.title || movie.name}</p>
                                        <div className='actor-movie-rating-category'>
                                            <p className='actor-details-movie-item'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg> {movie.vote_average.toFixed(1) || 'N/A'}</p>

                                            <p className='actor-details-movie-item'></p>
                                        </div>
                                        <div className='actor-details-movie-item'>{movie.character}</div>
                                        <div className="actor-details-movie-item">{movie.release_date?.slice(0, 4)}</div>
                                    </div>


                                </Link>

                            ))
                        ) : (<div>No data available</div>)
                        }
                    </div>



                </div>
            </div >


            <div className="actor-photos-container">
                <div className='page-title'>
                    Photos
                </div>
                <div className='actor-photos'>
                    <div className="actor-photos-row-one">
                        {movies.length > 0 ? (
                            getUniquePhotos(movies).map((photo, index) => (
                                photo.backdrop_path && photo.backdrop_path !== "" ? (
                                    <img key={`photo-${photo.id}-${index}`} className='photo-img' src={`https://image.tmdb.org/t/p/w500${photo.backdrop_path}`} alt={`Actor Photo ${index + 1}`} />
                                ) : (
                                    <></>
                                )

                            ))
                        ) : (
                            <div>No data available</div>
                        )}

                    </div>
                    <div className="actor-photos-row-two">
                        {credits.length > 0 ? (
                            getUniquePhotos(
                                credits.filter((photo) => {
                                    return !movies.some(movie => movie.backdrop_path === photo.backdrop_path);
                                })
                            ).map((photo, index) => (
                                <img
                                    key={`credit-photo-${photo.id}-${index}`}
                                    className='photo-img'
                                    src={`https://image.tmdb.org/t/p/w500${photo.backdrop_path}`}
                                    alt={`Actor Photo ${index + 1}`}
                                />
                            ))
                        ) : (
                            <div>No data available</div>
                        )}


                    </div>
                </div>
            </div>
            <div className='actor-credits-container'>
                <div className='page-title'>
                    All Credits <p className='total-credits'>{totalCredits}</p>
                </div>
                <div className='filter-buttons'>
                    <button onClick={() => handleFilterChange('movies')} className={filter === 'movies' ? 'active-button' : 'filter-button'}>Movies</button>
                    <button onClick={() => handleFilterChange('tv')} className={filter === 'tv' ? 'active-button' : 'filter-button'}>TV Show</button>
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={filter === 'all' ? 'active-button' : 'filter-button'}
                    >
                        All
                    </button>
                </div>
                <div className='actor-credits-list'>
                    {filteredCredits.length > 0 ? (
                        filteredCredits.map((credit) => (
                            <div key={`${credit.media_type}-${credit.id}`} className='actor-credits-card'>
                                <div className='credits-right-container'>
                                    <div className='actor-img-credits-container'>
                                        {credit.poster_path && credit.poster_path !== "" ? (
                                            <img className='actor-credits-img' src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`} alt={credit.title || credit.name} />) :
                                            (<>{fallbackIcon}</>)
                                        }
                                    </div>
                                    <div className='actor-details-movie'>
                                        <p className='actor-movie-title' onClick={() => openModal(credit)}>{credit.title || credit.name}</p>
                                        <div className='actor-movie-rating-category'>
                                            <p className='actor-details-movie-item'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg> {credit.vote_average.toFixed(1) || 'N/A'}</p>

                                            <p className='actor-details-movie-item'></p>
                                        </div>
                                        <div className='actor-details-movie-item'>{credit.character || "N/A"}</div>

                                    </div>
                                </div>

                                <div className='credits-year-container'>
                                    <div className='credits-year'>
                                        <div className="actor-details-movie-item">{credit.release_date.slice(0, 4)
                                            || credit.first_air_date?.slice(0, 4) || 'N/A'
                                        }</div>
                                        <button className='info-btn' onClick={() => openModal(credit)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" className="bi bi-info-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                        </svg></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No data available</div>
                    )}

                </div>
                <Modal isOpen={isModalOpen} closeModal={closeModal} modalContent={modalContent} />
            </div>
        </>
    )
}

export default Actor