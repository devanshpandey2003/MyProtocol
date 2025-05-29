import { createServer } from 'node:net';

const server = createServer(socket => {
    console.log('A TCP Socket connected');

    socket.on('data', (data) => {
        try {
            const parsed = JSON.parse(data.toString());
            console.log('Received data:', parsed);
        } catch (err) {
            console.error('Invalid data format:', data.toString());
        }
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
