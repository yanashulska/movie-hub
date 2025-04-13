import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import './SimilarContent.css'

const SimilarContent = ({ addToWatchlist, removeFromWatchlist, watchlist }) => {
    const { id, contentType } = useParams();
    const [similarContent, setSimilarContent] = useState([]);
    const similarRef = useRef()
    const rightButtonRef = useRef()
    const leftButtonRef = useRef()

    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;
    const fetchSimilarContent = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        };
        const url = `https://api.themoviedb.org/3/${contentType}/${id}/similar?language=en-US`;

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const sortedData = data.results.sort((a, b) => {
                const releaseA = a.release_date || a.first_air_date;
                const releaseB = b.release_date || b.first_air_date;

                if (!releaseA || !releaseB) return 0;
                return new Date(releaseB) - new Date(releaseA);
            });
            setSimilarContent(sortedData)
        } catch (error) {
            console.error('Error fetching content', error)
        };
    }

    useEffect(() => {
        if (id && contentType) {
            fetchSimilarContent();
        }
    }, [id, contentType])


    const handleScroll = () => {
        const scrollLeft = similarRef.current.scrollLeft;
        const scrollWidth = similarRef.current.scrollWidth;
        const clientWidth = similarRef.current.clientWidth;

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

    const handleScrollLeft = () => {
        similarRef.current.scrollBy({ left: -800, behavior: 'smooth' })
    }

    const handleScrollRight = () => {
        similarRef.current.scrollBy({ left: 800, behavior: 'smooth' })
    }

    useEffect(() => {
        const similarList = similarRef.current;
        similarList.addEventListener('scroll', handleScroll);
        return () => {
            similarList.removeEventListener('scroll', handleScroll)
        }
    }, [])

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
        <div className='similar-content-container'>
            <div className='page-title'>More Like This</div>
            <div className="similar-content-list-wrapper">
                <div className="similar-scroll-btn-left">
                    <button ref={leftButtonRef} onClick={handleScrollLeft} style={{ display: 'none' }}>{"<"}</button>
                </div>

                <div ref={similarRef} className='similar-content-list'>

                    {similarContent.length === 0 ? (
                        <p>No similar content available</p>
                    ) : (
                        similarContent.map((content) => (
                            <div key={content.id} className="similar-content-card">
                                {content.poster_path ? (
                                    <>
                                        <div className="add-watchlist" onClick={(e) => {
                                            handleAddToWatchlist(e, content)
                                        }}>
                                            {isInWatchlist(content) ? (
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
                                        <Link to={`/${contentType === 'movie' ? 'movie' : 'tv'}/${content.id}`} className="similar-content-img-container">
                                            <img className="similar-content-img" src={`https://image.tmdb.org/t/p/w1280${content.poster_path}`} alt={content.title || content.name} />
                                        </Link>
                                        <div className="similar-rating">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            {content.vote_average ? content.vote_average.toFixed(1) : ''}
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}

                            </div>
                        ))
                    )}
                </div>

                <div className="similar-scroll-btn-right">
                    <button ref={rightButtonRef} onClick={handleScrollRight} >{">"}</button>
                </div>
            </div>
        </div>
    )
}

export default SimilarContent