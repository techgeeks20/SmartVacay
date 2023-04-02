import React, { useState } from "react";
import AutocompleteInput from "../components/AutoCompleteInput";
import OpenAI from "openai-api";
import Navbar from "../components/Navbar";
import ResultModal from "../components/ResultModal";
function Destination({ currentUser }) {
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [hotelString, setHotelString] = useState("");
  const [airesponse, setResponse] = useState("");
  const [attractionString, setAttractionString] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [hotelPrice, setHotelPrice] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const enddateHandler = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (destination === "" || budget === "") {
      alert("Please enter destination and budget");
      return;
    }

    try {
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      const destinationResult = await fetch(
        `https://travel-advisor.p.rapidapi.com/locations/search?query=${destination}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
          },
        }
      );

      const destinationData = await destinationResult.json();
      const latitude = destinationData.data[0].result_object.latitude;
      const longitude = destinationData.data[0].result_object.longitude;
      await delay(1000);

      const attractionsResult = await fetch(
        `https://travel-advisor.p.rapidapi.com/attractions/list?lang=en_US&lunit=km&currency=USD&sort=recommended&latt=${latitude}&limit=5&bookable_first=false&location_id=${destinationData.data[0].result_object.location_id}&longt=${longitude}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
          },
        }
      );
      const attractionsData = await attractionsResult.json();
      setAttractions(attractionsData.data);
      const attractionArray = attractions.map((attraction) => attraction.name);
      const attractionString = attractionArray.join(", ");
      setAttractionString(attractionString);
      await delay(1000);

      const hotelsResult = await fetch(
        `https://travel-advisor.p.rapidapi.com/hotels/list?offset=0&currency=USD&limit=5&order=asc&lang=en_US&sort=recommended&location_id=${destinationData.data[0].result_object.location_id}&adults=1&pricesmax=${budget}&checkin_end=${enddate}&checkin=${startdate}&nights=1&lunit=km&amenities=pool&latitude=${latitude}&bookable_first=false&subcategory=hotel%2Cbb%2Cinn&longitude=${longitude}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
          },
        }
      );
      const hotelsData = await hotelsResult.json();
      setHotels(hotelsData.data);
      const hotelArray = hotels.map(
        (hotel) => `${hotel.name} : ${hotel.price}`
      );
      const hotelString = hotelArray.join(", ");
      await delay(1000);

      const restaurantsResult = await fetch(
        `https://travel-advisor.p.rapidapi.com/restaurants/list?lunit=km&restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&currency=USD&limit=5&lang=en_US&location_id=${destinationData.data[0].result_object.location_id}&adults=1&longitude=${longitude}&latitude=${latitude}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
          },
        }
      );

      const restaurantsData = await restaurantsResult.json();
      setRestaurants(restaurantsData.data);
      await delay(1000);

      const openai = new OpenAI(API_KEY);
      const prompt = `My prime destination is ${destination}. Here is a description of what I want to do: ${description}, and here is a list of attractions: ${attractionString}.
      My budget is ${budget}. Here are a list of hotels I have : ${hotelString}. Based off my description, return to me the best hotel out of the list I gave that I should go to, and the top 3 attractions
      out of my list that fit the description as well. Give me a percentage on a scale from 1-100 on how well those choices fit my description.`;
      const response = await openai.complete({
        engine: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2048,
        n: 1,
        stop: null,
        temperature: 0.5,
      });
      setResponse(response.data.choices[0].text);
      console.log(airesponse);
    } catch (err) {
      console.error(err);
      alert("Error fetching data. Please try again");
    }
    setIsOpen(true);
  };

  return (
    <>
      <Navbar currentUser={currentUser} />
      <form class="bg-gray-100">
        <div>
          <div class="min-h-screen py-6 flex flex-col justify-center sm:py-12">
            <div class="relative py-3 sm:max-w-xl sm:mx-auto">
              <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                <div class="max-w-md mx-auto">
                  <div class="flex items-center space-x-5">
                    <img
                      className="h-10 w-10"
                      src="https://freesvg.org/img/jonadab-Earth-with-continents-separated.png"
                    ></img>
                    <div class="block pl-2 font-semibold text-xl self-start text-gray-700">
                      <h2 class="leading-relaxed">Perfect Destination</h2>
                      <p class="text-sm text-[#33ACFF] font-normal leading-relaxed">
                        Our AI-based tool will find the best destination, just
                        for you!
                      </p>
                    </div>
                  </div>
                  <div class="divide-y divide-gray-200">
                    <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div class="flex flex-col">
                        <label class="leading-loose">
                          Where do you want to go
                        </label>

                        <AutocompleteInput
                          destination={destination}
                          setDestination={setDestination}
                        />
                      </div>
                      <div class="flex flex-col">
                        <label class="leading-loose">Budget</label>
                        <input
                          type="text"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="1000"
                        />
                      </div>
                      <div class="flex items-center space-x-4">
                        <div class="flex flex-col">
                          <label class="leading-loose">Start</label>
                          <div class="relative focus-within:text-gray-600 text-gray-400">
                            <input
                              type="date"
                              class="pr-4 pl-10 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                            <div class="absolute left-3 top-2">
                              <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div class="flex flex-col">
                          <label class="leading-loose">End</label>
                          <div class="relative focus-within:text-gray-600 text-gray-400">
                            <input
                              type="date"
                              class="pr-4 pl-10 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              value={enddate}
                              onChange={enddateHandler}
                            />
                            <div class="absolute left-3 top-2">
                              <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <label class="leading-loose">Description</label>
                        <input
                          type="text"
                          class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="I want to visit many attractions"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="pt-4 flex items-center space-x-4">
                      <button
                        onClick={handleSubmit}
                        class="bg-[#33ACFF] hover:bg-[#0077B6] flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ResultModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        airesponse={airesponse}
      />
    </>
  );
}

export default Destination;
