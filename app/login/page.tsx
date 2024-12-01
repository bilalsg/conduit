"use client"
import React, { useState } from 'react'
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/providers/AuthContext';

const Page = () => {
  const { setAuthUser, setLoggedIn, isLoggedIn, currentUser } = useAuth();
  const [eye, setEye] = useState(true);
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Utility function to create a delay using a Promise
  const delay = (duration: number) => new Promise(resolve => setTimeout(resolve, duration));

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', formData, { withCredentials: true });

      if (response.status === 200) {
        const userData = response.data;
        setLoggedIn(true);
        setAuthUser(userData);
        console.log(userData);
        window.location.href = "/sharetail";
        await delay(4000);
        console.log('isLoggedIn:', isLoggedIn);
      } else {
        console.error('Received non-200 status code:', response.status);
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error);
    }
  };

  return (
    <section className="relative h-full w-full flex items-center justify-center">
      <div className="flex light:bg-white dark:bg-[#18181B] h-full sm:w-1/2 w-full p-8 shadow-2xl rounded-2xl max-w-3xl overflow-hidden">
        <div className="md:w-1/2 w-full text-2xl px-5">
          <h2 className="font-bold">Log in</h2>
          <p className="text-sm mt-4 font-semibold">Secure access to your account for exclusive content and features.</p>
          
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

          <form>
            <div>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              />
            </div>
            <div className="relative flex justify-center items-center">
              <input
                type={eye ? "password" : "text"}
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              />
              {eye ? (
                <svg
                  onClick={() => setEye(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-1/2 right-5 -translate-y-1/2 lucide lucide-eye"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg
                  onClick={() => setEye(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute top-1/2 right-5 -translate-y-1/2 lucide lucide-eye"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800"
              onClick={handleLogin}
            >
              Log in
            </button>
          </form>

          <div className="flex items-center mt-8">
            <hr className="flex-1 border-t-2 border-gray-300" />
            <p className="mx-4 text-sm text-gray-500">OR</p>
            <hr className="flex-1 border-t-2 border-gray-300" />
          </div>

          <p className="mt-12 border-b-2 py-2 text-sm">Forget your password?</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm">Don't have an account?</p>
          
          </div>
        </div>

      </div>
    </section>
  );
}

export default Page;
