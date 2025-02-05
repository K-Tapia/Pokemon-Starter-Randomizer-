import { useState } from "react";
import "./App.css";
import Pokeball from "./assets/PokeballShaking.gif";
//import PokeDB from "./PokemonStarterTempDB.json";
import { useEffect, useRef } from "react";



/**
 * await fetch(url, {
 *  method: "POST",
 * body: {
 * kanto: }
 * })
 */


function App() {
  const [johtoSelected, setjohto] = useState(false);
  const [hoennSelected, sethoenn] = useState(false);
  const [kantoSelected, setkanto] = useState(false);
  const [fireSelected, setFire] = useState(false);
  const [waterSelected,setWater]= useState(false);
  const[grassSelected,setGrass]= useState(false);
  const[electricSelected,setElectric]=useState(false);

  const [filterData, setFilterData] = useState([]);

  const buttonStatus = {
    kanto: kantoSelected,
    johto: johtoSelected,
    hoenn: hoennSelected,
    //Typing filter
    fire: fireSelected,
    water:waterSelected,
    grass:grassSelected,
    electric:electricSelected,
  };
  //this will be altered later when ran by the json list
  const [pokemon, setPokemon] = useState({
    pokeName: "",
    pokeNum: 0,
    pokeType: "",
    pokeImage: "",
    pokeDescription: "",
  });
  //This will be changed once the generate button is clicked to an updated prompt
  const [prompt, setPrompt] = useState(
    "Welcome To Pokemon Starter Generator. Click on the Generate Button to Generate a Starter."
  );
  const [numPrompt, setNumPrompt] = useState("");
  //Image will change once the button is clicked
  const [starterImage, setOpeningImage] = useState(Pokeball);
  //This will store the entirety of the json file into this list.
  const [pokemonList, setPokemonList] = useState([]);

  const [pokemonStyles, setPokemonStyles] = useState({
    name: {},
    type: {},
    info: {},
  });
  //Here im going to define a default value that i can call back to if i need to reset the array
  const defaultArray= [ "Bulbasaur",
    "Charmander",
    "Squirtle",
    "Torchic",
    "Chikorita",
    "Totodile",
    "Mudkip",
    "Treecko",
    "Cyndaquil",];
  const [pokeNameArray, setPokeNameArray] = useState([
    "Bulbasaur",
    "Charmander",
    "Squirtle",
    "Torchic",
    "Chikorita",
    "Totodile",
    "Mudkip",
    "Treecko",
    "Cyndaquil",
  ]);
  //handles how our generate button will work by interacting with the json db
  const generateButtonLogic = async () => {
    //Trying new way to fetch data
    const randomArr = Math.floor(Math.random() * pokeNameArray.length);
    const randomPokeName = pokeNameArray[randomArr];
    try {
      const response = await fetch(
        `http://localhost:10000/api/pokemon/pokeName/${randomPokeName}`
        
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.status}`);
      }

      const selectedPokemon = await response.json();
      if (selectedPokemon.error) {
        throw new Error(selectedPokemon.error);
      }
      setPokemon(selectedPokemon);

      console.log("Selected Pokemon:", selectedPokemon);
      console.log("Pokemon List Length:", pokemonList.length);
      setNumPrompt(`Pokedex Entry: ${selectedPokemon.pokeNum}`);
      setPrompt("Generate Again?");
      setOpeningImage(`/images/${selectedPokemon.pokeImage}`);

      setPokemonStyles({
        name: {
          fontWeight: "bold",
          fontSize: "1.5em",
          margin: "10px 0",
        },
        type: {
          display: "inline-block",
          fontWeight: "bold",
          fontSize: "1em",
          margin: "10px 0",
          border: "2px solid #ff0000",
          padding: "2px",
          borderRadius: "5px",
          backgroundColor: "#eeeeee",
        },
        info: {
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#97bcf8cd",
          border: "1px solid #ff0000",
          borderRadius: "5px",
        },
      });
    } catch (error) {
      console.log("error fetching pokemon");
    }
  };

  //This filtercalled will be triggered to change each time the handleSelectedButton function is called onClick
  const [filterCalled, setFilterCalled] = useState(0);
  //Here useEffect will see whenever filterCalled is triggered run the logic for if button is true or false

  // let filterRef=useRef();
  // filterRef= pokemonList;
  useEffect(() => {
    let region = regionref.current;
    console.log(regionref.current);
    console.log(buttonStatus[regionref.current]);
    if (buttonStatus[region] === true) {
      console.log(buttonStatus[region]);
      // console.log("this is the new array "+ JSON.stringify(filterData));
      setPokemonList((prevState) => [...prevState, ...filterData.filter(pokemon=>!prevState.some(currentPoke=>currentPoke.region===pokemon.region))]);
      console.log("     This is whats happening TRUEEE");
    } else {
      console.log(buttonStatus[region]);
      setPokemonList((prevState) =>
        prevState.filter((pokemon) => pokemon.pokeType.toLowerCase().split("/")[0] !== region)
        );
        setPokemonList((prevState)=>prevState.filter((pokemon)=>pokemon.region.toLowerCase()!==region));
  
    }
  }, [filterCalled]);
  useEffect(() => {
    console.log(pokemonList);
    if (pokemonList.length > 0) {
      setPokeNameArray(pokemonList.map((p) => p.pokeName));
    } else {
      setPokeNameArray(defaultArray);
      console.log(pokeNameArray);
    }
  }, [pokemonList]);
  useEffect(() => {
    console.log(
      JSON.stringify(pokeNameArray) + "This is pokeNameARRAY FILTERED"
    );
  }, [pokeNameArray]);

  //this will cause buttons to be selected and retrieve region data.
  let regionref = useRef();
  const handleButtonSelect = async () => {
    const region = regionref.current;
    //console.log(region);
    try {
      const response = await fetch(
        `http://localhost:10000/api/pokemon/region/${region}`
      );
      const newArray = await response.json();
      setFilterData(newArray);
    } catch (error) {
      //console.log ("error Fetching Region");
    }
    setFilterCalled(filterCalled + 1);

    //console.log(JSON.stringify(newArray) +' Array that is being copied ');
  };
  const handleTypeButtonSelect = async () => {
    const type = regionref.current;
    //console.log(region);
    try {
      const response = await fetch(
        `http://localhost:10000/api/pokemon/pokeType/${type}`
      );
      const array = await response.json();
      console.log(array);
      setFilterData(array);
    } catch (error) {

      console.log ("error Fetching type");
    }
    setFilterCalled(filterCalled + 1);

    //console.log(JSON.stringify(newArray) +' Array that is being copied ');
  };

  useEffect(() => {
    const container = document.getElementById("Active-filtered-pokemon");
    if (container) {
      container.innerHTML="";
      pokemonList.forEach((p) => {
        const div = document.createElement("div");
         const pokemonName = document.createElement("p");
        pokemonName.id = `filtered-pokemon`;
        pokemonName.textContent = p.pokeName;

        const pokemonImage = document.createElement("img");
        pokemonImage.id = `filtered-image`;
        pokemonImage.src = `/images/${p.pokeImage}`;
        console.log(pokemonImage);
        pokemonImage.alt = `${p.pokeName} Starter Pokemon`;

        // Append the Pokémon details to the div
        div.appendChild(pokemonName);
        div.appendChild(pokemonImage);

        // Append the div to the container
        container.appendChild(div);
      
      
    });
    }
      
  }, [pokeNameArray],buttonStatus[regionref.current]);

  //console.log(regionref.current+" "+buttonStatus[regionref.current]);
  return (
    <>
      <header>
        <h1>Pokemon Starter Generator</h1>
        {/* {
          [1, 2, 3, 4 ,5, 6].map((number) => {
            return (
              <div>{number}</div>
            )
          })
        } */}
        {
          // EXAMPLE Region List
          /**
           * 
           regionPokemon.map((pokemon) => {
            
            return (
              return something here Kev man

            Create list with associated pokemon per region 
            have randomizer filter pokemon from selected regions
            CCS absolute and relatives
            )
            })
           * 
           * 
           */
        }
      </header>

      <main>
        <div id="center-pic">
          <div id="Active-filtered-pokemon"></div>
        <p id="pokemon-number">{numPrompt}</p>
        <div id="opening-image">
          <img id="starter-image" src={starterImage} alt="Starter Pokemon" />
        </div>
        </div>
      
       
        
        <div id="pokemon-info" style={pokemonStyles.info}>
          <p id="pokemon-name" style={pokemonStyles.name}>
            {pokemon?.pokeName}
          </p>
          <p id="pokemon-type" style={pokemonStyles.type}>
            {pokemon?.pokeType}
          </p>
          <p id="pokemon-description">{pokemon?.pokeDescription}</p>
        
        </div>
        <h2 id="generator-prompt">{prompt}</h2>
        <div id="generate">
          <input
            type="button"
            id="generate-button"
            value="Generate"
            onClick={generateButtonLogic}
          />
        </div>
        <div id="filter-region">
          <input
            type="button"
            id="Kanto"
            value="Kanto Region"
            onClick={() => {
              regionref.current = "kanto";
              handleButtonSelect();
              setkanto(!kantoSelected);
            }}
          />
          <input
            type="button"
            id="Johto"
            value="Johto Region"
            onClick={() => {
              regionref.current = "johto";
              handleButtonSelect();
              setjohto(!johtoSelected);
            }}
          />
          <input
            type="button"
            id="Hoenn"
            value="Hoenn Region"
            onClick={() => {
              regionref.current = "hoenn";
              handleButtonSelect();
              sethoenn(!hoennSelected);
            }}
            
          />
            <input
            type="button"
            id="Fire"
            value="Fire Type"
            onClick={() => {
              regionref.current = "fire";
              handleTypeButtonSelect();
              setFire(!fireSelected);
            }}  
          />
          <input
            type="button"
            id="Water"
            value="Water Type"
            onClick={() => {
              regionref.current = "water";
              handleTypeButtonSelect();
              setWater(!waterSelected);
            }}
          />
          <input
            type="button"
            id="Grass"
            value="Grass Type"
            onClick={() => {
              regionref.current = "grass";
              handleTypeButtonSelect();
              setGrass(!grassSelected);
            }}
          />

        </div>
      
      </main>

      {/**I might add a different footer later on */}
      <footer>
        <p>&copy; 2024 Pokemon Starter Generator</p>
      </footer>
    </>
  );
}

export default App;
