// initial value
const API_KEY = '618ca3194ae0d26edd3ed92fc528904a';
const API_URL = 'https://api.themoviedb.org/3/';
const imageUrl = 'https://image.tmdb.org/t/p/w500/';
const url = location.href.toString();
const valueSearch = url.split("#");

// Search Javascript
const searchButton = document.querySelector('#searchButton');
const searchValue = document.querySelector('#inputValue');
const searchMovie = document.querySelector('#movies-search');

// Detail Modal
const detailButton = document.querySelector('#get-detail');
const showDetail = document.querySelector('#movies-detail');

// Search
function movieSection(movies){
    return movies.map((movie) => {
        if(movie.poster_path){
            return `<div class="card bg-dark text-white" style="width: 150px;">
                <img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id} class="card-img-top"/>
                <div class="card-body row align-items-end">
                    <h5 class="card-title">${movie.title}</h5>
                    <a href="#${valueSearch[1]}#detail-${movie.id}" value="${movie.id}" class="btn btn-primary"
                    id="get-detail" >Check Detail</a>
                </div>
            </div>`;
        }
    })
}

function createMovieContainer(movies){
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class','movie');

    const movieTemplate = `${movieSection(movies)}`;

    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

function renderSearch(data){
    searchMovie.innerHTML='<h3> Search for ' + valueSearch[1] + '</h3>'
    const movies = data.results;
    const movieBlock = createMovieContainer(movies);
    searchMovie.appendChild(movieBlock);
    console.log('Data: ',data)
}

searchButton.onclick = function(event){
    event.preventDefault();
    const value = searchValue.value;
    location.href = "search.html#" + value;
    const url = location.href.toString();
    const valueSearch = url.split("#");
    console.log(valueSearch[1]);
    const searchUrl = API_URL + 'search/movie?api_key=' + API_KEY + '&query=' + valueSearch[1] ;

    fetch(searchUrl)
        .then((res) => res.json())
        .then((data) => {renderSearch(data)})
        .catch((error) => {
            console.log('Error: ',error)
        })
    searchValue.value = '';
}

function searchStart(value){
    const searchUrl = API_URL + 'search/movie?api_key=' + API_KEY + '&query=' + value ;

    fetch(searchUrl)
        .then((res) => res.json())
        .then((data) => {renderSearch(data)})
        .catch((error) => {
            console.log('Error: ',error)
        })
}

//Detail
function createIframe(video){
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = 300;
    iframe.height = 200;
    iframe.allowFullscreen = true;

    return iframe;
}

function getGenre(genres){
    var genre = "";
    for(x in genres){
        if(x == genres.length-1){
            genre += genres[x].name + ".";
        }
        else{
            genre += genres[x].name + ", ";
        }
    }
    return genre;
}

function movieDetail(detail){
    return `<img src=${imageUrl + detail.poster_path} data-movie-id=${detail.id}/>
    <div class="detail-desc">
        <h1>${detail.title}</h1>
        <p>Genre : ${getGenre(detail.genres)}</p>
        <p>Realese Date : ${detail.release_date}</p>
        <p>Status : ${detail.status}</p>
        <p>${detail.overview}</p>
        <button class="btn btn-primary" type="submit" id="watchTrailer"> Watch Trailer</button>
        <div id="display-video"></div>
    </div>`;
}

function generateModalDetail(detail){
    const detailElement = document.createElement('div');
    detailElement.setAttribute('class','detail-movie');

    const detailTemplate = `${movieDetail(detail)}`;
    detailElement.innerHTML = detailTemplate;
    return detailElement;
}

function renderDetail(data){
    showDetail.innerHTML='';
    const detailBlock = generateModalDetail(data);
    showDetail.appendChild(detailBlock);
    console.log('Data: ',data)
}

document.onclick = function(event){
    const target = event.target;
    if(target.id === 'get-detail'){
        event.preventDefault()
        var id = target.getAttribute("value");
        location.href = "detail.html#" + id;
    }
    else if(target.id === "watchTrailer"){
        const movieDetailUrl = location.href.toString().split("#");
        const videoDetailUrl = API_URL + 'movie/' + movieDetailUrl[1] + '/videos?api_key=' + API_KEY;
        const showVideo = document.querySelector('#display-video');
        console.log(showVideo);
        fetch(videoDetailUrl)
            .then((res) => res.json())
            .then((data) => {
                const videos = data.results;
                const length = videos.length > 4 ? videos.length : 4;
                const  iframeContainer = document.createElement('div');
                for(var i=0; i < length; i++){
                    const video = videos[i];
                    console.log(video);
                    const iframe = createIframe(video);
                    iframeContainer.appendChild(iframe);
                    showVideo.appendChild(iframeContainer);
                }
                })
            .catch((error) => {
                console.log('Error: ',error)
        })
    }
}

function detailPage(value){
    const detailUrl = API_URL + 'movie/' + value + '?api_key=' + API_KEY;
    fetch(detailUrl)
        .then((res) => res.json())
        .then((data) => {renderDetail(data);})
        .catch((error) => {
            console.log('Error: ',error)
        })
}

// Home Page Show
function homepageMovies(movies){
    return movies.map((movie) => {
        if(movie.poster_path){
            return `<div class="card bg-dark text-white" style="width: 150px;">
                <img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id} class="card-img-top"/>
                <div class="card-body row align-items-end">
                    <h5 align="center" class="card-title">${movie.title}</h5>
                    <a href="#${valueSearch[1]}#detail-${movie.id}" value="${movie.id}" class="btn btn-primary"
                    id="get-detail" >Check Detail</a>
                </div>
            </div>`;
        }
    })
}

function createHomeMovieContainer(movies){
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class','homepage-movie');

    const movieTemplate = `${homepageMovies(movies)}`;

    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

// Top Rated Movies
function renderTopRated(data){
    document.getElementById('top-rated-movies').innerHTML='';
    const movies = data.results;
    const movieBlock = createHomeMovieContainer(movies);
    document.getElementById('top-rated-movies').appendChild(movieBlock);
}

function topRated(){
    const topRatedUrl = API_URL + 'movie/top_rated?api_key=' + API_KEY;

    fetch(topRatedUrl)
        .then((res) => res.json())
        .then((data) => {renderTopRated(data)})
        .catch((error) => {
            console.log('Error: ',error)
        })
}

// Coming Soon
function renderComingSoon(data){
    document.getElementById('coming-soon-movies').innerHTML='';
    const movies = data.results;
    const movieBlock = createHomeMovieContainer(movies);
    document.getElementById('coming-soon-movies').appendChild(movieBlock);
}

function comingSoon(){
    const comingSoonUrl = API_URL + 'movie/upcoming?api_key=' + API_KEY;

    fetch(comingSoonUrl)
        .then((res) => res.json())
        .then((data) => {renderComingSoon(data)})
        .catch((error) => {
            console.log('Error: ',error)
        })
}

// Popular
function renderPopular(data){
    document.getElementById('popular-movies').innerHTML='';
    const movies = data.results;
    const movieBlock = createHomeMovieContainer(movies);
    document.getElementById('popular-movies').appendChild(movieBlock);
}

function popular(){
    const popularUrl = API_URL + 'movie/popular?api_key=' + API_KEY;

    fetch(popularUrl)
        .then((res) => res.json())
        .then((data) => {renderPopular(data)})
        .catch((error) => {
            console.log('Error: ',error)
        })
}

// Now Showing

function renderNowShowing(data){
    document.getElementById('now-showing-movies').innerHTML='';
    const movies = data.results;
    const movieBlock = createHomeMovieContainer(movies);
    document.getElementById('now-showing-movies').appendChild(movieBlock);
}

function nowShowing(){
    const nowShowingUrl = API_URL + 'movie/now_playing?api_key=' + API_KEY;

    fetch(nowShowingUrl)
        .then((res) => res.json())
        .then((data) => {renderNowShowing(data)})
        .catch((error) => {
            console.log('Error: ',error)
        })
}

//Initialize Search
searchStart(valueSearch[1]);
detailPage(valueSearch[1]);
nowShowing();
popular();
topRated();
comingSoon();
