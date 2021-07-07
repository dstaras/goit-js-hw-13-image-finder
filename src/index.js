import ref from './apiService.js';
import * as basicLightbox from 'basiclightbox';

import '../node_modules/basiclightbox/src/styles/main.scss';
import './styles.css';

ref.form.addEventListener('submit', ref.searchImage.bind(ref));

ref.gallery.addEventListener('click', event => {
  basicLightbox
    .create(
      `
    <img width="1400" height="900" src="${event.target.dataset['name']}">
	`,
    )
    .show();
});

const loadMore = function () {
  ref.loading.classList.add('show');
  ref.showMore();
};

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    loadMore();
  }
});
