/*------------------------------*/
/*DECLARING ALL VARIABLES NEEDED*/
/*------------------------------*/

let input = document.getElementById('js--search');
let powerOn = false;

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

let pictureLeft = document.getElementById('picture');
let powerButton = document.getElementById('powerButton');
let redLight = document.getElementById('redLight');
let yellowLight = document.getElementById('yellowLight');
let greenLight = document.getElementById('greenLight');
let statsScreen = document.getElementById('stats');
let statsLeft = document.getElementById('stats-left');
let statsRight = document.getElementById('stats-right');
let flavorTextBox = document.getElementById('flavorText');
let searchBox = document.getElementById('js--search');
let evolutionBox = document.getElementsByClassName('evolution');

let dispPokeID = document.getElementById('js--pokeID');
let dispPokeName = document.getElementById('js--pokeName');
let dispPokeType = document.getElementById('js--pokeType');
let dispPokeHeight = document.getElementById('js--pokeHeight');
let dispPokeWeight = document.getElementById('js--pokeWeight');
let dispPokeMoves = document.getElementById('js--pokeMoves');
let dispPokeImage = document.getElementById('js--pokeImage');
let dispPokeFlavorText = document.getElementById('js--pokeFlavorText');
let dispPokeSprite = document.getElementsByClassName('js--pokeSprite');
let pokeSpriteTooltip = document.getElementsByClassName('js--pokeSpriteTooltip');

/*------------------------*/
/*POWER ON AND OFF POKEDEX*/
/*------------------------*/
//POKEDEX ALWAYS OFF ON LOAD

clearPokedex();
pictureLeft.style.backgroundColor = "#494949";
dispPokeImage.style.visibility = "hidden";
dispPokeID.style.visibility= "hidden";
powerButton.classList.add('powerButtonOff');
powerButton.classList.remove('powerButtonOn');
redLight.classList.add('powerButtonOff');
redLight.classList.remove('redLightOn');
yellowLight.classList.add('powerButtonOff');
yellowLight.classList.remove('yellowLightOn');
greenLight.classList.add('powerButtonOff');
greenLight.classList.remove('greenLightOn');
statsScreen.style.background = '#003300';
statsLeft.style.visibility = 'hidden';
statsRight.style.visibility = 'hidden';
flavorTextBox.style.visibility = 'hidden';
searchBox.style.backgroundColor = '#003300';
searchBox.setAttribute('placeholder', '');
for(i=0;i<evolutionBox.length;i++){
    evolutionBox[i].classList.add('evolutionOff');
}



document.getElementById('powerButton').addEventListener('click', function(){
    if (powerOn === false) {
        powerButton.classList.add('powerButtonOn');
        powerButton.classList.remove('powerButtonOff');
        setTimeout(()=>{
            redLight.classList.add('redLightOn');
            redLight.classList.remove('powerButtonOff');
        },200)
        setTimeout(()=>{
            yellowLight.classList.add('yellowLightOn');
            yellowLight.classList.remove('powerButtonOff');
        },400)
        setTimeout(()=>{
            greenLight.classList.add('greenLightOn');
            greenLight.classList.remove('powerButtonOff');
        },600)
        setTimeout(()=>{
            pictureLeft.style.backgroundColor = "#fff";
            dispPokeImage.style.visibility = "visible";
            dispPokeImage.src = "IMG/oak.gif";
            statsScreen.style.background = '#30da0c';
            searchBox.style.backgroundColor = '#30da0c';
            searchBox.setAttribute('placeholder', 'enter id or name');
            powerOn = true;
        }, 800)


    } else {

        setTimeout(()=>{
            greenLight.classList.add('powerButtonOff');
            greenLight.classList.remove('greenLightOn');
        },200)
        setTimeout(()=>{
            yellowLight.classList.add('powerButtonOff');
            yellowLight.classList.remove('yellowLightOn');
        },400)
        setTimeout(()=>{
            redLight.classList.add('powerButtonOff');
            redLight.classList.remove('redLightOn');
        }, 600)
        setTimeout(()=>{
            clearPokedex();
            pictureLeft.style.backgroundColor = "#494949";
            dispPokeImage.style.visibility = "hidden";
            dispPokeID.style.visibility= "hidden";
            powerButton.classList.add('powerButtonOff');
            powerButton.classList.remove('powerButtonOn');
            statsScreen.style.background = '#003300';
            statsLeft.style.visibility = 'hidden';
            statsRight.style.visibility = 'hidden';
            flavorTextBox.style.visibility = 'hidden';
            searchBox.style.backgroundColor = '#003300';
            searchBox.setAttribute('placeholder', '');
            for(i=0;i<evolutionBox.length;i++){
                evolutionBox[i].classList.add('evolutionOff');
                evolutionBox[i].classList.remove('evolutionOn');
            }
            powerOn = false;
        },800)

    }
})

