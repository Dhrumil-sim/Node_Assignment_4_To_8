import { parseFile } from 'music-metadata';
import { asyncHandler } from '../../../utils/asyncHandler.js';

class SongMetaData {
  static getMetadata = async (filePath: string) => {
    try {
      const metadata = await parseFile(filePath);
      return metadata;  // Return the metadata to be used in the controller
    } catch (error: any) {
      console.error('Error parsing metadata:', error.message);
      throw new Error('Error parsing metadata');
    }
  };
}

export default SongMetaData;
