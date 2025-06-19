
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(mode === 'signup');
  }, [mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Login failed");
        return;
      }

      if (data?.user) {
        toast.success("Login successful!");
        // Wait a moment for profile to load
        setTimeout(() => {
          const role = userProfile?.role_name;
          const approvalStatus = userProfile?.approval_status;
          const mandatoryCompleted = userProfile?.mandatory_fields_completed;

          console.log('Login redirect logic:', { role, approvalStatus, mandatoryCompleted });

          // Route based on role and completion status
          if (role === 'Super Admin') {
            navigate("/admin/dashboard");
          } else if (role === 'Coach') {
            navigate("/coach/dashboard");
          } else if (role === 'Student') {
            // Check if student needs to complete profile
            if (!mandatoryCompleted) {
              navigate("/profile-wizard");
            } else if (approvalStatus === 'pending' || approvalStatus === 'rejected') {
              navigate("/profile-pending");
            } else {
              navigate("/dashboard");
            }
          } else {
            // Default fallback
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(email, password, name);
      
      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Signup failed");
        return;
      }

      if (data?.user) {
        toast.success("Account created successfully! Please complete your profile.");
        // Redirect to profile wizard after successful signup
        navigate("/profile-wizard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    navigate(isSignup ? "/login?mode=login" : "/login?mode=signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-bjj-gold rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-bjj-navy">
            Ahmed Darwish Academy
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignup ? "Get Started" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignup 
                ? "Enter your details to create your account"
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6">
              {isSignup && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isSignup && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-bjj-gold hover:bg-bjj-gold-dark"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isSignup ? "Creating Account..." : "Signing in...") 
                  : (isSignup ? "Create Account" : "Sign In")
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-bjj-gold"
                  onClick={toggleMode}
                >
                  {isSignup ? "Sign In" : "Get Started"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
