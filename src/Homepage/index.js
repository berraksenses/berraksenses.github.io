import React from 'react';
import './Homepage.css';

function Homepage(props) {
    return (
        <div className="homepage-container">
            <div className="bg-image"></div>
            <div className="homepage-box">

                <h1>Interactive Graphics Project</h1>
                <div className="controls">
                    <p>Use your mouse to change the camera view</p>
                    <p>Press <span className="keyboard">Enter</span>, <span className="keyboard">Space</span> or <span className="keyboard">Shift</span> in order to start the animation.</p>
                </div>
                <div><button onClick={props.onStartBtnClick}>Start</button></div>
                <div className="authors">
                    <h3>Authors:</h3>
                    <div>Artsiom Sauchuk</div>
                    <div>Berrak Senses</div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;