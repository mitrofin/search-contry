import debounce from 'lodash.debounce';
import fetchCountries from '../js/fetchCountries';
import getRefs from '../js/getRefs';
import countryListTemplate from '../templates/country-list.hbs';
import countryInfoTemplate from '../templates/country-info.hbs';
import * as showNotify from '../js/Pnotify';

/* const debounce = require('lodash.debounce'); */
const refs = getRefs();

refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(event) {
  event.preventDefault();
  const searchData = event.target.value.trim();
  console.log(searchData);
  clearCounrty();
  if (searchData.length === 0) {
    showNotify.ShowInfo();
    clearResult();
    return;
  }
  if (searchData === '') {
    showNotify.showAlert();
    clearResult();
    return;
  }
  fetchCountries(searchData)
    .then(country => {
      if (country.length > 10) {
        showNotify.showAlert();
        /* clearResult();
    clearCounrty(); */
      }
      if (country.length > 1 && country.length < 10) {
        return refs.containerList.insertAdjacentHTML(
          'beforeend',
          countryListTemplate(country)
        );
      }
      if (country.length === 1) {
        return refs.containerList.insertAdjacentHTML(
          'afterbegin',
          countryInfoTemplate(country)
        );
      }
      if (country.status === 404) {
        showNotify.showError();
      }

      /* appendCountries(country); */
    })

    .catch(error => {
      showNotify.showError();
      console.log({ error });
    });
}

/* function appendCountries(country) {
    const markUp = countryListTemplate(country);
    console.log(markUp);
    const markUpName = countryInfoTemplate(country);
    console.log(markUpName);    
} */

function clearResult() {
  refs.searchForm.value = '';
}

function clearCounrty() {
  refs.containerList.innerHTML = '';
}
