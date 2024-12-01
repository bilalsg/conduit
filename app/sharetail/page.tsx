"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sharetail from "../component/Post";
import { useAuth } from "@/providers/AuthContext";

interface Post {
  id:number;
  tail: string;
  firstname: string;
  lastname: string;
  URL: string;
  profile_picture: string;
  user_id: number;
}

interface Step {
  step_number: number;
  step_description: string;
}

const PricingPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState<boolean>(false);
  const [tail, setTail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [URL, setURL] = useState<string>("");
  const { currentUser } = useAuth();
  const [isFollowed, setIsFollowed] = useState(false);
  const [comments, setComments] = useState<{ [postId: number]: string[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [postId: number]: string }>({});
  
  const fetchAllComments = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/getAllComments');
      setComments(data.comments);
      console.log(data);
    } catch (error) {
      console.error('Error fetching all comments:', error);
    }
  };
  
  useEffect(() => {
    fetchAllComments();
  }, []);
  
  const handleAddComment = async (postId: number) => {
    const commentText = commentInputs[postId];

    if (!commentText) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/addcomment", {
        commentText,
        userId: currentUser?.id,
        tailId: postId,
      });

      if (response.status === 200) {
        alert("Comment added successfully!");
        setCommentInputs({ ...commentInputs, [postId]: "" });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };

  // Handle input change
  const handleInputChange = (postId: number, value: string) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };
  // Handle new post submission
  const handlePostSubmission = async () => {
    if (!tail || !name || !URL) {
      alert("Please fill in all fields: tail, name, and URL.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/tails", {
        tail,
        name,
        URL,
        userId: currentUser?.id,
      });

      if (response.status === 200) {
        alert("Post added successfully!");
        setPosts([{ tail, name, URL, user_id: currentUser?.id || 0 }, ...posts]);
        setTail("");
        setName("");
        setURL("");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Failed to add post.");
    }
  };

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get<Post[]>("http://localhost:8080/tails");
        setPosts(data.reverse());
  
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      setLoadingSkills(true);
      try {
        const { data } = await axios.get<{ skills: string[] }>("http://localhost:8080/skills");
        setSkills(data.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // Fetch steps based on skill
  const fetchSteps = async (skill: string) => {
    setLoadingSteps(true);
    setSelectedSkill(skill);

    try {
      const { data } = await axios.get<{ skill: string; steps: Step[] }>(
        `http://localhost:8080/steps?skill=${skill}`
      );
      setSteps(data.steps);
      console.log(data.steps)

    } catch (error) {
      console.error("Error fetching steps:", error);
    } finally {
      setLoadingSteps(false);
    }
  };

  // Save post URL
  const handleSavePost = async (url: string) => {
    try {
      const { data } = await axios.put("http://localhost:8080/save", {
        userId: currentUser?.id,
        imageUrl: url,
      });

      if (data.success) {
        console.log("URL saved successfully");
      } else {
        console.error("Failed to save URL:", data.message);
      }
    } catch (error) {
      console.error("Error saving URL:", error);
    }
  };

  // Follow user
  const handleFollowUser = async (userId: number) => {
    try {
      const { data } = await axios.post("http://localhost:8080/follow", {
        userId: currentUser?.id,
        followerUserId: userId,
      });

      if (data.success) {
        setIsFollowed((prev) => !prev);
        console.log("Follow status updated successfully");
      } else {
        console.error("Failed to follow/unfollow user:", data.message);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  // Save Skill
  const handleSaveSkill = async (skill: string) => {
    console.log("Saving skill:", skill); // Log the skill being saved

    try {
      const response = await axios.post("http://localhost:8080/skilladd", {
        user_id: currentUser?.id, // assuming currentUser is available
        skill_name: skill,
      });

      console.log("Response from server:", response.data); // Log the server response

      if (response.data.success) {
        console.log("Skill saved successfully:", skill);
      } else {
        console.error("Failed to save skill:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* New Post Form */}
  

      {/* Skills Section */}
      <div className="min-h-screen bg-gray-900 text-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Developer Roadmaps
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Roadmap is a collaborative community initiative that creates roadmaps, guides, and educational resources to support developers in advancing their skills.
            </p>
          </div>

          {loadingSkills ? (
            <div className="flex items-center justify-center">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-12 w-12"></div>
            </div>
          ) : skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div key={index} className="relative group">
                  <div className="p-6 rounded-lg border border-gray-800 bg-gray-900 hover:border-gray-700 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-100">{skill}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Step-by-step guide to becoming a {skill.toLowerCase()} developer.
                    </p>
                    <button
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded transition-all duration-200"
                      onClick={() => fetchSteps(skill)}
                    >
                      View Roadmap
                    </button>
                    <button
                      className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded transition-all duration-200"
                      onClick={() => handleSaveSkill(skill)}
                    >
                      Save Skill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No skills available.</p>
          )}

          {loadingSteps && <div>Loading steps...</div>}

          {steps.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Steps for {selectedSkill}</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {steps.map((step, index) => (
                  <li key={index} className="text-gray-400">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Add New Post</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tail"
            className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700"
            value={tail}
            onChange={(e) => setTail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="url"
            placeholder="URL"
            className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700"
            value={URL}
            onChange={(e) => setURL(e.target.value)}
          />
          <button
            onClick={handlePostSubmission}
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Post
          </button>
        </div>
      </div>
      {/* Posts Section */}
      <div className="w-full flex items-center justify-center">
      <div className="space-y-4 w-fit flex flex-col items-center justify-center">
     {posts.map((post) => (
  <div key={post.id} className="relative bg-white p-4 rounded shadow">
    <Sharetail {...post} />
    
    {/* Comment Input Section */}
    <div className="mt-4">
      <input
        type="text"
        placeholder="Add a comment..."
        value={commentInputs[post.id] || ""}
        onChange={(e) => handleInputChange(post.id, e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={() => handleAddComment(post.id)}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Comment
      </button>
    </div>
    
    {/* Display Comments Section */}
    <div className="mt-4 space-y-2">
    {comments[post.id]?.length > 0 ? (
  comments[post.id].map((comment, index) => (
    <div key={index} className="bg-gray-100 p-2 rounded">
      <div className="flex items-center space-x-2">
        {/* Profile Picture */}
        {comment.profile_picture ? (
          <img 
            src={comment.profile_picture} 
            alt={`${comment.firstname} ${comment.lastname}`} 
            className="w-8 h-8 rounded-full object-cover" 
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        )}
        <div>
          {/* User Name */}
          <p className="text-sm font-semibold text-gray-700">
            {comment.firstname} {comment.lastname}
          </p>
          {/* Email (Optional) */}
          <p className="text-xs text-gray-500">{comment.email}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-2">{comment.comment_text}</p>
      <div className="text-xs text-gray-500 mt-1">
        <span>Posted on: {new Date(comment.created_at).toLocaleString()}</span>
      </div>
    </div>
  ))
) : (
  <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
)}

    </div>
  </div>
))}

      </div>
      </div>
    </div>
  );
};

export default PricingPage;
