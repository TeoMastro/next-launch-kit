"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { useActionState } from "react"
import { validateSigninData } from "@/server-actions/auth"
import { ValidationState } from "@/types/auth"

interface LoginFormProps {
  error?: string
  message?: string
}

export function SigninForm({ error, message }: LoginFormProps) {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [authError, setAuthError] = useState("")
  const [showMessage, setShowMessage] = useState(!!message)
  const router = useRouter()
  const t = useTranslations('SignIn')
  const tValidation = useTranslations("Validation");

  const initialState: ValidationState = {
    errors: {},
    data: null,
    success: false,
    formData: { email: "", password: "" },
  }

  const [state, formAction] = useActionState(validateSigninData, initialState)

  useEffect(() => {
    if (state.success && state.data) {
      handleAuthentication(state.data)
    }
  }, [state])

  const handleAuthentication = async (data: { email: string; password: string }) => {
    setIsSigningIn(true)
    setAuthError("")
    setShowMessage(false)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError(t('invalidCredentials'))
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setAuthError(t('somethingWentWrong'))
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('signIn')}</CardTitle>
      </CardHeader>
      
      <form action={formAction} noValidate>
        <CardContent className="space-y-4 mb-5">
          {/* Display errors */}
          {(error || authError) && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertDescription className="text-red-800">{error || authError}</AlertDescription>
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
              placeholder={t('enterEmail')}
              disabled={isSigningIn}
              defaultValue={state.formData?.email || ""}
              className={state.errors.email ? "border-red-500" : ""}
            />
            {state.errors.email && (
              <p className="text-sm text-red-500">
                {tValidation(state.errors.email[0])}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t('enterPassword')}
              disabled={isSigningIn}
              defaultValue={state.formData?.password || ""}
              className={state.errors.password ? "border-red-500" : ""}
            />
            {state.errors.password && (
              <p className="text-sm text-red-500">
                {tValidation(state.errors.password[0])}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSigningIn}>
            {t('signIn')}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            {t('dontHaveAccount')}{" "}
            <a href="/auth/signup" className="font-medium text-primary hover:underline">
              {t('signUp')}
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
