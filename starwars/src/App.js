import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import "./App.css";
import Pokemon from "./components/Pokemon";
import { filterAndSort } from "./utilities";

const PokemonList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  width: 80rem;
  margin: auto;
`;

const App = () => {
  const [resultsPerPage, setResultsPerPage] = useState(9);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const listResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${resultsPerPage}&offset=${(currentPage - 1) * resultsPerPage}`
      );
      const list = [];
      const { results } = listResponse.data;

      for (const pokemon of results) {
        const pokemonResponse = await axios.get(pokemon.url);
        list.push(pokemonResponse.data);
      }
      setPokemonList(filterAndSort(list));
      setLoading(false);
    };
    fetchData();
  }, [resultsPerPage, currentPage]);

  return (
    <div className="App">
      <h1 className="Header">Pokemon{loading ? " Loading..." : null}</h1>
      <div className="info">
        Showing Pokemon #{(currentPage - 1) * resultsPerPage} - #{(currentPage - 1) * resultsPerPage + resultsPerPage}
      </div>
      <div className="info">
        Pokemon Per Page:{" "}
        <select onChange={(e) => setResultsPerPage(Number(e.target.value))}>
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="9" selected>
            9
          </option>
          <option value="12">12</option>
          <option value="15">15</option>
        </select>
      </div>
      {loading ? (
        "Loading"
      ) : (
        <PokemonList>
          {pokemonList.map((pokemon) => (
            <Pokemon key={pokemon.id} pokemon={pokemon} />
          ))}
        </PokemonList>
      )}
      <button disabled={loading} onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 0)}>
        Previous
      </button>
      <button disabled={loading} onClick={() => setCurrentPage(currentPage + 1)}>
        Next
      </button>
    </div>
  );
};

export default App;
