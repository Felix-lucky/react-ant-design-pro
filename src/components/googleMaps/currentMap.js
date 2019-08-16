import React, { Component } from 'react';
import { compose ,withStateHandlers} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MapWithAMarker = compose(
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 22.585, lng: 113.923 }}
  >
    <Marker position={{ lat: 22.585, lng: 113.923 }} 
    animation={window.google.maps.Animation.BOUNCE} 
    />
  </GoogleMap>
);

class MAp extends Component {
  render() {
    return (
      <MapWithAMarker
  googleMapURL="http://maps.google.cn/maps/api/js?key=AIzaSyDiMtRFimA-FbyLPXwXPH3WKGsRPA1MQSk"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `100%` }} />}
  mapElement={<div style={{ height: `100%` }} />}
/>
    );
  }
}

export default MAp;
