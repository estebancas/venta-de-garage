"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

const GarageSaleLogo = () => {
  return (
    <div className="relative flex items-center justify-center w-8 h-8 mr-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15] group-hover:-rotate-3">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <style>
          {`
            @keyframes stroke-draw-house {
              0% { stroke-dasharray: 0 150; opacity: 0; }
              10% { opacity: 1; }
              100% { stroke-dasharray: 150 0; opacity: 1; }
            }
            @keyframes bee-entrance {
              0% { opacity: 0; transform: translateY(4px) scale(0.9); }
              40% { opacity: 1; transform: translateY(-1px) scale(1.02); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes bee-breathe {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-1.5px); }
            }

            .animate-house {
              animation: stroke-draw-house 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }

            .garage-door {
              opacity: 0;
              transform-origin: 16px 28px;
              animation: stroke-draw-house 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.2s;
              transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease;
            }

            /* Drastic Hover: Garage door rolls up */
            .group:hover .garage-door {
              transform: scaleY(0.15);
              opacity: 0.2;
            }

            .bee-entrance-layer {
              opacity: 0;
              transform-origin: 16px 22px;
              animation: bee-entrance 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.6s;
            }

            .bee-breathe-layer {
              transform-origin: 16px 22px;
              animation: bee-breathe 4s ease-in-out infinite 1.8s;
            }

            .bee-interaction-layer {
              transform-origin: 16px 22px;
              transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease;
            }

            /* Drastic Hover: Bee dramatically springs out, scales, and turns primary */
            .group:hover .bee-interaction-layer {
              transform: translateY(-9px) scale(1.45) rotate(12deg);
              color: hsl(var(--primary));
            }
          `}
        </style>

        {/* Abstract Minimalist House */}
        <path
          d="M5 14.5L16 4.6L27 14.5V26.4C27 27.2837 26.2837 28 25.4 28H6.6C5.71634 28 5 27.2837 5 26.4V14.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground animate-house"
        />

        {/* Garage Door Opening */}
        <path
          d="M10 28V18.6C10 17.7163 10.7163 17 11.6 17H20.4C21.2837 17 22 17.7163 22 18.6V28"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground garage-door"
        />

        {/* Premium Floating Bee (Nested for compound animation without interference) */}
        <g className="bee-entrance-layer text-foreground">
          <g className="bee-breathe-layer">
            <g className="bee-interaction-layer drop-shadow-sm group-hover:drop-shadow-md">
              {/* Back wing */}
              <path
                d="M15.5 21.5 C13 17 17 16 16.5 21.5 Z"
                fill="currentColor"
                fillOpacity="0.1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Front wing */}
              <path
                d="M16.5 21.5 C15 17 19 16 17.5 21.5 Z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Body */}
              <rect
                x="13"
                y="21.5"
                width="6.5"
                height="4.5"
                rx="2.25"
                fill="currentColor"
                fillOpacity="0.15"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              {/* Stripes */}
              <path
                d="M15.2 21.5 V26 M17.2 21.5 V26"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              {/* Stinger */}
              <path
                d="M19.5 23.75 L21 23.75"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export function StorefrontHeader() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 group transition-opacity hover:opacity-80 duration-300"
        >
          <GarageSaleLogo />
          <h1 className="text-2xl font-heading font-bold tracking-tight">
            Venta de Garage
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-12 w-12 rounded-full hover:bg-accent/50 transition-all duration-300"
            asChild
          >
            <Link href="/carrito">
              <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-6 w-6 rounded-full bg-foreground text-[11px] font-bold text-background flex items-center justify-center shadow-lg animate-fade-in-scale">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Carrito ({itemCount})</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
