import './CastCards.css'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'



const CastCards = () => {
    const { id, contentType } = useParams();
    const [castData, setCastData] = useState([]);
    const castRef = useRef(null);
    const leftButtonRef = useRef(null);
    const rightButtonRef = useRef(null);
    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;
    const fetchCastData = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        };

        const url = `https://api.themoviedb.org/3/${contentType}/${id}/credits?language=en-US`;

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setCastData(data.cast || [])
        } catch (error) {
            console.error('Error fetching content', error)
        };
    }

    useEffect(() => {
        if (id && contentType) {
            fetchCastData();
        } else {
            console.log('Missing id or contentType')
        }
    }, [id, contentType])

    const handleScroll = () => {
        const scrollLeft = castRef.current.scrollLeft;
        const scrollWidth = castRef.current.scrollWidth;
        const clientWidth = castRef.current.clientWidth;

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
        castRef.current.scrollBy({ left: -600, behavior: 'smooth' })
    }

    const scrollRight = () => {
        castRef.current.scrollBy({ left: 600, behavior: 'smooth' })
    };

    useEffect(() => {
        const castList = castRef.current;
        if (castList) {

            handleScroll();

            castList.addEventListener('scroll', handleScroll);

            return () => {
                castList.removeEventListener('scroll', handleScroll);
            }
        } else {
            console.error("error")
        }

    }, [castData])

    const fallbackIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg>
    )

    return (
        <div className="cast-list-container">
            <div className="page-title">Cast</div>
            <div className='cast-list-wrapper'>
                <div className='cast-scroll-btn-left'>
                    <button ref={leftButtonRef} onClick={scrollLeft} style={{ display: 'none' }}>{"<"}</button>
                </div>
                <div className='cast-list' ref={castRef}>
                    {castData.length === 0 ? (
                        <p>No cast available</p>
                    ) : (
                        castData.map((actor) => {
                            return (
                                <Link to={`/cast/${actor.id}`} key={actor.id} className='cast-card'>
                                    {actor.profile_path ? (
                                        <img className='cast-img'
                                            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
                                    ) : (
                                        <div className='fallback-container'>
                                            <div>{fallbackIcon}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <p className='cast-name'>{actor.name}</p>
                                        <p className='character-name'>{actor.character}</p>
                                    </div>
                                </Link>
                            )
                        })
                    )}
                </div>
                <div className='cast-scroll-btn-right'>
                    <button ref={rightButtonRef} onClick={scrollRight}>{">"}</button>
                </div>
            </div>
        </div>
    )
}

export default CastCards 