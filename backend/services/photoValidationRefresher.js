import pool from '../config/pool.js';
import { saveValidPhotos } from './photoValidator.js';

// Finds properties whose photos have never been validated or haven't 
// been checked within the last seven days
async function findPropertiesNeedingValidation(){
    const [rows] = await pool.query(
        `SELECT L_ListingID
        From rets_property
        WHERE PhotosValidatedAt IS NULL
            OR PhotosValidatedAt < NOW() - INTERVAL 7 DAY
        LIMIT 500`
    )

    return rows;
} 

export async function refreshPhotoValidations(){
    // Continue processing batches until all properties are up to date.
    while (true){
        const properties = await findPropertiesNeedingValidation();

        if (properties.length === 0){
            break;
        }

        // Validate each property's photos concurrently to speed up the refresh
        await Promise.all(
            properties.map(property =>
                saveValidPhotos(property.L_ListingID)
            )
        );
    }
} 