import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function ReserveInfoAlert() {
  return (
    <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
        Modalidad de Reserva
      </AlertTitle>
      <AlertDescription className="text-xs text-blue-800 dark:text-blue-200 mt-1">
        La función de <strong>Reserva</strong> está disponible para clientes que
        desean adquirir productos mediante nuestro exclusivo plan de financiamiento
        <em> PebiCuotas™</em> (pagos mensuales hasta 4 meses) o para diferir el pago
        para una fecha posterior. Separa los artículos con tus datos de contacto y
        coordinaremos el pago contigo.
      </AlertDescription>
    </Alert>
  );
}
