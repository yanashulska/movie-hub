import './MovieDetails.css'
import '../../components/DetailsHero/DetailsHero'
import DetailsHero from '../../components/DetailsHero/DetailsHero'
import MovieTrailer from '../../components/MovieTrailer/MovieTrailer'
import MoreDetails from '../../components/MoreDetails/MoreDetails'
import CastCards from '../../components/CastCards/CastCards'
import SimilarContent from '../../components/SimilarContent/SimilarContent'
import DetailsNavbar from '../../components/DetailsNavbar/DetailsNavbar'
import { useEffect, useState } from 'react'
const MovieDetails = () => {

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

            let newWatchlist

            if (isAlreadyInWatchlist) {

                newWatchlist = prevWatchlist.filter((watchlistItem) => watchlistItem.id !== item.id)
            } else {
                newWatchlist = [item, ...prevWatchlist];
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
    return (
        <>
            <DetailsNavbar />
            <div className='movie-details'>
                <DetailsHero
                    watchlist={watchlist}
                    addToWatchlist={addToWatchlist}
                    removeFromWatchlist={removeFromWatchlist}
                />
                <div className='movie-details-main'>
                    <MovieTrailer />
                    <MoreDetails />
                    <CastCards />
                    <SimilarContent
                        watchlist={watchlist}
                        addToWatchlist={addToWatchlist}
                        removeFromWatchlist={removeFromWatchlist}
                    />
                </div>

            </div>
        </>
    )
}

export default MovieDetails