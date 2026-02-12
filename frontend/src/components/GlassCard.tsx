import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard = ({ children, className, ...props }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass-morphism rounded-2xl p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
