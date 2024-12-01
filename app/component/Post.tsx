"use client";

import React, { useState } from "react";

interface SharetailProps {
  tail: string;
  firstname: string;
  lastname: string;
  URL: string;
  profile_picture: string;
}

const Sharetail: React.FC<SharetailProps> = ({ tail, firstname, lastname, URL, profile_picture }) => {
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md sm:w-[440px] w-[340px]">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-4">
          <img
            src={profile_picture}
            alt={`${firstname} ${lastname}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="text-gray-700 font-semibold">{firstname} {lastname}</h4>
            <p className="text-gray-500 text-sm">@{firstname}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-2">
        <p className="text-gray-600">{tail}</p>
      </div>

      {/* Card Image */}
      <div className="p-2">
        <img
          src={URL}
          alt="Shared content"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      {/* Card Footer */}
      <div className="flex justify-between items-center p-4 border-t">
        {/* Following Info */}
        <div className="flex items-center gap-1">
          <p className="font-semibold text-gray-700">4</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>

        {/* Followers Info */}
        <div className="flex items-center gap-1">
          <p className="font-semibold text-gray-700">97.1K</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>

        {/* Follow Button */}
        <button
          onClick={() => setIsFollowed(!isFollowed)}
          className={`px-4 py-2 text-sm rounded ${
            isFollowed ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"
          }`}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default Sharetail;
