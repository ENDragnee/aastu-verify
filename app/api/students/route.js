import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Assuming this is your db connection

export async function GET(request) {
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    conn = await pool.getConnection();

    // Base query logic
    let query = "SELECT * FROM students";
    let countQuery = "SELECT COUNT(*) as total FROM students";
    let params = [];

    // Add search functionality if provided
    if (search) {
      const searchCondition = " WHERE studentId LIKE ? OR name LIKE ?";
      query += searchCondition;
      countQuery += searchCondition;
      params = [`%${search}%`, `%${search}%`];
    }

    // Add pagination
    query += " ORDER BY status DESC, studentId ASC LIMIT ? OFFSET ?";
    // Note: Use Number() to ensure they are treated as integers, not strings
    const queryParams = [...params, Number(limit), Number(offset)];

    // Execute queries
    const [rows] = await conn.query(query, queryParams);
    const [countResult] = await conn.query(countQuery, params);

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const response = NextResponse.json({
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });

    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Error fetching student data" },
      { status: 500 },
    );
  } finally {
    if (conn) conn.release();
  }
}
