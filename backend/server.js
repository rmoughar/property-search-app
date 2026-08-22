import app from "./app.js"
import 'dotenv/config';
import { refreshPhotoValidations } from "./services/photoValidationRefresher.js";

const port =  process.env.BACKEND_PORT || 4000;

app.listen(port, (err) => {
    if (err){
        console.error(err);
        return;
    }
    console.log(`Server listening on port ${port}`);

    refreshPhotoValidations().catch(error => {
        console.error('Photo validation refresh failed:', error);
    })
});