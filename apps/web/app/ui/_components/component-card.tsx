import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kkb/ui/components/card";
import { cn } from "@kkb/ui/lib/utils";

type ComponentCardProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function ComponentCard({ title, description, className, children }: ComponentCardProps) {
  return (
    <Card className={cn("h-full gap-0 overflow-hidden", className)}>
      <CardHeader className="gap-1 border-b py-5">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex h-full flex-1 flex-col p-0">{children}</CardContent>
    </Card>
  );
}
