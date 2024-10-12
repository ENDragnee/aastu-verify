import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM students');

    // Create a response object with headers to prevent caching
    const response = NextResponse.json(rows);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Error fetching student data' }, { status: 500 });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
}
