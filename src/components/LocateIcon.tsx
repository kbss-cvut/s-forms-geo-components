import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

interface Props {
    readonly onClick: () => void;
}

interface State {
    init: boolean
}

export default class LocateIcon extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state= {
            init: false
        };
    }

    componentDidMount() {
        const svg = document.querySelector(".locate-icon");
        if (svg && !this.state.init) {
            svg.addEventListener('click', this.props.onClick);
            this.setState({init: true});
        }
    }

    getTooltip = (props: any) => {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Find my location
            </Tooltip>
        )
    }

    render() {
        return (
            <OverlayTrigger placement="left" delay={{ show: 220, hide: 20 }} overlay={this.getTooltip}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" style={{backgroundColor: "whitesmoke", padding:"2px", boxShadow: "1px 1px"}}
                     className="bi bi-pin-map-fill btn locate-icon" viewBox="0 0 16 16">
                    <path fillRule="evenodd" strokeWidth="4"
                          d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"/>
                    <path fillRule="evenodd" strokeWidth="4" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                </svg>
            </OverlayTrigger>
        );
    }
}