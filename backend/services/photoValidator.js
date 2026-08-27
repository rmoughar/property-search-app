import pool from '../config/pool.js';

// Checks each photo URL concurrently and keeps only links that return a succesful HEAD request
async function validatePhotos(photos){
    const results = await Promise.all(
        photos.map(async url => {
                try{

                    //Filters out pdf links in photos
                    const pathname = new URL(url).pathname.toLowerCase();
                    if(pathname.endsWith('.pdf') || pathname.includes('/document-pdf/')) return null;

                    const response = await fetch(url, {method: 'HEAD'});
                    if(response.ok) return url;
                    return null;
                }catch(error){
                    return null;
                } 
            }
        )
    )

    return results.filter(result => result !== null);
}

export async function saveValidPhotos(lisitngID){

    const [rows] = await pool.query(
        `SELECT L_Photos
        FROM rets_property
        WHERE L_ListingID = ?`, 
        [lisitngID]
    )

    if(rows.length === 0) throw new Error(`Property ${lisitngID} not found`)

    const urls = rows[0].L_Photos ? JSON.parse(rows[0].L_Photos) : [];
    const validPhotos = await validatePhotos(urls);

    // Store the validated photo URLs and the time they were checked    
    const query = `
    UPDATE rets_property
    SET ValidatedPhotos = ?,
        PhotosValidatedAt = ?
    WHERE L_ListingID= ?`

    await pool.query(query, [
        JSON.stringify(validPhotos),
        new Date(),
        lisitngID
    ])
}