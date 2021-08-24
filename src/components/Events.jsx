import Amplify, { API } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { useState, useEffect } from "react";
import Navbar from './Navbar';
import '../App.css';
import boat from '../assets/sailboat.png';
import mountain from '../assets/mountain.png';
import iceberg from '../assets/iceberg.png';
import { Link } from 'react-router-dom';

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


function EventPage() {

    const [eventData, setEventData] = useState([]);

    useEffect(() => {

        async function getEvents() {
            const data = await API.get("race-api", "/events", {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            console.log(data);
            setEventData(data);
        }

        getEvents();

    }, []);

    console.log(eventData);

    return (

        <div className="events-page">
            <Navbar />
            <br />
            <br />
            <br />
            <br />
            {eventData.length > 0 &&
                <div>
                    <h1> Our Events </h1>
                    <div class="event-section">
                        {eventData.map((data) =>
                            <div>
                                <Link to={{ pathname: `/${data.eventId}` }}>
                                    <div class="event-icon">

                                        <p> {data.eventName} </p>
                                        <p id="organizer"> {data.organizer} </p>
                                        {data.eventName === "Discover Cape Horn" &&
                                            <center> <img src={boat} alt="boat" height="200" /></center>
                                        }

                                        {data.eventName === "Fuji Rush" &&
                                            <center ><img src={mountain} alt="mountain" height="200" /> </center>
                                        }

                                        {data.eventName === "Patagonia Adventure" &&
                                            <center> <img src={iceberg} alt="iceberg" height="200" /> </center>
                                        }
                                    </div>
                                </Link>
                            </div>


                        )}
                    </div>
                </div>
            }
        </div>


    );

}

export default EventPage;