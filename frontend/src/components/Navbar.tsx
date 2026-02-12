import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, FileText, LogOut, User } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-morphism border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            ResumeIQ
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/builder">
                <Button variant="ghost" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Builder
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 border-primary/20 bg-white/5 hover:bg-white/10">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/login?mode=signup">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
