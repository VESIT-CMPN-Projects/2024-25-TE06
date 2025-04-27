import './GetStartedButton.css'
import { useNavigate } from 'react-router-dom'

function GetStartedButton() {
  const navigate = useNavigate();

  return (
    <div className="getStartedParent" onClick={()=>navigate('/auth')}>
      <div className="getStarted">Get Started</div>
    </div>
  )
}

export default GetStartedButton
