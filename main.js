const swApi = 'https://www.swapi.co/api/people/'

const get = function(url) {
    return new Promise ((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            const DONE = 4;
            const OK = 200;
            if (this.readyState === DONE) {
                if (this.status === OK) {
                    // Everything Ok
                    resolve(JSON.parse(this.responseText));
                } else {
                    // There was an error
                    reject(new Error(`An error ocurred while perfoming the request ${this.status}`));
                }

            }
        }

        xhr.open('GET', url)
        xhr.send(null)
    })
}

function _handleError(err){
	console.log(`Request failed: ${err}`) 
}

let person = function(persons) {
    return `
        <h4>${persons.name}</h4>
        <ul>
            <li>${persons.height}</li>
            <li>${persons.mass}</li>
            <li>${persons.hair_color}</li>
            <li>${persons.skin_color}</li>
        </ul>
    `;
}

var pageSize = 5;
var pageNum = 1;

let nextPage = function() {
    pageNum++;
    console.log(swApi + '?page=' + pageNum);
    loadData(swApi + '?page=' + pageNum);
    people()
}

let previousPage = function() {
    pageNum--;
    loadData(swApi + '?page=' + pageNum);
    console.log(swApi + '?page=' + pageNum);
}

let  people = function(response) {
    let data = response
    let peopleLen = data.results
    console.log(data.results[0])

    document.getElementById('people').innerHTML = `
        ${peopleLen.map(person).join("")}
    `
    // console.log(peopleLen.map(person).join(""))
    return get(data.results[0].homeworld)
}

let homeworld = function(homeworld) {
    homeworld = homeworld
    console.log(homeworld)
}

let loadData = function(mainApi) {
    get(mainApi)
        .then(people)
        .then(homeworld)
        .catch((err) => _handleError(err))
}

loadData(swApi)