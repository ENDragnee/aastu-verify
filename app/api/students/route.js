import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const excelFilePath = path.join(process.cwd(), 'data', 'students.xlsx');
    const fileBuffer = await fs.readFile(excelFilePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return NextResponse.json({ error: 'Error reading student data' }, { status: 500 });
  }
}