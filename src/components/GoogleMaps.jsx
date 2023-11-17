import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { createCustomEqual } from "fast-equals"
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { useState, useEffect, useRef } from "react"
import PropTypes from 'prop-types'
import pin from '../assets/icons/pin.svg'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const DEFAULT_CENTER = { lat: -32.031, lng: -60.307 }
const DEFAULT_ZOOM = 15

const render = (status) => {
  if (status === Status.LOADING) return <h4>Cargando mapa...</h4>
  if (status === Status.FAILURE) return <h4>Ocurrio un error al cargar el mapa</h4>
  return null
}


export const GoogleMaps = ({setCenter}) => {
  // [START maps_react_map_component_app_state]
  const onCenterChanged = (m) => {
    setCenter(m.getCenter().toJSON());
  }

  // [START maps_react_map_component_app_return]
  return (
      <Wrapper apiKey={API_KEY} render={render}>
        <Map
          center={DEFAULT_CENTER}
          onCenterChanged={onCenterChanged}
          zoom={DEFAULT_ZOOM}
          style={{ flexGrow: "1", height: "100%" }}
        >
        </Map>
      </Wrapper>
  );
  // [END maps_react_map_component_app_return]
};

const Map = ({  onCenterChanged, ...options }) => {
  // [START maps_react_map_component_add_map_hooks]
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);
  // [END maps_react_map_component_add_map_hooks]

  // [START maps_react_map_component_options_hook]
  // because React does not do deep comparisons, a custom hook is used
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);
  // [END maps_react_map_component_options_hook]
  
  // [START maps_react_map_component_event_hooks]
  useEffect(() => {
    if (map) {
      ["center_changed"].forEach((eventName) =>
        window.google.maps.event.clearListeners(map, eventName)
      );
      if (onCenterChanged) {
        map.addListener("center_changed", () => onCenterChanged(map));
      }
    }
  }, [map, onCenterChanged]);
  // [END maps_react_map_component_event_hooks]
  // [START maps_react_map_component_return]
  return (
    <section className="relative select-none">
      <div ref={ref} style={{ width: "100%", height: "250px"}} />
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 pointer-events-none">
        <img src={pin} alt="pin" />
      </div>  
    </section>
  );
  // [END maps_react_map_component_return]
};

Map.propTypes = {
  onCenterChanged: PropTypes.func.isRequired,
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
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}