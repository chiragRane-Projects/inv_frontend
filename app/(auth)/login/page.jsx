"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Next Image
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Truck,
  ShieldCheck,
  User,
  Package,
  Loader2,
  Eye, 
  EyeOff, 
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role) => {
    setError("");
    if (role === "superadmin") {
      setEmail("testadmin@logistics.com");
      setPassword("admin123");
    } else if (role === "manager") {
      setEmail("testmanager@logistics.com");
      setPassword("manager123");
    } else if (role === "delivery") {
      setEmail("testdelivery@logistics.com");
      setPassword("delivery123");
    }
    setShowPassword(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center lg:grid lg:grid-cols-2">
      {/* Left Side: Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex relative h-full flex-col justify-between p-10 text-white dark:border-r">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <Image
                src="/login.jpg" 
                alt="Logistics warehouse operations"
                fill
                className="object-cover grayscale-[20%]" 
                priority
            />
             {/* Dark overlay to ensure text readability */}
            <div className="absolute inset-0 bg-slate-950/75 mix-blend-multiply" />
        </div>

        {/* Content sits on top (z-20) */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Truck className="mr-2 h-6 w-6 text-blue-400" />
          SmartLogistics Inc.
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-light italic opacity-90">
              "This platform revolutionized how we handle last-mile delivery and
              inventory forecasting. A game changer for our warehouse
              efficiency."
            </p>
            <footer className="text-sm font-medium text-slate-300">
               — Operations Director, FastLane Logistics
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="p-4 lg:p-8 flex items-center justify-center w-full bg-background">
        <div className="mx-auto w-full max-w-[450px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              {/* Password Input Wrapper for relative positioning */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Dynamic type change
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-11 pr-10" // Add padding right so text doesn't hide behind button
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 animate-in fade-in-50">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-all"
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          {/* Demo Credentials Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold">
                Project Demo Access
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            <div
              onClick={() => fillCredentials("superadmin")}
              className="cursor-pointer group relative flex items-center space-x-3 rounded-lg border border-slate-200 px-4 py-3 shadow-sm hover:border-blue-500 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Super Admin</p>
                <p className="text-xs text-gray-500 truncate">
                  Full access to all analytics
                </p>
              </div>
              <div className="invisible group-hover:visible text-blue-600 text-xs font-semibold">
                Click to fill
              </div>
            </div>

            <div
              onClick={() => fillCredentials("manager")}
              className="cursor-pointer group relative flex items-center space-x-3 rounded-lg border border-slate-200 px-4 py-3 shadow-sm hover:border-blue-500 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Package className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Warehouse Manager
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Inventory & Dispatch control
                </p>
              </div>
              <div className="invisible group-hover:visible text-blue-600 text-xs font-semibold">
                Click to fill
              </div>
            </div>

            <div
              onClick={() => fillCredentials("delivery")}
              className="cursor-pointer group relative flex items-center space-x-3 rounded-lg border border-slate-200 px-4 py-3 shadow-sm hover:border-blue-500 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Delivery Agent
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Route view & Order updates
                </p>
              </div>
              <div className="invisible group-hover:visible text-blue-600 text-xs font-semibold">
                Click to fill
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}