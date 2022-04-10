import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import notfound from '../assets/not-found.svg';

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if(categoryId){
      const query = searchQuery(categoryId);

      client.fetch(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
    } else{
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    }
  }, [categoryId])
  

  if(loading) return <Spinner message="Kami sedang menambah ide baru pada berandamu!"/>

  if(!pins?.length) return( 
    <div className="text-gray-700 flex justify-center flex-col font-bold items-center w-full text-xl mt-2">
      <img src={notfound} className="w-auto h-600" />
       Belum ada postingan!
    </div>
  )

  return (
    <div>
      { pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed