import pool from '../config/pool.js';
import { saveValidPhotos } from './photoValidator.js';

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
    while (true){
        const properties = await findPropertiesNeedingValidation();

        if (properties.length === 0){
            break;
        }

        await Promise.all(
            properties.map(property =>
                saveValidPhotos(property.L_ListingID)
            )
        );
    }
} 