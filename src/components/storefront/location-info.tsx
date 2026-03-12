"use client";

import { useEffect, useState } from "react";
import { MapPin, ExternalLink, MessageCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Location {
  id: string;
  provincia: string;
  canton: string;
  distrito: string;
  codigo_postal: string;
  direccion_exacta: string | null;
  map_link: string | null;
  coordenadas: string | null;
}

export function LocationInfo() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await fetch("/api/location");
        if (response.ok) {
          const { data } = await response.json();
          setLocation(data);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocation();
  }, []);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (isLoading) {
    return null; // or a skeleton loader
  }

  // If no location is configured, show default message
  if (!location) {
    return (
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          Retiro en Persona
        </AlertTitle>
        <AlertDescription className="text-sm text-blue-800 dark:text-blue-200 mt-1">
          No ofrecemos envíos. Coordinaremos el punto de retiro contigo por WhatsApp.
        </AlertDescription>
      </Alert>
    );
  }

  // Build address string
  const addressParts = [
    location.distrito,
    location.canton,
    location.provincia,
    location.codigo_postal,
  ];
  const address = addressParts.filter(Boolean).join(", ");

  // Create WhatsApp link with pre-filled message
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        "Hola, me gustaría coordinar la entrega de mi producto"
      )}`
    : null;

  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
      <div className="space-y-3">
        <div>
          <AlertTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Ubicación de Retiro
          </AlertTitle>
          <AlertDescription className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            <div className="space-y-1">
              <p className="font-medium">{address}</p>
              {location.direccion_exacta && (
                <p className="text-xs">{location.direccion_exacta}</p>
              )}
            </div>
          </AlertDescription>
        </div>

        {(location.map_link || whatsappLink) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {location.map_link && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="h-8 text-xs border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                <a
                  href={location.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Ver en mapa
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}

            {whatsappLink && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="h-8 text-xs border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Coordinar por WhatsApp
                </a>
              </Button>
            )}
          </div>
        )}

        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
          <strong>Retiro únicamente en persona.</strong> No ofrecemos envíos. Coordina con
          nosotros para definir el punto de entrega.
        </p>
      </div>
    </Alert>
  );
}
