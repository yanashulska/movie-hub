import { Link } from 'react-router-dom'
import './DetailsNavbar.css'
import { useRef, useEffect } from 'react'

const DetailsNavbar = () => {
    const navRef = useRef();

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

    return (
        <>
            <div ref={navRef} className='details-navbar'>
                <div className="details-navbar-left">
                    <Link to={`/`} className='details-navbar-logo'><span>Movie</span>Hub</Link>
                </div>
                <div className="navbar-right">
                    <Link to={`/watchlist`} className='details-watchlist'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg><span className='navbar-icon-text'>Watchlist</span> </Link>
                </div>
            </div >
        </>
    )
}
export default DetailsNavbar