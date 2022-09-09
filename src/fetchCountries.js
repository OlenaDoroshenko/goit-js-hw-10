


function fetchCountries(x){

    const url = `https://restcountries.com/v3.1/name/${x}?fields=name,capital,population,flags,languages`;    

    return fetch(url).then(response => response.json()).then(data => data);
};


export { fetchCountries};