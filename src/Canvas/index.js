import React from 'react';
import initialization from './init';
import './Canvas.css';
import Loader from '../Loader';

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: true,
        }
    }
    componentDidMount() {
        this.isActive = true;
        initialization(this, () => {
            this.setState({showLoader: false})
        });

    }
    componentWillUnmount() {
        this.isActive = false;
    }

    render() {
        
        return (
            <div className="canvas-container">
                {this.state.showLoader && <Loader />}
                <canvas id="canvas" />
            </div>
        );
    }
}


export default Canvas;