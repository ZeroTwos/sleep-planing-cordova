import React from "react";
import * as Ons from 'react-onsenui';
export default class ChartInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: window.title || '',
            description: window.description || '',
        }
    }

    render(){
        return (<div>
                <Ons.Input
                    value={this.state.title}
                    onChange={this.props.changeTitle.bind(this)}
                    style={{fontSize : "1.5rem"}}/>
                <Ons.Input
                    value={this.state.description}
                    onChange={this.props.changeDescription.bind(this)}
                    style={{fontSize : "1.5rem"}}/>
                </div>
        )
    }
}