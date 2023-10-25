import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { createCustomEqual } from "fast-equals"
import * as React from "react"
import { useEffect } from "react"
import { useRef } from "react"
import { isLatLngLiteral } from "@googlemaps/typescript-guards";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const DEFAULT_CENTER = { lat: -32, lng: -64 }
const DEFAULT_ZOOM = 6

const render = (status) => {
  return <h1>{status}</h1>;
};
/*
const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>
  if (status === Status.FAILURE) return <h3>{status} ...</h3>
  return null
}


const GoogleMapsWrapper = ({ children }) => {

  const apiKey = API_KEY

  if (!apiKey) {
    return <div>Cannot display the map: google maps api key missing</div>
  }

  return (
    <Wrapper
      apiKey={apiKey}
      render={render}
    >
      {children}
    </Wrapper>
  )
}


const GoogleMaps = ({ onClick, onIdle, children, style, ...options }) => {
  const ref = useRef(null)
  const [map, setMap] = React.useState()

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}))
    }
  }, [ref, map])

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        window.google.maps.event.clearListeners(map, eventName),
      )
      if (onClick) {
        map.addListener("click", onClick)
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map))
      }
    }
  }, [map, onClick, onIdle])

  useEffect(() => {
    // Display the map
    if (ref.current) {
      new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      })
    }
  }, [ref])

  return (
    <>
      <div
        ref={ref}
        style={{ width: "500px", height: "300px" }}
      />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map })
        }
      })}
    </>
  )
}

const Marker = ({ position }) => {
  console.log(position)
  const [marker, setMarker] = useState(null)

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker())
    }

    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  useEffect(() => {
    if (marker) {
      marker.setPosition(position)
    }
  }, [marker, position])

  return null
}

export const Test = () => {
  const [clicks, setClicks] = React.useState([]);
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM); // initial zoom
  const [center, setCenter] = React.useState(DEFAULT_CENTER);
  
  const onClick = (e) => {
    // avoid directly mutating state
    console.log("onClick")
    setClicks([...clicks, e.latLng]);
  };
  
  const onIdle = (m) => {
    console.log("onIdle");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };

   return (
   <GoogleMapsWrapper>
    <GoogleMaps
      onClick={onClick}
      onIdle={onIdle}
      style={{ width: "500px", height: "300px" }}
    >
      <Marker position={DEFAULT_CENTER} />
    </GoogleMaps>
  </GoogleMapsWrapper>
  )
}

*/

export const Test = () => {
  // [START maps_react_map_component_app_state]
  const [clicks, setClicks] = React.useState([]);
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM); // initial zoom
  const [center, setCenter] = React.useState(DEFAULT_CENTER);

  const onClick = (e) => {
    // avoid directly mutating state
    setClicks([e.latLng]);
  };

  const onIdle = (m) => {
    console.log("onIdle");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };


  // [END maps_react_map_component_app_state]
  const form = (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      <input
        type="number"
        id="lat"
        name="lat"
        value={center.lat}
        onChange={(event) =>
          setCenter({ ...center, lat: Number(event.target.value) })
        }
      />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={center.lng}
        onChange={(event) =>
          setCenter({ ...center, lng: Number(event.target.value) })
        }
      />
      <h3>{clicks.length === 0 ? "Click on map to add markers" : "Clicks"}</h3>
      {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))}
      <button onClick={() => setClicks([])}>Clear</button>
    </div>
  );
  // [START maps_react_map_component_app_return]
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper apiKey={API_KEY} render={render}>
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
        </Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );
  // [END maps_react_map_component_app_return]
};

const Map = ({ onClick, onIdle, children, style, ...options }) => {
  // [START maps_react_map_component_add_map_hooks]
  const ref = React.useRef(null);
  const [map, setMap] = React.useState();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);
  // [END maps_react_map_component_add_map_hooks]

  // [START maps_react_map_component_options_hook]
  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);
  // [END maps_react_map_component_options_hook]
  // [START maps_react_map_component_event_hooks]
  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        window.google.maps.event.clearListeners(map, eventName)
      );
      if (onClick) {
        map.addListener("click", onClick);
      }
      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);
  // [END maps_react_map_component_event_hooks]
  // [START maps_react_map_component_return]
  return (
    <>
      <div ref={ref} style={{ width: "500px", height: "300px" }} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
  // [END maps_react_map_component_return]
};

// [START maps_react_map_marker_component]
const Marker = (options) => {
  console.log(options)
  const [marker, setMarker] = React.useState();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);
  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);
  return null;
};

// [END maps_react_map_marker_component]
const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof window.google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof window.google.maps.LatLng
  ) {
    return new window.google.maps.LatLng(a).equals(new window.google.maps.LatLng(b));
  }
  // TODO extend to other types
  // use fast-equals for other objects
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}