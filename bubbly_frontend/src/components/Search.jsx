import React, {useState,useEffect} from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import {feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';
import empty from '../assets/search.svg';


const Search = ({searchTerm}) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if(searchTerm){
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      
      client.fetch(query).then((data)=>{
        setPins(data);
        
        setLoading(false);
      })
    }else{
      client.fetch(feedQuery).then((data)=>{
        setPins(data);
        
        setLoading(false);
      })
    }
    
  }, [searchTerm])
  

  return (
    <div>
      {loading && <Spinner message="Mencari gambar..."/>}
      {pins?.length !== 0 && <MasonryLayout pins={pins}/>}
      {pins?.length === 0 && searchTerm !== '' && 
      <div className="mt-10 text-center text-xl font-bold text-gray-700 flex flex-col">
        <img src={empty} className="w-auto h-340" />
        Gambar tidak ditemukan!
      </div>}
    </div>
  )
}

export default Search