import React, { Component } from 'react';

class Group extends Component {
    render() {
        const { children }=this.props;
        return (
            <div>
                {children}
            </div>
        );
    }
}

export default Group;