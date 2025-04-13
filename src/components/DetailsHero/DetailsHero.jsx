import './DetailsHero.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const DetailsHero = ({ addToWatchlist, removeFromWatchlist, watchlist }) => {
    const [contentData, setContentData] = useState(null);
    const { contentType, id } = useParams();
    const [isExpanded, setIsExpanded] = useState(false);

    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;

    const fetchContentDetails = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        };

        const url = `https://api.themoviedb.org/3/${contentType}/${id}?language=en-US`

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setContentData(data);
        } catch (error) {
            console.error('error fetching content', error)
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0)

        if (id && contentType) {
            fetchContentDetails()
        }
    }, [id, contentType]);

    if (!contentData) {
        return <div>Loading</div>
    }

    const title = contentType === 'movie' ? contentData.title : contentData.name;
    const releaseDate = contentType === 'movie' ? contentData.release_date : contentData.first_air_date;
    const runtime = contentType === 'movie'
        ? contentData.runtime
        : (contentData.episode_run_time && contentData.episode_run_time[0]) || 'N/A';

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
    }


    const shortDescription = contentData.overview?.length > 120
        ? contentData.overview.slice(0, 120) + '...'
        : contentData.overview

    const shouldShorten = contentData.overview?.length > 120;

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
        <>
            <div className='movie-hero'>
                <div className='hero-container'
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${contentData.backdrop_path})` }}>
                </div>
                <div className='movie-info'>
                    <div className='img-container'>
                        {contentData.poster_path && (
                            <>
                                <div className="add-watchlist" onClick={(e) => handleAddToWatchlist(e, contentData)}>
                                    {isInWatchlist(contentData) ? (
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
                                <img className='poster-img' src={`https://image.tmdb.org/t/p/w1280${contentData.poster_path}`} alt="" />
                                <div className="rating">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    {contentData.vote_average ? contentData.vote_average.toFixed(1) : ''}
                                </div>
                            </>
                        )}
                    </div>
                    <div className='details'>
                        <div className="details-title">{title}</div>
                        <div className='details-title-info'>
                            <p >{releaseDate.split('-')[0]}</p>
                            <span className='spacer'> | </span>
                            <p>{runtime ? `${runtime} min` : 'N/A'}</p>
                        </div>
                        <div className='details-description'>
                            {isExpanded ? contentData.overview : shortDescription}
                            {shouldShorten && !isExpanded && (
                                <button className='read-more' onClick={handleToggle}>
                                    Read More...
                                </button>
                            )}
                            {isExpanded && (
                                <button className='read-more' onClick={handleToggle}>
                                    Show Less
                                </button>
                            )}
                        </div>
                        <div className='watchlist-btn-container'>
                            <button onClick={(e) => handleAddToWatchlist(e, contentData)} className='watchlist-btn'> {isInWatchlist(contentData) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                </svg>
                            )}Add to Watchlist</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsHero