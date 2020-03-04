const http = {
  POST (url, body = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.responseType = 'json'
      xhr.setRequestHeader('Content-Type', "application/json")
      xhr.onload = () => {
        if (xhr.status >= 400) {
          reject(xhr.response)
        } else {
          resolve(xhr.response)
        }
      }
      xhr.onerror = () => {
        reject(xhr.response)
      }
      xhr.send(JSON.stringify(body));
    })
  },
  GET (url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", url)
      xhr.responseType = 'json'
      xhr.onload = () => {
        if (xhr.status >= 400) {
          reject(xhr.response)
        } else {
          resolve(xhr.response)
        }
      }
      xhr.onerror = () => {
        reject(xhr.response)
      }
      xhr.send();
    })
  },
}

const newsService = (() => {
  const apiKey = '1fb3ba10e4c441648767da4841a18740';
  const apiURL = 'https://newsapi.org/v2';

  return {
    getTopHeadLines(country = "ru") {
      return http.GET(`${apiURL}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`)
    },
    getEveryThing(query) {
      return http.GET(`${apiURL}/everything?q=${query}&apiKey=${apiKey}`)
    },
  }
})();

// Elements
const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];


form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
})
// init selects and load start newses
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews();
});

function loadNews() {
  const country = countrySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
    showLoader();
    newsService.getTopHeadLines(country)
      .then((newsData) => {
        if (!newsData.articles.length) {
          throw new Error({error: 'no news was found'});
        }
        removePreloader();
        renderNews(newsData.articles);
      })
      .catch((error) => {
        showAlert(JSON.stringify(error), 'error-msg');
      });
  } else {
    newsService.getEveryThing(searchText)
      .then((newsData) => {
        if (!newsData.articles.length) {
          throw new Error({error: 'no news was found'});
        }
        removePreloader();
        renderNews(newsData.articles);
      })
      .catch((error) => {
        showAlert(JSON.stringify(error), 'error-msg');
      });
  }
}



// Function render
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = '';
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

function clearContainer(container) {
  let child = container.lastElementChild;
  while(child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

// News item template function
function newsTemplate({ urlToImage, title, url, description }) {
  return `
  <div class="col s6">
    <div class="card">
      <div class="card-image">
        <img src="${urlToImage}">
        <span class="card-title">${title || ''}</span>
      </div>
      <div class="card-content">
        <p>${description || ''}</p>
      </div>
      <div class="card-action">
        <a href="${url}">Read more</a>
      </div>
    </div>
  </div>`
}

function showAlert(msg, type) {
  M.toast({ html: msg, classes: type});
}

// show loader funciton 
function showLoader() {
  const inner = `<div class="progress">
  <div class="indeterminate"></div>
</div>`;
  document.body.insertAdjacentHTML('afterbegin', inner);
}

// remove loader 
function removePreloader() {
  const loader = document.querySelector('.progress');
  if (loader) {
    loader.remove();
  }
}