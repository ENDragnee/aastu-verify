"use client";

import { useState, useEffect } from "react";
import {
  Search,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentVerificationPage() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStudents = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page, limit: 10, search });
      const response = await fetch(`/api/students?${query.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setStudents(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (student) => {
    const newStatus = student.status === "Taken" ? "Not taken" : "Taken";
    setUpdatingId(student.studentId);

    try {
      // Optimistic UI update
      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === student.studentId ? { ...s, status: newStatus } : s,
        ),
      );

      const response = await fetch("/api/students/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: student.studentId, newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");
    } catch (error) {
      console.error("Update failed:", error);
      // Revert on error
      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === student.studentId
            ? { ...s, status: student.status }
            : s,
        ),
      );
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const StatCard = ({ title, value, colorClass }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div
        className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace("text-", "bg-")} ${colorClass}`}
      >
        <User size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Student Verification
            </h1>
            <p className="text-gray-400 mt-1">
              Manage ID card distribution and status
            </p>
          </div>
          <button
            onClick={() => fetchStudents(pagination.currentPage, searchTerm)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-700 transition-colors"
          >
            <RefreshCw size={16} /> Refresh Data
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Students"
            value={pagination.totalItems}
            colorClass="text-blue-500"
          />
          {/* Note: In a paginated API, getting exact global counts for "Taken" usually requires a separate API endpoint. 
              If you need precise global counts, create a /api/students/stats endpoint. 
              For now, I'll hide these or you can implement the endpoint. */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <CheckCircle2 className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white font-medium">Tracking Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="bg-gray-800 rounded-t-xl p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Name or Student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
          </div>
          <div className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-800 rounded-b-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                  <th className="p-4 font-semibold">Student Info</th>
                  <th className="p-4 font-semibold">ID Number</th>
                  <th className="p-4 font-semibold">Group</th>
                  <th className="p-4 font-semibold">Details</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-6 bg-gray-700 rounded w-20 mx-auto"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-8 bg-gray-700 rounded w-12 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.studentId}
                      className="hover:bg-gray-750 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium text-white">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-300 text-sm">
                        {student.studentId}
                      </td>
                      <td className="p-4 text-gray-400">{student.group}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {student.sex} • {student.addmission}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            student.status === "Taken"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}
                        >
                          {student.status === "Taken" ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={student.status === "Taken"}
                            onChange={() => handleStatusChange(student)}
                            disabled={updatingId === student.studentId}
                          />
                          <div
                            className={`w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 transition-colors ${
                              student.status === "Taken"
                                ? "bg-blue-600"
                                : "bg-gray-600"
                            } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          ></div>
                          {updatingId === student.studentId && (
                            <Loader2 className="absolute -left-6 w-4 h-4 animate-spin text-gray-400" />
                          )}
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={() =>
                fetchStudents(pagination.currentPage - 1, searchTerm)
              }
              disabled={pagination.currentPage === 1 || loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="mr-2" /> Previous
            </button>

            <div className="hidden sm:flex gap-2">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                // Logic to show useful page numbers around current page
                let pageNum = i + 1;
                if (pagination.totalPages > 5 && pagination.currentPage > 3) {
                  pageNum = pagination.currentPage - 2 + i;
                }
                if (pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchStudents(pageNum, searchTerm)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pagination.currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                fetchStudents(pagination.currentPage + 1, searchTerm)
              }
              disabled={
                pagination.currentPage === pagination.totalPages || loading
              }
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
