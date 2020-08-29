// DOM Element initial variable
const imageContainer = document.getElementById("image-container");
const loadingAnimation = document.getElementById("loader");

// Initial Global Variable
let loadNewPhotos = false;
let initialImageLoad = true;
let imagesLoaded = 0;
let totalImage = 0;
let fetchedPhotosArray = [];

// Unsplash API
let countOfImageToBeFetch = 5;
const apiKey = "XrTnKR_Jf3hZmsjHgTW5Dwepp5zbuteRgzuZ9aOBmcg";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${countOfImageToBeFetch}`;

// Helper Function for set the amount of Image to being fetch
function setCountOfImageToBeFetch(countOfImage) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${countOfImage}`;
}

//Helper Function for add Attributes to Element
function setElementAttributes(element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Check if all image is loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImage) {
    loadNewPhotos = true;
    loadingAnimation.hidden = true;
    countOfImageToBeFetch = 30;
  }
}

// Create Element for Links and Photos, to Add to DOM
function makeFetchedPhotosAsElement() {
  imagesLoaded = 0;
  totalImage = fetchedPhotosArray.length;
  fetchedPhotosArray.forEach((photo) => {
    // create <a></a> link for the photo
    const linkPhoto = document.createElement("a");
    setElementAttributes(linkPhoto, {
      href: photo.links.html,
      target: "_blank",
    });
    // create <img /> for the photo
    const imgPhoto = document.createElement("img");
    setElementAttributes(imgPhoto, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Event Listener, to check if the image is already loaded or not
    imgPhoto.addEventListener("load", () => {
      imageLoaded();
    });
    // put <img /> inside <a></a> and put <a></a> inside imageContainer
    linkPhoto.appendChild(imgPhoto);
    imageContainer.appendChild(linkPhoto);
  });
}

// GET Photos from Unsplash API
async function getPhotosFromUnsplashAPI() {
  try {
    const response = await fetch(apiUrl);
    fetchedPhotosArray = await response.json();
    makeFetchedPhotosAsElement();
    if (initialImageLoad) {
      initialImageLoad = false;
      setCountOfImageToBeFetch(30);
    }
  } catch (err) {
    //catch error here
    console.log(err);
  }
}

// Check to see if scrolling near bottom of page, Load More Photos if it is
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    loadNewPhotos
  ) {
    loadNewPhotos = false;
    getPhotosFromUnsplashAPI();
  }
});

getPhotosFromUnsplashAPI();
