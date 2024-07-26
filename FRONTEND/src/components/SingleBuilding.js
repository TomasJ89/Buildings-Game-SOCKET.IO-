import React from 'react';

const SingleBuilding = ({building,build}) => {
    return (
        <div className="p-1 border d-flex flex-column text-center">
            <div className="icon">{building.icon}</div>
            <div className="fw-bold">{building.name}</div>
            <small>Gold: {building.price}</small>
            <small>Wood: {building.wood}</small>
            <small>Stone: {building.stone}</small>
            <small><b>Production: </b>
                {Object.keys(building.production)[0]}: {building.production[Object.keys(building.production)[0]]}
            </small>
            <button className="mt-2" onClick={() => build(building)}>Build</button>
        </div>
    );
};

export default SingleBuilding;