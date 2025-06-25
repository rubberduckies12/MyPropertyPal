import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    axios.get(`http://localhost:5001/api/users/verify-email?token=${token}`)
      .then(() => {
        setMessage('Email verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      })
      .catch(() => setMessage('Verification failed or link expired.'));
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-10 text-lg">{message}</div>
  );
};

export default VerifyEmail;