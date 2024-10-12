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

    // Set cache control headers
    const response = NextResponse.json({ message: 'Student status updated successfully' });
    response.headers.set('Cache-Control', 'no-store, max-age=0');

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return response;
  } catch (error) {
    console.error('Error updating student status:', error);
    return NextResponse.json({ error: 'Error updating student data' }, { status: 500 });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
}
