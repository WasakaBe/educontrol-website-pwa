import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Admin, Alumn, Docent, Family, Public } from '../Pages';
import { Footer } from '../Sections/Public';
import { AuthContextProvider } from '../Auto/Auth';
import { AvisoDeClientes, Privacy, TerminosYCondiciones } from '../Sections/Doc';

const AppRoutes: React.FC = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Public />} />
          <Route path="/Administration/:userName?" element={<Admin />} />
          <Route path="/Alumn/:userName?" element={<Alumn />} />
          <Route path="/Docent/:userName?" element={<Docent />} />
          <Route path="/Familiar/:userName?" element={<Family />} />
          <Route path="/terms" element={<TerminosYCondiciones />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/aviso/clientes" element={<AvisoDeClientes />} />
        </Routes>
        <Footer />
      </Router>
    </AuthContextProvider>
  );
};

export default AppRoutes;
