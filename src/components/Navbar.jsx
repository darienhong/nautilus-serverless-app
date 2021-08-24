import React from 'react';
import '../App.css';
import {
    Link,
    useHistory,
} from 'react-router-dom';
import { Auth } from 'aws-amplify';


function Navbar() {

    const history = useHistory();

    const handleClick = async () => {
        try {
            localStorage.removeItem("count");
            localStorage.removeItem("username");
            await Auth.signOut();
            history.push("/LogIn");
        } catch (error) {
            console.log('error signout out: ', error);
        }

    };

    return (
        <div className="nav-bar-container">
            <nav>
                <ul>
                    <li> <Link to="/Home" className="nav-bar"> Home </Link></li>
                    <li> <Link to="/Events" className="nav-bar"> Events </Link></li>
                    <li> <Link to="/Dashboard" className="nav-bar"> Dashboard </Link></li>
                    {Auth.currentAuthenticatedUser() ? <li onClick={handleClick} className="nav-bar">  Log Out </li> :
                        <li> <Link to="/LogIn" className="nav-bar"> Log In </Link></li>
                    }
                </ul>
            </nav>
        </div>
    );

}

export default Navbar;