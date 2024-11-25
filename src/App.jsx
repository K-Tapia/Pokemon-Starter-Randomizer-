import { useState } from 'react';
import './App.css';
import Pokeball from "./assets/PokeballShaking.gif";
import PokeDB from "./PokemonStarterTempDB.json";
import {useEffect} from 'react';
function App() {
  //this will be altered later when ran by the json list
  const [pokemon, setPokemon] = useState({
   pokeName:"",
        pokeNum:0,
        pokeType:"",
        pokeImage:"",
        pokeDescription:"" 
  });
  //This will be changed once the generate button is clicked to an updated prompt
  const [prompt, setPrompt] = useState(
    "Welcome To Pokemon Starter Generator. Click on the Generate Button to Generate a Starter."
  );
  const [numPrompt, setNumPrompt] = useState(
    ""
  );
  //Image will change once the button is clicked 
  const [starterImage, setOpeningImage]= useState(
    Pokeball
  );
  //This will store the entirety of the json file into this list.
  const [pokemonList, setPokemonList]= useState([]);

  const [pokemonStyles, setPokemonStyles] = useState({
    name: {},
    type: {},
    info: {},
  });

  //Essentially retrieving our json db
  useEffect(()=>{
    //console.log("Loaded PokeDB: ",PokeDB);
   setPokemonList(PokeDB.pokemon);
  }
  ,[]);

  //handles how our generate button will work by interacting with the json db
  const generateButtonLogic= () =>{
    const randomArr= Math.floor(Math.random()*pokemonList.length);
    //console.log("Pokemon List Length in Button Logic:", pokemonList.length);
    const selectedPokemon= pokemonList[randomArr];
   
    setPokemon(selectedPokemon); 
    setNumPrompt(`Pokedex Entry: ${selectedPokemon.pokeNum}`);
    setPrompt("Generate Again?");
    setOpeningImage(`/images/${selectedPokemon.pokeImage}`);

   
  setPokemonStyles({
    name: {
      fontWeight: 'bold',
      fontSize: '1.5em',
      margin: '10px 0',
    },
    type: {
      display: 'inline-block',
      fontWeight: 'bold',
      fontSize: '1em',
      margin: '10px 0',
      border: '2px solid #ff0000',
      padding: '2px',
      borderRadius: '5px',
      backgroundColor: '#eeeeee',
    },
    info: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: '#97bcf8cd',
      border: '1px solid #ff0000',
      borderRadius: '5px',
    }
  });

  };
    

  return (
    <>
      <header>
        <h1>Pokemon Starter Generator</h1>
    </header>
   
        <main> 
            <p id="pokemon-number">{numPrompt}</p>
            <div id="opening-image">
                <img id="starter-image" src={starterImage} alt="Starter Pokemon"/>
            </div>
              <div id="pokemon-info"style={pokemonStyles.info}>
                <p id="pokemon-name" style={pokemonStyles.name}>{pokemon?.pokeName}</p>
                <p id="pokemon-type" style={pokemonStyles.type}>{pokemon?.pokeType}</p>
                <p id="pokemon-description">{pokemon?.pokeDescription}</p>
                 </div>
            <h2 id="generator-prompt">{prompt}</h2>
            <div id="generate">
                <input type="button" id="generate-button" value="Generate" onClick={generateButtonLogic}/>
            </div>
          
        </main>
   
{/**I might add a different footer later on */}
<footer>
      <p>&copy; 2024 Pokemon Starter Generator</p>
    </footer>
    </>
  );
}

export default App
