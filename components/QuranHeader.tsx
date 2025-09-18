import { Sparkles } from "lucide-react";

export default function QuranHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h1>
        <Sparkles className="h-6 w-6 text-secondary" />
      </div>
      <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}
