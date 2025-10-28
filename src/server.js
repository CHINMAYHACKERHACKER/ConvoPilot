import cors from 'cors';
import express from 'express';
const app = express();
import cluster from 'cluster';
import os from 'os';
const numCPUs = os.cpus().length;
import { dbConnection, closeConnection } from './Config/DataBase.js';
import 'dotenv/config';
import authRoutes from './Routes/authRoutes.js';
dbConnection()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        closeConnection()
        process.exit(1);
    });
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/user', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        pid: process.pid,
    });
});

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    //^ Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`server started on port ${port}`);
    })
    console.log(`Worker ${process.pid} started`);
}