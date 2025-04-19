import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from '../src/pages/Login/Login'
import Home from '../src/pages/Home/Home'
import MovieDetails from './pages/MovieDetails/MovieDetails'
import Search from './pages/Search/Search'
import Actor from './pages/Actor/Actor'
import Watchlist from './pages/Watchlist/Watchlist'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'




const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const auth = getAuth();


  useEffect(() => {
    const storedSignedInState = localStorage.getItem('isSignedIn');
    if (storedSignedInState === 'true') {
      setIsSignedIn(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        localStorage.setItem('isSignedIn', 'true');
        setIsSignedIn(true);
      } else {

        localStorage.setItem('isSignedIn', 'false');
        setIsSignedIn(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);




  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/:contentType/:id' element={<MovieDetails />} />

          <Route path='/search' element={<Search />} />

          <Route path='/cast/:id' element={<Actor />} />

          <Route path='/watchlist' element={isSignedIn ? <Watchlist /> : <Navigate to='/login' />}></Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
