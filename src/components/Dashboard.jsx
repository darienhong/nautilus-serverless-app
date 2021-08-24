import Amplify, { API } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { useState, useEffect } from "react";
import { withAuthenticator } from '@aws-amplify/ui-react';
import Navbar from './Navbar';
import '../App.css';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link, useHistory } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';

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


function Dashboard() {

  const [user, setUser] = useState("");
  const [favourites, setFavourites] = useState([]);
  const history = useHistory();
  const [hover, setHover] = useState(false);
  const [currHover, setCurrHover] = useState();
  const [selected, setSelected] = useState({});

  const defaultProps = {
    center: {
      lat: -55.98282801216771,
      lng: -67.26653807526428,
    },
    zoom: 11
  };

  const mapStyles = {
    height: "80vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: -55.98282801216771,
    lng: -67.26653807526428,
  };

  async function getFavourites() {
    const data = await API.get("race-api", `/favourite/${user}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(data);
    setFavourites(data.favourites);
    console.log(favourites);
  }

  function handleClick(teamId) {
    history.push(`/Dashboard/${teamId}`);
  }

  useEffect(() => {
    setUser(localStorage.getItem("username"));
  });

  useEffect(() => {
    getFavourites();
    console.log(favourites);
  }, [user]);

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard">
        <br />
        <br />
        <br />
        <br />
        <div className="dashboard-body">
          <div className="return-button">
            <Link to="/DCH2021">
              <div className="back-button">
                <IoChevronBack size="40px" />
              </div>
            </Link>
          </div>

          <h1 className="dashboard-text"> Hey there <span className="name"> {user}</span>, check out how your favourite teams are doing! </h1>
          <div className="dashboard-favs">
            {favourites.map((data, index) =>
              <Link to={{ pathname: `/Dashboard/${data.teamId}` }}>
                <div key={index} className="fav-box" onMouseEnter={() => {
                  setHover(true); setCurrHover(index);
                }} onMouseLeave={() => { setHover(false); setCurrHover(-1); }}> {hover && currHover === index ? "See Details" : data.country} </div> </Link>)}
          </div>
        </div>

        {favourites && favourites.length > 0 &&
          <LoadScript
            googleMapsApiKey='AIzaSyA1d-gv11T2oZk30Fg25Ad2cF1GjIHmmUI'>
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={13}
              center={defaultCenter}
            >
              {favourites.map((data, index) => {
                return (
                  <Marker key={index} position={{ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }} onMouseOver={() => setSelected(index)} onMouseOut={() => setSelected({})}>
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

                    )}
                  </Marker>
                )
              }
              )}
              <Marker key={-1} position={defaultCenter} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" onMouseOver={() => setSelected(-1)} onMouseOut={() => setSelected({})}>
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
        }

      </div>
    </div>
  );
}

export default withAuthenticator(Dashboard);