import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import genixLogo from './jok.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { signup, login } from '@/services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth(); // Renamed to avoid naming conflict
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('admin');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    hospital: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    const loginCredentials = {
      email: loginData.email,
      password: loginData.password,
      userType
    };

    try {
      const response = await login(loginCredentials);
      // Set user in AuthContext
      setAuthUser(response.user.userType);
      // Redirect based on userType
      if (userType === 'admin') {
        navigate('/appointments');
      } else if (userType === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/home');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      return setErrorMessage('Passwords do not match');
    }

    // Prepare data for signup API
    const userData = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      userType,
      specialization: userType === 'doctor' ? signupData.specialization : undefined,
      hospital: userType === 'doctor' ? signupData.hospital : undefined
    };

    console.log('Sending signup data:', userData);

    try {
      const response = await signup(userData);
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        specialization: '',
        hospital: ''
      });
      alert(response.message); // Show success message
      navigate('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.response?.data?.error || error.message || 'Signup failed. Please try again.');
    }
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/api/test');
      const data = await response.json();
      alert(`Backend test successful: ${data.message}`);
      console.log('Backend test response:', data);
    } catch (error) {
      alert(`Backend test failed: ${error.message}`);
      console.error('Backend test error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={genixLogo} alt="Genix Logo" className="h-200 sm:h-24 md:h-32 lg:h-[165px] w-auto" />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          {/* Test Backend Button */}
          <div className="mb-4 text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={testBackendConnection}
              className="text-xs"
            >
              Test Backend Connection
            </Button>
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <div className="mb-4">
              <div className="flex space-x-2 mb-6">
                <Button 
                  type="button" 
                  variant={userType === 'admin' ? 'default' : 'outline'}
                  className={userType === 'admin' ? 'bg-primary' : ''}
                  onClick={() => setUserType('admin')}
                >
                  Admin
                </Button>
                <Button 
                  type="button" 
                  variant={userType === 'doctor' ? 'default' : 'outline'}
                  className={userType === 'doctor' ? 'bg-primary' : ''}
                  onClick={() => setUserType('doctor')}
                >
                  Doctor
                </Button>
                <Button 
                  type="button" 
                  variant={userType === 'patient' ? 'default' : 'outline'}
                  className={userType === 'patient' ? 'bg-primary' : ''}
                  onClick={() => setUserType('patient')}
                >
                  Patient
                </Button>
              </div>
            </div>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                
                <Button type="submit" className="w-full bg-primary">
                  Login
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name" 
                    value={signupData.name}
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
                  />
                </div>
                
                {userType === 'doctor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input 
                        id="specialization" 
                        placeholder="E.g., Endocrinologist" 
                        value={signupData.specialization}
                        onChange={(e) => setSignupData({...signupData, specialization: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital</Label>
                      <Input 
                        id="hospital" 
                        placeholder="E.g., City Hospital" 
                        value={signupData.hospital}
                        onChange={(e) => setSignupData({...signupData, hospital: e.target.value})}
                        required
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="signup-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-primary">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
