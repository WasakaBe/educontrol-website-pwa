import { cbtaMov } from '../../../assets/images'
import './InfoAreas.css'
export default function InforAreas() {
  return (
    <div className='container-info-areas'>
       <div className='section1-info-areas'>
          <h2>ÁREAS PROPEDÉUTICAS:</h2>
       </div>
       <div className='section2-info-areas'>
          <h3>FÍSICO-MATEMÁTICO</h3>
          <h3>QUÍMICO-BIOLÓGICO</h3>
          <h3>HUMANIDADES Y CIENCIAS SOCIALES</h3>
          <h3>ECONÓMICO-ADMINISTRATIVO</h3>
       </div>
       <div className='section2-info-areas'>
          <h3>SERVICIOS CON LOS QUE CONTAMOS EN LA INSTITUCIÓN:</h3>
          <div className='section-img-info-areas'>
            <img src={cbtaMov} alt=''/>
          </div>
       </div>
       
    </div>
  )
}
