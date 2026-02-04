"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardData {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  description?: string;
}

interface StatsCardsProps {
  stats: StatCardData[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          {/* Gradient accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-copper-500 to-teal-500" />
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-foreground sm:text-2xl">
                  {stat.value}
                </p>
                {stat.trend && (
                  <p
                    className={cn(
                      "text-xs font-medium",
                      stat.trend.positive
                        ? "text-green-600"
                        : "text-destructive"
                    )}
                  >
                    {stat.trend.positive ? "↑" : "↓"} {stat.trend.value}
                  </p>
                )}
                {stat.description && (
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-copper-100 p-2.5">
                <stat.icon className="size-5 text-copper-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
