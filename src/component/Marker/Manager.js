import {Component} from 'react'
import { withDashContext } from '../Dash/ContextManager'

class Manager extends Component{
    constructor( props ) {
        super( props )
        this.ctx = null;
        this.drawOnScale = null;
        this.rectHub = [
            {x:0.1, y:0.1, w:0.5, h:0.05, label:"HelloWorld"}
        ];
    }

    drawAllRect(){
        const { maxScale, width, height } = this.props.dashStatus.state.displayerMetaInfo;
        this.ctx.clearRect(0, 0, width*maxScale, height*maxScale);
        this.rectHub.forEach(rect=>{
            this.drawRect(rect)
        })
    }

    drawRect = rect => {
        const { scale, WIDTH, HEIGHT } = this.props.dashStatus.state.displayerMetaInfo;
        const { x, y, w, h, label } = rect;
        this.ctx.strokeStyle="#f00";
        this.ctx.lineWidth = 10 / scale;
        this.ctx.strokeRectWithRadis(x*WIDTH, y*HEIGHT, w*WIDTH, h*HEIGHT, 40/scale ).stroke();

        this.ctx.strokeRectWithRadis((x+0.4)*WIDTH, 0.18*HEIGHT, 0.2*WIDTH, 0.03*HEIGHT, 20/scale ).stroke();

        this.ctx.moveTo((x+0.4)*WIDTH, 0.19*HEIGHT)
        this.ctx.lineTo((x+0.35)*WIDTH, 0.19*HEIGHT)
        this.ctx.lineTo((x+0.25)*WIDTH, 0.15*HEIGHT)
        this.ctx.stroke()
        this.ctx.beginPath();
        this.ctx.fillStyle="#f00"
        this.ctx.arc((x+0.25)*WIDTH, 0.15*HEIGHT, 20 / scale, 0, Math.PI*2)
        this.ctx.fill()
        this.ctx.beginPath();
        this.ctx.font = '64px HiraginoSansGB';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText( label, (x+0.5)*WIDTH, 0.195*HEIGHT)        
    }

    componentDidMount() {
        CanvasRenderingContext2D.prototype.strokeRectWithRadis = function (x, y, w, h, r) {
            let minWH = Math.min(Math.abs(w), Math.abs(h));
            if( Math.abs(r) > minWH/2){
                r = Math.abs(minWH)
            }
            this.beginPath();
            this.moveTo(w>0?x+r:x-r, y);
            this.arcTo(x+w, y, x+w, y+h, r);
            this.arcTo(x+w, y+h, x, y+h, r);
            this.arcTo(x, y+h, x, y, r);
            this.arcTo(x, y, x+w, y, r);
            // this.arcTo(x+r, y);
            this.closePath();
            this.stroke()
            return this;
        }

        this.props.onRef && this.props.onRef(this);
        console.log("registed component")
    }

    render() {
        // console.log( 'recive props ');
        const { scale } = this.props.dashStatus.state.displayerMetaInfo;
        if (scale !== this.drawOnScale) {
            this.drawOnScale = scale;
            // this.ctx && this.drawAllRect();
            // console.log("redraw")
        }
        return null
    }
}

export default withDashContext( Manager )
