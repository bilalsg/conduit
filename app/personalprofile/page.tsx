"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import axios from "axios";

const PersonalProfile = () => {
  const { currentUser } = useAuth();
  const [hoverCover, setHoverCover] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);
  const [savedSkills, setSavedSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);

  // Fetch saved skills for the current user
  useEffect(() => {
    const fetchSavedSkills = async () => {
      if (!currentUser?.id) {
        console.warn("No user ID found. Skipping API call.");
        return;
      }
      setLoadingSkills(true);
      try {
        const response = await axios.post("http://localhost:8080/skillsshow", {
          userId: currentUser.id,
        });
        const skills = response.data.skills || [];
        setSavedSkills(skills.map((skill: any) => skill.skill_name));
      } catch (error: any) {
        console.error(
          "Error fetching skills:",
          error.response?.data || error.message || error
        );
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSavedSkills();
  }, [currentUser]);

  // Fetch steps for selected skill
  const fetchSteps = async (skill: string) => {
    setLoadingSteps(true);
    setSelectedSkill(skill);
    try {
      const { data } = await axios.get(`http://localhost:8080/steps?skill=${skill}`);
      setSteps(data.steps);
      console.log(data.steps);
    } catch (error) {
      console.error("Error fetching steps:", error);
    } finally {
      setLoadingSteps(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gray-100 p-6">
      {/* Cover Picture Section */}
      <div className="relative h-64 bg-gray-300 rounded-lg overflow-hidden shadow-md">
        <div
          className="h-full"
          onMouseEnter={() => setHoverCover(true)}
          onMouseLeave={() => setHoverCover(false)}
        >
          <img
            className={`w-full h-full object-cover transition-transform duration-300 ease-in-out ${
              hoverCover ? "scale-105" : ""
            }`}
            src={
              currentUser?.cover_picture ||
              "https://i.pinimg.com/564x/df/73/e1/df73e1a9f964f97ce910856dfd2a7483.jpg"
            }
            alt="Cover"
          />
          {hoverCover && (
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg"
              aria-label="Update Cover"
            >
              Update Cover
            </button>
          )}
        </div>
        <div
          className="absolute left-1/2 bottom-[-48px] transform -translate-x-1/2 z-10 flex flex-col items-center"
          onMouseEnter={() => setHoverProfile(true)}
          onMouseLeave={() => setHoverProfile(false)}
        >
          <img
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            src={currentUser?.profile_picture || "/default-avatar.png"}
            alt="Profile"
          />
          {hoverProfile && (
            <button
              className="mt-3 bg-black text-white px-3 py-1 rounded-lg"
              aria-label="Update Profile Picture"
            >
              Update Picture
            </button>
          )}
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="mt-16 flex flex-col md:flex-row md:justify-between gap-8">
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                {currentUser?.firstname} {currentUser?.lastname}
              </h1>
              <p className="text-gray-600 text-sm">{currentUser?.description}</p>
            </div>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
              Update Info
            </button>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Follow
          </button>
          <div className="mt-4 flex gap-4">
            <a href="/gallery" className="px-4 py-2 bg-green-500 text-white rounded-lg">
              Gallery
            </a>
            <a href="/edit" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg">
              Edit Profile
            </a>
          </div>
        </div>

        {/* Skills and Roadmap */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Skills</h2>
          {loadingSkills ? (
            <p>Loading skills...</p>
          ) : (
            <div className="mt-2">
              {savedSkills.map((skill, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-gray-800 bg-gray-900 hover:border-gray-700 transition-all duration-200 mb-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-100">{skill}</h3>
                  </div>
                  <button
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => fetchSteps(skill)}
                  >
                    View Roadmap
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Display Roadmap for Selected Skill */}
          {selectedSkill && (
            <div className="mt-6 p-6 rounded-lg border border-gray-800 bg-gray-900">
              <h3 className="text-xl font-semibold text-gray-100">Roadmap for {selectedSkill}</h3>
              {loadingSteps ? (
                <p className="text-gray-400 mt-4">Loading steps...</p>
              ) : (
                <ul className="mt-4">
                  {steps.map((step, index) => (
                    <li key={index} className="mb-2 px-3 py-2 bg-gray-800 rounded text-gray-200">
                      {step}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PersonalProfile;
