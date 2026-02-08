const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));

app.get('/style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.send(`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: Arial, sans-serif;
            background: #ffff);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        h1, h2 { color: #333; margin-bottom: 20px; }
        h1 { text-align: center; font-size: 28px; }
        h2 { font-size: 22px; }
        
        .form-group { margin-bottom: 20px; }
        
        label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: 500;
        }
        
        input, textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: #002fffff;
        }
        
        button {
            width: 100%;
            background: #002fffff;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        button:hover { background: #002fffff; }
        button:active { transform: scale(0.98); }
        
        .link {
            text-align: center;
            margin-top: 20px;
            color: #666;
        }
        
        .link a {
            color: #002fffff;
            text-decoration: none;
            font-weight: 500;
        }
        
        .link a:hover { text-decoration: underline; }
        
        .error, .success {
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            display: none;
        }
        
        .error {
            background: #fee;
            color: #c33;
        }
        
        .success {
            background: #efe;
            color: #3c3;
        }
        
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #ddd;
        }
        
        .tab {
            padding: 10px 20px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            border-bottom: 3px solid transparent;
            width: auto;
        }
        
        .tab.active {
            color: #002fffff;
            border-bottom-color: #002fffff;
        }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        .movie-item {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 10px;
            border-left: 4px solid #002fffff;
        }
        
        .movie-item h3 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .movie-item p {
            color: #666;
            font-size: 14px;
            margin: 5px 0;
        }
        
        .movie-item button {
            width: auto;
            padding: 8px 15px;
            font-size: 14px;
            margin-top: 10px;
            margin-right: 5px;
        }
        
        .search-result {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
            border-left: 4px solid #002fffff;
        }
        
        .search-result img {
            max-width: 200px;
            border-radius: 5px;
            margin-top: 10px;
        }
        
        .btn-edit { background: #3498db !important; }
        .btn-edit:hover { background: #2980b9 !important; }
        
        .btn-delete { background: #e74c3c !important; }
        .btn-delete:hover { background: #c0392b !important; }
        
        .btn-cancel { background: #95a5a6 !important; }
        .btn-cancel:hover { background: #7f8c8d !important; }
        
        .btn-add { background: #27ae60 !important; }
        .btn-add:hover { background: #229954 !important; }
        
        .logout-btn {
            background: #e74c3c !important;
            margin-top: 20px;
        }
        
        .logout-btn:hover {background: #c0392b !important;}
    `);
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
        const API = window.location.origin + '/api';

        const show = (id, msg) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = msg;
                el.style.display = 'block';
                setTimeout(() => el.style.display = 'none', 5000);
            }
        };

        async function register(e) {
            e.preventDefault();
            const data = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const res = await fetch(API + '/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (result.success) {
                    localStorage.setItem('token', result.data.token);
                    show('success', 'Registration successful!');
                    setTimeout(() => window.location.href = '/dashboard', 1500);
                } else {
                    show('error', result.message);
                }
            } catch (err) {
                show('error', 'Registration failed');
            }
        }

        async function login(e) {
            e.preventDefault();
            const data = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const res = await fetch(API + '/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (result.success) {
                    localStorage.setItem('token', result.data.token);
                    show('success', 'Login successful!');
                    setTimeout(() => window.location.href = '/dashboard', 1500);
                } else {
                    show('error', result.message);
                }
            } catch (err) {
                show('error', 'Login failed');
            }
        }

        async function loadMovies() {
            const token = localStorage.getItem('token');
            if (!token) return window.location.href = '/login';

            try {
                const res = await fetch(API + '/movies', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();

                const list = document.getElementById('movieList');
                if (result.success && result.data.length > 0) {
                    list.innerHTML = result.data.map(m => \`
                        <div class="movie-item">
                            <h3>\${m.title}</h3>
                            <p>\${m.description}</p>
                            <p><strong>Genre:</strong> \${m.genre} | <strong>Year:</strong> \${m.releaseYear}</p>
                            <p><strong>Rating:</strong> \${m.rating}/10</p>
                            <button class="btn-edit" onclick="editMovie('\${m._id}')">Edit</button>
                            <button class="btn-delete" onclick="deleteMovie('\${m._id}')">Delete</button>
                        </div>
                    \`).join('');
                } else {
                    list.innerHTML = '<p>No movies yet. Add your first movie!</p>';
                }
            } catch (err) {
                show('error', 'Failed to load movies');
            }
        }

        async function addMovie(e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const data = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                genre: document.getElementById('genre').value,
                releaseYear: parseInt(document.getElementById('year').value),
                rating: parseFloat(document.getElementById('rating').value),
                director: document.getElementById('director').value
            };

            try {
                const res = await fetch(API + '/movies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (result.success) {
                    show('success', 'Movie added!');
                    document.getElementById('movieForm').reset();
                    switchTab('my-movies');
                    loadMovies();
                } else {
                    show('error', result.message);
                }
            } catch (err) {
                show('error', 'Failed to add movie');
            }
        }

        async function deleteMovie(id) {
            if (!confirm('Delete this movie?')) return;
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(API + '/movies/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();

                if (result.success) {
                    show('success', 'Movie deleted!');
                    loadMovies();
                } else {
                    show('error', result.message);
                }
            } catch (err) {
                show('error', 'Failed to delete');
            }
        }

        async function editMovie(id) {
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(API + '/movies/' + id, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();

                if (result.success) {
                    const m = result.data;
                    document.getElementById('title').value = m.title;
                    document.getElementById('description').value = m.description;
                    document.getElementById('genre').value = m.genre;
                    document.getElementById('year').value = m.releaseYear;
                    document.getElementById('rating').value = m.rating;
                    document.getElementById('director').value = m.director || '';

                    switchTab('add-movie');
                    const form = document.getElementById('movieForm');
                    form.onsubmit = (e) => updateMovie(e, id);
                    document.querySelector('#movieForm h2').textContent = 'Edit Movie';
                } else {
                    show('error', result.message);
                }
            } catch (err) {
                show('error', 'Failed to load movie');
            }
        }

        async function updateMovie(e, id) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const data = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                genre: document.getElementById('genre').value,
                releaseYear: parseInt(document.getElementById('year').value),
                rating: parseFloat(document.getElementById('rating').value),
                director: document.getElementById('director').value
            };

            try {
                const res = await fetch(API + '/movies/' + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (result.success) {
                    show('success', 'Movie updated!');
                    resetForm();
                    switchTab('my-movies');
                    loadMovies();
                } else {
                    show('error', result.message);
                }
            } catch (err) {
                show('error', 'Failed to update');
            }
        }

        function resetForm() {
            document.getElementById('movieForm').reset();
            document.getElementById('movieForm').onsubmit = addMovie;
            document.querySelector('#movieForm h2').textContent = 'Add New Movie';
        }

        function switchTab(name) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.getElementById(name).classList.add('active');
            if (event) event.target.classList.add('active');
        }

        async function searchOMDB() {
            const query = document.getElementById('omdbSearch').value.trim();
            if (!query) return show('error', 'Enter a movie title');

            const token = localStorage.getItem('token');
            const div = document.getElementById('omdbResult');
            div.innerHTML = '<p>Searching...</p>';

            try {
                const res = await fetch(API + '/movies/search/' + encodeURIComponent(query), {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await res.json();

                if (result.success) {
                    const m = result.data;
                    div.innerHTML = \`
                        <div class="search-result">
                            <h3>\${m.title} (\${m.year})</h3>
                            <p><strong>Genre:</strong> \${m.genre}</p>
                            <p><strong>Director:</strong> \${m.director}</p>
                            <p><strong>Plot:</strong> \${m.plot || 'N/A'}</p>
                            <p><strong>IMDb:</strong> \${m.rating}/10</p>
                            \${m.poster && m.poster !== 'N/A' ? '<img src="' + m.poster + '">' : ''}
                            <br><button class="btn-add" onclick='addFromOMDB(\${JSON.stringify(m).replace(/'/g, "&apos;")})'>Add to Collection</button>
                        </div>
                    \`;
                } else {
                    div.innerHTML = '<p style="color:#e74c3c;">Movie not found!</p>';
                }
            } catch (err) {
                div.innerHTML = '<p style="color:#e74c3c;">Search failed. Check API key.</p>';
            }
        }

        async function addFromOMDB(movie) {
            const token = localStorage.getItem('token');
            const data = {
                title: movie.title,
                description: movie.plot || movie.title,
                genre: movie.genre,
                releaseYear: parseInt(movie.year),
                rating: parseFloat(movie.rating) || 0,
                director: movie.director,
                poster: movie.poster !== 'N/A' ? movie.poster : undefined
            };

            try {
                const res = await fetch(API + '/movies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (result.success) {
                    show('success', 'Added to collection!');
                    document.getElementById('omdbResult').innerHTML = '';
                    document.getElementById('omdbSearch').value = '';
                    switchTab('my-movies');
                    loadMovies();
                } else {
                    show('error', result.message);
                }
            } catch (err) {
                show('error', 'Failed to add');
            }
        }

        function logout() {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    `);
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Movie Website</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container" style="max-width:400px">
                <h1>Create Account</h1>
                <div id="error" class="error"></div>
                <div id="success" class="success"></div>
                <form onsubmit="register(event)">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" required minlength="3">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" required minlength="6">
                    </div>
                    <button type="submit">Register</button>
                </form>
                <div class="link">
                    Already have an account? <a href="/login">Login</a>
                </div>
            </div>
            <script src="/script.js"></script>
        </body>
        </html>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Movie Website</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container" style="max-width:400px">
                <h1>Welcome Back</h1>
                <div id="error" class="error"></div>
                <div id="success" class="success"></div>
                <form onsubmit="login(event)">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div class="link">
                    Don't have an account? <a href="/">Register</a>
                </div>
            </div>
            <script src="/script.js"></script>
        </body>
        </html>
    `);
});

app.get('/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Movie Website</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>My Movies</h1>
                <div id="error" class="error"></div>
                <div id="success" class="success"></div>
                
                <div class="tabs">
                    <button class="tab active" onclick="switchTab('my-movies')">My Movies</button>
                    <button class="tab" onclick="switchTab('add-movie')">Add Movie</button>
                    <button class="tab" onclick="switchTab('search-omdb')">Search Movie</button>
                </div>

                <div id="my-movies" class="tab-content active">
                    <div id="movieList"></div>
                </div>

                <div id="add-movie" class="tab-content">
                    <form id="movieForm" onsubmit="addMovie(event)">
                        <h2>Add New Movie</h2>
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="title" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" id="description" required>
                        </div>
                        <div class="form-group">
                            <label>Genre</label>
                            <input type="text" id="genre" required>
                        </div>
                        <div class="form-group">
                            <label>Year</label>
                            <input type="number" id="year" required min="1900" max="2030">
                        </div>
                        <div class="form-group">
                            <label>Rating (0-10)</label>
                            <input type="number" id="rating" step="0.1" min="0" max="10" required>
                        </div>
                        <div class="form-group">
                            <label>Director</label>
                            <input type="text" id="director">
                        </div>
                        <button type="submit">Add Movie</button>
                        <button type="button" class="btn-cancel" onclick="resetForm()">Cancel</button>
                    </form>
                </div>

                <div id="search-omdb" class="tab-content">
                    <h2>Search Movie</h2>
                    <p style="color:#666;margin-bottom:20px">Search movies</p>
                    <div class="form-group">
                        <label>Movie Title</label>
                        <input type="text" id="omdbSearch" placeholder="Inception, Matrix, Interstellar...">
                    </div>
                    <button onclick="searchOMDB()">Search</button>
                    <div id="omdbResult"></div>
                </div>

                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
            <script src="/script.js"></script>
            <script>loadMovies()</script>
        </body>
        </html>
    `);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));