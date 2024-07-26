import React, {useState} from 'react';
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import mainStore from "../store/mainStore";

const LoginPage = ({socket}) => {
    const colors = [
        '#fd3546',
        '#FFDFBA',
        '#eeee85',
        '#BAFFC9',
        '#2c8c40',
        '#99c0de',
        '#E1BAFF',
        '#ea80c7',
        '#FFCCCC'
    ];
    const {userColor, setUserColor, setUser, setAllUsers, error, setError,setBoughtBuildings} = mainStore()
    const nav = useNavigate()

    useEffect(() => {
        socket.on("loggedIn", data => {
            console.log(data)
            if (data.error) return setError(data.message)

            setUser(data.data)
            nav('/game')

        })
        socket.on("allUsers", users => {
            console.log(users)
            setAllUsers(users)
        })
        socket.on('allBuildings', buildings => {
            setBoughtBuildings(buildings);
            setError("")

        });

    }, [])

    function login() {

        if (!userColor) return

        const user = {
            color: userColor,
        }
        socket.emit("login", user)
    }

    return (
        <div className="p-2 border text-center w-25 ">
            <h5>Select color and login</h5>
            <div className="p-2 border d-flex flex-wrap justify-content-center gap-2">
                {colors.map((x, i) =>
                    <div className={`box p-5 ${userColor === x ? "opacity-100" : ""}`}
                         onClick={() => setUserColor(x)}
                         key={i}
                         style={{backgroundColor: x}}></div>)}
            </div>
            <p className="error">{error}</p>
            <button className="btn btn-outline-dark" onClick={login}>Login</button>
        </div>
    );
};

export default LoginPage;