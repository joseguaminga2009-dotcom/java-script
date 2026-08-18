const listaPokemon = document.querySelector("#listaPokemon"),
letURL = "https://pokeapi.co/api/v2/pokemon/";

for (let i =1; i <= 151; i++){
    fetch(URL + i)
        .then((response) => response.json())
        .then (data => console.log(data))
}       

function mostarPokemon(data) {

}