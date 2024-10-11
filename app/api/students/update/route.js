import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, newStatus } = await request.json();
    const excelFilePath = path.join(process.cwd(), 'data', 'students.xlsx');

    // Read the current Excel file
    const fileBuffer = await fs.readFile(excelFilePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(sheet);

    // Update the status of the specific student
    data = data.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    );

    // Write the updated data back to the Excel file
    const newSheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = newSheet;
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    await fs.writeFile(excelFilePath, excelBuffer);

    return NextResponse.json({ message: 'Student status updated successfully' });
  } catch (error) {
    console.error('Error updating Excel file:', error);
    return NextResponse.json({ error: 'Error updating student data' }, { status: 500 });
  }
}