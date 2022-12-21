import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/Pokedex/Pagination'
import PokeCard from '../components/Pokedex/PokeCard'


const Pokedex = () => {

  const { trainer } = useSelector(state => state)

  const [pokemons, setPokemons] = useState()
  const [types, setTypes] = useState()
  const [typeSelected, setTypeSelected] = useState('All pokemons')

  const navigate = useNavigate()

  useEffect(() => {
  if(typeSelected !== "All pokemons"){
    axios.get(typeSelected)
    .then(res => setPokemons(res.data.pokemon.map(e => e.pokemon)))
    .catch(err => console.log(err))
  }else {
    const URL = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=9999999'
    axios.get(URL)
    .then(res => setPokemons(res.data.results))
    .catch(err => console.log(err))
    }
  }, [typeSelected])

  useEffect(() => {
    const URL = 'https://pokeapi.co/api/v2/type'
    axios.get(URL)
    .then(res => setTypes(res.data.results))
    .catch(err => console.log(err))
  },[] )

  const handleSubmit = e => {
  e.preventDefault()
  const input = e.target.search.value.trim().toLowerCase()
  navigate(`/pokedex/${input}`)
  }

  const handleChange = e => {
    setTypeSelected(e.target.value)
    setpage(1)
  }

  //logica de la paginacion
  const [page, setpage] = useState(1)
  const [pokePerPage, setPokePerPage] = useState(8)
  const initialPoke = (page - 1) * pokePerPage
  const finalPoke = page * pokePerPage
  const maxPage = pokemons && Math.ceil(pokemons.length / pokePerPage)


  return (
    <div>
      <h2>Welcome {trainer}, here you can find your favorite Pokemon. </h2>
      <form onSubmit={handleSubmit} >
        <input id='Search' type="text" />
        <button>Search</button>
      </form>
      <select onChange={handleChange} >
        <option value={'All pokemons'} >All pokemons</option>
        {
          types?.map(type => (
            <option key={type.url} value={type.url}>{type.name}</option>
          ))
        }
      </select>
      <Pagination 
        page={page} 
        maxPage={maxPage}
        setpage={setpage}
      />
      <div className='poke-countaier' >
      {
      pokemons?.slice(initialPoke, finalPoke).map(poke => (
        <PokeCard
            key={poke.url} 
            url={poke.url}
        />
      ))
    }
    </div>
  </div>
  )
}

export default Pokedex