
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signIn(emailOrUsername, password);
      
      if (error) {
        console.error("Login error:", error);
        return;
      }

      if (data?.user) {
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
    } finally {
      setIsLoading(false);
    }
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
            Sign in to your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="emailOrUsername">Email or Username</Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Enter your email or username"
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

              <Button
                type="submit"
                className="w-full bg-bjj-gold hover:bg-bjj-gold-dark"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-bjj-gold"
                  onClick={() => navigate("/")}
                >
                  Get Started
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
