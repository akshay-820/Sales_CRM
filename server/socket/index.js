const { Server } = require("socket.io");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🔌 Client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error(
            "Socket.io has not been initialized. Call initSocket(server) first.",
        );
    }
    return io;
}

module.exports = {
    initSocket,
    getIO,
};
