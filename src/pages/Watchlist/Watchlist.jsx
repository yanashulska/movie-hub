import './Watchlist.css'
import WatchlistNavbar from '../../components/WatchlistNavbar/WatchlistNavbar'

import MovieRatingSlider from '../../components/Slider/Slider';

import { useEffect, useState, useRef } from 'react';

import { Link } from 'react-router-dom';

const Watchlist = () => {
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const [rating, setRating] = useState(() => {
        const savedRatings = localStorage.getItem('movieRatings');
        return savedRatings ? JSON.parse(savedRatings) : {};
    })

    const [watchlist, setWatchlist] = useState(() => {
        const savedWatchlist = localStorage.getItem('watchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    });

    const [showModal, setShowModal] = useState(false);

    const [currentMovieId, setCurrentMovieId] = useState(null);

    const [activeSection, setActiveSection] = useState('watchlist');

    const [underlineStyle, setUnderlineStyle] = useState({})

    const watchlistRef = useRef(null);
    const collectionsRef = useRef(null);
    const comingSoonRef = useRef(null);


    const [showCollectionModal, setShowCollectionModal] = useState(false);

    const [collectionName, setCollectionName] = useState('');

    const [selectedMovies, setSelectedMovies] = useState([]);

    const [step, setStep] = useState(1);

    const [collections, setCollections] = useState(() => {
        const savedCollections = localStorage.getItem('collections');
        return savedCollections ? JSON.parse(savedCollections) : [];
    });
    ;

    const [activeCollection, setActiveCollection] = useState(null);

    const handleCollectionClick = (collection) => {
        setActiveCollection(collection)
    }

    const closeCollectionView = () => {
        setActiveCollection(null)
    }

    const handleCreateColleciton = () => {
        setShowCollectionModal(true)
    }

    const handleNameSubmit = () => {
        if (collectionName.trim() !== '') {
            setStep(2);
            setError('')
        } else {
            setError('Please enter a name');
        }
    }
    const handleDeleteCollection = (index) => {

        const updateCollections = collections.filter((_, i) => i !== index);

        setCollections(updateCollections);

        localStorage.setItem('collections', JSON.stringify(updateCollections))
    }

    const handleMovieSelect = (movieId) => {
        setSelectedMovies((prev) =>
            prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
        )
    }

    const handleCollectionSubmit = () => {
        const newCollection = {
            name: collectionName,
            movies: selectedMovies.map(movieId => watchlist.find(movie => movie.id === movieId))
        }

        setCollections((prevCollections) => {
            const updatedCollections = [newCollection, ...prevCollections]
            localStorage.setItem('collections', JSON.stringify(updatedCollections));
            return updatedCollections;
        })
        setShowCollectionModal(false)
        setCollectionName('')
        setSelectedMovies([])
        setStep(1)
    }

    const handleNameChange = (e) => {
        setCollectionName(e.target.value)
    }

    useEffect(() => {
        const currentTab = {
            watchlist: watchlistRef.current,
            collections: collectionsRef.current,
            comingSoon: comingSoonRef.current
        }[activeSection];
        if (currentTab) {
            const { offsetLeft, offsetWidth } = currentTab;
            setUnderlineStyle({
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`
            })
        }
    }, [activeSection])



    const handleSectionChange = (section) => {
        setActiveSection(section)
    }

    const handleRatingSubmit = (movieId, rating) => {
        setRating((prevRatings) => {
            const updatedRatings = { ...prevRatings, [movieId]: rating };
            localStorage.setItem('movieRatings', JSON.stringify(updatedRatings));
            return updatedRatings;
        });

    }



    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }, [watchlist]);


    const totalItems = watchlist.length;

    const getWatchlistCount = () => {
        let movieCount = 0;
        let tvCount = 0;


        watchlist.forEach(item => {
            if (item.original_title) {
                movieCount++
            } else if (item.name) {
                tvCount++
            }
        });
        return {
            movieCount,
            tvCount
        }
    }

    const { movieCount, tvCount } = getWatchlistCount()

    const filteredWatchlist = watchlist.filter((item) => {
        if (filter === 'movie') {
            return item.original_title;
        } else if (filter === 'tv') {
            return item.name;
        }
        return true
    })
    const handleFilterChange = (type) => {
        setFilter(type)
    }

    const openRatingModal = (movieId) => {
        setCurrentMovieId(movieId);
        setShowModal(true);
    };

    const closeRatingModal = () => {
        setShowModal(false);
        setCurrentMovieId(null);
    };

    const handleDeleteWatchlistItem = (movieId) => {
        const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId)
        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist))

    }


    const fallbackIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" className="bi bi-file-earmark-image-fill" viewBox="0 0 16 16">
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
            <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z" />
        </svg>

    )

    return (
        <div>
            <WatchlistNavbar />
            <div className='watchlist-title'>
                <span style={{ color: 'gray' }}>My</span>Watchlist
            </div>
            <div className='watchlist-options'>
                <div ref={watchlistRef}
                    className='watchlist-options-item'
                    onClick={() => handleSectionChange('watchlist')}>Watchlist</div>
                <div ref={collectionsRef}
                    className='watchlist-options-item'
                    onClick={() => handleSectionChange('collections')}>Collections</div>

                <div className="underline" style={underlineStyle}></div>
            </div>

            {activeSection === 'watchlist' && <div>
                <div className='watchlist-container'>
                    {activeSection === 'watchlist' && <div></div>}
                    <div className='watchlist-items-count'>
                        <button className={filter === 'all' ? 'active-button' : 'filter-button'} onClick={() => handleFilterChange('all')}>All <div className='watchlist-item-count'>{totalItems}</div></button>
                        <button className={filter === 'movie' ? 'active-button' : 'filter-button'} onClick={() => handleFilterChange('movie')}>Movies <div className='watchlist-item-count'>{movieCount}</div></button>
                        <button className={filter === 'tv' ? 'active-button' : 'filter-button'} onClick={() => handleFilterChange('tv')}>TV Shows<div className='watchlist-item-count'> {tvCount}</div></button>
                    </div>
                    <div className='watchlist-cards-container'>
                        {filteredWatchlist.map((item, index) => (
                            <div className='watchlist-card' key={index}>
                                <button onClick={() => handleDeleteWatchlistItem(item.id)} className='watchlist-delete-btn'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </button>

                                <div className='watchlist-card-img-container'>
                                    <Link to={`/${item.media_type || (item.original_title ? 'movie' : 'tv')}/${item.id}`} className='watchlist-img-container'>
                                        {item.poster_path ? (
                                            <img className='watchlist-card-img' src={`https://image.tmdb.org/t/p/w1280${item.poster_path}`} alt={item.title || item.name} />
                                        ) : (
                                            <div className='watchlist-fallback'>{fallbackIcon}</div>
                                        )}

                                    </Link>
                                    <div className='watchlist-card-title'>{item.title || item.name}</div>
                                </div>

                                <div className='watchlist-rating'>
                                    <button className='watchlist-rating-btn' onClick={() => openRatingModal(item.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>{rating[item.id] && <div>{rating[item.id]} / 10</div>}</button>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {showModal && (
                    <MovieRatingSlider
                        watchlist={watchlist}
                        movieId={currentMovieId}
                        onSubmitRating={handleRatingSubmit}
                        onClose={closeRatingModal}
                    />
                )}
            </div>}
            {activeSection === 'collections' && <div>
                <div className='collection-container'>
                    <button className='collection-btn' onClick={handleCreateColleciton}>+ Create collection</button>
                    {showCollectionModal && (
                        <div className='modal-collection'>
                            <div className='modal-collection-container'>
                                {step === 1 && (
                                    <div>
                                        <div>
                                            <div className='input-container-title'>Name</div>
                                            <input
                                                type="text"
                                                value={collectionName}
                                                onChange={handleNameChange}
                                                placeholder="Enter collection name"
                                                className={error ? 'input-error' : ''}
                                            />
                                            {error && <p className='error-message'>{error}</p>}
                                        </div>
                                        <div className='collection-list-buttons-container'>
                                            <button className='collection-btn' onClick={handleNameSubmit}>Next</button>
                                            <button className='collection-cancel-btn' onClick={() => setShowCollectionModal(false)}>Cancel</button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div>
                                        <div className='collection-movie-list-title'>Select movies</div>
                                        <div className='movie-list'>

                                            {watchlist.map((movie) => (
                                                <div key={movie.id}>
                                                    <input
                                                        type="checkbox"
                                                        id={`movie-${movie.id}`}
                                                        checked={selectedMovies.includes(movie.id)}
                                                        onChange={() => handleMovieSelect(movie.id)}
                                                        className='movie-checkbox'
                                                    />
                                                    <label htmlFor={`movie-${movie.id}`} className='movie-label'>
                                                        <div className="movie-image-container">
                                                            {movie.poster_path ? (
                                                                <img
                                                                    src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
                                                                    alt={movie.title || movie.name}
                                                                    className="movie-image"
                                                                />
                                                            ) : (
                                                                <div className='movie-list-modal-fallback-container'>
                                                                    <div className='movie-list-modal-fallback'>{fallbackIcon}</div>
                                                                    <div>{movie.title}</div>
                                                                </div>
                                                            )}

                                                            <div className={`circle ${selectedMovies.includes(movie.id) ? 'selected' : ''}`} />
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}

                                        </div>
                                        <div className='collection-movie-list-buttons-container'>
                                            <button className='collection-btn' onClick={handleCollectionSubmit}>
                                                {selectedMovies.length > 0 ? `Add movies(${selectedMovies.length})` : `Add movies()`}
                                            </button>
                                            <button className='collection-cancel-btn' onClick={() => setShowCollectionModal(false)}>Cancel</button>
                                        </div>
                                    </div>

                                )}
                            </div>

                        </div>
                    )}

                    {!activeCollection && (<div className='collections-container'>
                        {collections.length > 0 && (
                            <div className='collections-list'>
                                {collections.map((collection, index) => (
                                    <div className='collection-card-container' key={collection.id}>
                                        <div
                                            className="collection-card"
                                            onClick={() => handleCollectionClick(collection)}
                                        >
                                            <div >
                                                <div className='collection-card-info' >
                                                    <div className="collection-name">{collection.name}</div>
                                                    <div className="collection-movie-count">
                                                        {collection.movies.length} movies
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='collection-delete-btn' onClick={() => handleDeleteCollection(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    )}

                    {activeCollection && (

                        <div className="active-collection">

                            <div className='active-collection-title' onClick={closeCollectionView}> <div className='close-collection-btn-container'>
                                <div>
                                    <div><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                                    </svg></div></div>
                            </div>
                                <div className='active-collection-title-item'>{activeCollection.name}</div>
                            </div>
                            <div className="active-collection-movies">
                                {activeCollection.movies.map((movie, index) => (
                                    <Link className='active-collection-movies-container' to={`/${movie.media_type || (movie.original_title ? 'movie' : 'tv')}/${movie.id}`} key={index}>
                                        {movie.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
                                                alt={movie.title}

                                            />
                                        ) : (
                                            <div className='active-collection-fallback-container'>
                                                <div className='active-collection-fallback'>{fallbackIcon}</div>
                                                <div className='active-collection-fallback-title'>{movie.title}</div>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>

                        </div>
                    )}
                </div>
            </div>}
            {activeSection === 'comingSoon' && <div>Showing Coming Soon</div>}
        </div>
    )
}

export default Watchlist 