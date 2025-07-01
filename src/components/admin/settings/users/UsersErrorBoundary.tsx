
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Users } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class UsersErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Users Settings Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Users Settings Error
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl mb-4">
              <Users className="h-16 w-16 mx-auto text-bjj-gray" />
            </div>
            <h3 className="text-lg font-semibold text-bjj-navy">
              Something went wrong with the users settings
            </h3>
            <p className="text-bjj-gray">
              There was an error loading the users management interface. This could be due to 
              permission issues or database connectivity problems.
            </p>
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                <p className="text-sm text-red-700 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={this.handleRetry} className="bg-bjj-gold hover:bg-bjj-gold-dark">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
