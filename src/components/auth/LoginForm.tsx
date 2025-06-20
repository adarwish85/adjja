
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthFlow } from "@/hooks/useAuthFlow";

interface LoginFormProps {
  isSignup?: boolean;
  onToggleMode?: () => void;
}

export const LoginForm = ({ isSignup = false, onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, loading, error } = useAuthFlow();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔐 Attempting login for:', email);
      const result = await signIn(email, password);
      
      if (result.success) {
        console.log('✅ Login successful, waiting for redirect...');
        toast.success("Login successful!");
        // The useEffect in the parent component will handle navigation
      } else {
        console.error("❌ Login failed:", result.error);
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
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
      // TODO: Implement signup logic
      toast.success("Account created successfully! Please complete your profile.");
      navigate("/profile-wizard", { replace: true });
    } catch (error) {
      console.error("💥 Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-bjj-gold"
              onClick={onToggleMode}
              disabled={isLoading}
            >
              {isSignup ? "Sign In" : "Get Started"}
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
