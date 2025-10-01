import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginLayout } from './LoginLayout';
import { LoginForm } from './LoginForm';
import { AuthService } from '../service/AuthService';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService().isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    console.log('Login exitoso');
  };

  return (
    <LoginLayout>
      <LoginForm onSubmit={handleLoginSuccess} />
    </LoginLayout>
  );
}