import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

interface Props {
    readonly onClick: () => void;
}

export default class LocateIcon extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    getTooltip = (props: any) => {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Najít mou polohu
            </Tooltip>
        )
    }

    render() {
        return (
            <OverlayTrigger placement="left" delay={{ show: 220, hide: 20 }} overlay={this.getTooltip}>
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 122.88 122.88"
                     fill="currentColor" style={{backgroundColor: "whitesmoke", padding:"2px", boxShadow: "1px 1px"}}
                     className="bi bi-pin-map-fill btn locate-icon" onClick={() => this.props.onClick()}>
                    <path d="M68.23,13.49c10.44,1.49,19.79,6.36,26.91,13.48c7.29,7.29,12.23,16.93,13.58,27.68h14.17v13.58h-14.39 c-1.62,10.13-6.42,19.2-13.36,26.13c-7.11,7.11-16.47,11.99-26.91,13.48v15.04H54.65v-15.04c-10.44-1.49-19.79-6.36-26.9-13.48 c-6.94-6.94-11.74-16-13.36-26.13H0V54.65h14.16c1.35-10.75,6.29-20.39,13.58-27.68c7.11-7.11,16.46-11.99,26.9-13.48V0h13.58 V13.49L68.23,13.49z M61.44,35.41c13.95,0,25.25,11.31,25.25,25.25c0,13.95-11.31,25.25-25.25,25.25 c-13.95,0-25.25-11.31-25.25-25.25C36.19,46.72,47.49,35.41,61.44,35.41L61.44,35.41z M89,33.11c-7.05-7.05-16.8-11.42-27.56-11.42 c-10.76,0-20.51,4.36-27.56,11.42c-7.05,7.05-11.42,16.8-11.42,27.56c0,10.76,4.36,20.51,11.42,27.56 c7.05,7.05,16.8,11.42,27.56,11.42c10.76,0,20.51-4.36,27.56-11.42c7.05-7.05,11.42-16.8,11.42-27.56 C100.41,49.9,96.05,40.16,89,33.11L89,33.11z"/></svg>
            </OverlayTrigger>
        );
    }
}