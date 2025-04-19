import { useState, useEffect } from 'react'
import './Slider.css'

const MovieRatingSlider = ({ movieId, onSubmitRating, onClose, watchlist }) => {
    const [rating, setRating] = useState(0);
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        if (movieId && watchlist.length > 0) {
            const selectedMovie = watchlist.find((item) => item.id === movieId);
            setMovie(selectedMovie);

            const savedRatings = JSON.parse(localStorage.getItem("movieRatings")) || {};
            if (savedRatings[movieId]) {
                setRating(savedRatings[movieId])
            } else {
                setRating(0)
            }
        }

    }, [movieId, watchlist]);


    const handleSliderChange = (e) => {
        setRating(parseFloat(e.target.value));
    }

    const handleSubmit = () => {
        if (onSubmitRating) {
            onSubmitRating(movieId, rating)
        }
        onClose()
    }

    return (
        <>
            <div className='movie-rating-slider-modal'>
                <div className='movie-rating-slider'>
                    <div className='slider-header'>
                        <div className="slider-img-container">
                            {movie.poster_path && movie.poster_path !== "" ? (
                                <img className='slider-img' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title || movie.name} />
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <div className='slider-modal-content-details-container'>
                            <div className='slider-modal-content-details'>
                                <div className='slider-modal-title'>{movie.title || movie.name}</div>
                            </div>
                            <div>
                                <div>Rate movie</div>
                                <span className="close-button" onClick={onClose}>&times;</span>
                                <div className="star-rating-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                </div>
                                <input type="range" min={1} max={10} step={0.5} value={rating} onChange={handleSliderChange} className='slider' />
                                <div className='rating-display'>
                                    <span>{rating}</span>
                                </div>
                                <button onClick={handleSubmit} className='submit-rating-btn'>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieRatingSlider

