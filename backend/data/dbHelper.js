import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

export const readDb = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json, returning empty database structure', error);
    return { users: [], firms: [], blogs: [], analytics: [] };
  }
};

export const writeDb = async (data) => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to db.json', error);
    throw error;
  }
};
