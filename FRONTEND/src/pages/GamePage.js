import React, {useEffect, useState,} from 'react';
import mainStore from "../store/mainStore";
import {useNavigate} from "react-router-dom";
import SingleBuilding from "../components/SingleBuilding";
import GridArena from "../components/GridArena";

const GamePage = ({socket}) => {
    const buildings = [
        {
            "icon": "🏠",
            "name": "House",
            "price": 5000,
            "wood": 100,
            "stone": 50,
            "production": {
                "gold": 20
            }
        },
        {
            "icon": "🌳",
            "name": "Tree",
            "price": 100,
            "wood": 5,
            "stone": 0,
            "production": {
                "wood": 10
            }
        },
        {
            "icon": "🚗",
            "name": "Car",
            "price": 2000,
            "wood": 20,
            "stone": 10,
            "production": {
                "gold": 5
            }
        },
        {
            "icon": "🛤️",
            "name": "Railway",
            "price": 3000,
            "wood": 50,
            "stone": 30,
            "production": {
                "stone": 15
            }
        },
        {
            "icon": "🏢",
            "name": "Office Building",
            "price": 10000,
            "wood": 200,
            "stone": 150,
            "production": {
                "gold": 50
            }
        },
        {
            "icon": "🏥",
            "name": "Hospital",
            "price": 8000,
            "wood": 150,
            "stone": 100,
            "production": {
                "gold": 30
            }
        },
        {
            "icon": "🗼",
            "name": "Tower",
            "price": 6000,
            "wood": 100,
            "stone": 120,
            "production": {
                "stone": 25
            }
        },
        {
            "icon": "🏰",
            "name": "Castle",
            "price": 15000,
            "wood": 300,
            "stone": 400,
            "production": {
                "gold": 70
            }
        },
        {
            "icon": "🚤",
            "name": "Boat",
            "price": 2500,
            "wood": 70,
            "stone": 30,
            "production": {
                "gold": 10
            }
        },
        {
            "icon": "🌉",
            "name": "Bridge",
            "price": 7000,
            "wood": 150,
            "stone": 200,
            "production": {
                "stone": 30
            }
        },
        {
            "icon": "🛤️",
            "name": "Train Track",
            "price": 1200,
            "wood": 30,
            "stone": 20,
            "production": {
                "wood": 20
            }
        },
        {
            "icon": "🛤️",
            "name": "Train Station",
            "price": 5000,
            "wood": 100,
            "stone": 120,
            "production": {
                "gold": 25
            }
        },
        {
            "icon": "🌄",
            "name": "Mountain",
            "price": 3000,
            "wood": 50,
            "stone": 150,
            "production": {
                "stone": 40
            }
        },
        {
            "icon": "🚂",
            "name": "Train",
            "price": 7000,
            "wood": 120,
            "stone": 80,
            "production": {
                "gold": 35
            }
        },
        {
            "icon": "🏛️",
            "name": "Museum",
            "price": 9000,
            "wood": 150,
            "stone": 250,
            "production": {
                "gold": 40
            }
        },
        {
            "icon": "🏝️",
            "name": "Island",
            "price": 10000,
            "wood": 200,
            "stone": 300,
            "production": {
                "wood": 50
            }
        },
        {
            "icon": "🗽",
            "name": "Statue",
            "price": 4000,
            "wood": 50,
            "stone": 200,
            "production": {
                "stone": 35
            }
        },
        {
            "icon": "🚀",
            "name": "Rocket",
            "price": 20000,
            "wood": 300,
            "stone": 500,
            "production": {
                "gold": 100
            }
        },
        {
            "icon": "🛸",
            "name": "UFO",
            "price": 25000,
            "wood": 400,
            "stone": 600,
            "production": {
                "gold": 120
            }
        },
        {
            "icon": "🎡",
            "name": "Ferris Wheel",
            "price": 5000,
            "wood": 100,
            "stone": 50,
            "production": {
                "gold": 15
            }
        }
    ]
    const { user, allUsers, setError, setAllUsers, error,setUser,setBoughtBuildings } = mainStore();
    const [selectedSpot, setSelectedSpot] = useState(null);
    const nav = useNavigate()

    useEffect(() => {
        socket.on('allBuildings', buildings => {
            setBoughtBuildings(buildings);
            setSelectedSpot(null);
            setError("")
        });
        socket.on('updates', (updatedUsers) => {
            setAllUsers(updatedUsers);
            const updatedUser = updatedUsers.find(x => x.socket_id === user.socket_id);
            if (updatedUser) {
                setUser(updatedUser);
            } else {
                nav("/")
            }
        });
        // Cleanup on unmount
        return () => {
            socket.off('allBuildings');
        };
    }, [socket]);

    function build(building) {
        if (!selectedSpot) return;

        const data = {
            userId: user.socket_id,
            building,
            selectedSpot
        };
        socket.emit("build", data);
    }

    function destroy(building) {
        socket.emit("destroy", building);
    }

    return (
        <div className="d-flex gap-2 w-100 h">
            <div className="p-2 border flex1 overflow-y-scroll">
                <h5>Player</h5>
                <div className="d-flex gap-2 justify-content-center" style={{ backgroundColor: user.userColor }}>
                    <div>🪙Gold: {user.gold} </div>
                    <div>🪵Wood: {user.wood} </div>
                    <div>🪨Stone: {user.stone} </div>
                </div>
                <p className="error">{error}</p>
                <div className="d-flex flex-wrap gap-1 mt-2 justify-content-center">
                    {buildings.map((x, i) =><SingleBuilding key={i} building={x} build={build}/>)}
                </div>
            </div>
            <GridArena selectedSpot={selectedSpot} setSelectedSpot={setSelectedSpot} destroy={destroy} />
            <div className="p-2 border d-flex flex1 flex-column gap-1">
                <h5>Other Players</h5>
                {allUsers.filter(x => x.socket_id !== user.socket_id).map((x, i) =>
                    <div className="p-2 border d-flex gap-2" key={i}>
                        <div className="otherBox" style={{ backgroundColor: x.userColor }}></div>
                        <div>
                            <div>🪙Gold: {x.gold} </div>
                            <div>🪵Wood: {x.wood} </div>
                            <div>🪨Stone: {x.stone} </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GamePage;