import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert"
import { Button } from "./components/ui/button"
import { WarningCircle } from "@phosphor-icons/react"

  resetErrorBoundary: () => vo
  error: Error
  resetErrorBoundary: () => void
 

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  if (import.meta.env.DEV) throw error

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <WarningCircle className="h-4 w-4" />
          <AlertTitle>This spark has encountered a runtime error</AlertTitle>
}

















}
