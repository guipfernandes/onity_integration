import axios from 'axios';

class RemoteService {
  constructor(conn) {
    this.conn = conn;
  }

  connectPort(data) {
    return this.conn.post('api/serial/conectar', data);
  }

  disconnectPort() {
    return this.conn.post('api/serial/desconectar');
  }
  
  recordCard(data) {
    return this.conn.post('api/serial/novo-cliente', data);
  }

  isPortOpen() {
    return this.conn.post('api/serial/porta-aberta');
  }

  lastLog() {
    return this.conn.post('api/serial/ultimo-log');
  }
}

const remoteService = new RemoteService(axios.create({baseURL: '/'}));

export default remoteService;
