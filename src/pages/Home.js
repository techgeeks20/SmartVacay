import React from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";
import Globe from "../components/Globe";

const Home = ({ currentUser }) => {
  let history = useHistory();
  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-6xl font-extrabold text-center mb-5">SmartVacay</h1>
        <p class="text-center italic text-black">
          Your perspective will be widened, your life experiences will be
          enhanced, and you will be able to interact with individuals from many
          cultures.
        </p>

        <div className="text-center mb-10">
          <a
            href="/discover"
            className="mt-10 inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-[#FFA726] border border-[#FFA726] rounded-md shadow-sm hover:bg-[#FF7043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA726]"
          >
            Discover adventures
          </a>
        </div>

        <Globe alt="Globe" />
      </div>
      <div className="mb-5"></div>
    </>
  );
};

export default Home;
