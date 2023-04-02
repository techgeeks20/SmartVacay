import { useState, useEffect } from "react";

const AutocompleteInput = ({ destination, setDestination }) => {
  const fetchOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
  };
  const [suggestions, setSuggestions] = useState([]);

  const handleInputClick = () => {
    setDestination("");
  };

  const handleSuggestionClick = (description) => {
    setDestination(description);
    setSuggestions([]);
  };

  useEffect(() => {
    if (destination.length > 2) {
      fetch(
        `https://place-autocomplete1.p.rapidapi.com/autocomplete/json?input=${destination}&radius=500`,
        fetchOptions
      )
        .then((response) => response.json())
        .then((response) => setSuggestions(response.predictions))
        .catch((err) => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [destination]);

  return (
    <div className="relative inline-block">
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        onClick={handleInputClick}
        class="px-4 py-2 border focus:ring-[#33ACFF] focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
        placeholder="Paris"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full py-1 mt-1 bg-white border-2 border-gray-300 border-t-0 list-none">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion.description)}
              className="p-2 text-base cursor-pointer hover:bg-gray-100"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
