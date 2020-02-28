const http = {
  POST (url, body = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.responseType = 'json'
      xhr.setRequestHeader('Content-Type', "application/json")
      xhr.onload = () => {
        if (xhr.status >=400) {
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
        if (xhr.status >=400) {
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
      return http.GET(`${apiURL}/top-headlines?country=${country}&apiKey=${apiKey}`)
    },
    getEveryThing(query) {
      return http.GET(`${apiURL}/everything?q=${query}&apiKey=${apiKey}`)
    },
  }
})();

// init selects and load start newses
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews();
});

function loadNews() {
  newsService.getTopHeadLines('ru')
  .then((newsData) => {
    console.log(newsData);
    renderNews(newsData.articles);
  });
}

// Function render
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  let fragment = '';
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML('afterbegin', fragment);
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
