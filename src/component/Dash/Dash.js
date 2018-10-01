import React, {Component} from 'react'
import { Spin } from 'antd'
import DashProvider, { withDashContext } from './ContextManager'
import Manager from './Manager'

/**
 * Mistake_Dash
 * ***
 * Mistake_Dash is a component with a img and a sign layer,
 * to display mistakes ..
 */
class Dash extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        this.doms = { }
        this.mainContainerMetaInfo = { width: 0, height: 0 }
        this.innerBoxMetaInfo = {};
        
        this.events = props.dashStatus.events;
        this.incomeStyle = props.style;
    }

    resizeHandle = e => {
        console.log("resize")
    }

    registEvents = () => {
        window.addEventListener('resize', this.resizeHandle);
    }

    componentWillUnmount(){
        window.removeEventListener('resize',this.resizeHandle);
    }

    /**
     * After component mounted, init containers which includes:
     * * ***```mainContainer```*** the out container of this tool ..
     * * ***```innerBox```*** we add a spain betweenthe mainContainer and innerBox for better display, so the innerBox is the really div weare going to operate ..
     */
    componentDidMount( res ) {
        let mainContainer, innerBox;
        mainContainer = document.querySelector('div#Dash');
        let mainContainerMetaInfo = { width: mainContainer.offsetWidth, height: mainContainer.offsetHeight };
        this.props.dashStatus.setState({mainContainerMetaInfo: mainContainerMetaInfo});
        innerBox = mainContainer.querySelector('div#innerBox');
        innerBox.style.cssText = `width: ${mainContainerMetaInfo.width}px; height: ${mainContainerMetaInfo.height}px; position: relative`;
        this.doms = { mainContainer, innerBox };

        this.registEvents();
        // 
    }

    render() {
        let {loading} = this.props.dashStatus.state;
        return (
            <div id='Dash' style={{ width: "100%", overflow: "hidden", ...this.incomeStyle }} >
                <Spin spinning={loading} >
                    <div id='innerBox' >
                        <Manager parent={this} />
                    </div>
                </Spin>
            </div>
        )
    }

}

export function withProvider(Component) {
    return function ContextComponent(props) {
        return (
            <DashProvider>
                <Component {...props} />
            </DashProvider>
        );
    };
}
export default withProvider(withDashContext(Dash))