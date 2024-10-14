import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

const wss = new WebSocketServer({ noServer: true });

const rooms: { [key: string]: Set<WebSocket> } = {};

function broadcastToRoom(boardId: string, sender: WebSocket, message: { action: string, data: string }) {
    const room = rooms[boardId];
    if (!room) return;

    room.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

export function setupWebSocket(server: any) {
    server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
        const url = request.url || '';
        if (url.startsWith('/api/ws')) {
            wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
                wss.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });

    wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
        const requestUrl = new URL(request.url || '', `http://${request.headers.host}`);
        const pathnameParts = requestUrl.pathname.split('/');
        const boardId = pathnameParts[3];

        if (!boardId) {
            ws.close(1008, 'Board ID não encontrado');
            return;
        }

        if (!rooms[boardId]) {
            rooms[boardId] = new Set();
        }

        rooms[boardId].add(ws);
        console.log(`Cliente entrou na sala: ${boardId}`);

        ws.on('close', () => {
            if (rooms[boardId]) {
                rooms[boardId].delete(ws);
                if (rooms[boardId].size === 0) {
                    delete rooms[boardId];
                }
                console.log(`Cliente saiu da sala: ${boardId}`);
            }
        });

        ws.on('message', (message: string) => {
            try {
                const parsedMessage = JSON.parse(message);
                const { action, data } = parsedMessage;

                if (!action || !data) {
                    throw new Error("Formato de mensagem inválido");
                }

                console.log(action, data);
                broadcastToRoom(boardId, ws, { action, data });
            } catch (error: any) {
                console.error("Erro ao processar mensagem:", error.message);
                ws.send(JSON.stringify({ action: "error", data: { message: error.message } }));
            }
        });
    });
}
