# Pokedex

[You can find my pokedex here](https://sven-i-am.github.io/ajax-pokedex/)

## The exercise
* create a working Pokedex using the information provided by the [PokeAPI](https://pokeapi.co/)
* use HTML to structure the information
* use JavaScript for adding the required functionalities
* use CSS to make it all look nice

* deadline: 3 days
* solo project

### required functionalities
* You can search a pokémon by name and by ID
* Of said pokémon you need to show:
  * The ID-number
  *  An image (sprite)
  *  At least 4 "moves"
  *  The previous evolution, only if it exists, along with their name and image. Be carefull, you cannot just do ID-1 to get the previous form, for example look into "magmar" - "magmortar". You have to use a seperate api call for this!
  
## Challenges
* using asynchronicity and API calls to this level for the first time
* the evolution chain can get confusing
* the outliers and special forms added an extra layer of difficulty to get working properly
* once the main functionalities were implemented I started adding some extra fun features such as music and text to speech capabilities
* the text to speech uses the web speech API, which I'd never used before
* currently, I am still struggling to make it possible to click through to an evolution, the addEventlistener and removeEventlistener methods are not playing nice

## Disclaimers
I can't take credit for all the styling and html elements, I found the structure and styling on codepen and altered those parts that I needed.
I did however add all the JavaScript functionalities myself.