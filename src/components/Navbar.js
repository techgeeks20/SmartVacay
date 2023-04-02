import React from "react";
import { signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = ({ currentUser }) => {
  let history = useHistory();
  const signOutHandler = () => {
    signOut(auth);
    history.push("/login");
  };
  return (
    <div class="bg-gray-100 font-sans sticky top-0 z-50 shadow-md">
      <div class="bg-white bottom shadow-">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between py-4">
            <div
              onClick={() => {
                history.push("/");
              }}
            >
              <img
                className="h-10"
                src="https://media.istockphoto.com/id/1148705812/vector/location-icon-vector-pin-sign-isolated-on-white-background-navigation-map-gps-direction.jpg?s=612x612&w=0&k=20&c=lqEIzW3QedZfytsX30NoBJbHxZZbWnlLsvEiwOSbaow="
              />
            </div>

            <div className="hidden sm:flex justify-between sm:items-center">
              <a
                href="/"
                className="text-gray-800 text-medium font-semibold hover:text-[#FFA726] mr-16 bottom-3"
              >
                Home
              </a>
              <a
                href="/discover"
                className="text-gray-800 text-medium font-semibold hover:text-[#FFA726] mx-4"
              >
                Discover
              </a>
              <a
                href="/destination"
                className="text-gray-800 text-medium font-semibold hover:text-[#FFA726] ml-16"
              >
                Destination
              </a>
            </div>

            {currentUser === null ? (
              <div class="hidden sm:flex sm:items-center">
                <a
                  onClick={() => history.push("/login")}
                  class="text-gray-800 cursor-pointer text-medium font-semibold border px-4 py-2 rounded-lg hover:text-[#FFA726] hover:border-[#FFA726]"
                >
                  Login
                </a>
              </div>
            ) : (
              <div class="hidden sm:flex sm:items-center">
                <a
                  onClick={signOutHandler}
                  class="text-gray-800 cursor-pointer text-medium font-semibold border px-4 py-2 rounded-lg hover:text-[#FFA726] hover:border-[#FFA726]"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
