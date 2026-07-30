import { Button } from "@kkb/ui/components/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">kkb</h1>
        <p className="text-muted-foreground">docs</p>
      </div>
      <div className="flex gap-3">
        <Button render={<Link href="/" />}>Home</Button>
        <Button
          variant="outline"
          render={
            <a href="https://github.com/kalynbeach/kkb" target="_blank" rel="noopener noreferrer" />
          }
        >
          GitHub
        </Button>
      </div>
    </div>
  );
}
