'use client'

import { useState, useEffect } from 'react'
import { Search, User, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Page() {
  const [studentId, setStudentId] = useState('')
  const [currentStudent, setCurrentStudent] = useState(null)
  const [recentVerifications, setRecentVerifications] = useState([])
  const [students, setStudents] = useState([])
  const [takenCount, setTakenCount] = useState(0)

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
      setStudents(data)
      updateRecentVerifications(data)
      updateTakenCount(data)
    } catch (error) {
      console.error('Error loading student data:', error)
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
    const student = students.find(s => s.studentId === studentId)
    if (student) {
      setCurrentStudent(student)
      if (student.status !== 'Taken') {
        await handleStatusChange(true)
      }
    } else {
      setCurrentStudent(null)
    }
  }

  const handleStatusChange = async (checked) => {
    if (!currentStudent) return

    const newStatus = checked ? 'Taken' : 'Not taken'
    try {
      const response = await fetch('/api/students/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentStudent.studentId, newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update student status')
      }

      const updatedStudents = students.map(s => 
        s.studentId === currentStudent.studentId ? {...s, status: newStatus} : s
      )
      setStudents(updatedStudents)
      setCurrentStudent({...currentStudent, status: newStatus})
      updateRecentVerifications(updatedStudents)
      updateTakenCount(updatedStudents)
    } catch (error) {
      console.error('Error updating student status:', error)
    }
  }

  return (
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
                <p className="text-gray-400">Dorm</p>
                <p className="font-medium">{currentStudent.dorm}</p>
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
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Verifications (Taken)</h2>
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
          {recentVerifications.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {recentVerifications.map((student, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="mr-3" size={20} />
                    <span>{student.name}</span>
                  </div>
                  <span className="text-gray-400">{student.studentId}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">No recent verifications</p>
          )}
        </div>
      </div>
    </div>
  )
}