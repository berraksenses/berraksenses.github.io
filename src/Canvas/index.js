import React from 'react';
import initialization from './init';
import './Canvas.css';

class Canvas extends React.Component {

    componentDidMount() {
        this.isActive = true;
        initialization(this);
        
    }
    componentWillUnmount() {
        this.isActive = false;
    }

    render() {
        return (
                <canvas id="canvas"/>
        );
    }
}


export default Canvas;