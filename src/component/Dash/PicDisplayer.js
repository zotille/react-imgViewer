import React, {Component} from 'react'
import { withDashContext } from './ContextManager'

class PicDisplayer extends Component{
    constructor( props ){
        super( props )
        this.state = {
            imgSrc: ''
        }
        this.events = props.dashStatus.events;
        this._style = {
            userSelect: "none",
            width: "100%",
            height: "100%"
        }
    }

    imgLoaded = res => {
        let image = res.target, height, width, top, left;
        let { mainContainerMetaInfo, displayerMetaInfo } = this.props.dashStatus.state;
        let ratio = image.naturalWidth / image.naturalHeight;
        const { maxScale } = displayerMetaInfo;

        if (ratio >= mainContainerMetaInfo.width / mainContainerMetaInfo.height) {      // width >= height
            width = 0.8 * mainContainerMetaInfo.width;
            height = displayerMetaInfo.fulfilRate * mainContainerMetaInfo.width / ratio;
        } else {
            width = 0.8 * mainContainerMetaInfo.height * ratio;
            height = displayerMetaInfo.fulfilRate * mainContainerMetaInfo.height;
        }

        left = ( mainContainerMetaInfo.width - width ) / 2;
        top = ( mainContainerMetaInfo.height - height ) / 2;
        displayerMetaInfo = { ...displayerMetaInfo, width, height, top, left,
             defaultLeft: left, defaultTop: top, WIDTH: width*maxScale, HEIGHT: height*maxScale };
        this.props.dashStatus.setState({displayerMetaInfo: displayerMetaInfo}, 
            ()=>{
                this.events.emit("!LOAD_DATA")
            })

        this.props.dashStatus.setState({loading: false});
    }

    loadImg = src => {

    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                imgSrc: "http://www.zotille.top/test.png"
            })
        }, 1000)
    }

    render() {
        const { imgSrc } = this.state;
        return(
            <div style={this._style}>
                <img alt='shown' src={imgSrc} style={this._style} onLoad={this.imgLoaded}/>
            </div>
        )
    }
}

export default withDashContext(PicDisplayer)