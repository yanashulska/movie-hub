import './WatchlistNavbar.css'
import { useRef, useEffect } from 'react'; import { Link } from 'react-router-dom';

const WatchlistNavbar = () => {
    const navRef = useRef();
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 80) {
                navRef.current.classList.add('nav-dark');
            } else {
                navRef.current.classList.remove('nav-dark');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div ref={navRef} className="navbar">
            <div className="left-side">
                <Link to={`/`} className='logo'>
                    <div><span>Movie</span>Hub</div>
                </Link>
            </div>
            <div className="right-side"></div>
        </div >
    )
}

export default WatchlistNavbar