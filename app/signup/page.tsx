"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    Firstname: '',
    Lastname: '',
    Email: '',
    Password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users', formData);
      alert(response.data.message || 'Registration successful!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full bg-white p-8 border border-gray-300 rounded-lg shadow-2xl flex">
        <div className="sm:w-full w-full px-5">
          <h2 className="text-2xl font-semibold text-center mb-2">Sign Up</h2>
          <p className="text-center text-gray-600 mb-6">
            Create an account to track your progress, showcase your skill set, and be a part of the community.
          </p>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <FaGithub size={20} />
              Continue with GitHub
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <FaGoogle size={20} />
              Continue with Google
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <FaLinkedin size={20} />
              Continue with LinkedIn
            </button>
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="Firstname"
              placeholder="Firstname"
              value={formData.Firstname}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="Lastname"
              placeholder="Lastname"
              value={formData.Lastname}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              name="Email"
              placeholder="Email Address"
              value={formData.Email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="relative">
              <input
                type="password"
                name="Password"
                placeholder="Password"
                value={formData.Password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <button className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Register
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>

          <p className="text-xs text-center text-gray-400 mt-4">
            By continuing to use our services, you acknowledge that you have both read and agree to our{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
