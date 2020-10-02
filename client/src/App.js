import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);
  
  const showAddMarkerPopup = (event) => {
    const [ longitude, latitude ] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/srakibul99/ckei06wri0rob19qje0m9awua"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {
        logEntries.map(entry => (
          <>
          <Marker 
          key = {entry._id}
          latitude={entry.latitude}
          longitude={entry.longitude} 
          >

          <div
          onClick={() => setShowPopup({
            // ...showPopup,
            [entry._id] : true,
          })}
          >
            <svg 
              className="marker"
              style={{
                width: `${6 * viewport.zoom}px`,
                height: `${6 * viewport.zoom}px`,
              }} 
              viewBox="0 0 24 24" 
              stroke-width="1" 
              fill="none" 
              stroke-linecap="round"
              stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                </svg>
          </div>
        </Marker>
        {
          showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
              anchor="top" >
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                <small>Visited on: 
                  {new Date(entry.visitDate).toLocaleDateString()}</small>
              </div>
            </Popup>
          ) : null
        }
        </>
        ))
      }
      {
      addEntryLocation ? (
        <>
        <Marker 
          latitude={addEntryLocation.latitude}
          longitude={addEntryLocation.longitude}
          >

          <div>
            <svg 
            className="marker-red"
            style={{
              width: `${6 * viewport.zoom}px`,
              height: `${6 * viewport.zoom}px`,
            }} 
            viewBox="0 0 24 24"  
            stroke="red" 
            stroke-width="1" 
            fill="none" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>

          </div>
        </Marker>
        <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="top" >
              <div className="popup">
                <LogEntryForm onClose={()=> {
                  setAddEntryLocation(null);
                  getEntries();
                }} location={addEntryLocation}/>
              </div>
            </Popup>
        </>
      ) : null
}
      </ReactMapGL>
  );
}

export default App;