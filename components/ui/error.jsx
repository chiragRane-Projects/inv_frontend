"use client"
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export function ErrorCard({ 
  title = 'Something went wrong', 
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  showHomeButton = false 
}) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-2 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button asChild size="sm">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function EmptyState({ 
  title = 'No data found', 
  description = 'There are no items to display.',
  action,
  icon: Icon = AlertTriangle
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {action}
    </div>
  )
}