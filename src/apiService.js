import { error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '../node_modules/@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import InfiniteScroll from 'infinite-scroll';

import imageTemplate from '../src/tmp.hbs';

const ref = {
  KEY: '22389576-6dc946f066e9adfceedfbeb2d',
  page: 1,
  loadMoreBtn: document.querySelector('.load-btn'),
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loading: document.querySelector('.loading'),
  search: '',

  searchImage(event) {
    event.preventDefault();
    ref.page = 1;
    ref.gallery.innerHTML = '';
    ref.renderImages(event.target.query.value);
    ref.search = event.target.query.value;
  },

  renderImages(search) {
    setTimeout(() => {
      fetch(
        `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${ref.search}&page=${ref.page}&per_page=12&key=${ref.KEY}`,
      )
        .then(response => response.json())
        .then(data => {
          ref.loading.classList.remove('show');
          if (data.hits.length > 0) {
            data.hits.forEach(el =>
              ref.gallery.insertAdjacentHTML('beforeend', `${imageTemplate(el)}`),
            );
            if (ref.gallery.children.length > 12) {
              const { scrollTop, clientHeight } = document.documentElement;
              window.scrollTo({
                top: scrollTop + clientHeight,
                behavior: 'smooth',
              });
            }
          } else if (
            data.totalHits === ref.gallery.children.length &&
            ref.gallery.children.length > 0
          ) {
            error({ delay: 3500, text: 'No more images in this category' });
          } else error({ delay: 3500, text: 'Such images are not found' });
        });
    }, 100);
  },

  showMore() {
    ref.page += 1;
    ref.renderImages(ref.form.query.value);
  },
};

const infScroll = new InfiniteScroll('.gallery', {
  path: function () {
    return (
      'https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=' +
      ref.search +
      '&page=' +
      (this.pageIndex + 1) +
      '&per_page=12&key=' +
      ref.KEY
    );
  },
  responseType: 'text',
  status: '.scroll-status',
  history: false,
});

infScroll.on('load', function (response) {
  const data = JSON.parse(response);
  ref.loading.classList.add('show');
  data.hits.forEach(el => ref.gallery.insertAdjacentHTML('beforeend', `${imageTemplate(el)}`));
  const { scrollTop, clientHeight } = document.documentElement;
  window.scrollTo({
    top: scrollTop + clientHeight,
    behavior: 'smooth',
  });
  ref.loading.classList.remove('show');
  if (data.total % 12 === this.loadCount) {
    error({ delay: 3500, text: 'В этой категории больше нет изображений' });
    infScroll.off;
  }
});

export default ref;
