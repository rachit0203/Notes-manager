import React, { useState } from "react"
import SearchBar from "./SearchBar/SearchBar"
import ProfileInfo from "./Cards/ProfileInfo"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { FiHome, FiUser, FiLogOut, FiPlusCircle } from "react-icons/fi"
import {
  signInSuccess,
  signoutFailure,
  signoutStart,
} from "../redux/user/userSlice"
import axios from "axios"

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  const onLogout = async () => {
    try {
      dispatch(signoutStart())

      const res = await axios.get("http://localhost:3000/api/auth/signout", {
        withCredentials: true,
      })

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message))
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      dispatch(signInSuccess())
      navigate("/login")
    } catch (error) {
      toast.error(error.message)
      dispatch(signoutFailure(error.message))
    }
  }

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={"/"} className="flex-shrink-0 flex items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GoodNotes
              </h2>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FiHome className="mr-1.5 h-5 w-5" />
                Home
              </Link>
              <Link
                to="/profile"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/profile')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FiUser className="mr-1.5 h-5 w-5" />
                Profile
              </Link>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center
          ">
            <button
              onClick={() => navigate('/add-note')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
            >
              <FiPlusCircle className="mr-2 h-5 w-5" />
              New Note
            </button>
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200 pt-4 pb-3">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium">
                  {userInfo?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{userInfo?.username}</div>
              <div className="text-sm font-medium text-gray-500">{userInfo?.email}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="ml-4 flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiLogOut className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-3 space-y-1 px-2">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/profile"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/profile') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Profile
          </Link>
          <button
            onClick={() => navigate('/add-note')}
            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800"
          >
            New Note
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
