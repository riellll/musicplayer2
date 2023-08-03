const rangeBar = document.querySelector(".rangeBar");
const audio = document.querySelector(".audio");
const playPause = document.querySelector("#playPause");
const time = document.querySelector(".time");
const title = document.querySelector(".other_title");
const lyrics = document.querySelector(".lyricsBox_1");
const box_1 = document.querySelector(".box-1");
const playButton = document.querySelector(".playButton");

// swiper
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let lyricsID = "";

 ////// this is the function to fetch Data in rapid api to display in Web //////
const musicData = async () => {
  const album =
    "https://spotify23.p.rapidapi.com/search/?q=adam levine&type=multi&offset=0&limit=10&numberOfTopResults=5";
  const artists =
    "https://spotify23.p.rapidapi.com/artist_related/?id=2w9zwq3AktTeYYMuhMjju8";
  const options1 = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": `179aa4b3e9msh25a7461566c2560p1cae82jsnc4f8cf204022`,
      "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
    },
  };

  const song_lyrics = `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${lyricsID}`;
  const artist_adamLivine =
    "https://genius-song-lyrics1.p.rapidapi.com/search/?q=adam%20levine&per_page=10&page=1";
  const options2 = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": `751d488d52msh4e7bf83c0688c4bp198c80jsn9f7656191a1d`,
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
    },
  };
  console.log(lyricsID);
  try {
    const album_res = await fetch(album, options1);
    const artists_res = await fetch(artists, options1);
    const lyrics_res = await fetch(song_lyrics, options2);
    const adam_res = await fetch(artist_adamLivine, options2);
    const album_result = await album_res.json();
    const artists_result = await artists_res.json();
    const lyrics_result = await lyrics_res.json();
    const adam_result = await adam_res.json();
    // console.log(album_result,artists_result);
    return { album_result, artists_result, lyrics_result, adam_result };
  } catch (error) {
    console.error(error);
  }
};

 ////// this is the function to generate the cards of the other album of artist //////
const carousel_album = async () => {
  const { album_result } = await musicData();
  // console.log(album_result.albums.items[0].data.coverArt.sources[0]);
  const data = album_result.albums.items;
  data.forEach((item, index) => {
    // console.log(item.data.coverArt.sources[0].url);
    if (index === 6) return;
    const image = item.data.coverArt.sources[0].url;
    const uri = item.data.uri;
    const name = item.data.name;
    const date = item.data.date.year;
    const li = document.createElement("li");
    li.classList.add("card");
    li.innerHTML = `
<li class="card">
<a href="${uri}" target="_blank">
<div class="img"><img src="${image}" draggable="false"></div>
    <h2>${name}</h2>
    <span>${date}</span>
    </a>
          </li>
  `;

    carousel.appendChild(li);
  });
};

 ////// this is the function to generate the cards of the related artist //////
const carousel_artist = async () => {
  const { artists_result } = await musicData();
  const data = artists_result.artists;
  console.log(data);
  data.forEach((item, index) => {
    // console.log(item.data.coverArt.sources[0].url);
    const image = item.images[0].url;
    const uri = item.external_urls.spotify;
    const name = item.name;
    const li = document.createElement("li");
    li.classList.add("card");
    li.innerHTML = `
<li class="card">
<a href="${uri}" target="_blank">
<div class="img"><img src="${image}" draggable="false"></div>
    <h2>${name}</h2>
    </a>
          </li>
  `;

    carousel.appendChild(li);
  });
};

  ////// this is the function to generate the lyrics //////
const music_lyrics = async () => {
  const { lyrics_result } = await musicData();
  console.log(lyrics_result);
  const { html } = lyrics_result.lyrics.lyrics.body;
  const html_lyrics = html.replace(/(\r\n|\r|\n)/g, "<br>");
  console.log(html_lyrics);
  const div = document.createElement("div")
  div.classList.add("lyricsBox_1")
    carousel.innerHTML = "";
    div.innerHTML = html_lyrics
    // carousel.innerHTML = "";
    // lyrics.innerHTML = "";
    // lyrics.innerHTML = html_lyrics;
    carousel.appendChild(div);
  };

  ////// this is the function to the music player//////
