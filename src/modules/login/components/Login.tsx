import { LoginLayout } from './LoginLayout';
import { LoginForm } from './LoginForm';

export default function Login() {
  const handleLoginSuccess = () => {
  };

  return (
    <LoginLayout>
      <LoginForm onSubmit={handleLoginSuccess} />
    </LoginLayout>
  );
}