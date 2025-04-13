import { useParams } from 'react-router-dom';
import './MovieTrailer.css'
import { useState, useEffect } from 'react';


const MovieTrailer = () => {
    const [trailer, setTrailer] = useState([]);
    const { id, contentType } = useParams();

    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;

    const fetchTrailers = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        };
        const url = `https://api.themoviedb.org/3/${contentType}/${id}/videos?language=en-US`;

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setTrailer(data.results)
        } catch (error) {
            console.error('Error fetching content', error)
        };
    }

    useEffect(() => {
        if (id && contentType) {
            fetchTrailers();
        }
    }, [id, contentType])

    const renderTrailerOne = () => {
        if (trailer.length === 0) {
            return <p>No videos available</p>
        }
        return trailer.slice(0, 1).map((trailer) => {
            if (trailer.site === 'YouTube') {
                return (
                    <iframe
                        key={trailer.id}
                        className="video-player"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        frameBorder="0"
                        allowFullScreen
                        title={trailer.name}
                    ></iframe>
                )
            }
            return null;
        })
    }

    const renderTrailerTwo = () => {
        if (trailer.length === 0) {
            return <p>No videos available</p>
        }
        return trailer.slice(1, 2).map((trailer) => {
            if (trailer.site === 'YouTube') {
                return (
                    <iframe
                        key={trailer.id}
                        className="video-player"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        frameBorder="0"
                        allowFullScreen
                        title={trailer.name}
                    ></iframe>
                )
            }
            return null;
        })
    }

    return (
        <div className='video-container' id='trailers'>
            <div className='page-title'>
                Videos</div>
            <div className='video-player-container'>
                <div>{renderTrailerOne()}</div>
                <div>{renderTrailerTwo()}</div>
            </div>
        </div>
    )
}

export default MovieTrailer