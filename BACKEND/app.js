// const express = require("express");
// const app = express();
// const cors = require("cors")
// const mainRouter = require("./routers/mainRouter")
// const mongoose = require("mongoose")
//
//
// require("dotenv").config()
//
// mongoose.connect(process.env.MONGO_KEY)
//     .then(() => {
//         console.log("DB connect success ")
//     }).catch(err => {
//     console.log("error")
//     console.log(err)
// })
//
//
// // app.use(cors())
// // app.use(express.json());
// //
// // app.use("/", mainRouter)
// //
// //
// // app.listen(2000);

const {Server} = require("socket.io");

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = []
let buildings = []



io.on("connection", (socket) => {

    socket.on("login", (user) => {
        const userExists = users.find(x => x.userColor === user.color)

        if (userExists) {

            return socket.emit("loggedIn", {error: true, message: "Color already taken", data: null})
        }

        const myUser = {
            socket_id: socket.id,
            userColor: user.color,
            wood: 1000,
            gold: 20000,
            stone: 500,
            myBuildings:[],
        }

        users.push(myUser)
        socket.emit("loggedIn", {error: false, message: null, data: myUser})
        io.emit('allUsers', users);
        io.emit('allBuildings', buildings);

    })
    socket.on("build", data => {


        const building = data.building

        const buildingExists = buildings.some(building => building.place === data.selectedSpot);

        if (buildingExists) {
            return socket.emit("loggedIn", { error: true, message: "You can't choose this place", data: null });
        }

        const userIndex = users.findIndex(x => x.socket_id === data.userId)
        if (userIndex < -1) {

            return socket.emit("loggedIn", {error: true, message: "User not found", data: null})
        }

        const currentUser = users[userIndex]


        if (building.price > currentUser.gold || building.wood > currentUser.wood || building.stone > currentUser.stone ) {
            return socket.emit("loggedIn", {error: true, message: "U dont have enough resource", data: null})
        } else {
            currentUser.gold = currentUser.gold - building.price
            currentUser.wood = currentUser.wood - building.wood
            currentUser.stone = currentUser.stone - building.stone
            const id = Date.now()
            currentUser.myBuildings.push({ ...building, id: id })

            const newBuilding = {

                place: data.selectedSpot,
                color: currentUser.userColor,
                icon: building.icon,
                name: building.name,
                ownerId: currentUser.socket_id,
                id:id
            }

            buildings.push(newBuilding)

            socket.emit("loggedIn", {error: false, message: null, data: currentUser})

            io.emit('allUsers', users);
            io.emit('allBuildings', buildings);
        }

    })

    socket.on("destroy", data => {
        const destroyer = users.find(x => x.socket_id === socket.id)
        const owner = users.find(x => x.socket_id === data.ownerId)
        const buildingIndex = buildings.findIndex(x => x.id === data.id);

        if (destroyer.gold < 1000 || destroyer.wood < 1000 || destroyer.stone < 1000 ) {
            return socket.emit("loggedIn", {error: true, message: "U dont have enough resource", data: null})
        } else {
            destroyer.gold -= 1000
            destroyer.wood -= 1000
            destroyer.stone -= 1000
        }
        if (buildingIndex !== -1) {
            const buildingId = buildings[buildingIndex].id;
            buildings[buildingIndex] = {
                place: buildings[buildingIndex].place, // retain only the place property
                icon: "☠️", // updated properties
                color: destroyer.userColor,
                name: "ATA",
                ownerId: destroyer.socket_id
            };

            // Update owner's buildings
            owner.myBuildings = owner.myBuildings.filter(x => x.id !== buildingId);
            if (owner.myBuildings.length === 0){
                users = users.filter(x => x.socket_id !== owner.socket_id); // Filter out the disconnected user
            }

            // Emit updates
            io.emit('allUsers', users);
            io.emit('allBuildings', buildings);
        }

    })

    socket.on("disconnect", () => {
        users = users.filter(x => x.socket_id !== socket.id); // Filter out the disconnected user
        buildings = buildings.filter(x => x.ownerId !== socket.id)
        io.emit('allBuildings', buildings);
        io.emit('allUsers', users); // Emit the updated list of users to all clients
    });
});
setInterval(() => {
    users.forEach(user => {
        user.myBuildings.forEach(building => {
            if (building.production.gold) {
                user.gold += building.production.gold;
            }
            if (building.production.wood) {
                user.wood += building.production.wood;
            }
            if (building.production.stone) {
                user.stone += building.production.stone;
            }
        });
    });
    io.emit('updates', users);
}, 1000);

io.listen(2000);

