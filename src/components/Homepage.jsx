import Amplify, { API, Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import Lottie from 'react-lottie';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import '../App.css';
import animationData from '../assets/sailing.json';
import {
    Link
} from 'react-router-dom';

Amplify.configure(awsconfig);

Amplify.configure({
    API: {
        endpoints: [
            {
                name: "race-api",
                endpoint: "https://rsnjuggb6c.execute-api.us-east-1.amazonaws.com/prod/",
            }
        ]
    }
})


function Homepage() {

    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");


    async function getUserInfo() {

        await Auth.currentCredentials();
        await Auth.currentUserInfo()
            .then(function (result) {
                setUser(result.username);
                setEmail(result.attributes.email);
                setPhone(result.attributes.phone_number);
            })
            .catch(err => console.log(err))

    }

    async function checkUserExists() {
        const userInfo = await API.get("race-api", `/favourite/${user}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        localStorage.setItem("username", user);
        return userInfo;
    }


    async function addUser() {
        const params = {
            body: {
                "username": user,
                "email": email,
                "phone": phone
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }

        const data = await API.post("race-api", "/user", params);
        console.log("here! adding user");
    }


    useEffect(() => {
        getUserInfo();

        if (checkUserExists()) {
            addUser();
        }

        const reloadCount = sessionStorage.getItem('reloadCount');
        if (reloadCount < 2) {
            sessionStorage.setItem('reloadCount', String(reloadCount + 1));
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloadCount');
        }

    }, []);


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
    };

    return (
        <div className="home-page">
            {user && <Navbar />}

            <div className="landingpage-body">
                <div className="left-landing">
                    <div className="landing-text">

                        {user && user.length > 0 && <div className="intro-text"> Hey {user}! </div>}
                        <h1 className="landing"> Come Along for the <span className="journey"> Journey </span> in your favourite events </h1>
                    </div>
                    <Link to="/Events">
                        <div className="create-acc-button">
                            <p> Check out our events </p>
                        </div>
                    </Link>
                </div>

                <br />
                <br />
                <div className="animation">
                    <Lottie
                        options={defaultOptions}
                        height={600}
                        width={500}
                        style={{
                            paddingRight: 40
                        }}
                    />
                </div>
            </div>
            <br />
            <br />
            <br />
        </div>
    );
}

export default Homepage;