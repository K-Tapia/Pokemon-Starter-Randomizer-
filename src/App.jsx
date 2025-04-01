import { useState,useEffect } from "react";
import { NavLink, Link } from "react-router";


import "./App.css";
import Pokeball from "./assets/PokeballShaking.gif";


/**
 * 
 * TODOS 
 * 1.) Remove the dom stuff, and do things the React-y way, which is that map.
 * 2.) clean up code, for instance, you no longer need the defaultArray
 * 3.) Install React Router, use the library doc
 * 4.) Configure the router with routes, just do the home page "/" and an about page.
 */
function App() {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [pokemon, setPokemon] = useState({
    pokeName: "",
    pokeNum: 0,
    pokeType: "",
    pokeImage: "",
    pokeDescription: "",
  });

  const [pokeNameArray, setPokeNameArray] = useState();
  const [pokemons, setPokemons] = useState([])
  const [starterImage, setOpeningImage] = useState(Pokeball);
  const [prompt, setPrompt] = useState("Welcome To Pokemon Starter Generator. Click on the Generate Button to Generate a Starter.");
  const [numPrompt, setNumPrompt] = useState("");

  const generateButtonLogic = async () => {
    const randomIndex = Math.floor(Math.random() * pokeNameArray.length);
    const randomPokeName = pokeNameArray[randomIndex];

    try {
      const response = await fetch(`http://localhost:10000/api/pokemon/pokeName/${randomPokeName}`);
      if (!response.ok) throw new Error(`Failed to fetch Pokémon: ${response.status}`);

      const selectedPokemon = await response.json();
      if (selectedPokemon.error) throw new Error(selectedPokemon.error);

      setPokemon(selectedPokemon);
      setNumPrompt(`Pokedex Entry: ${selectedPokemon.pokeNum}`);
      setPrompt("Generate Again?");
      setOpeningImage(`/images/${selectedPokemon.pokeImage}`);

    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  };

  const handleButtonSelect = (filterKey) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      
      switch(filterKey){
        case "kanto":
        case "johto":
        case "hoenn":
        case "fire":
        case "water":
        case "grass":
          updatedFilters[filterKey]=!updatedFilters[filterKey];
          break;
          default:
            console.log("filter couldn't be read properly",filterKey);
            break;
      }
      return updatedFilters;
    });
  };
  
  
  // UseEffect to fetch filtered data when selectedFilters change
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const response = await fetch("http://localhost:10000/api/pokemon/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedFilters), // Use updated selectedFilters
        });

        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);

        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)){
          setPokeNameArray(data.map((p)=>p.pokeName));
        }else if(data.length===0){
          setPokeNameArray();
        }
        console.log((data));
        // filterList(data);
        setPokemons(data)
      } catch (error) {
        console.error("API fetch error:", error);
      }
    };

    console.log(selectedFilters, "hello")
    if (Object.keys(selectedFilters).length > 0) {
      console.log("here")
      fetchFilteredData();
      console.log("there")
     
    } else if(Object.keys(selectedFilters).length===0){
      // setPokeNameArray(defaultArray);
      fetchFilteredData()
    }
    

  }, [selectedFilters]); //fetch when selectedFilters change

  const filterButtonStyle = (filter, selectedFilters) => {
    return {
      backgroundColor: selectedFilters[filter] ? "#ffcc00" : "#ddd", // Highlight when selected
      color: selectedFilters[filter] ? "#000" : "#333", // Text color based on selection
      border: "1px solid #333",
      padding: "8px 15px",
      margin: "5px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "background-color 0.3s ease", // Smooth transition
    };
  };
  
  return (
    <>
      <header>
        <h1>Pokemon Starter Generator</h1>
      </header>

      <main>
      <div id= 'pokeheader'>
      <p id="pokemon-number">{numPrompt}</p>
      <p id="pokemon-name">{pokemon?.pokeName}</p>
          <p id="pokemon-type">{pokemon?.pokeType}</p>
      </div>
     
            <div id="center-pic">
            <div id="Active-filtered-pokemon">
            {pokemons.map((pokemon) => {
              console.log("pokemon.pokeName:", pokemon.pokeName);
            return (
               <Link to={`/about/${pokemon.pokeName}`} key={pokemon.pokeName}>
                <div key={pokemon.pokeName}>{pokemon.pokeName}
              <img key= {`filterImage${pokemon.pokeImage}`}src= {`./images/${pokemon.pokeImage}` }
              width="40px"
              height="40px"
              />
              </div>
              </Link>
              
              
            )
          })}
            
          </div> 

        
       
        <div id="opening-image">
          <img id="starter-image" src={starterImage} alt="Starter Pokemon" />
        </div>
        </div>
        <div id="pokemon-describe">
          
          <p id="pokemon-description">{pokemon?.pokeDescription}</p>
        </div>

        <h2 id="generator-prompt">{prompt}</h2>
        <div id="generate">
          <input type="button" id="generate-button" value="Generate" onClick={generateButtonLogic} />
        </div>

        {/* Region & Type Filters */}
        {//potentially change this with useRef interacting inside of a switch case function, error with grass type when selected at before anything else.
        }
        <div id="filter-region">
        <input
          type="button"
          id="Kanto"
          value="Kanto Region"
          style={filterButtonStyle("kanto", selectedFilters)}
          onClick={() => handleButtonSelect("kanto")}
        />
        <input
          type="button"
          id="Johto"
          value="Johto Region"
          style={filterButtonStyle("johto", selectedFilters)}
          onClick={() => handleButtonSelect("johto")}
        />
        <input
          type="button"
          id="Hoenn"
          value="Hoenn Region"
          style={filterButtonStyle("hoenn", selectedFilters)}
          onClick={() => handleButtonSelect("hoenn")}
        />
        <input
          type="button"
          id="Fire"
          value="Fire Type"
          style={filterButtonStyle("fire", selectedFilters)}
          onClick={() => handleButtonSelect("fire")}
        />
        <input
          type="button"
          id="Water"
          value="Water Type"
          style={filterButtonStyle("water", selectedFilters)}
          onClick={() => handleButtonSelect("water")}
        />
        <input
          type="button"
          id="Grass"
          value="Grass Type"
          style={filterButtonStyle("grass", selectedFilters)}
          onClick={() => handleButtonSelect("grass")}
        />

        </div>
      </main>

      <footer>
        <nav>
          <button><Link to="/About">About</Link></button>
        </nav>
        <p>&copy; 2024 Pokemon Starter Generator</p>
      </footer>
    </>
  );
}

export default App;
