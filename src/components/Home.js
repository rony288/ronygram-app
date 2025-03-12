import React, { useState, useEffect } from "react";
import Posts from "./Posts";
import'./Posts.css';
import Navigation from "./Navigation";
import'./Navigation.css';
import Users from './Users';

const Home = () => {
    return(
        <div>
        <Navigation/>
        <Users/>
        <Posts/>
        <h1></h1>
        </div>
    )
}

export default Home;