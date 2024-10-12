'use client'

import { useState, useEffect} from 'react'
import { Search, User, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Page() {
  const [studentId, setStudentId] = useState('')
  const [currentStudent, setCurrentStudent] = useState(null)
  const [recentVerifications, setRecentVerifications] = useState([])
  const [students, setStudents] = useState([])
  const [takenCount, setTakenCount] = useState(0)
  const [loading, setLoading] = useState(true) // Added loading state

  useEffect(() => {
      loadStudentData()
  }, [])

  const loadStudentData = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) {
        throw new Error('Failed to fetch student data')
      }
      const data = await response.json()
      console.log('Fetched student data:', data)
      setStudents(data)
      updateRecentVerifications(data)
      updateTakenCount(data)
    } catch (error) {
      console.error('Error loading student data:', error)
    } finally {
      setLoading(false) // Stop loading after data is fetched
    }
  }

  const updateRecentVerifications = (studentsData) => {
    const takenStudents = studentsData
      .filter(student => student.status === 'Taken')
      .slice(0, 10)
    setRecentVerifications(takenStudents)
  }

  const updateTakenCount = (studentsData) => {
    const count = studentsData.filter(student => student.status === 'Taken').length
    setTakenCount(count)
  }

  const handleVerification = async (e) => {
    e.preventDefault()

    setCurrentStudent(null) // Clear current student state

    const student = students.find(s => String(s.studentId) === String(studentId))
    if (student) {
      setCurrentStudent(student)
    }
  }

  const handleStatusChange = async (checked, student = currentStudent) => {
    if (!student) return
  
    const newStatus = checked ? 'Taken' : 'Not taken'
  
    try {
      const response = await fetch('/api/students/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: student.studentId, newStatus }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to update student status')
      }
  
      // Update the specific student's status in the students array
      const updatedStudents = students.map(s =>
        s.studentId === student.studentId ? { ...s, status: newStatus } : s
      )
  
      // Update the students array in the state
      setStudents(updatedStudents)
  
      // Update recent verifications and taken count based on the updated students array
      updateRecentVerifications(updatedStudents)
      updateTakenCount(updatedStudents)
  
      // Update the current student
      setCurrentStudent({ ...student, status: newStatus })
      
    } catch (error) {
      console.error('Error updating student status:', error)
    }
  }  

  // Conditionally rendering loading screen or main content
  return loading ? (
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
  ) : (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Student Verification System</h1>
      
      <div className="max-w-md mx-auto mb-8 relative">
        <form onSubmit={handleVerification} className="flex items-center bg-gray-800 rounded-full p-2 shadow-lg">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-4"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
            <Search size={24} />
          </button>
        </form>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Taken: {takenCount}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {currentStudent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto mb-8 bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="font-medium">{currentStudent.name}</p>
              </div>
              <div>
                <p className="text-gray-400">ID</p>
                <p className="font-medium">{currentStudent.studentId}</p>
              </div>
              <div>
                <p className="text-gray-400">Group</p>
                <p className="font-medium">{currentStudent.group}</p>
              </div>
              <div>
                <p className="text-gray-400">Admission number</p>
                <p className="font-medium">{currentStudent.addmission}</p>
              </div>
              <div>
                <p className="text-gray-400">Sex</p>
                <p className="font-medium">{currentStudent.sex}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className="font-medium">{currentStudent.status}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  Temporary ID Card
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={currentStudent.status === 'Taken'}
                    onChange={(e) => handleStatusChange(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Verifications (Taken)</h2>
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
          <ul className="divide-y divide-gray-700">
            {recentVerifications.map((student) => (
              <li key={student.studentId} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <User className="mr-3 text-gray-600" size={20} />
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-gray-400 text-sm">ID: {student.studentId}</p>
                  </div>
                </div>
                <p className="text-gray-400">{student.group}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
