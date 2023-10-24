import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect } from "react";
import { useRef } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;

};
const GoogleMapsWrapper = ({
  children,
}) => {
  const apiKey = API_KEY;

  if (!apiKey) {
    return <div>Cannot display the map: google maps api key missing</div>;
  }

  return <Wrapper apiKey={apiKey} render={render}>{children}</Wrapper>;
};


const DEFAULT_CENTER = { lat: 8.8566, lng: 0.3522 };
const DEFAULT_ZOOM = 7;

const GoogleMaps = () => {
  const ref = useRef(null);

  useEffect(() => {
    // Display the map
    if (ref.current) {
      new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      style={{ width: "500px", height: "300px" }}
    />
  );
};

export const Test = () => (
  <GoogleMapsWrapper>
    <GoogleMaps />
  </GoogleMapsWrapper>
);