/*-------------------------*/
/*HELP BUTTON*/
/*------------------------*/

document.getElementById('js--helpButton').addEventListener('click', function(){
    alert('working on it');
})

/*-------------------------*/
/*CALL API ON SEARCH CLICK*/
/*------------------------*/

document.getElementById("js--searchButton").addEventListener("click", function(){
    if(powerOn===true){
        clearPokedex();
        let userInput = input.value.toString().toLowerCase();
        if (userInput.endsWith("mime")){
            userInput = 'mr-mime';
        }
        if (userInput.endsWith("rime")){
            userInput = 'mr-rime';
        }
        if (userInput.startsWith("mime")){
            userInput = 'mime-jr';
        }
        (async () =>
        {
            try {
                await fillPokedex(userInput);
            } catch (error) {
                dispPokeImage.src="IMG/error.png";
            }
        })();
    } else {
        input.value = '';
    }

})

/*------------------------------------*/
/*CLICK BLUE BUTTON FOR RANDOM POKEMON*/
/*------------------------------------*/

document.getElementById('js--randomPokemon').addEventListener('click', function(){
    if (powerOn === true){
        clearPokedex();
        (async () =>
        {
            try {
                let count = await getPokemonCount();
                let randomID = Math.floor(Math.random() * count);
                await fillPokedex(randomID);
            } catch (error) {
                dispPokeImage.src="IMG/error.png";
            }
        })();
    } else {
        input.value = '';
    }
})

/*------------------------------------------*/
/*GO TO EVOLUTION WHEN THE SPRITE IS CLICKED*/
/*------------------------------------------*/

function goToEvo(evolution){
    clearPokedex();
    (async () =>
    {
        try {
            await fillPokedex(evolution);
        } catch (error) {
            dispPokeImage.src="IMG/error.png";
        }
    })();
}


/*----------*/
/*FUNCTIONS*/
/*---------*/

async function fillPokedex(userInput){
    //clear searchbar
    input.value='';
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

    dispPokeID.style.visibility= "visible";
    statsLeft.style.visibility = 'visible';
    statsRight.style.visibility = 'visible';
    flavorTextBox.style.visibility = 'visible';

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
        pokeSpriteTooltip[x].title = poke.name;
        evolutionBox[x].classList.add('evolutionOn');
        evolutionBox[x].classList.remove('evolutionOff');
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
    console.log(pokeData);

    let pokeSpecies = await fetch(pokeData.species.url);
    pokeSpecies= await pokeSpecies.json();
    console.log(pokeSpecies);

    let evoChainURL = pokeSpecies.evolution_chain.url;
    let evoChain = await fetch(evoChainURL);
    evoChain = await evoChain.json();

    evoChain = evoChain.chain;
    let evoChainArray =[];
    if (evoChain.evolves_to.length === 1){
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
        }

    }else {
        let chain = evoChain.evolves_to;
        console.log(chain);
        for(i=0;i<chain.length;i++){
            let evoMultiData = chain[i].species;
            let evoName = evoMultiData.name;
            console.log(evoName);
            console.log(pokeData.name);
            //let evoData = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}/`);
           // evoData = await evoData.json();
            //let evoSprite = evoData.sprites.front_default;
            let evo = {
                name: evoName,
                //sprite: evoSprite
            };
            console.log(evo);
            evoChainArray.push(evo);
        }
        //wittle down the evolution array to show only eevee + 5 random evolutions
        do{
            let x = Math.floor(Math.random() * evoChainArray.length)+1;
            evoChainArray.splice(x,1);
        } while (evoChainArray.length>6);
    }
    return evoChainArray;
}


async function getPokemonCount ()
{
    let pokeData = await fetch("https://pokeapi.co/api/v2/pokemon/");
    pokeData = await pokeData.json();
    return pokeData.count;
}

function clearPokedex(){
    for (i=0; i<dispPokeSprite.length;i++){
        dispPokeSprite[i].src='';
        dispPokeSprite[i].value='';
        pokeSpriteTooltip[i].title = '';
        dispPokeSprite[i].style.visibility = "hidden";

    }
    dispPokeID.style.visibility= "hidden";
    dispPokeID.innerText = '';
    dispPokeName.innerText = '';
    dispPokeType.innerText = '';
    dispPokeHeight.innerText = '';
    dispPokeWeight.innerText = '';
    dispPokeMoves.innerHTML = '';
    dispPokeImage.src = 'IMG/loading.gif';
    dispPokeFlavorText.innerHTML = '';
    for(j=0;j<evolutionBox.length;j++){
        evolutionBox[j].classList.add('evolutionOff');
        evolutionBox[j].classList.remove('evolutionOn');
    }
}
