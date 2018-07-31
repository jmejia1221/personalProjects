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

let people = function(response) {
    let data = response
    let peopleLen = data.results.length
    console.log(data.results[0])
    
    return get(data.results[0].homeworld)
}

let homeworld = function(homeworld) {
    homeworld = homeworld
    console.log(homeworld)
}

get(swApi)
    .then(people)
    .then(homeworld)
    .catch((err) => _handleError(err))


// const main = document.getElementById('content').innerHTML = scope.data;