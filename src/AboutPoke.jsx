
import { NavLink, Link,useParams } from "react-router";
import {useEffect,useState} from "react";



const AboutPoke=()=>{
  const {pokeName}=useParams();
  console.log(pokeName);
  const [pokemon, setPokemon]=useState([]);

  useEffect(()=>{
    fetch(`http://localhost:10000/api/pokemon/pokeName/${pokeName}`)
    .then((response)=>response.json())
    .then((data)=>{
      setPokemon(data)
      //console.log(data.pokeImage);
      //console.log(pokemon);
    })
  },[pokeName]);
  if(!pokemon){
    return <h2>Pokemon not found, loading...</h2>
  } 
  return (
      <div>
          
          <h1>{pokemon.pokeName} Pokedex Entry: {pokemon.pokeNum}</h1>
          <img src={`/images/${pokemon.pokeImage}` }></img>
          <p>{pokemon.pokeDescription}</p>

          <button><Link to="/">Return to Generator</Link></button>
      </div>
    );  
};
export default AboutPoke;