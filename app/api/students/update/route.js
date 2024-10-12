import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  let conn;
  try {
    const { id, newStatus } = await request.json();

    conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE students SET status = ? WHERE studentId = ?',
      [newStatus, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Create a response object with headers to prevent caching
    const response = NextResponse.json({ message: 'Student status updated successfully' });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Error updating student status:', error);
    return NextResponse.json({ error: 'Error updating student data' }, { status: 500 });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
}
