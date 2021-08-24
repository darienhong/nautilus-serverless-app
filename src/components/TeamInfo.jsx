import Amplify, { API } from 'aws-amplify';
import { useState, useEffect } from "react";
import Navbar from './Navbar';
import '../App.css';
import { useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';


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
var namer = require("korean-name-generator");

function TeamInfo() {
    const { teamId } = useParams();

    const [teamCoords, setTeamCoords] = useState([]);
    const [teamData, setTeamData] = useState();
    const [coordsLine, setCoordsLine] = useState([]);
    const [polyPath, setPolyPath] = useState([]);
    const [selected, setSelected] = useState({});
    const [currKey, setCurrKey] = useState(0);


    const mapStyles = {
        height: "80vh",
        width: "100%"
    };

    const finalDest = {
        lat: -55.98282801216771,
        lng: -67.26653807526428,
    };

    const defaultCenter = {
        lat: -55.94483502601551,
        lng: -67.2778404496852
    };

    async function getTeam() {

        const teamCoords = await API.get("race-api", `/coordinates/${teamId}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const teamInfo = await API.get("race-api", `/teams/${teamId}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        setTeamCoords(teamCoords);
        setTeamData(teamInfo);
    }

    async function createCoordsLine() {

        setCoordsLine([]);

        if (coordsLine.length < teamCoords.length) {
            teamCoords.map(data => {
                const coord = {
                    lat: parseFloat(data.latitude),
                    lng: parseFloat(data.longitude)
                };

                setCoordsLine(coordsLine => [...coordsLine, coord]);

            })
        }

        console.log(coordsLine);
    };

    async function createPolyPath() {
        if (polyPath.length < 15) {
            setPolyPath(coordsLine);
        }
        console.log(polyPath);
    };

    useEffect(() => {
        getTeam();
        console.log(teamCoords);
    }, []);

    useEffect(() => {
        createCoordsLine();
        console.log(coordsLine);
    }, [teamCoords]);

    useEffect(() => {
        createPolyPath();
        console.log(polyPath);
        if (currKey < 23) {
            const interval = setInterval(refresh, 3000);
            return () => clearInterval(interval);
        }

    }, [coordsLine]);


    async function refresh() {
        await getTeam();
        await createCoordsLine();
        await createPolyPath();
        setCurrKey(currKey + 1);
    };

    console.log(polyPath);

    return (
        <div className="team-page">
            <Navbar />
            <div className="event-body">
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="title-event">
                    <Link to="/Dashboard">
                        <div className="back-button">
                            <IoChevronBack size="40px" />
                        </div>
                    </Link>

                </div>
                {teamData && <div><div> <div className="team-title"> <span className="min"> team </span> <span className="hover-team"> {teamData.country} </span></div>

                    <div style={{ textAlign: "center" }}>
                        <svg height={50} width={348}>
                            <line class="svg-line" x1={1} x2={1000} y1={1} y2={1} stroke="black" strokeWidth="20px" />
                        </svg>
                    </div>
                    <div className="team-members">

                        <p> 정경우 </p>
                        <p> 박지라 </p>
                        <p> 서동훈 </p>
                        <p> Kenneth Park </p>
                        <p> 배재원 </p>
                        <p> Jenny Kim </p>
                    </div>
                </div>

                </div>
                }

                {teamCoords && teamCoords.length > 0 &&

                    <center>
                        <br />
                        <br />
                        <div className="map-layout">
                            <LoadScript
                                googleMapsApiKey='AIzaSyA1d-gv11T2oZk30Fg25Ad2cF1GjIHmmUI'>
                                <GoogleMap
                                    key={currKey}
                                    mapContainerStyle={mapStyles}
                                    zoom={12}
                                    center={defaultCenter}
                                >
                                    {teamCoords.map((data, index) => {
                                        return (<Marker key={index} position={{ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }} onMouseOver={() => setSelected(index)} onMouseOut={() => setSelected({})}>
                                            {selected === index && (
                                                <InfoWindow
                                                    pixelOffset={"0"}
                                                    position={{ lat: selected.latitude, lng: selected.longitude }}
                                                    clickable={true}
                                                    onCloseClick={() => setSelected({})} >
                                                    <div className="info-window-location">
                                                        <p style={{ fontWeight: "600" }}> {data.timestamp} </p>
                                                        <p> ({data.latitude}, {data.longitude}) </p>
                                                    </div>

                                                </InfoWindow>
                                            )}  </Marker>)
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
                                                    <p style={{ fontWeight: "600" }}> Destination: Cape Horn </p>
                                                    <p> ({defaultCenter.lat}, {defaultCenter.lng}) </p>
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </Marker>

                                    <Polyline
                                        path={polyPath}
                                        options={{
                                            geodesic: true,
                                            strokeColor: '#669DF6',
                                            strokeOpacity: 1.0,
                                            strokeWeight: 2,
                                        }} />
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </center>
                }
                <br />
                <br />

            </div>
        </div>
    );
}

export default TeamInfo;