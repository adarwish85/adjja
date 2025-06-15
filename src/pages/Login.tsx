import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const { signIn, signUp, user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Enhanced redirect logic with better role detection
  useEffect(() => {
    console.log('🔄 Login: Auth state check - user:', !!user, 'userProfile:', userProfile, 'loading:', loading, 'hasRedirected:', hasRedirected);
    
    // Only proceed if we have both user and profile, not loading, and haven't redirected yet
    if (user && userProfile && !loading && !hasRedirected) {
      const userRole = userProfile.role_name?.toLowerCase();
      console.log('👤 Login: User authenticated with role:', userRole, 'redirecting...');
      
      // Set flag to prevent multiple redirects
      setHasRedirected(true);
      
      // Use a timeout to ensure all state updates are complete
      setTimeout(() => {
        // Enhanced role-based routing with better debugging
        if (userRole === 'student') {
          console.log('🎓 Login: Redirecting to student dashboard');
          navigate("/dashboard", { replace: true });
        } else if (userRole === 'coach') {
          console.log('👨‍🏫 Login: Redirecting to coach dashboard');
          navigate("/coach", { replace: true });
        } else if (userRole === 'super admin' || userRole === 'admin' || userRole === 'superadmin') {
          console.log('👑 Login: Redirecting to admin dashboard');
          navigate("/admin", { replace: true });
        } else {
          console.log('❓ Login: Unknown role:', userRole, 'redirecting to home');
          navigate("/", { replace: true });
        }
      }, 100); // Short delay to ensure state consistency
    }
  }, [user, userProfile, loading, navigate, hasRedirected]);

  // Reset redirect flag when user changes
  useEffect(() => {
    if (!user) {
      setHasRedirected(false);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.emailOrUsername || !loginData.password) return;

    setIsSubmitting(true);
    try {
      console.log('🔐 Login: Attempting login for:', loginData.emailOrUsername);
      const { data, error } = await signIn(loginData.emailOrUsername, loginData.password);
      if (data && !error) {
        console.log("✅ Login: Login successful, waiting for profile to load and redirect...");
        // Clear the form on successful login
        setLoginData({ emailOrUsername: "", password: "" });
      }
    } catch (error) {
      console.error("❌ Login: Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) return;
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await signUp(signupData.email, signupData.password, {
        name: signupData.name
      });
      if (data && !error) {
        console.log("Signup successful, waiting for profile to load...");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Attempting password reset for email:", resetEmail);
      console.log("Current window location:", window.location.origin);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      console.log("Password reset response:", { error });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(`Failed to send reset email: ${error.message}`);
      } else {
        toast.success("Password reset email sent! Check your inbox and spam folder.");
        setShowResetForm(false);
        setResetEmail("");
      }
    } catch (error) {
      console.error("Password reset exception:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-bjj-navy">
            ADJJA Academy Portal
          </h2>
          <p className="mt-2 text-sm text-bjj-gray">
            Sign in to access your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              {showResetForm ? "Reset your password" : "Sign in to your account or create a new one"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showResetForm ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    We'll send you a link to reset your password. Check your spam folder if you don't see it.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-bjj-gold hover:bg-bjj-gold-dark text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Email"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowResetForm(false)}
                    disabled={isSubmitting}
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="emailOrUsername">Email or Username</Label>
                      <Input
                        id="emailOrUsername"
                        type="text"
                        value={loginData.emailOrUsername}
                        onChange={(e) => setLoginData(prev => ({ ...prev, emailOrUsername: e.target.value }))}
                        placeholder="Enter your email or username"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-sm text-bjj-gold hover:text-bjj-gold-dark underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={signupData.name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating account..." : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
