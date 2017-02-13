"use strict";
import React from 'react';

class EmptyPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container text-center">
                <div style={{minHeight: "100vh", display: "flex", alignItems: "center"}}>
                    <h1 className="text-info col-md-12 col-sm-12 col-xs-12">Waiting for data</h1>
                </div>
            </div>
        )
    }
}

export default EmptyPage;
