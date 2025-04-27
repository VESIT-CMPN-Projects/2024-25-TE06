import HomeHeader from '../../components/HomeHeader/HomeHeader'
import Footer from '../../components/Footer/Footer'
import './Error.css'
import Img from '../../assets/error.svg';
import { useNavigate } from 'react-router-dom';

function Error() {
  const navigate = useNavigate();
  return (
    <>
    <HomeHeader/>
    <section className="error">
        <div className="error-Img">
          <img src={Img} alt="" className="Img" />
        </div>
        <div className="error-text">
          <p className="error-text-p">
            <span className="error-text-span">Oops!</span> The page you are looking
            for might have been removed, had its name changed, or is temporarily
            unavailable.
          </p>
          <button className='error-home' onClick={()=>{navigate('/')}}>Go to Home Page</button>
        </div>
      </section>
    <Footer/>
    </>
  )
}

export default Error