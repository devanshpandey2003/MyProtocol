
import express from 'express';
import cors from 'cors';
import { createConnection } from 'node:net';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

let tcpClient = null;
let tcpReady = false;


function connectToTcpServer() {
    tcpClient = createConnection({ host: 'localhost', port: 8080 }, () => {
        console.log('Connected to TCP server');
        tcpReady = true;
    });

    tcpClient.on('end', () => {
        console.log('TCP connection ended. Reconnecting...');
        tcpReady = false;
        setTimeout(connectToTcpServer, 3000);
    });

    tcpClient.on('error', (err) => {
        console.error('TCP Error:', err.message);
    });
}

connectToTcpServer();


app.post('/send', (req, res) => {
    const message = req.body.message;

    if (!tcpReady) {
        return res.status(500).json({ error: 'TCP client not ready' });
    }

    const payload = JSON.stringify({ data: message });

    tcpClient.write(payload, () => {
        console.log('Sent to TCP:', payload);
        res.json({ success: true, message: 'Sent to TCP server' });
    });
});

app.listen(PORT, () => {
    console.log(`Bridge server running at http://localhost:${PORT}`);
});
