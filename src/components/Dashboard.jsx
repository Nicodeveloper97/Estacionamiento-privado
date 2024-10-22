import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [newLicensePlate, setNewLicensePlate] = useState('');
  const [userCars, setUserCars] = useState([]);
  const [parkingSpots, setParkingSpots] = useState(Array(60).fill(null));
  const [selectedCarForParking, setSelectedCarForParking] = useState('');
  const [reservationMessage, setReservationMessage] = useState(''); // Nuevo estado para el mensaje
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
          parkingSpot: null
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

      // Aquí actualizamos el mensaje de confirmación
      setReservationMessage(`Tu lugar fue reservado con éxito en el lugar ${spotIndex + 1}.`);

      setSelectedCarForParking('');
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

  const { first_name, last_name } = userData.user;
  const { carbrand, carmodel } = userData;

  const carBrandsWithModels = carbrand.map((brand) => ({
    ...brand,
    models: carmodel.filter((model) => model.brand_code === brand.code),
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg mb-8 p-6 border border-[#1B00B7]/10">
        <h1 className="text-3xl font-bold text-[#1B00B7] mb-6">Dashboard del Usuario</h1>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            id="name"
            type="text"
            value={`${first_name} ${last_name}`}
            readOnly
            className="w-full px-4 py-2 bg-gray-50 border border-[#1B00B7]/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B00B7]/50"
          />
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg mb-8 p-6 border border-[#1B00B7]/10">
        <h2 className="text-2xl font-semibold text-[#1B00B7] mb-6">Vehículos Registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#1B00B7]/10">
            <thead className="bg-[#1B00B7]/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1B00B7] uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1B00B7] uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1B00B7] uppercase tracking-wider">Patente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1B00B7] uppercase tracking-wider">Estacionamiento</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#1B00B7]/10">
              {userCars.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{car.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.licensePlate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.parkingSpot || 'No asignado'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg mb-8 p-6 border border-[#1B00B7]/10">
        <h2 className="text-2xl font-semibold text-[#1B00B7] mb-6">Agregar un Nuevo Vehículo</h2>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
              <select
                id="brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-[#1B00B7]/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B00B7]/50"
              >
                <option value="">Seleccione una marca</option>
                {carBrandsWithModels.map((brand) => (
                  <option key={brand.code} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-[#1B00B7]/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B00B7]/50"
              >
                <option value="">Seleccione un modelo</option>
                {carBrandsWithModels
                  .find((brand) => brand.name === selectedBrand)
                  ?.models.map((model) => (
                    <option key={model.id} value={model.name}>
                      {model.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">Patente</label>
            <input
              type="text"
              id="licensePlate"
              value={newLicensePlate}
              onChange={(e) => setNewLicensePlate(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#1B00B7]/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B00B7]/50"
              placeholder="Ingrese la patente"
            />
          </div>
          <button
            onClick={handleAddCar}
            disabled={!selectedBrand || !selectedModel || !newLicensePlate}
            className="w-full bg-[#1B00B7] hover:bg-[#1B00B7]/90 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B00B7]/50 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar Vehículo
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg mb-8 p-6 border border-[#1B00B7]/10">
        <h2 className="text-2xl font-semibold text-[#1B00B7] mb-6">Reservar Estacionamiento</h2>
        
        {/* Mostramos el mensaje si hay uno */}
        {reservationMessage && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            {reservationMessage}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="carForParking" className="block text-sm font-medium text-gray-700 mb-2">Seleccione un vehículo</label>
          <select
            id="carForParking"
            value={selectedCarForParking}
            onChange={(e) => setSelectedCarForParking(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-[#1B00B7]/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B00B7]/50"
          >
            <option value="">Seleccione un vehículo</option>
            {userCars.filter(car => car.parkingSpot === null).map((car) => (
              <option key={car.id} value={car.id}>
                {car.brand} {car.model} - {car.licensePlate}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {parkingSpots.map((carId, index) => (
            <button
              key={index}
              className={`w-full h-12 rounded-md font-semibold transition-colors ${
                carId
                  ? 'bg-red-500 text-white cursor-not-allowed'
                  : 'bg-[#1B00B7]/10 text-[#1B00B7] hover:bg-[#1B00B7]/20'
              }`}
              onClick={() => handleReserveParking(index)}
              disabled={carId || !selectedCarForParking}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-center">
        <button
          onClick={handleLogout}
          className="bg-white border-2 border-[#1B00B7] text-[#1B00B7] hover:bg-[#1B00B7] hover:text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B00B7]/50 focus:ring-offset-2 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
