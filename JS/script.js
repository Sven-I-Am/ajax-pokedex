/*------------------------------*/
/*DECLARING ALL VARIABLES NEEDED*/
/*------------------------------*/

let input = document.getElementById('js--search');

let Pokemon = function (id, name, types, moves, sprites, height, weight, flavor_text_entries)
{
    this.id = id;                                                           //this pokemon's ID
    this.name = name;                                                       //this pokemon's name
    this.types = types;                                                     //this pokemon type
    this.moves = moves;                                                     //contains all the moves this pokemon has/can learn
    this.sprites = sprites;                                                 //stores sprites
    this.mainArt = sprites.other['official-artwork'].front_default;         //link to official artwork
    this.height = height;                                                   //this pokemon height
    this.weight = weight;                                                   //this pokemon weight
    this.flavor_text_entries = flavor_text_entries;                         //contains all flavor text for species

}


/*--------------------------*/
/*GETTING FIELDS TO POPULATE*/
/*--------------------------*/

let dispPokeID = document.getElementById('js--pokeID');
let dispPokeName = document.getElementById('js--pokeName');
let dispPokeType = document.getElementById('js--pokeType');
let dispPokeHeight = document.getElementById('js--pokeHeight');
let dispPokeWeight = document.getElementById('js--pokeWeight');
let dispPokeMoves = document.getElementById('js--pokeMoves');
let dispPokeImage = document.getElementById('js--pokeImage');
let dispPokeFlavorText = document.getElementById('js--pokeFlavorText');
let dispPokeSprite = document.getElementsByClassName('js--pokeSprite');

/*-------------------------*/
/*CALL API ON SEARCH CLICK*/
/*------------------------*/

document.getElementById("js--searchButton").addEventListener("click", function(){
    for (i=0; i<dispPokeSprite.length;i++){
        dispPokeSprite[i].src='';
        dispPokeSprite[i].value='';
        dispPokeSprite[i].style.visibility = "hidden";
    }
    (async () =>
    {
        try {
            await fillPokedex(input.value);
        } catch (error) {
            //alert("Pokemon not found!");
        }
    })();
})

/*------------------------------------*/
/*CLICK BLUE BUTTON FOR RANDOM POKEMON*/
/*------------------------------------*/

document.getElementById('js--randomPokemon').addEventListener('click', function(){
    for (i=0; i<dispPokeSprite.length;i++){
        dispPokeSprite[i].src='';
        dispPokeSprite[i].value='';
        dispPokeSprite[i].style.visibility = "hidden";
    }
    (async () =>
    {
        try {
            let count = await getPokemonCount();
            let randomID = Math.floor(Math.random() * count);
            await fillPokedex(randomID);
        } catch (error) {
            //alert("Pokemon not found!");
        }
    })();
})


/*----------*/
/*FUNCTIONS*/
/*---------*/

async function fillPokedex(userInput){
    let pokemon;
    pokemon = await getPokemon(userInput);
    let evoChainArray;
    evoChainArray = await getEvoChain(userInput);

    let pokeID = pokemon.id;
    let pokeName = pokemon.name;
    let pokeTypes= [];
    pokemon.types.forEach(function(poke){
        let type = poke.type;
        pokeTypes.push(type.name);
    })
    pokeTypes = pokeTypes.join(', ');
    let pokeHeight = pokemon.height;
    let pokeWeight = pokemon.weight;
    let pokeMoveNames = [];
    pokemon.moves.forEach(function(poke){
        let move = poke.move;
        let moveName = move.name;
        pokeMoveNames.push(moveName);
    })
    let pokeMoves = [];
    if (pokeMoveNames.length <4){
        for (i=0;i<pokeMoveNames.length;i++) {
            let x = Math.floor(Math.random() * pokeMoveNames.length);
            pokeMoves.push(pokeMoveNames[x]);
        }
    } else {
        for (i=0;i<4;i++) {
            let x = Math.floor(Math.random() * pokeMoveNames.length);
            pokeMoves.push(pokeMoveNames[x]);
        }
    }
    pokeMoves = pokeMoves.join('<br>');
    let pokeImage = pokemon.mainArt;
    let flavorTextEntries = pokemon.flavor_text_entries;
    let flavorTextEntriesEn = [];
    flavorTextEntries.forEach(function(text){
        if (text.language.name==="en"){
            flavorTextEntriesEn.push(text);
        }

    })
    let flavorText= flavorTextEntriesEn[0].flavor_text;

    dispPokeID.innerText = pokeID.toString();
    dispPokeName.innerText = pokeName;
    dispPokeType.innerText = pokeTypes;
    dispPokeHeight.innerText = pokeHeight.toString() + ' ft';
    dispPokeWeight.innerText = pokeWeight.toString() + ' lbs';
    dispPokeMoves.innerHTML = pokeMoves;
    dispPokeImage.src = pokeImage;
    dispPokeFlavorText.innerHTML = flavorText.toString();
    let x = 0;
    evoChainArray.forEach(function(poke){
        dispPokeSprite[x].src = poke.sprite;
        dispPokeSprite[x].addEventListener('click', function(){
            goToEvo(poke.name);
        });
        dispPokeSprite[x].style.visibility = "visible";
        x++;
    })

}

