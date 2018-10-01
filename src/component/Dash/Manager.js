import React, {Component} from 'react'
import { withDashContext } from './ContextManager'

import ToolBar from './ToolBar'
import Displayer from './Displayer';
class Manager extends Component{
    constructor( props ){
        super( props );
        this.parent = props.parent;
        this.parent.manager = this;
        this.events = props.dashStatus.events;
        this.controlPoint = { x: '', y: '' }
        this.componentsHub = [];
        this.targetIndex = -1;
        this.target = null;
    }

    mouseDownHandle = e => {
        console.log("DOWN");
        this.componentsHub.forEach(cpt=>{
            cpt.onMouseDown && cpt.onMouseDown(e);
        })
    }
    mouseMoveHandle = e => {
        this.target && this.target.onMouseMove(e);
    }
    mouseUpHandle = e => {
        console.log("UP");
        this.target && this.target.onMouseUp();
        this.targetIndex = -1;
        this.target = null;
    }

    catchEvents = ix =>{
        if(ix > this.targetIndex) {
            this.targetIndex = ix;
            this.target = this.componentsHub[this.targetIndex];
        }

    }

    broadcastEvent = (eventName, e, cptIndex) => {
        cptIndex = cptIndex || this.componentsHub;
        if (!(cptIndex instanceof Array)) cptIndex = [cptIndex]
        cptIndex.forEach( cpt => {
            this.componentsHub[cptIndex] && 
            this.componentsHub[cptIndex][eventName] && 
            this.componentsHub[cptIndex][eventName](e);
        })
    }

    registComponent = ( cpt, index ) => {
        this.componentsHub[index] = cpt;
        console.log(this.componentsHub)
    }

    keyPressHandle = e => {
        console.log(e);
        this.broadcastEvent('onKeyDown', e, 2);
    }

    registEvents = () => {
        window.addEventListener('keypress', this.keyPressHandle);
    }

    componentDidMount() {
        console.log('Manager mounted')
        this.registEvents();
    }
    
    render() {
        return(
            <div style={{width:"100%", height:"100%"}} onMouseDown={this.mouseDownHandle} onMouseMove={this.mouseMoveHandle} onMouseUp={this.mouseUpHandle} onMouseLeave={this.mouseUpHandle} onKeyPress={this.keyDownHandle} >
                <Displayer onRef={this.registComponent} actionIndex={1} onMouseDown={res=>{this.catchEvents(1)}} />
                <ToolBar onRef={this.registComponent} actionIndex={2} onMouseDown={res=>{this.catchEvents(2)}} parent={this} />
            </div>
        )
    }
}

export default withDashContext( Manager )