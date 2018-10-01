import React, {Component} from 'react';
import './App.css';
import Dash from './component/Dash/Dash'

class App extends Component {

    render() {
        return (
            <div className="App" style={{display:'flex', justifyContent:'flex-start', 
            flexDirection:'column', height: "100vh", width: "100vw", overflow:"hidden"}}>
                <Dash style={{flexGrow:1}}/>
            </div>
        );
    }
}

export default App;
