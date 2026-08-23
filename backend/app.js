import 'dotenv/config';
import express from "express";
import propertiesRouter from './routes/properties.js'
import healthRouter from "./routes/health.js";
import cors from "cors";
import searchRouter from "./routes/search.js";
const app = express();
const allowedOrigins = [
    'http://127.0.0.1:5173',
    'http://localhost:4005'
]

app.use(cors({origin: allowedOrigins}));
app.use(express.json());

app.use((req, res, next) => {

  if(req.originalUrl === '/favicon.ico'){
    return next();
  }

  const start = performance.now();

  res.on('finish', () =>{
    const timeDiff = performance.now() - start;
    console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${timeDiff.toFixed(2)}ms`
    )
  });

  next();
});

app.get('/', (req, res) => {
    res.send('hi');
})

app.use('/api/health', healthRouter);

app.use('/api/properties', propertiesRouter);

app.use('/api/search', searchRouter);

export default app;