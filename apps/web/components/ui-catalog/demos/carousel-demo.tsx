"use client";

import { Badge } from "@kkb/ui/components/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@kkb/ui/components/carousel";

type CarouselSlide = {
  title: string;
  detail: string;
  tag: string;
};

const carouselSlides: ReadonlyArray<CarouselSlide> = [
  {
    title: "Server sections",
    detail:
      "Keep page structure on the server and isolate richer interaction inside small islands.",
    tag: "shell",
  },
  {
    title: "Local data only",
    detail: "Slides stay static in-file so the demo remains narrow and predictable.",
    tag: "demo",
  },
  {
    title: "Manual navigation",
    detail: "Arrow controls are enough here. No autoplay, timers, or remote media.",
    tag: "control",
  },
] as const;

export function CarouselDemo() {
  return (
    <div className="px-14 py-6">
      <Carousel opts={{ align: "start", loop: false }}>
        <CarouselContent>
          {carouselSlides.map((slide) => (
            <CarouselItem key={slide.title} className="md:basis-1/2">
              <div className="flex h-full flex-col justify-between rounded-md bg-muted/20 p-5">
                <div className="space-y-3">
                  <Badge variant="outline">{slide.tag}</Badge>
                  <div className="space-y-2">
                    <p className="text-base font-medium">{slide.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{slide.detail}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 top-1/2 -translate-y-1/2" />
        <CarouselNext className="right-1 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
