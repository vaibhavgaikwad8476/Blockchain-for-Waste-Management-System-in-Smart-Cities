import { WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  server: Server;

  sendNotification(message): void {
    this.server.emit('new-waste-request', message);
  }
}
