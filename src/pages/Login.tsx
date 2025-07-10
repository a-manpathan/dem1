import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

// ===================================================================================
// Restored original imports for API handling and authentication
// ===================================================================================
import { useAuth } from '@/contexts/AuthContext';
import { signup, login } from '@/services/api';
import yourDashboardImage from '@/assets/SignIn.png'
import genixLogo from '@/pages/jok.jpg';


// ===================================================================================
// IMPORTANT: Import your image here
// For example: import yourDashboardImage from './assets/SignIn.png';
// Then, use `yourDashboardImage` in the carouselItems array below.
// I am using a placeholder for this example.
//const yourDashboardImage = 'https://i.imgur.com/2jLhS84.png'; 
// ===================================================================================


// --- UI Component Stubs ---
// These are placeholders for your actual UI library components (e.g., from @/components/ui/...).
// They are included to make the component preview runnable.
const Button = ({ children, onClick, className, type = "button" }) => (
  <button type={type} onClick={onClick} className={`${className} px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2`}>
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input className={`${className} block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} {...props} />
);

const Label = ({ children, ...props }) => (
  <label className="text-sm font-medium text-gray-700" {...props}>
    {children}
  </label>
);

const Checkbox = ({ id, label }) => (
    <div className="flex items-center">
        <input id={id} name={id} type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <Label htmlFor={id} className="ml-2 block text-sm text-gray-900">{label}</Label>
    </div>
);
// --- End of UI Component Stubs ---

// --- Carousel Content Configuration ---
const carouselItems = [
    {
        heading: "Smarter Healthcare Access",
        description: "Access secure records and AI-powered assistance, all in one place.",
        imageSrc: yourDashboardImage
    },
    {
        heading: "Intelligent Consultation",
        description: "Leverage AI to transcribe and analyze patient consultations efficiently.",
        imageSrc: yourDashboardImage
    },
    {
        heading: "Streamlined Appointments",
        description: "Manage your appointments, checkups, and follow-ups with ease.",
        imageSrc: yourDashboardImage
    }
];

const Login = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth(); // Renamed to avoid naming conflict, as in original

  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState('login'); 
  const [userType, setUserType] = useState('doctor'); 
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    hospital: '',
  });

  // Effect for the self-sliding carousel
  useEffect(() => {
    const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e, formSetter, formState) => {
    const { name, value } = e.target;
    formSetter({ ...formState, [name]: value });
  };

  // Restored original login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

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
    } finally {
        setIsLoading(false);
    }
  };

  // Restored original signup handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (signupData.password !== signupData.confirmPassword) {
      return setErrorMessage('Passwords do not match');
    }
    
    setIsLoading(true);

    const userData = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      userType,
      specialization: userType === 'doctor' ? signupData.specialization : undefined,
      hospital: userType === 'doctor' ? signupData.hospital : undefined
    };

    try {
      const response = await signup(userData);
      setSignupData({
        name: '', email: '', password: '', confirmPassword: '', specialization: '', hospital: ''
      });
      alert(response.message); // Show success message as in original
      navigate('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.response?.data?.error || error.message || 'Signup failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const renderLoginForm = () => (
     <form onSubmit={handleLoginSubmit} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" value={loginData.email} onChange={(e) => handleInputChange(e, setLoginData, loginData)} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={loginData.password} onChange={(e) => handleInputChange(e, setLoginData, loginData)} required />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
        <div className="flex items-center justify-between">
            <Checkbox id="remember-me" label="Remember me" />
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot Password?
            </a>
        </div>
        <div>
            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300">
                {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
        </div>
    </form>
  );

  const renderSignupForm = () => (
    <form onSubmit={handleSignupSubmit} className="space-y-4">
        <Input name="name" placeholder="Full Name *" required value={signupData.name} onChange={(e) => handleInputChange(e, setSignupData, signupData)} />
        <Input name="email" type="email" placeholder="Email *" required value={signupData.email} onChange={(e) => handleInputChange(e, setSignupData, signupData)} />
        {userType === 'doctor' && (
            <>
                <Input name="specialization" placeholder="Specialization *" required value={signupData.specialization} onChange={(e) => handleInputChange(e, setSignupData, signupData)} />
                <Input name="hospital" placeholder="Hospital *" required value={signupData.hospital} onChange={(e) => handleInputChange(e, setSignupData, signupData)} />
            </>
        )}
        <div className="relative">
            <Input name="password" type={showPassword ? "text" : "password"} placeholder="Password *" required value={signupData.password} onChange={(e) => handleInputChange(e, setSignupData, signupData)} />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
        <Input name="confirmPassword" type="password" placeholder="Confirm Password *" required value={signupData.confirmPassword} onChange={(e) => handleInputChange(e, setSignupData, signupData)} />
        
        <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Left Visual Panel with Carousel */}
      <div className="hidden lg:flex w-1/2 bg-[#009CDE] p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div 
                className="flex transition-transform duration-1000 ease-in-out w-full"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {carouselItems.map((item, index) => (
                    <div 
                        key={index}
                        className="w-full flex-shrink-0 text-center flex flex-col items-center justify-center px-4"
                    >
                        <h1 className="text-4xl font-bold mb-4">{item.heading}</h1>
                        <p className="text-lg max-w-md mx-auto leading-relaxed">{item.description}</p>
                        <div className="relative mt-12 flex items-end justify-center px-4">
                            <img 
                                src={item.imageSrc} 
                                alt="Healthcare Dashboard" 
                                className="rounded-xl shadow-2xl z-10 w-full max-w-lg" 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="absolute bottom-10 flex space-x-3">
            {carouselItems.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                        index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                ></button>
            ))}
        </div>
</div>

      {/* Right Login/Signup Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
    <div>
        <img src={genixLogo} alt="Genix Logo" className="h-30 w-auto" />
    </div>
    <div className="flex bg-gray-200 rounded-full p-1 text-sm">
        {['doctor', 'patient', 'admin'].map((role) => (
            <button
                key={role}
                onClick={() => setUserType(role)}
                className={`capitalize px-3 py-1 rounded-full transition-colors duration-300 ${userType === role ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
            >
                {role}
            </button>
        ))}
    </div>
</div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {view === 'login' ? 'Welcome Back' : 'Create an Account'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                      <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="font-semibold text-blue-600 hover:underline">
                        {view === 'login' ? 'Sign up' : 'Sign in'}
                      </button>
                    </p>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}

                {view === 'login' ? renderLoginForm() : renderSignupForm()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
