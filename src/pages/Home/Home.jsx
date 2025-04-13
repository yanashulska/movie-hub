import './Home.css'
import HomeNavbar from '../../components/HomeNavbar/HomeNavbar'

import play_icon from '../../assets/play_icon.png'
import MovieCards from '../../components/MovieCards/MovieCards'
import info_icon from '../../assets/info_icon.png'
import Footer from '../../components/Footer/Footer'
import { useEffect, useState } from 'react'
import Modal from '../../components/Modal/Modal'
import { useNavigate } from 'react-router-dom'





const Home = () => {
    const [contentType, setContentType] = useState('movie');
    const [bannerData, setBannerData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [watchlist, setWatchlist] = useState(() => {
        const savedWatchlist = localStorage.getItem('watchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    }
    );
    const navigate = useNavigate()
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




    const bearerToken = import.meta.env.VITE_API_BEARER_TOKEN;
    const fetchRandomContent = async (type) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        };
        const url = `https://api.themoviedb.org/3/trending/${type}/day?language=en-US`;


        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const randomContent = data.results[Math.floor(Math.random() * data.results.length)];
            setBannerData(randomContent)
        } catch (error) {
            console.error('Error fetching content', error)
        };
    }

    useEffect(() => {
        fetchRandomContent(contentType);
    }, [contentType])

    useEffect(() => {

    }, [bannerData]);



    const openModal = () => {
        setModalContent(bannerData);
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null)
    }

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isModalOpen]);



    const handlePlayClick = () => {
        navigate(`/${contentType}/${bannerData.id}`);

        setTimeout(() => {
            const trailersSection = document.getElementById('trailers');

            if (trailersSection) {
                trailersSection.scrollIntoView({ behavior: 'smooth' })
            }
        }, 100)
    }

    const truncateBannerDescription = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text
    }

    return (
        <>

            <div className='movie-banner'>
                <HomeNavbar setContentType={setContentType} />
                {bannerData && (
                    <>

                        <img className='banner-img' src={`https://image.tmdb.org/t/p/w1920${bannerData.backdrop_path || null}`}
                            alt="" />

                        <div className="movie-caption">
                            <p className='home-movie-title'>{bannerData.original_title || bannerData.original_name}</p>
                            <p className='release-date'>{new Date(bannerData.release_date || bannerData.first_air_date).getFullYear()}</p>
                            <p className='description'>{truncateBannerDescription(bannerData.overview, 40)}</p>
                            <div className='btn-container'>
                                <button onClick={handlePlayClick} className='play-btn'> <img className='play-icon' src={play_icon} alt="" />Play</button>
                                <button className='info-btn' onClick={() => openModal()}><img src={info_icon} alt="" />More</button>
                            </div>

                        </div>

                    </>
                )}
                <Modal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    modalContent={modalContent}
                />
            </div>

            <MovieCards contentType={contentType} category={contentType === 'movie' ? 'now_playing' : 'airing_today'}
                watchlist={watchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
            />

            <MovieCards contentType={contentType} category={contentType === 'movie' ? 'upcoming' : 'on_the_air'}
                watchlist={watchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
            />

            <MovieCards contentType={contentType} category={contentType === 'movie' ? 'top_rated' : 'top_rated'}
                watchlist={watchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
            />

            <MovieCards contentType={contentType} category={contentType === 'movie' ? 'popular' : 'popular'}
                watchlist={watchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
            />

            <Footer />

        </>
    )
}

export default Home