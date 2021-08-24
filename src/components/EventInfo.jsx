import Amplify, { API } from 'aws-amplify';
import { useState, useEffect, React } from "react";
import Navbar from './Navbar';
import '../App.css';
import { useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { HiChevronRight } from 'react-icons/hi';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

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


function EventInfo() {
    const { eventId } = useParams();

    const [eventData, setEventData] = useState();
    const [teamData, setTeamData] = useState([]);
    const [user, setUser] = useState("");
    const [favourites, setFavourites] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [selected, setSelected] = useState({});
    const [currKey, setCurrKey] = useState(0);
    const [hover, setHover] = useState(false);
   // localStorage.removeItem('favTeams');
    const favTeams = localStorage.getItem('favTeams') ? JSON.parse(localStorage.getItem('favTeams')) : [];
    localStorage.setItem('favTeams', JSON.stringify(favTeams));
    const headers = ["Team Country", "No.Members", "Favourite"];
    const leaderHeaders = ["Rank", "Team Country", "No.Members", "Distance to Destination"];

    const mapStyles = {
        height: "80vh",
        width: "100%",
        justifyContent: "center",
    };

    const finalDest = {
        lat: -55.98282801216771,
        lng: -67.26653807526428,
    };

    const defaultCenter = {
        lat: -55.94483502601551,
        lng: -67.2778404496852
    };

    async function getEvent() {

        console.log("saved username:" + localStorage.getItem("username"));
        setUser(localStorage.getItem("username"));

        const data = await API.get("race-api", `/events/${eventId}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const teams = await API.get("race-api", `/allTeams/${eventId}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        setEventData(data);
        setTeamData(teams);

    }

    async function getFavourites() {
        await getEvent();
        const data = await API.get("race-api", `/favourite/${user}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        //  console.log(data);
        setFavourites(data.favourites);
    }

    async function getLeaderboard() {
        const leaderboardInfo = await API.get("race-api", `/leaderboard/${eventId}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log(leaderboardInfo);
        setLeaderboard(leaderboardInfo);
    }

    async function refresh() {
        await getEvent();
        await getLeaderboard();
        setCurrKey(currKey + 1);
    };

    useEffect(() => {
        getEvent();
    }, []);

    useEffect(() => {
        getFavourites();
    }, [user]);

    useEffect(() => {
        getLeaderboard();
        const interval = setInterval(refresh, 5000);
        return () => clearInterval(interval);
    }, []);

    async function handleClickFav(teamId, country, members, lat, long, dist) {
        if (!favTeams.includes(teamId)) {
            favTeams.push(teamId);
            localStorage.setItem('favTeams', JSON.stringify(favTeams));
            console.log("favouriting");
            console.log(favTeams);

            const params = {
                body: {
                    "teamId": teamId,
                    "teamCountry": country,
                    "nomembers": members,
                    "lat": lat,
                    "long": long,
                    "distance": dist
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }

            const data = await API.post("race-api", `/favourite/${user}`, params);
            console.log("here, adding favourite");
            console.log(data);
        }

        console.log(favTeams);

        window.location.reload(true);
    }

    function handleClickUnFav(teamId) {
        if (favTeams.includes(teamId)) {
            favTeams.filter(item => item !== teamId);
        }
    }

    return (
        <div className="eventinfo-page">
            <Navbar />
            <div className="event-body">
                <br />
                <br />
                <br />
                <br />
                <br />
                {eventData && <div>
                    <div className="title-event">
                        <Link to="/Events">
                            <div className="back-button">
                                <IoChevronBack size="40px" />
                            </div>
                        </Link>
                        {eventData && <div> <div className="title-event">  <h1 className="eventName"> {eventData.eventName} </h1>
                            <h2 className="event-organizer"> {eventData.organizer} </h2>
                        </div>
                            <h2 className="event-description"> {eventData.description} </h2>
                        </div>

                        }
                    </div>

                    {leaderboard && leaderboard.length > 0 &&
                        <div>
                            <h1> Leaderboard </h1>
                            <div class="team-section" key={currKey}>

                                <table id="teams-table" >
                                    <tbody>
                                        <tr> {leaderHeaders.map(header =>
                                            <th> {header} </th>)} </tr>
                                        {leaderboard.map((data, index) => (<tr> <td> {index + 1} </td>
                                            <td> {data.country} </td>
                                            <td> {data.nomembers} </td>
                                            <td> {(data.distance).toFixed(3) + " km"} </td>
                                        </tr>))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                    <br />
                    <br />
                    <br />

                    {leaderboard && leaderboard.length > 0 &&
                        <center>
                            <div className="map-layout">
                                <LoadScript
                                    googleMapsApiKey='AIzaSyA1d-gv11T2oZk30Fg25Ad2cF1GjIHmmUI'>
                                    <GoogleMap
                                        mapContainerStyle={mapStyles}
                                        zoom={12}
                                        center={defaultCenter}
                                    >
                                        {leaderboard.map((data, index) => {
                                            return (<Marker key={index} position={{ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }} onMouseOver={() => setSelected(index)} onMouseOut={() => setSelected({})}>
                                                {selected === index && (
                                                    <InfoWindow
                                                        pixelOffset={"0"}
                                                        position={{ lat: selected.latitude, lng: selected.longitude }}
                                                        clickable={true}
                                                        onCloseClick={() => setSelected({})} >
                                                        <div className="info-window-location">
                                                            <p style={{ fontWeight: "600" }}> {data.country} </p>
                                                            <p> ({data.latitude}, {data.longitude}) </p>
                                                        </div>

                                                    </InfoWindow>
                                                )} </Marker>)
                                        }
                                        )}
                                        <Marker key={-1} position={finalDest} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" onMouseOver={() => setSelected(-1)} onMouseOut={() => setSelected({})}>
                                            {selected === -1 && (
                                                <InfoWindow
                                                    pixelOffset={"0"}
                                                    position={{ lat: selected.latitude, lng: selected.longitude }}
                                                    clickable={true}
                                                    onCloseClick={() => setSelected({})} >
                                                    <div className="info-window-location">
                                                        <p style={{ fontWeight: "600" }}> Cape Horn </p>
                                                        <p> ({defaultCenter.lat}, {defaultCenter.lng}) </p>
                                                    </div>

                                                </InfoWindow>
                                            )}
                                        </Marker>

                                    </GoogleMap>

                                </LoadScript>
                            </div>
                        </center>
                    }
                    <br />
                    < br />
                    <br />

                    {teamData && teamData.length > 0 &&
                        <div>
                            <h1> Current Teams </h1>
                            <div class="team-section" key={currKey}>

                                <table id="teams-table">
                                    <tbody>
                                        <tr> {headers.map(header =>
                                            <th> {header} </th>)} </tr>
                                        {teamData.map(data => (<tr> <td> {data.country} </td>
                                            <td> {data.nomembers} </td>
                                            <td>  {favTeams.includes(data.teamId) ? <div className="favourite-icon-filled">
                                                <AiFillStar size="23px" onClick={() => handleClickUnFav(data.teamId)} />
                                            </div> :
                                                <div className="favourite-icon" onClick={() => handleClickFav(data.teamId, data.country, data.nomembers, data.latitude, data.longitude, data.distance)} >
                                                    <AiOutlineStar size="23px" />
                                                </div>
                                            }
                                            </td></tr>))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                    <br />
                    <br />
                    {favourites && favourites.length > 0 &&
                        <div>
                            <h1> Your Favourite Teams </h1>
                            <center>
                                <div class="fav-section">
                                    <Link to="/Dashboard">
                                        <div class="team-icon"
                                            onMouseEnter={() => { setHover(true); }}
                                            onMouseLeave={() => { setHover(false); }}>
                                            <div>
                                                {favourites.map((data) =>
                                                    <p> {data.country} <br /> </p>
                                                )
                                                }
                                            </div>
                                            <div className="next">
                                                <HiChevronRight size="28px" />
                                            </div>
                                            {hover ? <p> See Details </p> : ""}
                                        </div>
                                    </Link>
                                </div>
                            </center>
                        </div>
                    }
                </div>
                }

            </div>
        </div>
    );
}

export default EventInfo;