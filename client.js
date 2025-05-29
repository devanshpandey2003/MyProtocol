import { createConnection } from 'node:net';

class MyProtocol {
    constructor() {
        this.connect();
    }

    connect() {
        this.client = createConnection({ host: 'localhost', port: 8080 }, () => {
            console.log('Connection established...');
            this.ready = true;
        });

        this.ready = false;

        this.client.on('end', () => {
            this.ready = false;
            console.log('Disconnected. Retrying...');
            setTimeout(() => this.connect(), 3000); 
        });

        this.client.on('error', (err) => {
            this.ready = false;
            console.error('Client error:', err.message);
        });
    }
    send(data) {
        if (this.ready) {
            const payload = JSON.stringify({ data });
            this.client.write(payload);
            console.log('Sent data:', payload);
        } else {
            console.log('Client not ready to send data.');
        }
    }
}

const myProtocol = new MyProtocol();

setInterval(() => {
    myProtocol.send('hello world');
}, 2000);
