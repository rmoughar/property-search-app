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

        const start = performance.now();

        await Promise.all(
            properties.map(property =>
                saveValidPhotos(property.L_ListingID)
            )
        );
        // for (const property of properties){
        //     console.log(`Validating ${property.L_ListingID}...`);
        //     await saveValidPhotos(property.L_ListingID);
        // }

        const elapsed = (performance.now() - start) / 1000;
        console.log(`Validated ${properties.length} properties in ${elapsed.toFixed(2)}s`)

    }

    console.log('DONE!!!!!!!')
} 

const [rows] = await pool.query(`
    SELECT COUNT(*) AS count
    FROM rets_property
    WHERE PhotosValidatedAt IS NULL
       OR PhotosValidatedAt < NOW() - INTERVAL 7 DAY
`);

console.log(rows[0].count);

refreshPhotoValidations().catch(error => {
    console.error('photo validation failed:', error);
});

//rows gives each pair 