import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vehicle } from '../../features/vehicles/types/vehicle.types';
import { VEHICLE_TYPE_LABELS } from '../../features/vehicles/types/vehicle.types';
import { createVehicleIcon, createSelectedIcon } from './MarkerIcon';
import { StatusBadge } from '../ui/StatusBadge';
import { useAppStore } from '../../store/appStore';

// Fix leaflet default icon issue with Vite
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  vehicles: Vehicle[];
  onLocationPick?: (lat: number, lng: number) => void;
}

// Component to fly to selected vehicle
function MapController({ vehicle }: { vehicle: Vehicle | null }) {
  const map = useMap();
  const prevVehicleId = useRef<string | null>(null);

  useEffect(() => {
    if (vehicle && vehicle.id !== prevVehicleId.current) {
      map.flyTo([vehicle.latitude, vehicle.longitude], 15, { duration: 1.2 });
      prevVehicleId.current = vehicle.id;
    }
  }, [vehicle, map]);

  return null;
}

// Component to handle map click for location picking
function LocationPicker({ onLocationPick }: { onLocationPick?: (lat: number, lng: number) => void }) {
  const isPickingLocation = useAppStore((s) => s.isPickingLocation);

  useMapEvents({
    click(e) {
      if (isPickingLocation && onLocationPick) {
        onLocationPick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

export function FleetMap({ vehicles, onLocationPick }: MapViewProps) {
  const { selectedVehicle, openVehicleDetail, isPickingLocation } = useAppStore();

  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden ${isPickingLocation ? 'cursor-crosshair' : ''}`}>
      {isPickingLocation && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Click on map to select location
        </div>
      )}
      <MapContainer
        center={[-6.2088, 106.8456]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController vehicle={selectedVehicle} />
        <LocationPicker onLocationPick={onLocationPick} />
        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicle?.id === vehicle.id;
          const icon = isSelected
            ? createSelectedIcon(vehicle.status)
            : createVehicleIcon(vehicle.status);

          return (
            <Marker
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => openVehicleDetail(vehicle),
              }}
            >
              <Popup>
                <div className="p-3 min-w-[180px]">
                  <div className="font-semibold text-surface-900 text-sm">{vehicle.licensePlate}</div>
                  <div className="text-xs text-surface-500 mt-0.5">{vehicle.name}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={vehicle.status} />
                    <span className="text-xs text-surface-400">{VEHICLE_TYPE_LABELS[vehicle.vehicleType]}</span>
                  </div>
                  <div className="text-xs text-surface-500 mt-2">
                    Driver: {vehicle.driverName}
                  </div>
                  <button
                    onClick={() => openVehicleDetail(vehicle)}
                    className="mt-3 w-full text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
