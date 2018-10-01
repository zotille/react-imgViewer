import React, {Component} from 'react'
import { withDashContext } from './ContextManager'

import PicDisplayer from './PicDisplayer'
import Marker from '../Marker/Marker'

class Displayer extends Component{
    constructor( props ){
        super( props )
        this.state = {
        }
        this.displayBoxStyle = {
            position: "absolute", 
            boxShadow: "0px 0px 30px #eee", 
            // transition: `transform 0.1s ease-out 0s, opacity 0.3s ease 0s, 
            //     left 0.1s ease-out 0s, top 0.1s ease-out 0s`
        }
    }

    onScroll = e => {
        this.props.dashStatus.adjustScale( - e.deltaY / 500, {x:e.pageX, y: e.pageY} )
    }
    onMouseDown = e => {
        this.controlPoint = {
            x: e.pageX, y: e.pageY
        }
    }

    onMouseMove = e => {
        let { pageX, pageY } = e;
        // console.log(pageX, pageY)
        let { x, y } = this.controlPoint;
        let dx = pageX - x, dy = pageY - y;
        const { top, left } = this.props.dashStatus.state.displayerMetaInfo;
        let newLeft = left + dx, newTop = top + dy;
        this.props.dashStatus.setState({
            displayerMetaInfo: { ...this.props.dashStatus.state.displayerMetaInfo,
                left: newLeft, top: newTop, transition: null}
        })
        this.controlPoint = { x: pageX, y: pageY }
    }
    onMouseUp = e => {

    }

    componentDidMount() {
        this.props.onRef(this, this.props.actionIndex)
    }

    render() {
        const { loading, displayerMetaInfo } = this.props.dashStatus.state
        const { width, height, top, left, scale, transition } = displayerMetaInfo;
        return(
            <div style={{...this.displayBoxStyle, transition: transition, width:width+'px', height: height+'px', left: left+'px', top: top+'px',
                transform:`scale(${scale})`, opacity: loading ? 0 : 1 }} onMouseDown={this.props.onMouseDown}
                onWheel={this.onScroll} >
                <div style={{width:"100%", height:"100%", position:"relative"}}>
                    <PicDisplayer parent={this} />
                    <Marker parent={this} />
                    {/* <div style={{position:"absolute", top:0, width:"100%", height:"100%", backgroundColor:"#f003"}} /> */}
                </div>
            </div>
        )
    }
}

export default withDashContext(Displayer)

