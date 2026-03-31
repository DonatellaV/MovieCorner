import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL;
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

function AllDirectorsPage({ directors, onBack, onSelectDirector }) {
  return (
    <div className="all-directors-container">
      <header className="browser-header">
        <div className="header-left">
          <button onClick={onBack} className="back-btn-minimal">← BACK</button>
          <h2>ALL MASTERMINDS</h2>
        </div>
      </header>

      <div className="directors-grid-large">
        {directors.map((dir) => (
          <div 
            key={dir.id} 
            className="director-card-huge"
            onClick={() => onSelectDirector(dir.id)} // Wikipedia helyett ez
            style={{ cursor: 'pointer' }}
          >
            <div className="img-wrapper">
              <img 
                src={dir.profile_path 
                  ? `https://image.tmdb.org/t/p/w500${dir.profile_path}` 
                  : `https://ui-avatars.com/api/?name=${dir.name}&background=00ff73&color=fff`} 
                alt={dir.name} 
              />
            </div>
            <div className="dir-info">
              <h3>{dir.name}</h3>
              <p>Known for: {dir.known_for?.map(m => m.title || m.name).slice(0, 2).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilmsPage({ movies, genres, onSelectMovie, filters, setFilters}) {
  return (
    <div className="films-browser-container">
      <header className="browser-header">
        <div className="header-left">
          <h2>LATEST MOVIES </h2>
        </div>
        <div className="header-right-advanced">
          <span className="filter-label">BROWSE BY</span>
          <div className="filter-buttons">
          {/* YEAR SZŰRŐ*/}
          <div className="dropdown">
            <button className="filter-btn">YEAR <span className="arrow">⌄</span></button>
                <div className="dropdown-content">
                  <a onClick={() => setFilters.setYear('All')}>All</a>
                  <a href="#">Upcoming</a>
                  <a onClick={() => setFilters.setYear('2020s')}>2020s</a>
                  <a onClick={() => setFilters.setYear('2010s')}>2010s</a>
                  <a onClick={() => setFilters.setYear('2000s')}>2000s</a>
                  <a onClick={() => setFilters.setYear('1990s')}>1990s</a>
                  <a onClick={() => setFilters.setYear('1980s')}>1980s</a>
                  <a onClick={() => setFilters.setYear('1970s')}>1970s</a>
                </div>
              </div>
              {/* RATING SZŰRŐ*/}
              <div className="dropdown">
                <button className="filter-btn">RATING <span className="arrow">⌄</span></button>
                <div className="dropdown-content">
                  <a href="#">Highest First</a>
                  <a href="#">Lowest First</a>
                </div>
              </div>
              {/* GENRE SZŰRŐ*/}
              <div className="dropdown">
                <button className="filter-btn">GENRE <span className="arrow">⌄</span></button>
                <div className="dropdown-content">
                    {genres && genres.length > 0 ? (
                      genres.map((g) => (
                        <a key={g.id} href="#">
                          {g.name}
                        </a>
                      ))
                    ) : (
                      <a href="#">Loading...</a>
                    )}
                </div>
              </div>
            </div>
          <div className="mini-search-section">
            <span className="filter-label">FIND A FILM</span>
            <input type="text" className="mini-search-input" />
          </div>
        </div>
      </header>

      {/*FILMEK POSZTEREI*/}
      <div className="letterboxd-grid">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="lb-poster-card" 
            onClick={() => onSelectMovie(movie)}
            style={{ cursor: 'pointer' }} 
          >
            <img 
              src={
                movie.isLocal 
                  ? `${API_BASE}${movie.posterURL}` 
                  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
            />
            <div className="lb-poster-overlay"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginPage({ onBack, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        username: username,
        password: password,
        email: "login@temp.hu"
      });

      if (response.data.status === "success") {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', response.data.username);
        onBack(); 
        window.location.reload();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Hiba történt a belépés során";
      alert(errorMsg);
    }
  };
  return (
    <div className="login-overlay"> 
      <div className="login-card-modern"> 
        <button onClick={onBack} className="close-btn">&times;</button>
        
        <div className="login-header">
          <h2 style={{ color: '#00ff73' }}>LOGIN</h2>
          <p>Welcome back! Sign in.</p>
        </div>

        <form className="modern-form" onSubmit={handleLogin}>
          <div className="input-group-modern">
            <input 
              type="text" 
              id="login-username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="login-username">Username</label>
          </div>

          <div className="input-group-modern">
            <input 
              type="password" 
              id="login-password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="login-password">Password</label>
          </div>

          <button type="submit" className="glow-on-hover">Login</button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?<span onClick={onSwitchToRegister} style={{cursor: 'pointer', color: '#00ff73'}}>Register!</span></p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onBack }) {
  const [isVerified, setIsVerified] = useState(false);
  const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleCaptchaChange = (value) => {
    if (value) {
      setIsVerified(true);
    }
  };
  
  return (
    <div className="register-overlay">
      <div className="register-card-modern">
        <button onClick={onBack} className="close-btn">&times;</button>
        
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join the community!</p>
        </div>

        <form className="modern-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group-modern">
            <input type="text" id="username" required />
            <label htmlFor="username">Username</label>
          </div>

          <div className="input-group-modern">
            <input type="email" id="email" required />
            <label htmlFor="email">E-Mail</label>
          </div>

          <div className="input-group-modern">
            <input type="password" id="password" required />
            <label htmlFor="password">Password</label>
          </div>

          <div className="input-group-modern">
            <input type="password" id="confirm" required />
            <label htmlFor="confirm">Confirm Password</label>
          </div>
        <div className="captcha-container">
            <ReCAPTCHA
              sitekey={RECAPTCHA_KEY}
              onChange={handleCaptchaChange}
              theme="dark"
            />
          </div>
          <button 
            type="submit" 
            className={`glow-on-hover ${!isVerified ? 'disabled-btn' : ''}`}
            disabled={!isVerified}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

const NewsSection = () => {
    const [activeTab, setActiveTab] = useState('Articles');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      fetch(`${API_BASE}/news/${activeTab}?t=${new Date().getTime()}`)
    .then(res => res.json())
    .then(data => {
      setNews(data);
      setLoading(false);
    })
}, [activeTab]);

    return (
      <div className="news-container">
        <div className="news-tabs">
          {['Articles', 'Reviews', 'Videos'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              Movies {tab}
            </button>
          ))}
        </div>

        {loading ? <p>Loading news from IGN...</p> : (
          <div className="news-grid">
            {news.map((item, index) => (
              <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="news-card">
                <img src={item.img} alt="" />
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <p className="news-date">{item.date}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

function App() {
  const [tmdbMovies, setTmdbMovies] = useState([]);
  //Rendezők
  const [allTmdbDirectors, setAllTmdbDirectors] = useState([]);
  const [latestDirectors, setLatestDirectors] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState(null);
  //Keresés
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('movie');
  //Filmek
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [genres, setGenres] = useState([]);
  const currentYear = 2026;
  const [view, setView] = useState('home'); 
  const [toast, setToast] = useState(null);
  //Szűrők
  const [filterGenre, setFilterGenre] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterSort, setFilterSort] = useState('latest');
  const [miniSearch, setMiniSearch] = useState(''); 

  

  const fetchDirectorDetails = async (directorParam) => {
  try {
    let personId = directorParam;

    // Ha a paraméter nem szám (hanem név a saját DB-ből), megkeressük az ID-t
    if (isNaN(directorParam)) {
      const searchRes = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${TMDB_KEY}&query=${encodeURIComponent(directorParam)}`
      );
      if (searchRes.data.results.length > 0) {
        personId = searchRes.data.results[0].id;
      } else {
        alert("Director not found on TMDB!");
        return;
      }
    }

    // Innen a kód változatlan, már a jó personId-t használja
    const detailRes = await axios.get(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_KEY}&language=en-US`);
    const creditsRes = await axios.get(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_KEY}&language=en-US`);
    
    const directedMovies = creditsRes.data.crew
      .filter(m => m.job === 'Director')
      .sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""))
      .slice(0, 12);

    setSelectedDirector({
      ...detailRes.data,
      movies: directedMovies
    });
  } catch (err) {
    console.error("Error fetching director:", err);
  }
};
  /*FILMS FÜLHÖZ a mai dátumhoz legközelebbi filmek*/
    const getLatestMovies = () => {
    const localMovies = allMovies.map(m => ({
      ...m,
      release_date: m.year ? `${m.year}-01-01` : "1900-01-01",
      isLocal: true
    }));

    const combined = [...localMovies, ...tmdbMovies];

    const sorted = combined.sort((a, b) => {
      const dateA = new Date(a.release_date || a.year);
      const dateB = new Date(b.release_date || b.year);
      return dateB - dateA;
    });

      return sorted.slice(0, 20);
    };

    /*FILMS --> Szűrő */
        const getFilteredMovies = () => {
        const local = allMovies.map(m => ({ 
          ...m, 
          isLocal: true,
          unifiedYear: parseInt(m.year) || 0 
        }));

        const tmdb = tmdbMovies.map(m => ({ 
          ...m, 
          isLocal: false,
          unifiedYear: m.release_date ? parseInt(m.release_date.substring(0, 4)) : 0 
        }));

        const combined = [...local, ...tmdb];

        return combined.filter(m => {
          let matchesYear = true;
          const y = m.unifiedYear;

          if (filterYear !== 'All') {
            if (filterYear === '2020s') matchesYear = y >= 2020;
            else if (filterYear === '2010s') matchesYear = y >= 2010 && y < 2020;
            else if (filterYear === '2000s') matchesYear = y >= 2000 && y < 2010;
            else if (filterYear === '1990s') matchesYear = y >= 1990 && y < 2000;
            else if (filterYear === '1980s') matchesYear = y >= 1980 && y < 1990;
            else if (filterYear === '1970s') matchesYear = y >= 1970 && y < 1980;
          }

          // 4. MŰFAJ SZŰRŐ
          let matchesGenre = true;
          if (filterGenre !== 'All') {
            if (m.isLocal) {
              matchesGenre = String(m.genre) === String(filterGenre);
            } else {
              matchesGenre = m.genre_ids && m.genre_ids.includes(Number(filterGenre));
            }
          }
          const matchesSearch = (m.title || "").toLowerCase().includes(miniSearch.toLowerCase());

          return matchesYear && matchesGenre && matchesSearch;
        })
        .sort((a, b) => b.unifiedYear - a.unifiedYear);
      };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const scroll = (direction) => {
    const slider = document.getElementById('dir-slider');
    const firstCard = slider?.querySelector('.director-circle-card');
    
    if (slider && firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const gap = 30; 
      const step = cardWidth + gap;
      const scrollAmount = Math.round(step * 4);

      if (direction === 'left') {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleDirectorScroll = (direction) => {
    const slider = document.getElementById('dir-slider');
    if (!slider) return;

    const firstCard = slider.querySelector('.director-circle-card');
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const gap = 30; 
      const moveDistance = (cardWidth + gap) * 4;

      const currentScroll = slider.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - moveDistance 
        : currentScroll + moveDistance;

      slider.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

    const handleSelectMovie = async (movie) => {
    try {
      if (movie.isLocal) {
        setSelectedMovie({
          ...movie,
          backdrop_path: movie.posterURL,
          overview: movie.description || "Nincs leírás ehhez a filmhez.",
          release_date: movie.year?.toString() || "N/A",
          vote_average: movie.rating || 0,
          isLocal: true
        });
      } else {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_KEY}&append_to_response=videos,credits&language=en-US`
        );
        setSelectedMovie({
          ...res.data,
          isLocal: false
        });
      }
      setIsSearchOpen(false);
      setSearchQuery('');
    } catch (err) {
      console.error("Hiba a film részleteinek betöltésekor:", err);
    }
  };

  const handleSearch = async (val) => {
  setSearchQuery(val);
  
  if (val.length > 2) {
    try {
      // Ha 'movie', akkor filmeket keres, ha 'person', akkor színészeket/rendezőket
      const endpoint = searchCategory === 'movie' ? 'movie' : 'person';
      
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/${endpoint}?api_key=${TMDB_KEY}&query=${encodeURIComponent(val)}&language=en-US`
      );

      let results = res.data.results;

      // Szűrés: Emberek esetén csak azokat mutatjuk, akiknek van profilképük
      if (searchCategory === 'person') {
        results = results.filter(p => p.profile_path);
      }

      setSearchResults(results.slice(0, 8)); // Max 8 találat a listába
      setIsSearchOpen(true);
    } catch (err) {
      console.error("Keresési hiba:", err);
    }
  } else {
    setSearchResults([]);
    setIsSearchOpen(false);
  }
};

  useEffect(() => {
    const fetchTmdbDirectors = async () => {
  try {
    let finalDirectors = [];
    let page = 1;
    let seenIds = new Set(); // Ezzel nyomon követjük, kit adtunk már hozzá

    // Addig megyünk, amíg nincs meg 20 egyedi rendező, vagy el nem érjük az 50. oldalt
    while (finalDirectors.length < 20 && page <= 50) {
      const res = await axios.get(
        `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`
      );
      
      // Kiszűrjük azokat, akik rendezők ÉS van képük, ÉS még nem láttuk őket
      const directorsInPage = res.data.results.filter(
        p => p.known_for_department === 'Directing' && 
             p.profile_path && 
             !seenIds.has(p.id)
      );

      // Hozzáadjuk őket a listához és a szűrő készletünkhöz
      directorsInPage.forEach(p => {
        seenIds.add(p.id);
        finalDirectors.push(p);
      });

      page++;
    }

    setAllTmdbDirectors(finalDirectors);
    
  } catch (err) {
    console.error("Hiba a rendezők begyűjtésekor:", err);
  }
};

    const fetchEverything = async () => {
      try {
        const localRes = await axios.get(`${API_BASE}/test-connection`);
        const localData = localRes.data.map(m => ({
          ...m,
          isLocal: true,
          vote_average: m.rating || 0 
        }));
        setAllMovies(localData);

        const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}&language=en-US&page=1`);
        const tmdbData = tmdbRes.data.results.map(m => ({
          ...m,
          isLocal: false
        }));
        setTmdbMovies(tmdbData);

        const combined = [...localData, ...tmdbData]
          .sort((a, b) => b.vote_average - a.vote_average) 
          .slice(0, 10); 
        setRecommended(combined);

        const heroSelection = tmdbData.slice(0, 5);
        const withDirectors = await Promise.all(heroSelection.map(async (m) => {
          try {
            const cRes = await axios.get(`https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${TMDB_KEY}`);
            const dir = cRes.data.crew.find(p => p.job === 'Director');
            return { ...m, director: dir ? dir.name : 'Unknown' };
          } catch { return { ...m, director: 'N/A' }; }
        }));
        setHeroMovies(withDirectors);

      } catch (err) {
        console.error("Valami elszállt:", err);
      }
    };

    fetchEverything();
    fetchTmdbDirectors();
    axios.get(`${API_BASE}/genres`).then(res => setGenres(res.data)).catch(e => console.error(e));
    axios.get(`${API_BASE}/latest-directors`).then(res => setLatestDirectors(res.data)).catch(e => console.error(e));
  }, []);

  if (heroMovies.length === 0) return <div className="loading">Loading...</div>

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="logo" onClick={() => {
            console.log("Navigáció a főoldalra...");
            setView('home');
          }}>MOVIE<span>CORNER</span></div>
          <div className="search-wrapper">
          <div className="search-box">
              {/* KATEGÓRIA VÁLASZTÓ (A 3 vonalas/legördülő jellegű megoldás) */}
              <select 
                className="search-category-select"
                value={searchCategory}
                onChange={(e) => {
                  setSearchCategory(e.target.value);
                  setSearchQuery(""); // Törlés váltáskor
                  setSearchResults([]);
                }}
              >
                <option value="movie">Movies</option>
                <option value="person">Artists</option>
              </select>

              <input 
                type="text" 
                placeholder={searchCategory === 'movie' ? "Do or do not, there is no try..." : "Looking for a mastermind?"} 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setIsSearchOpen(true)}
              />
              
              {/* TALÁLATI LISTA */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="search-item" 
                      onClick={() => {
                        if (searchCategory === 'movie') {
                          handleSelectMovie(result);
                        } else {
                          // Ha személy, a már meglévő részletező függvényedet hívjuk meg
                          fetchDirectorDetails(result.id); 
                        }
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <img 
                        src={result.poster_path || result.profile_path 
                          ? `https://image.tmdb.org/t/p/w92${result.poster_path || result.profile_path}` 
                          : 'https://via.placeholder.com/40x60'} 
                        alt="thumb" 
                      />
                      <div className="search-info">
                        {/* Filmnek 'title', embernek 'name' tulajdonsága van a TMDB-ben */}
                        <span className="search-title">{result.title || result.name}</span>
                        <span className="search-year">
                          {result.release_date 
                            ? result.release_date.split('-')[0] 
                            : (result.known_for_department || 'Artist')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
</div>
        <div className="nav-links">
          <button 
            className={view === 'films' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setView('films')}
          >
            FILMS
          </button>
                  <button 
            className={view === 'news' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setView('news')}
          >
            NEWS
          </button>
        </div>
        <div className="auth">
                {localStorage.getItem('isLoggedIn') === 'true' ? (
          /*Bejelentkezve nézet*/
          <div className="user-profile-nav">
            <span>
              {localStorage.getItem('username')}
            </span>
            <button className="btn-logout" onClick={() => {
              localStorage.clear();
              showToast("Sikeres kijelentkezés!");
              setTimeout(() => window.location.reload(), 1000);
            }}>
              Logout
            </button>
          </div>
        ) : (
          /*Bejelentkezés nélkül*/
          <>

            <button className="btn-login" onClick={() => setView('login')}>Login</button>
            <button className="btn-register" onClick={() => setView('register')}>Register</button>
          </>
        )}
      </div>
      </nav>

      {/* 5 fókuszban levő film*/}
      {view === 'home' && (
        <>
      <div className="hero-accordion-header">
        <h2>Latest <span>Movies</span></h2>
      </div>
      <section className="hero-accordion-section">
        <div className="accordion-wrapper">
          {heroMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="accordion-item" 
              style={{ backgroundImage: movie.poster_path 
                  ? `url(https://image.tmdb.org/t/p/w1280${movie.poster_path})` 
                  : `url(${API_BASE}${movie.posterURL})`, }}
            >
              <div className="accordion-overlay">
                <div className="text-wrap">
                  <span className="year-tag">{movie.release_date ? movie.release_date.split('-')[0] : movie.year}</span>
                  <h2 className="hero-title">{movie.title}</h2>
                  <p className="director">Director: <span>{movie.director || 'N/A'}</span></p>
                  <button className="more-info-btn-hero" onClick={() => handleSelectMovie(movie)}>More Info</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10 mai dátumhoz legközelebbi film*/}
      <section className="recommended">
        <div className="section-header">
          <h2>Top Picks</h2>
        </div>
        <div className="movie-grid">
          {recommended.map(movie => (
            <div key={movie.id} className="card" onClick={() => handleSelectMovie(movie)} style={{ cursor: 'pointer' }}>
              <div className="img-holder">
                <img 
                  src={movie.isLocal 
                    ? `${API_BASE}${movie.posterURL}` 
                    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                />
                <div className="card-hover-ui">
                  <div className="play-circle">▶</div>
                </div>
              </div>
              <div className="card-details">
                <p className="m-title">{movie.title}</p>
                <div className="m-meta-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p className="m-year" style={{ color: '#888' }}>
                    {movie.isLocal ? movie.year : movie.release_date?.split('-')[0]}
                  </p>
                  <p className="m-rating" style={{ color: '#00ff73' }}>⭐ {movie.vote_average.toFixed(1)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*Rendezők a legtöbb filmmel az oldalon*/} 
            <section className="latest-directors-row">
              <div className="dir-section-header">
                <h2>DIRECTORS</h2>
                <button className="see-all-btn" onClick={() => setView('all-directors')}>
                  SEE ALL
                </button>
              </div>
              
              <div className="slider-wrapper">
                {/* Balra nyíl */}
                <button className="nav-btn left" onClick={() => {
                    const slider = document.getElementById('dir-slider');
                    if (slider) {
                        const card = slider.querySelector('.director-circle-card');
                        const step = card ? card.offsetWidth + 40 : 200;
                        slider.scrollBy({ left: -(step * 4), behavior: 'smooth' });
                    }
                }}>‹</button>
                
                <div className="directors-flex" id="dir-slider">
                  {latestDirectors.map((director, index) => (
                    <div key={index} 
                          className="director-circle-card" 
                          onClick={() => fetchDirectorDetails(director.name)} // ID helyett névvel hívjuk meg
                          style={{cursor: 'pointer'}}
                        >
                      <div className="white-ring">
                        <img src={`${API_BASE}${director.photoURL}`} alt={director.name} />
                      </div>
                      <p className="dir-name">{director.name}</p>
                    </div>
                  ))}
                </div>

                {/* Jobbra nyíl */}
                <button className="nav-btn right" onClick={() => {
                    const slider = document.getElementById('dir-slider');
                    if (slider) {
                        const card = slider.querySelector('.director-circle-card');
                        const step = card ? card.offsetWidth + 40 : 200; 
                        slider.scrollBy({ left: step * 4, behavior: 'smooth' });
                    }
                }}>›</button>
              </div>
            </section>

        </>
      )} {/*LOGIN */}
      {view === 'login' && (
        <LoginPage 
          onBack={() => setView('home')} 
          onSwitchToRegister={() => setView('register')} 
        />
      )}

      {/*REGISTER*/}
      {view === 'register' && (
        <RegisterPage 
          onBack={() => setView('home')} 
        />
      )}

      {/*FILMS*/}
      {view === 'films' && (
        <FilmsPage 
          movies={getFilteredMovies()}
          genres={genres} 
          onSelectMovie={handleSelectMovie} 
          filters={{ 
            year: filterYear, 
            genre: filterGenre, 
            sort: filterSort, 
            search: miniSearch 
          }}
          setFilters={{ 
            setYear: setFilterYear, 
            setGenre: setFilterGenre, 
            setSort: setFilterSort, 
            setSearch: setMiniSearch 
          }}
        />
      )}

      {/*NEWS*/}
      {view === 'news' && <NewsSection />}
      

      {/*Movie data*/}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedMovie(null)}>&times;</button>
            <div className="modal-content">
              <img 
                className="modal-backdrop" 
                src={selectedMovie.isLocal 
                  ? `${API_BASE}${selectedMovie.backdrop_path}` 
                  : `https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path}`} 
                alt="" 
              />
              <div className="modal-details">
                <h2>{selectedMovie.title}</h2>
                <div className="modal-meta">
                  <span className="modal-rating">⭐ {selectedMovie.vote_average?.toFixed(1)}</span>
                  <span className="modal-year">
                    {selectedMovie.isLocal ? selectedMovie.release_date : selectedMovie.release_date?.split('-')[0]}
                  </span>
                </div>
                <p className="modal-overview">{selectedMovie.overview}</p>
                
                {/*TMDB trailer*/}
                {!selectedMovie.isLocal && selectedMovie.videos?.results.length > 0 && (
                  <div className="trailer-section">
                    <h3>Trailer</h3>
                    <div className="trailer-container">
                      <iframe 
                        src={`https://www.youtube.com/embed/${selectedMovie.videos.results[0].key}`}
                        title="Trailer"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTOR MODAL */}
{selectedDirector && (
  <div className="modal-overlay" onClick={() => setSelectedDirector(null)}>
    <div className="movie-modal director-modal-style" onClick={(e) => e.stopPropagation()}>
      <button className="close-modal" onClick={() => setSelectedDirector(null)}>&times;</button>
      
      <div className="modal-content">
        <div className="director-header-flex" style={{ display: 'flex', gap: '30px', padding: '20px' }}>
          <img 
            src={`https://image.tmdb.org/t/p/w300${selectedDirector.profile_path}`} 
            alt={selectedDirector.name}
            style={{ width: '200px', borderRadius: '15px', border: '2px solid #00ff73' }}
          />
          <div className="director-text">
            <h2 style={{ color: '#00ff73', fontSize: '2.5rem' }}>{selectedDirector.name}</h2>
            <p><strong>Born:</strong> {selectedDirector.birthday} | {selectedDirector.place_of_birth}</p>
            <p className="bio-text" style={{ marginTop: '15px', lineHeight: '1.6', fontSize: '0.9rem', maxHeight: '150px', overflowY: 'auto' }}>
              {selectedDirector.biography || "No biography available."}
            </p>
          </div>
        </div>

        <div className="director-movies-section" style={{ padding: '0 20px 20px' }}>
          <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>FILMOGRAPHY</h3>
          <div className="mini-movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
            {selectedDirector.movies.map(movie => (
              <div key={movie.id} className="mini-movie-card" onClick={() => { setSelectedDirector(null); handleSelectMovie(movie); }} style={{ cursor: 'pointer' }}>
                <img 
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/100x150'} 
                  alt={movie.title}
                  style={{ width: '100%', borderRadius: '5px' }}
                />
                <p style={{ fontSize: '0.7rem', marginTop: '5px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {movie.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/*Director data*/}
      {view === 'all-directors' && (
  <AllDirectorsPage 
    directors={allTmdbDirectors} 
    onBack={() => setView('home')} 
    onSelectDirector={fetchDirectorDetails} // Ezt add hozzá!
  />
)}

      
    </div>
      

      
  )
  
}

export default App;