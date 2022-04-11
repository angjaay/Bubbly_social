import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import {useParams,useNavigate} from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import {userCreatedPinsQuery, userQuery, userSavedPinsQuery} from '../utils/data';
import {client} from '../client';
import MasonryLayout from './MasonryLayout';
import  Spinner  from './Spinner';
import empty from '../assets/question.svg';


const randomImage ='https://source.unsplash.com/1600x900/?nature,photgraphy,technology';

const activeBtnStyles = 'bg-gradient-to-br from-indigo-600  to-blue-600 text-white font-bold p-2 rounded-full w-22 outline-none shadow-lg shadow-indigo-500/50';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Dibuat');
  const [activeBtn, setActiveBtn] = useState('dibuat');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    })
  },[userId])

  useEffect(() => {
    if(text === 'Dibuat'){
      const createdPinsQuery= userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      })
    } else{
      const savedPinsQuery= userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      })
    }

  }, [text, userId])
  

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  }

  if(!user){
    return <Spinner message="Memuat profil..."/>
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src={randomImage} alt="banner-pic" 
              className="w-full h-370 2xl:h-510 shadow-lg object-cover" />
              <img 
                src={user.image} 
                alt=""
                className="rounded-full w-36 h-36 -mt-20 shadow-xl object-cover"
              />
              <h1 className="font-bold text-3xl text-center mt-3">
                {user.userName}
              </h1>
              <div className="absolute top-0 z-1 right-0 p-2">
                {userId === user._id && (
                  <GoogleLogout 
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps)=>(
                    <button
                      type="button"
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21}/>
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  
                  cookiePolicy="single_host_origin"
                />
                )}
              </div>
          </div>
          <div className="text-center mb-7 mt-2">
            <button
              type="button"
              onClick={(e) =>{
                setText(e.target.textContent);
                setActiveBtn('dibuat');
              }}
              className={`${activeBtn === 'dibuat' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Dibuat
            </button>
            <button
              type="button"
              onClick={(e) =>{
                setText(e.target.textContent);
                setActiveBtn('disimpan');
              }}
              className={`${activeBtn === 'disimpan' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Disimpan
            </button>
          </div>
          
          {pins?.length ? (  
            <div className="px-2">
                <MasonryLayout pins={pins}/>
            </div>
          ) : (
            <div className="text-gray-700 flex-col flex justify-center font-bold items-center w-full text-xl mt-2">
              <img src={empty} className="w-auto h-340" />
              Belum ada postingan!
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default UserProfile