import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM students');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Error fetching student data' }, { status: 500 });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
}