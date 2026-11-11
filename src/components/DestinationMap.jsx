import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DestinationMap.css";

// Custom purple marker
const customIcon = new Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function DestinationMap({ destinations }) {
  return (
    <div className="destination-map-wrapper">
      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        scrollWheelZoom={false}
        className="destination-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {destinations.map((destination) => (
          <Marker
            key={destination.id}
            position={destination.coordinates}
            icon={customIcon}
          >
            <Popup>
              <div className="map-popup">
                <img
                  src={destination.image}
                  alt={destination.name}
                />

                <h3>{destination.name}</h3>

                <p>{destination.country}</p>

                <span>
                  Estimated budget: ${destination.budget}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default DestinationMap;