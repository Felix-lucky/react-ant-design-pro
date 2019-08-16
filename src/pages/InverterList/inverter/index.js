import React, { Component } from 'react';

class Inverter extends Component {
    render() {
        const { children }=this.props;
        return (
            <div>
                {children}
            </div>
        );
    }
}

export default Inverter;