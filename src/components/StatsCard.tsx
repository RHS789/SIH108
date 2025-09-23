import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ReactNode;
  description?: string;
  variant?: "default" | "sacred" | "gold";
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  description,
  variant = "default" 
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "sacred":
        return "bg-gradient-primary text-primary-foreground sacred-glow border-primary/20";
      case "gold":
        return "bg-gradient-gold text-primary-foreground gold-glow border-secondary/20";
      default:
        return "bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-sacred";
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-accent";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:scale-[1.02] ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-teko uppercase tracking-wider opacity-90">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${variant === "default" ? "bg-muted/50" : "bg-white/20"}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="text-3xl font-bold font-teko">
            {value}
          </div>
          {(change || description) && (
            <div className="flex items-center justify-between">
              {change && (
                <span className={`text-sm font-medium ${getChangeColor()}`}>
                  {change}
                </span>
              )}
              {description && (
                <span className="text-xs opacity-80 text-right">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}