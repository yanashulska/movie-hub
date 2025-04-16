import './HomeNavbar.css'
import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../firebase'
import { useNavigate } from 'react-router-dom'

const HomeNavbar = ({ setContentType }) => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const navRef = useRef();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login')
        } catch (error) {
            console.error('Error signing out: ', error.message)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                if (window.scrollY >= 80) {
                    navRef.current.classList.add('details-nav-dark');
                } else {
                    navRef.current.classList.remove('details-nav-dark');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])


    const toggleNavbar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <div ref={navRef} className='home-navbar'>
                <div className="home-navbar-left">
                    <p className='home-navbar-logo'><span>Movie</span>Hub</p>
                    <span className='home-nav-btn' onClick={() => setContentType("movie")}>Movie</span>
                    <span className='home-nav-btn' onClick={() => {
                        setContentType("tv")
                    }}>TV Show</span>
                </div>
                <div className="home-navbar-right">
                    <Link to={`/search`} className='home-search-btn'>
                        <div className='home-search-icon' >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                            </svg>
                        </div>
                    </Link>

                    <div className='home-sign-out'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                        </svg>
                        {user ? (
                            <span onClick={handleSignOut} className='home-icon-text'>Sign Out</span>
                        ) : (
                            <span onClick={() => navigate('/login')} className='home-icon-text'>Sign In</span>
                        )}
                    </div>

                    <Link to={`/watchlist`} className='home-watchlist'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg><span className='home-icon-text'>Watchlist</span></Link>

                    <div>
                        <button onClick={toggleNavbar} className="toggle-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </button>

                        <div className={`side-navbar ${isOpen ? 'open' : ''}`}>
                            {isOpen && (
                                <button className="close-nav-btn" onClick={toggleNavbar}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </button>
                            )}
                            <ul>
                                <li><div className='side-nav-item' onClick={() => { setContentType('movie'); toggleNavbar() }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
                                    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
                                </svg>Movie</div></li>
                                <li><div className='side-nav-item' onClick={() => { setContentType('tv'); toggleNavbar() }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-play" viewBox="0 0 16 16">
                                    <path d="M6 6.883v4.234a.5.5 0 0 0 .757.429l3.528-2.117a.5.5 0 0 0 0-.858L6.757 6.454a.5.5 0 0 0-.757.43z" />
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                                </svg>TV Show</div></li>
                                <li><Link to={`/watchlist`} onClick={() => { toggleNavbar() }}
                                    className='side-nav-item' ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="toggle-bi bi-bookmark-heart" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                    </svg>Watchlist</Link> </li>
                                <li><div to={`/login`} className='side-nav-item' onClick={() => { handleSignOut(); toggleNavbar() }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                </svg>Sign Out</div></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default HomeNavbar