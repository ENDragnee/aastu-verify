import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  let conn;
  try {
    const { id, newStatus } = await request.json();

    conn = await pool.getConnection();

    // First, check the current status
    const [currentStatus] = await conn.query(
      'SELECT status FROM students WHERE studentId = ?',
      [id]
    );

    if (!currentStatus || currentStatus.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // If the current status is already "Taken", don't update
    if (currentStatus[0].status === 'Taken') {
      return NextResponse.json({ message: 'Student status is already Taken' });
    }

    // If the status is not "Taken", proceed with the update
    const result = await conn.query(
      'UPDATE students SET status = ? WHERE studentId = ?',
      [newStatus, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Failed to update student status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Student status updated successfully' });
  } catch (error) {
    console.error('Error updating student status:', error);
    return NextResponse.json({ error: 'Error updating student data' }, { status: 500 });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
}