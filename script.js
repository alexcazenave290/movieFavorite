// Películas por defecto
const defaultMovies = [
    {
        title: "El Señor de los Anillos: La Comunidad del Anillo",
        year: 2001,
        desc: "Un joven hobbit, Frodo, debe destruir un anillo mágico para salvar la Tierra Media.",
        img: "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_SY445_.jpg",
        trailer: "https://www.youtube.com/watch?v=V75dMMIW2B4"
    },
    {
        title: "Interestelar",
        year: 2014,
        desc: "Un grupo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.",
        img: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
    },
    {
        title: "Coco",
        year: 2017,
        desc: "Miguel, un niño mexicano, viaja al mundo de los muertos para descubrir la historia de su familia.",
        img: "https://lumiere-a.akamaihd.net/v1/images/p_coco_19736_fd5fa537.jpeg",
        trailer: "https://www.youtube.com/watch?v=Ga6RYejo6Hk"
    },
    {
        title: "Spider-Man: Un Nuevo Universo",
        year: 2018,
        desc: "Miles Morales se convierte en Spider-Man y conoce a otros Spider-Personas de universos alternativos.",
        img: "https://musicart.xboxlive.com/7/60f85000-0000-0000-0000-000000000002/504/image.jpg",
        trailer: "https://www.youtube.com/watch?v=g4Hbz2jLxvQ"
    }
];

// Leer películas desde localStorage o usar las de ejemplo
let movies = [];
if (localStorage.getItem('movies')) {
    try {
        movies = JSON.parse(localStorage.getItem('movies'));
    } catch {
        movies = [...defaultMovies];
    }
} else {
    movies = [...defaultMovies];
}

// Función para guardar en localStorage
function saveMovies() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

// Renderizar las tarjetas
function renderMovies(list) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    list.forEach((movie, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <button class="delete-movie-btn" title="Borrar película" data-idx="${idx}">&times;</button>
            <img src="${movie.img}" alt="${movie.title}" data-trailer="${movie.trailer}">
            <div class="card-content">
                <div class="card-title">${movie.title}</div>
                <div class="card-year">${movie.year}</div>
                <div class="card-desc">${movie.desc}</div>
                <button class="details-btn">Detalles</button>
            </div>
        `;
        container.appendChild(card);
    });
}
renderMovies(movies);
// Borrar película con confirmación
document.getElementById('movies-container').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-movie-btn')) {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        const movie = movies[idx];
        if (confirm(`¿Seguro que quieres borrar "${movie.title}"?`)) {
            movies.splice(idx, 1);
            saveMovies();
            renderMovies(movies);
        }
    }
});
// Mostrar/ocultar detalles
document.getElementById('movies-container').addEventListener('click', function(e) {
    if (e.target.classList.contains('details-btn')) {
        const card = e.target.closest('.card');
        card.classList.toggle('show-desc');
        e.target.textContent = card.classList.contains('show-desc') ? 'Ocultar' : 'Detalles';
    }
});

// Buscador
document.getElementById('search').addEventListener('input', function(e) {
    const value = e.target.value.toLowerCase();
    const filtered = movies.filter(m => m.title.toLowerCase().includes(value));
    renderMovies(filtered);
});

// Modal para imagen/tráiler
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

document.getElementById('movies-container').addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
        const trailer = e.target.getAttribute('data-trailer');
        modal.style.display = 'flex';
        // Si hay trailer, muestra el iframe, si no, la imagen grande
        if (trailer) {
            modalBody.innerHTML = `<iframe width="420" height="315" src="${trailer.replace("watch?v=", "embed/")}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            modalBody.innerHTML = `<img src="${e.target.src}" alt="">`;
        }
    }
});
modalClose.onclick = () => modal.style.display = 'none';
modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// Modo oscuro/claro
const themeBtn = document.getElementById('theme-toggle');
themeBtn.onclick = () => {
    document.body.classList.toggle('dark');
    themeBtn.textContent = document.body.classList.contains('dark') ? 'Modo Claro' : 'Modo Oscuro';
};

// --- AGREGAR PELÍCULA FAVORITA ---
const addMovieBtn = document.getElementById('add-movie-btn');
const addMovieForm = document.getElementById('add-movie-form');
const cancelAddMovie = document.getElementById('cancel-add-movie');

addMovieBtn.onclick = () => {
    addMovieForm.style.display = 'flex';
    addMovieBtn.style.display = 'none';
};
cancelAddMovie.onclick = () => {
    addMovieForm.reset();
    addMovieForm.style.display = 'none';
    addMovieBtn.style.display = 'block';
};

addMovieForm.onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('movie-title').value.trim();
    const year = parseInt(document.getElementById('movie-year').value);
    const img = document.getElementById('movie-img').value.trim();
    const trailer = document.getElementById('movie-trailer').value.trim();
    const desc = document.getElementById('movie-desc').value.trim();

    if (!title || !year || !img || !trailer || !desc) return;

    movies.push({ title, year, img, trailer, desc });
    saveMovies(); // Guardar en localStorage
    renderMovies(movies);

    addMovieForm.reset();
    addMovieForm.style.display = 'none';
    addMovieBtn.style.display = 'block';
};  