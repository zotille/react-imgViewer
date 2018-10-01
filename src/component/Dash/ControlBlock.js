import React, {Component} from 'react'
import { withDashContext } from "./ContextManager";

class ControlBlock extends Component{
    constructor( props ) {
        super( props );
        this.parent = props.parent;
        this.basicStyle={
            ...props.style,
            userSelect: "none",
            cursor: "move",
            backgroundColor: "#000",
            marginRight: "5px",
            borderRadius: "4px"
        }
        this._style = {
            ...this.basicStyle,
            opacity: 0.05,
        }
        this.state = {
            style: this._style
        }
        this._hoverStyle = {
            ...this.basicStyle,
            opacity: 0.2,
        }
    }
    onMouseEnter = e =>{
        this.setState({
            style: this._hoverStyle
        })
    }
    onMouseLeave = e =>{
        if( !this.parent.actionSig ) {
            this.setState({
                style: this._style
            })
        }
}


    onMouseDown = e => {
        this.parent.actionSig = 'MOVE'
    }

    render(){
        return(
            <div onMouseDown={this.onMouseDown} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
             style={this.state.style} >
            </div>
        )
    }
}

export default withDashContext( ControlBlock )