import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import Lottie from 'react-lottie';
import '../App.css';
import animationData from '../assets/sailing.json';
import {
    Link,
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


function LandingPage() {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
    };

    return (
        <div className="landing-page">
            <div className="landingpage-body">
                <div className="left-landing">
                    <div className="landing-text">
                        <h1 className="landing"> Come Along for the <span className="journey"> Journey </span> in your favourite events </h1>
                    </div>
                    <Link to="/LogIn">
                        <div className="create-acc-button">
                            <p> Join our fan base </p>
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

export default LandingPage;