import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {children}
      </main>
      <footer className="py-8 border-t border-white/10 glass-morphism text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ResumeIQ. Powered by AI.</p>
      </footer>
    </div>
  );
};