let num = 0;
let numOfSong = [];
const music_adamLavine = async (num = 0) => {
  const { adam_result } = await musicData();
  // const box_11 = document.querySelector(".box-1");
  if (!numOfSong[0]) {
    numOfSong.push(adam_result.hits.length);
  }
  const image = adam_result.hits[num].result.header_image_thumbnail_url;
  const title = adam_result.hits[num].result.title;
  const name = adam_result.hits[num].result.artist_names;
  lyricsID = adam_result.hits[num].result.id;
  music_lyrics();
  console.log(lyricsID);
  console.log(numOfSong, image, title, name);

  box_1.removeChild(box_1.children[0]);

  /*   const img = document.createElement("img");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  img.src = image;
  img.alt = title;
  h2.innerHTML = title;
  p.innerHTML = name; */
  // box_1.appendChild(img);
  // box_1.appendChild(h2);
  // box_1.appendChild(p);

  const box = `  <div class="box-2"> <img
  src="${image}"
  alt="album-cover"
/> 
<h2>${title}</h2>
<p>${name}</p>  </div>
`;

  box_1.insertAdjacentHTML("afterbegin", box);
};

music_adamLavine();

//////// this is the navigation in the Lyrics, Other album and Related Artist/////////
const navigate = (e) => {
  // event.preventDefault()
  const active = document.querySelector(".active");
  console.log(e.target, active);

  const li = document.createElement("li");
  li.classList.add("card");


  if (e.target.textContent === "Lyrics") {
    active.classList.remove("active");
    e.target.classList.add("active");

    music_lyrics();
  } else if (e.target.textContent === "Other Album") {
    active.classList.remove("active");
    e.target.classList.add("active");
    carousel.innerHTML = "";
    carousel.appendChild(li);
    carousel_album();
  } else if (e.target.textContent === "Related Artists") {
    active.classList.remove("active");
    e.target.classList.add("active");
    carousel.innerHTML = "";
    carousel.appendChild(li);
    carousel_artist();
  } else {
    return;
  }
};


////// this is the controller of the next and prev button  //////
const controller = async (e) => {
  // console.log(e.target);

  let ranNum = Math.floor(Math.random() * numOfSong.length);

  // console.log(nextSong);
  // console.log(numOfSong);
  if (e.target.classList.contains("fa-backward-step")) {
    console.log(numOfSong);
    console.log(num);
    if (num === 0) return;
    num--;
    music_adamLavine(num);
    console.log(num);
  } else if (e.target.classList.contains("fa-forward-step")) {
    console.log(numOfSong);
    console.log(num);
    if (num + 1 === numOfSong) return;
    num++;
    music_adamLavine(num);
    console.log(num);
  }
};

/////////// this is the play and pause button ////
const playSong = (e) => {
  // console.log(e.target);
if (e.target.className.includes("fa-circle-play")) {
  // audio.play();
  e.target.classList.remove("fa-circle-play");
  e.target.classList.add("fa-circle-pause");
} else {
  // audio.pause();
  e.target.classList.remove("fa-circle-pause");
  e.target.classList.add("fa-circle-play");
}
}; 

window.addEventListener("load", () => {
  // audio.pause();
  // carousel_album();
  // carousel_artist();
  // music_lyrics();
  // musicData();
});


/* audio.onloadedmetadata = function () {
  rangeBar.max = audio.duration;
  rangeBar.value = audio.currentTime;
  //   console.log(rangeBar.max);
}; */



/* if (audio.play()) {
  setInterval(() => {
    rangeBar.value = audio.currentTime;
    // time.childNodes[0].textContent = Math.floor(audio.currentTime)
    let seconds = Math.floor(audio.currentTime % 60);
    let minutes = Math.floor(audio.currentTime / 60);
    time.childNodes[0].textContent =
      "0" + minutes + ":" + (seconds >= 10 ? seconds : "0" + seconds);
    // console.log(audio.currentTime % 60);
  }, 200);
} */

rangeBar.onchange = () => {
  audio.play();
  audio.currentTime = rangeBar.value;
  playButton.classList.remove("fa-circle-play");
  playButton.classList.add("fa-circle-pause");
};




/////// this is the swiper ////////////

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});
const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");

  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};
const dragging = (e) => {
  if (!isDragging) return; 
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};
const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};
const infiniteScroll = () => {

  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
 
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};
const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; 
  
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

title.addEventListener("click", navigate);
playPause.addEventListener("click", playSong);
playButton.addEventListener("click", controller);
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
