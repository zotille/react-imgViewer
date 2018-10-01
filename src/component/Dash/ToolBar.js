import React, {Component} from 'react'
import { withDashContext } from './ContextManager'
import ControlBlock from './ControlBlock'

class Button extends Component{
    constructor( props ) {
        super( props );
        this.parent = props.parent;
        this._style = {
            width: "32px",
            height: "32px",
            marginRight:"5px",
            userSelect: "none",
            cursor: "pointer",
            opacity: 0.2,
            background: "#000000",
            boxShadow: "0 2px 4px 0 rgba(0,0,0,0.68)",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "20px"
        }
        this.actionSig = '';
    }
    render(){
        const { value, index } = this.props
        return(
            <div style={this._style} onClick={e => this.parent.clickHandle(index)}>
                {value}
            </div>
        )
    }
}

class ToolBar extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            left: 0,
            top: 0
        }
        this._style = {
            position: "absolute",
            left: 0,
            top: 0,
            display: "flex"
        }
        this.inputStyle = {
            color: "#fff",
            border: "NONE",
            backgroundColor: "#666",
            marginRight: "5px",
            borderRadius: "3px",
            width: "40px",
            textAlign: "center",
        }
        this.zoomStep = 0.5;
    }


    clickHandle = index => {
        console.log(index)
        switch(index){
            case 0:
            console.log("zoomIn", this.zoomStep)
                this.props.dashStatus.adjustScale(this.zoomStep)
                break;
            case 1:
            console.log("zoomOut")
                this.props.dashStatus.adjustScale(-this.zoomStep)
                break;
            default:
            console.warn("")
        }
    }

    scaleInput = e => {
        let newScale = e.target.value;
        if (/%/.test(newScale)) {
            newScale = newScale.split('%')[0];
        }
        let { displayerMetaInfo } = this.props.dashStatus.state;
        if(/^[0-9]*$/.test(newScale)){
            newScale = newScale / 100;
            if( newScale >= 1 && newScale <= displayerMetaInfo.maxScale ) {
                this.props.dashStatus.setState({displayerMetaInfo:{ 
                    ...displayerMetaInfo,
                    scale: newScale,
                    transition: `transform 0.3s ease-out 0s`
                }})
            } else{
                e.target.value = parseInt(this.props.dashStatus.state.displayerMetaInfo.scale*100, 10) + '%' 
            }
        } else {
            e.target.value = parseInt(this.props.dashStatus.state.displayerMetaInfo.scale*100, 10) + '%' 
        }
    }

    scaleKeyUp = e => {
        if( e.keyCode === 13) {
            this.scaleInput(e)
        }
    }

    onMouseDown = e => {
        this.controlPoint = {
            x: e.pageX, y: e.pageY
        }
    }

    onMouseMove = e => {
        if( !this.actionSig ) { return }
        let { pageX, pageY } = e;
        // console.log(pageX, pageY)
        let { x, y } = this.controlPoint;
        let dx = pageX - x, dy = pageY - y;
        const { top, left } = this.state;
        let newLeft = left + dx, newTop = top + dy;
        this.setState({ left: newLeft, top: newTop });
        this.controlPoint = { x: pageX, y: pageY }
    }
    onMouseUp = e => {
        this.actionSig = null
    }

    onKeyDown = e => {
        console.log('catch', e)
        if (e.key) {
            switch(e.key) {
                case '=':
                case '+':
                    this.props.dashStatus.adjustScale(this.zoomStep);
                    break;
                case '-':
                    this.props.dashStatus.adjustScale(-this.zoomStep);
                    break;
            }
        }
    }

    componentDidMount() {
        this.props.onRef(this, this.props.actionIndex)
    }

    render() {
        const { left, top } = this.state;
        const { scale } = this.props.dashStatus.state.displayerMetaInfo;
        if( this.refs.scaleDisplay ) {
            this.refs.scaleDisplay.value = parseInt(scale*100, 10) + '%';
        }
        return(
            <div onMouseDown={this.props.onMouseDown} style={{ ...this._style, left: left, top: top}}>
                <ControlBlock parent={this} style={{ height: "32px", width:"20px" }} />
                <Button key={0} value={'+'} index={0} parent={this}/>
                <input ref='scaleDisplay' defaultValue={ parseInt(scale*100, 10) + '%' } 
                    onBlur={this.scaleInput} onKeyUp={this.scaleKeyUp} style={this.inputStyle} />
                <Button key={1} value={'-'} index={1} parent={this}/>

            </div>
        )
    }
}

export default withDashContext( ToolBar )