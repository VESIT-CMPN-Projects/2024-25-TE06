import { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import './Profile.css'

function Profile() {
const accessToken = JSON.parse(localStorage.getItem("accessToken"));
const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    postalCode: ''
  });

  const fetchUser = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    try {
      const response = await axios.get('http://localhost:5000/api/v1/user/profile',config);
      console.log(response)
      if (response.data.user_profile) {
        const { username, email, address, postalCode } = response.data.user_profile;
        setProfile({
          name: username || '',
          email: email || '',
          address: address || '',
          postalCode: postalCode || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile({
        name: '',
        email: '',
        address: '',
        postalCode: ''
      }); 
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
      <div className="DetailsContainer">
        <div className="FormPart1">
          <Form.Group className="mb-3" controlId="ProfileName">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Charles" 
            value={profile.name}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId='ProfileEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="charlenereed@gmail.com" 
            value={profile.email}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Permanent Address</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Mumbai, India" 
            value={profile.address}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="400074" 
            value={profile.postalCode}
            readOnly
          />
        </Form.Group>
        </div>
      </div>
  )
}

export default Profile