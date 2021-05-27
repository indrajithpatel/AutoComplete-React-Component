import "./AutoComplete.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

function AutoComplete() {
  const [state, setState] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const makeClientSideFiltering = (value) => {
    const items = state.filter((item) => {
      if (item["pokemon_species"].name.includes(value)) {
        return item;
      }
    });
    setFilteredItems(items);
  };

  function debounce(func, ms) {
    var timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), ms);
    };
  }

  const onSearch = (event) => {
    const debouncedFunction = debounce(makeClientSideFiltering, 2000);
    debouncedFunction(event.target.value);
  };

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokedex/2/").then((res) => {
      const data = res.data["pokemon_entries"];
      setState(data);
      setFilteredItems(data);
    });
    inputRef.current.addEventListener("focusin", (event) => {
      const current = listRef.current;
      if (current.className.includes("inactive")) {
        current.classList.toggle("inactive");
      }
    });
    inputRef.current.addEventListener("focusout", (event) => {
      const current = listRef.current;
      if (!current.className.includes("inactive")) {
        current.classList.toggle("inactive");
      }
    });
  }, []);

  return (
    <div className="autocomplete">
      <input
        className="autocomplete__search"
        type="text"
        onChange={onSearch}
        ref={inputRef}
      ></input>
      <div className="autocomplete__list inactive" ref={listRef}>
        {filteredItems.map((item, index) => {
          return (
            <li className="autocomplete__list__item" key={item.entry_number}>
              {item["pokemon_species"].name}
            </li>
          );
        })}
      </div>
    </div>
  );
}

export default AutoComplete;
