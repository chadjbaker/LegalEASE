import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import search_icon from "../assets/search.png";
import "../styles/components/Search.css";

// Helper function to see the updates to the database in the console
function callServer() {
  axios.get('http://localhost:8000/test', {
    params: {
      table: 'sample',
    },
  }).then((response) => {
    console.log(response.data);
  });
}


const Search = () => {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState(false);

  const handleSearch = async (input) => {
    if(input === ""){
      alert("Enter search value");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/search/", {
        input
      })
      callServer()
      setSearchData(res.data.query.search);
    } catch (error) {
      console.error("Error in fetching wiki data");
      setSearchData(false);
    }
  }

  useEffect(() => {
    // Defaults to Pizza
    handleSearch("Pizza")
  },[])

  const parser = new DOMParser();
  
  return (
    <div className="search">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img
          src={search_icon}
          alt=""
          onClick={() => handleSearch(inputRef.current.value)}
        />
      </div>
      {searchData ? (
        <div className='search-results'>
          {searchData.map((data, index) => {
            const stringHTML = data ? parser.parseFromString(data.snippet, "text/html") : undefined;
            
            return (
              <>
                <span className='search-title'>
                  {data.title}
                </span>
                <div
                  className="search-snippet"
                  key={index}
                  dangerouslySetInnerHTML={{ __html: stringHTML.body.innerHTML }} />
              </>
            )
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Search