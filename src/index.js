import './css/styles.css';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';
import refs from './refs.js';

const DEBOUNCE_DELAY = 300;
const options = {
  position: 'left-top',
  distance: '100px',
  clickToClose: 'true',
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const query = refs.input.value;

  resetLists();

  if (query === '') {
    return;
  }

  fetchCountries(query)
    .then(data => {
      if (data.length === 1) {
        markUpOneCountry(data[0]);
        return;
      }

      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          options
        );
        return;
      }

      markUpCountriesList(data);
    })
    .catch(error =>
      Notify.failure('Oops, there is no country with that name', options)
    );
}

function markUpOneCountry({ flags, capital, languages, name, population }) {
  const markup = `<h2><img src="${flags.svg}" alt="flag" width ="50"> ${
    name.official
  }</h2>
    <p><span>Capital</span>: ${capital}</p>
    <p><span>Population</span>: ${population}</p>
    <p><span>Languages</span>: ${Object.values(languages)}</p>
    `;

  refs.oneCountryBox.insertAdjacentHTML('beforeend', markup);
}

function markUpCountriesList(list) {
  const markup = list
    .map(item => {
      const { name, flags } = item;
      return `<li><img src="${flags.svg}" alt="flag" width ="25"> ${name.official}</li>`;
    })
    .join('');

  refs.countriesList.insertAdjacentHTML('beforeend', markup);
}

function resetLists() {
  refs.countriesList.innerHTML = '';
  refs.oneCountryBox.innerHTML = '';
}
