import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [newLicensePlate, setNewLicensePlate] = useState('');
  const [userCars, setUserCars] = useState([]);
  const [parkingSpots, setParkingSpots] = useState(() => {
    const spots = Array(20).fill(null);
    spots[11] = '1'; 
    return spots
  });
  const [selectedCarForParking, setSelectedCarForParking] = useState('');
  const [reservationMessage, setReservationMessage] = useState(''); 
  const [guestName, setGuestName] = useState("");
  const [guestSurname, setGuestSurname] = useState("");
  const [guestEntryDate, setGuestEntryDate] = useState("");
  const [guestEntryTime, setGuestEntryTime] = useState("");
  const [guestParkingSpot, setGuestParkingSpot] = useState("");
  const [guestReservations, setGuestReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setUserCars([
        {
          id: '1',
          brand: 'Fiat',
          model: 'Cronos',
          licensePlate: 'ABC123',
          parkingSpot: 12
        }
      ]);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleAddCar = () => {
    if (selectedBrand && selectedModel && newLicensePlate) {
      const newCar = {
        id: Date.now().toString(),
        brand: selectedBrand,
        model: selectedModel,
        licensePlate: newLicensePlate,
        parkingSpot: null
      };

      setUserCars((prevCars) => [...prevCars, newCar]);

      setSelectedBrand('');
      setSelectedModel('');
      setNewLicensePlate('');
    }
  };

  const handleReserveParking = (spotIndex) => {
    if (selectedCarForParking) {
      setParkingSpots(prevSpots => {
        const newSpots = [...prevSpots];
        newSpots[spotIndex] = selectedCarForParking;
        return newSpots;
      });

      setUserCars(prevCars => 
        prevCars.map(car => 
          car.id === selectedCarForParking 
            ? { ...car, parkingSpot: spotIndex + 1 } 
            : car
        )
      );

      setReservationMessage(`Tu lugar fue reservado con éxito en el lugar ${spotIndex + 1}.`);

      setSelectedCarForParking('');
    }
  };

  const handleReserveGuestParking = () => {
    if (guestName && guestSurname && guestEntryDate && guestEntryTime && guestParkingSpot) {
      const newGuest = {
        id: Date.now().toString(),
        name: guestName,
        surname: guestSurname,
        entryDate: guestEntryDate,
        entryTime: guestEntryTime,
        parkingSpot: guestParkingSpot,
      };

      setGuestReservations((prevReservations) => [...prevReservations, newGuest]);

      setParkingSpots((prevSpots) => {
        const newSpots = [...prevSpots];
        newSpots[parseInt(guestParkingSpot) - 1] = `${guestName} ${guestSurname}`;
        return newSpots;
      });

      setReservationMessage(`Reserva realizada para ${guestName} ${guestSurname} en el lugar ${guestParkingSpot}.`);

      setGuestName("");
      setGuestSurname("");
      setGuestEntryDate("");
      setGuestEntryTime("");
      setGuestParkingSpot("");
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#1B00B7]">Cargando...</p>
        </div>
      </div>
    );
  }

  const { first_name, last_name, email } = userData.user;
  const { carbrand, carmodel } = userData;

  const carBrandsWithModels = carbrand.map((brand) => ({
    ...brand,
    models: carmodel.filter((model) => model.brand_code === brand.code),
  }));

  const availableSpots = parkingSpots.map((spot, index) => spot === null ? index + 1 : null).filter(Boolean);

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 p-4 lg:p-6">
      
      <div className="w-full lg:w-2/3 space-y-6 order-2 lg:order-1">
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Agregar un vehículo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="carBrand" className="block text-sm font-medium text-gray-700">Marca</label>
              <select
                id="carBrand"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('');
                }}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una marca</option>
                {carBrandsWithModels.map((brand) => (
                  <option key={brand.code} value={brand.code}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Modelo</label>
              <select
                id="carModel"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedBrand}
              >
                <option value="">Selecciona un modelo</option>
                {selectedBrand && carBrandsWithModels.find(brand => brand.code === selectedBrand)?.models.map((model) => (
                  <option key={model.code} value={model.code}>{model.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="carLicensePlate" className="block text-sm font-medium text-gray-700">Patente</label>
              <input
                id="carLicensePlate"
                type="text"
                value={newLicensePlate}
                onChange={(e) => setNewLicensePlate(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddCar}
            className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar vehículo
          </button>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Reservar estacionamiento para invitados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                id="guestName"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="guestSurname" className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                id="guestSurname"
                type="text"
                value={guestSurname}
                onChange={(e) => setGuestSurname(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="guestEntryDate" className="block text-sm font-medium text-gray-700">Fecha de ingreso</label>
              <input
                id="guestEntryDate"
                type="date"
                value={guestEntryDate}
                onChange={(e) => setGuestEntryDate(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="guestEntryTime" className="block text-sm font-medium text-gray-700">Hora de ingreso</label>
              <input
                id="guestEntryTime"
                type="time"
                value={guestEntryTime}
                onChange={(e) => setGuestEntryTime(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="guestParkingSpot" className="block text-sm font-medium text-gray-700">Lugar de estacionamiento</label>
              <select
                id="guestParkingSpot"
                value={guestParkingSpot}
                onChange={(e) => setGuestParkingSpot(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un lugar</option>
                {availableSpots.map((spot) => (
                  <option key={spot} value={spot}>{spot}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleReserveGuestParking}
            className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reservar estacionamiento para invitado
          </button>
        </div>
      </div>

      
      <div className="w-full lg:w-1/3 space-y-6 order-1 lg:order-2">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Información del usuario</h2>
          <p className="text-sm text-gray-700"><strong>Nombre:</strong> {first_name}</p>
          <p className="text-sm text-gray-700"><strong>Apellido:</strong> {last_name}</p>
          <p className="text-sm text-gray-700"><strong>Email:</strong> {email}</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tus vehículos</h2>
          {userCars.length === 0 ? (
            <p>No has agregado vehículos aún.</p>
          ) : (
            <ul className="space-y-2">
              {userCars.map((car) => (
                <li
                  key={car.id}
                  className="p-3 bg-white rounded-md shadow-sm"
                >
                  <strong>{car.brand} {car.model}</strong> - {car.licensePlate}
                  <br />
                  Lugar de estacionamiento: {car.parkingSpot || "Ninguno"}
                </li>
              ))}
            </ul>
          )}
        </div>

        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Mis invitados</h2>
          {guestReservations.length === 0 ? (
            
            <p>No tienes reservas de invitados aún.</p>
          ) : (
            <ul className="space-y-2">
              {guestReservations.map((guest) => (
                <li
                  key={guest.id}
                  className="p-3 bg-gray-100 rounded-md shadow-sm border border-gray-200"
                >
                  <strong>{guest.name} {guest.surname}</strong>
                  <br />
                  Fecha y hora de ingreso: {guest.entryDate} {guest.entryTime}
                  <br />
                  Lugar de estacionamiento: {guest.parkingSpot}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}