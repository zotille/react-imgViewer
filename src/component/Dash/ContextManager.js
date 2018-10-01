import React, { Component } from "react";
import EventEmitter from 'events'

export const DashContext = React.createContext();

class Provider extends Component {
    state = {
        displayerMetaInfo: {
            fulfilRate: 0.8,
            scale: 1,
            maxScale: 5,
            opacity: 0,
            defaultLeft: 0,
            defaultTop: 0,
            transition: `transform 0.3s ease-out 0s, opacity 0.3s ease 0s, 
                left 0.3s ease-out 0s, top 0.3s ease-out 0s`
        },
        actionInfo: {
            targetIndex: -1,
        },
        mainContainerMetaInfo: {},
        loading: true
    };
    events = new EventEmitter();

    updateState = (newState, callback) => {
        this.setState(newState, ()=>{callback && callback()});
    }

    registAction = index => {
        let { targetIndex } = this.state;
        let newIndex = Math.max( index, targetIndex );
        this.setState({ targetIndex: newIndex });
    }

    adjustScale = (deltaScale, controlPoint) => {
        const { displayerMetaInfo } = this.state;
        let { scale, maxScale, width, height, left, top, defaultLeft, defaultTop } = displayerMetaInfo;
        let newdisplayerMetaInfo, newScale, newLeft, newTop;
        if( (deltaScale < 0 && scale === 1) || (deltaScale > 0 && scale === maxScale )) {
            return
        }

        newScale = scale + deltaScale;
        // scale by the wheel
        if (controlPoint) {
            if( deltaScale > 0 && newScale > maxScale) {   // zoomIn
                newScale = maxScale;
            } else if( deltaScale < 0 && newScale < 1) {
                newScale = 1;
            }
            let deltaLeft = (controlPoint.x - (left + width/2)) / scale * (newScale - scale);
            let deltaTop = (controlPoint.y - (top + height/2)) / scale * (newScale - scale);
            newLeft = left - deltaLeft;
            newTop = top - deltaTop;

            newdisplayerMetaInfo = { ...displayerMetaInfo, scale: newScale, left: newLeft, top: newTop,
                transition: 'null' }            
        } else {
            // scale by the button
            if( deltaScale > 0) {   // zoomIn
                newScale = Math.min( newScale, maxScale) ;
                newdisplayerMetaInfo = { ...displayerMetaInfo, scale: newScale}
            } else if(scale>1) {    // zoomOut
                newScale = Math.max( newScale, 1 );
                newLeft = defaultLeft + (left-defaultLeft) / (scale-1) * (newScale-1);
                newTop = defaultTop + (top-defaultTop) / (scale-1) * (newScale-1);
                newdisplayerMetaInfo = { ...displayerMetaInfo, scale: newScale, left: newLeft, top: newTop}
            }
            newdisplayerMetaInfo = {...newdisplayerMetaInfo, transition: `transform 0.2s ease-out 0s, opacity 0.2s ease 0s, 
            left 0.2s ease-out 0s, top 0.2s ease-out 0s`}
        }
        // this.state.displayerMetaInfo = newdisplayerMetaInfo;
        this.setState({ displayerMetaInfo: newdisplayerMetaInfo})
    }

    render() {
        return (
            <DashContext.Provider
                value={{
                    state: this.state,
                    events: this.events,
                    adjustScale: this.adjustScale.bind(this),
                    setState: this.updateState.bind(this)
                }} >
                {this.props.children}
            </DashContext.Provider>
        );
    }
}

export function withDashContext(Component) {
    return function ContextComponent(props) {
        return (
            <DashContext.Consumer>
                {context => <Component {...props} dashStatus={context} />}
            </DashContext.Consumer>
        );
    };
}

export default Provider
