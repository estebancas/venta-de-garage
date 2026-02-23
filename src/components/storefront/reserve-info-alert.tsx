import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function ReserveInfoAlert() {
  return (
    <Alert className="border-blue-200 bg-blue-50/50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-sm font-semibold text-blue-900">
        Modalidad de Reserva Disponible
      </AlertTitle>
      <AlertDescription className="text-xs text-blue-800 mt-1">
        La función de <strong>Reserva</strong> está disponible para clientes que
        desean adquirir productos mediante nuestro exclusivo plan de financiamiento
        <em> PebiCuotas™</em> (pagos mensuales hasta 4 meses) o para aquellos que
        prefieren diferir el pago para una fecha posterior. Esta opción separa los
        artículos sin requerir pago inmediato.
      </AlertDescription>
    </Alert>
  );
}
