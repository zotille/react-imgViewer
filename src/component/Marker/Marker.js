import React, {Component} from 'react'
import { withDashContext } from '../Dash/ContextManager'
import Manager from './Manager'

class Marker extends Component{
    constructor( props ){
        super( props );
        this._style = {
            userSelect: "none",
            width: "100%",
            height: "100%",
        }
        this.events = props.dashStatus.events;
    }

    registEvents = callback => {
        this.events.on("!LOAD_DATA", res => {
            this.manager.drawAllRect();
        })
    }
    componentDidMount(){
        console.log(this.manager, this.refs.canvas.getContext('2d'))
        this.manager.ctx = this.refs.canvas.getContext('2d');
        this.registEvents();
    }

    render() {
        const { width, height, maxScale } = this.props.dashStatus.state.displayerMetaInfo;
        return(
            <div style={{ ...this._style, position: "absolute",top: 0}}>
                <Manager onRef={ref=>{this.manager=ref}}/>
                <canvas ref="canvas" style={ this._style} width={width*maxScale+'px'} height={height*maxScale+'px'} />
            </div>
        )
    }
}

export default withDashContext( Marker )