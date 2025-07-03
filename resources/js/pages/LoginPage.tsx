import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md shadow-[0_0.125rem_0.5rem_0px_rgba(0,0,0,0.08)] rounded-md border-0 p-8">
        <div className="space-y-1 text-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Please enter your details to sign in
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-black">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 text-sm border-gray-200 rounded-md px-3 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-black">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-12 text-sm border-gray-200 rounded-md px-3 placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 !my-6 bg-black hover:bg-black/80 text-sm font-medium rounded-md"
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}; 