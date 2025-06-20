
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navigationTimeout, setNavigationTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { signIn, signUp, user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(mode === 'signup');
  }, [mode]);

  // Simplified navigation logic with timeout safety
  useEffect(() => {
    // Don't do anything if we're still loading auth state
    if (loading) {
      console.log('🔄 Auth still loading, waiting...');
      return;
    }

    // Don't navigate if we're in the middle of submitting
    if (isSubmitting) {
      console.log('🔄 Still submitting, waiting...');
      return;
    }

    // Only proceed if we have a user
    if (!user) {
      console.log('❌ No user found, staying on login page');
      return;
    }

    console.log('✅ User authenticated, checking profile and role...', { 
      user: !!user, 
      userProfile,
      role: userProfile?.role_name,
      mandatoryCompleted: userProfile?.mandatory_fields_completed,
      approvalStatus: userProfile?.approval_status
    });

    // Clear any existing timeout
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }

    // Set a timeout to prevent infinite waiting
    const timeout = setTimeout(() => {
      console.log('⏰ Navigation timeout - proceeding with default redirect');
      
      if (!userProfile) {
        console.log('⚠️ No profile found after timeout, redirecting to profile wizard');
        navigate("/profile-wizard", { replace: true });
        return;
      }

      // Default role-based navigation
      const role = userProfile.role_name?.toLowerCase();
      console.log('🧭 Default navigation for role:', role);
      
      switch (role) {
        case 'super admin':
          navigate("/admin/dashboard", { replace: true });
          break;
        case 'coach':
          navigate("/coach/dashboard", { replace: true });
          break;
        case 'student':
          navigate("/dashboard", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    }, 3000); // 3 second timeout

    setNavigationTimeout(timeout);

    // If we have a profile, navigate immediately
    if (userProfile) {
      clearTimeout(timeout);
      
      const role = userProfile.role_name?.toLowerCase();
      const approvalStatus = userProfile.approval_status;
      const mandatoryCompleted = userProfile.mandatory_fields_completed;

      console.log('🧭 Immediate navigation logic:', { role, approvalStatus, mandatoryCompleted });

      // Route based on role and completion status
      if (role === 'super admin') {
        console.log('👑 Redirecting Admin to dashboard');
        navigate("/admin/dashboard", { replace: true });
      } else if (role === 'coach') {
        console.log('👨‍🏫 Redirecting Coach to dashboard');
        navigate("/coach/dashboard", { replace: true });
      } else if (role === 'student') {
        // Check if student needs to complete profile
        if (!mandatoryCompleted) {
          console.log('📝 Redirecting Student to profile wizard');
          navigate("/profile-wizard", { replace: true });
        } else if (approvalStatus === 'pending' || approvalStatus === 'rejected') {
          console.log('⏳ Redirecting Student to profile pending');
          navigate("/profile-pending", { replace: true });
        } else {
          console.log('🎓 Redirecting Student to dashboard');
          navigate("/dashboard", { replace: true });
        }
      } else {
        console.log('🔄 Default redirect to dashboard');
        navigate("/dashboard", { replace: true });
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [user, userProfile, loading, navigate, isSubmitting, navigationTimeout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔐 Attempting login for:', email);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error("❌ Login error:", error);
        toast.error(error.message || "Login failed");
        setIsSubmitting(false);
        return;
      }

      if (data?.user) {
        console.log('✅ Login successful for user:', data.user.id);
        toast.success("Login successful!");
        // Don't set isSubmitting(false) here - let the useEffect handle navigation
        // The component will handle the redirect, then we can clear the submitting state
      } else {
        console.error("❌ No user data received");
        toast.error("Login failed - no user data received");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("💥 Login failed:", error);
      toast.error("Login failed. Please try again.");
      setIsSubmitting(false);
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

    setIsSubmitting(true);

    try {
      console.log('📝 Attempting signup for:', email);
      const { data, error } = await signUp(email, password, name);
      
      if (error) {
        console.error("❌ Signup error:", error);
        toast.error(error.message || "Signup failed");
        setIsSubmitting(false);
        return;
      }

      if (data?.user) {
        console.log('✅ Signup successful for user:', data.user.id);
        toast.success("Account created successfully! Please complete your profile.");
        // Redirect to profile wizard after successful signup
        navigate("/profile-wizard", { replace: true });
      }
    } catch (error) {
      console.error("💥 Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isSignup;
    setIsSignup(newMode);
    navigate(newMode ? "/login?mode=signup" : "/login?mode=login", { replace: true });
  };

  // Show loading state while auth is initializing or we're submitting
  const isLoading = loading || isSubmitting;

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
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                    disabled={isLoading}
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

              {/* Show timeout warning if we're waiting too long */}
              {isSubmitting && !isSignup && (
                <div className="text-center text-sm text-gray-600 mt-4">
                  <p>Authenticating... If this takes too long, please refresh and try again.</p>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-bjj-gold"
                  onClick={toggleMode}
                  disabled={isLoading}
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
