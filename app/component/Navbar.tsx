"use client";
import { useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom"; // Assuming you're using React Router for routing
import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";
import { BsSearch } from "react-icons/bs"; // Search Icon
import { HiUserCircle } from "react-icons/hi"; // Profile Icon

export const Navbar = () => {
  const { isLoggedIn, currentUser } = useAuth();
  const [searchlist, setSearchList] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [word, setWord] = useState({ word: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWord({ ...word, [name]: value });
  };

  const handlePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8080/search", {
        params: word,
      });

      if (response.status === 200) {
        setSearchList(response.data);
        setShow(prev => !prev);
      }
    } catch (error) {
      console.error("Error occurred while searching:", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="text-2xl font-bold">
          <a href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-codesandbox">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
              <polyline points="7.5 19.79 7.5 14.6 3 12" />
              <polyline points="21 12 16.5 14.6 16.5 19.79" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" x2="12" y1="22.08" y2="12" />
            </svg>
            <span>Projet</span>
          </a>
        </div>

        {/* Search Input */}
        {isLoggedIn && (
          <div className="relative flex items-center gap-2">
            <input
              className="p-2 rounded-lg bg-gray-700 text-sm text-white"
              type="search"
              placeholder="Search..."
              name="word"
              onChange={handleChange}
            />
            <button onClick={handlePost} className="bg-blue-500 p-2 rounded-lg text-white">
              <BsSearch />
            </button>
            {show && (
              <div className="absolute bg-gray-800 rounded-lg p-2 w-60 mt-2">
                {searchlist.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer">
                    <img src={item.profile_picture || "/default-avatar.png"} alt={item.firstname} className="w-8 h-8 rounded-full" />
                    <span>{`${item.firstname} ${item.lastname}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        <div className="flex gap-4">
          <a href="https://twitter.com" className="text-white hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="https://github.com" className="text-white hover:text-gray-400">
            <FaGithub />
          </a>
          <a href="https://discord.com" className="text-white hover:text-blue-500">
            <FaDiscord />
          </a>
        </div>

        {/* Profile Dropdown */}
        {isLoggedIn && currentUser && (
          <div className="relative">
            <button
              onClick={() => setShow(prev => !prev)}
              className="flex items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-full"
            >
              {currentUser.profile_picture ? (
                <img src={currentUser.profile_picture} alt="User Avatar" className="w-10 h-10 rounded-full" />
              ) : (
                <HiUserCircle className="text-white text-3xl" />
              )}
            </button>
            {show && (
              <div className="absolute right-0 bg-gray-800 rounded-lg p-2 w-40 mt-2">
                <a href={`/personalprofile`} className="block px-4 py-2 text-white hover:bg-gray-700">Profile</a>
                <a href="/logout" className="block px-4 py-2 text-white hover:bg-gray-700">Logout</a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
