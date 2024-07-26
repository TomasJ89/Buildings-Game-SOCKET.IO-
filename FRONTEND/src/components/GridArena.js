import React from 'react';
import mainStore from "../store/mainStore";

const GridArena = ({selectedSpot,setSelectedSpot,destroy}) => {
    const { user,boughtBuildings } = mainStore();
    return (
        <div className="p-2 border flex3 grid-container">
            {Array.from({length: 100}, (_, i) => i + 1).map((spot) =>
                <div key={spot}
                     className="grid-item pointer"
                     style={{backgroundColor: selectedSpot === spot ? user.userColor : ""}}
                     onClick={() => setSelectedSpot(spot)}
                >
                    {boughtBuildings.map((building, i) =>
                        building.place === spot ?
                            <div key={i}
                                 className="d-flex h-100 w-100 justify-content-center align-items-center flex-column"
                                 style={{backgroundColor: building.color}}>
                                <div className="icon">{building.icon}</div>
                                <div className="fw-bold text-center">{building.name}</div>
                                {building.color !== user.userColor && building.name !== "ATA" ?
                                    <button onClick={() => destroy(building)}>Destroy</button> : ""}
                            </div>
                            : null
                    )}
                </div>
            )}
        </div>
    );
};

export default GridArena;