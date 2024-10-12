'use client'

import { Search, User } from 'lucide-react'

export function LoadingComponent() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Student Verification System</h1>
      
      <div className="max-w-md mx-auto mb-8 relative">
        <div className="flex items-center bg-gray-800 rounded-full p-2 shadow-lg">
          <div className="flex-grow bg-gray-700 h-10 rounded-full animate-pulse"></div>
          <div className="bg-blue-500 p-2 rounded-full ml-2">
            <Search size={24} className="text-gray-300" />
          </div>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            Taken: ...
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Student Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-12 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Verifications (Taken)</h2>
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
          <ul className="divide-y divide-gray-700">
            {[...Array(5)].map((_, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <User className="mr-3 text-gray-600" size={20} />
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}