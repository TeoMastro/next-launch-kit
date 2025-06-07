"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  error?: string
  message?: string
}

export function SigninForm({ error, message }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [showMessage, setShowMessage] = useState(!!message)
  const router = useRouter()

  useEffect(() => {
    if (message) {
      setShowMessage(true)
      const timer = setTimeout(() => {
        setShowMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError("")
    setShowMessage(false)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setFormError("Invalid email or password")
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setFormError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 mb-5">
          {(error || formError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || formError}</AlertDescription>
            </Alert>
          )}
          
          {message && showMessage && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}