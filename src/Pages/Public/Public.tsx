import React from 'react'
import {
  Navbar,
  Carrusel,
  Welcome,
  Cultural,
  About,
  Carreras,
  Activities,
} from '../../Sections/Public'
import Inscription from '../../Sections/Public/Inscription/Inscription'
import InforAreas from '../../Sections/Public/InfoAreas/InforAreas'
import Contact from '../../Sections/Public/Contact/Contact'
import Breadcrumb from '../../constants/Breadcrumbs/Breadcrumbs'
const Public: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Breadcrumb path="Inicio" />
      <Carrusel />
      <Welcome />
      <Cultural />
      <About />
      <Carreras />
      <Activities />
      <Inscription />
      <InforAreas />
      <Contact />
    </div>
  )
}

export default Public
