import app from "./app.js"
import 'dotenv/config';

const port =  process.env.BACKEND_PORT || 4000;

app.listen(port, (err) => {
    if (err){
        console.error(err);
        return;
    }
    console.log(`Example app listening on port ${port}`);
});