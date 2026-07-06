import express from "express";
import propertiesRouter from './routes/properties.js'
import healthRouter from "./routes/health.js";

const app = express();

app.use('/api/health', healthRouter);

app.use('/api/properties', propertiesRouter);

export default app;