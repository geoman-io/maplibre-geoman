import type { GeoJsonImportFeature } from '@/types/index.ts';
import fs from 'fs/promises';
import path from 'path';

const testsRoot = path.join(process.cwd(), 'tests');

export const loadGeoJson = async (fixtureName: string) => {
  const filePath = path.join(testsRoot, 'fixtures', `${fixtureName}.json`);
  const fileContent = await fs.readFile(filePath, 'utf-8');

  try {
    const parsedGeoJson = JSON.parse(fileContent);
    if (Array.isArray(parsedGeoJson)) {
      return parsedGeoJson as Array<GeoJsonImportFeature>;
    } else if (typeof parsedGeoJson === 'object' && parsedGeoJson !== null) {
      return [parsedGeoJson as GeoJsonImportFeature];
    }
    return null;
  } catch (error) {
    console.error('Error while parsing JSON file', error);
    return null;
  }
};
