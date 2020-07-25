import React from 'react';
import Canvas from '../Canvas'
import Homepage from '../Homepage';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCanvas: false,
    };
  }
  onStartBtnClick() {
    this.setState({ showCanvas: true })
  }

  render() {
    const children = this.state.showCanvas ? <Canvas /> : <Homepage onStartBtnClick={() => this.onStartBtnClick()}/>;
    return (
      <div className="App">
        <header className="App-header">
         
        </header>
        {children}
      </div>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Canvas />
//       </header>
//     </div>
//   );
// }

export default App;
