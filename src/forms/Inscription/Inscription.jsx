import './Inscription.css'
import {Navbar} from '../../sections/Public'
export default function Inscriptionformulario() {
  return (
    <div>
      <Navbar/>
      <div className='container-inscription-form'>
        <div className='subcontainer-section-one-inscription-form'>
            {/*aqui ira la primera seccion del formulario */}
            <h2>Bienvenido, querido aspirante</h2>
             <label>A continuacion se le proporcionara un formulario donde usted tendra que rellenar con los datos que se piden o requieran, <span>favor de rellenar con seriedad e ingresando datos reales </span>.</label>
             <label>Tener a la mano los documentos requeridos para poder rellenar el formulario</label>
             <button>Ir al cuestionario</button>
        </div>
        {/*aqui ya va el cuestionario del formulario */}
      </div>
    </div>
  )
}