async function getPokemon (userInput)
{
    let pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}/`);
    pokeData = await pokeData.json();
    let pokeSpecies = await fetch(pokeData.species.url);
    pokeSpecies= await pokeSpecies.json();
    return new Pokemon(pokeData.id, pokeData.name, pokeData.types, pokeData.moves, pokeData.sprites, pokeData.height, pokeData.weight, pokeSpecies.flavor_text_entries);
}

async function getEvoChain(userInput){
    let pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}/`);
    pokeData = await pokeData.json();
    let pokeSpecies = await fetch(pokeData.species.url);
    pokeSpecies= await pokeSpecies.json();
    let evoChainURL = pokeSpecies.evolution_chain.url;
    let evoChain = await fetch(evoChainURL);
    evoChain = await evoChain.json();
    evoChain = evoChain.chain;
    let evoChainArray =[];
    let evo1Name = evoChain.species.name;
    let evo1Data = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo1Name}/`);
    evo1Data = await evo1Data.json();
    let evo1Sprite = evo1Data.sprites.front_default;
    let evo1 = {
        name: evo1Name,
        sprite: evo1Sprite
    };
    evoChainArray.push(evo1);
    if (evoChain.evolves_to.length === 1){

        let chain = evoChain.evolves_to;
        let chainData = chain[0];
        let evo2Name = chainData.species.name;
        let evo2Data = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo2Name}/`);
        evo2Data = await evo2Data.json();
        let evo2Sprite = evo2Data.sprites.front_default;
        let evo2 = {
            name: evo2Name,
            sprite: evo2Sprite
        };
        evoChainArray.push(evo2);

        if (chainData.evolves_to.length !== 0){

            let chain2 = chainData.evolves_to;
            let chain2Data = chain2[0];
            let evo3Name = chain2Data.species.name;
            let evo3Data = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo3Name}/`);
            evo3Data = await evo3Data.json();
            let evo3Sprite = evo3Data.sprites.front_default;
            let evo3 = {
                name: evo3Name,
                sprite: evo3Sprite
            };
            evoChainArray.push(evo3);

        }
//POKEMON WITH MULTIPLE EVOLUTIONS//
    } else {

        let chain = evoChain.evolves_to;
        for(i=0;i<chain.length;i++){
            let evoMultiData = chain[i].species;
            let evoName = evoMultiData.name;
            let evoData = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}/`);
            evoData = await evoData.json();
            let evoSprite = evoData.sprites.front_default;
            let evo = {
                name: evoName,
                sprite: evoSprite
            };
            evoChainArray.push(evo);
        }
    }

    return evoChainArray;
}

function goToEvo(evolution){
    for (i=0; i<dispPokeSprite.length;i++){
        dispPokeSprite[i].src='';
        dispPokeSprite[i].value='';
        dispPokeSprite[i].style.visibility = "hidden";
    }
    (async () =>
    {
        try {
            await fillPokedex(evolution);
        } catch (error) {
            alert("Pokemon not found!");
        }
    })();
}

async function getPokemonCount ()
{
    let pokeData = await fetch("https://pokeapi.co/api/v2/pokemon/");
    pokeData = await pokeData.json();
    return pokeData.count;
}