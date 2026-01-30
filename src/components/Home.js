import React from "react";
import Posts from "./Posts";
import './Posts.css';
import Navigation from "./Navigation";
import './Navigation.css';
import Users from './Users';

const Home = () => {
    return(
        <div>
            <Navigation/>
            <Users/>
            <Posts/>
        </div>
    )
}

export default Home;
