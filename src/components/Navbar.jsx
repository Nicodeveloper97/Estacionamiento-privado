import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jfif'; 

function Navbar() {
  return (
    <nav className="bg-gray-50 shadow-md">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8"> 
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0"> 
            
              <img src={logo} alt="Logo ParkSmart" className="h-10 w-auto" />
            
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
