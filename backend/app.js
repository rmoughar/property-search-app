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
  console.log('Method:', req.method);
  console.log('URL:', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
  console.log('Timestamp:', new Date().toLocaleString());
  const startTime = Date.now();
  res.on('finish', () =>{
    const timeDiff = Date.now() - startTime;
    console.log('Response Time:', timeDiff, 'ms');
    console.log('Stauts:', res.statusCode);
  })
  next();
});

app.get('/', (req, res) => {
    res.send('hi');
})

app.use('/api/health', healthRouter);

app.use('/api/properties', propertiesRouter);

app.use('/api/search', searchRouter);

export default app;