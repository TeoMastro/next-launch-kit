"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { getValidationTranslation, getAuthTranslation } from "@/lib/server-translations"

export async function signUpAction(formData: FormData) {
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
  if (!first_name || !last_name || !email || !password || !confirmPassword) {
    const message = await getValidationTranslation("allFieldsRequired");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  // Trim whitespace
  const trimmedFirstName = first_name.trim()
  const trimmedLastName = last_name.trim()
  const trimmedEmail = email.trim().toLowerCase()

  // Name validation
  if (trimmedFirstName.length < 2) {
    const message = await getValidationTranslation("firstNameTooShort");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  if (trimmedLastName.length < 2) {
    const message = await getValidationTranslation("lastNameTooShort");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    const message = await getValidationTranslation("invalidEmail");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  // Enhanced password validation
  if (password.length < 8) {
    const message = await getValidationTranslation("passwordTooShort");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  if (password !== confirmPassword) {
    const message = await getValidationTranslation("passwordsDontMatch");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    const message = await getValidationTranslation("passwordNeedsLowercase");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    const message = await getValidationTranslation("passwordNeedsNumber");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    const message = await getValidationTranslation("passwordNeedsSpecialChar");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    })

    if (existingUser) {
      const message = await getValidationTranslation("userAlreadyExists");
      redirect("/auth/signup?error=" + encodeURIComponent(message))
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    await prisma.user.create({
      data: {
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        email: trimmedEmail,
        password: hashedPassword,
      }
    })

    console.log(`New user created: ${trimmedEmail}`)
  } catch (error) {
    console.error("Signup error:", error)
    const message = await getAuthTranslation("somethingWentWrong");
    redirect("/auth/signup?error=" + encodeURIComponent(message))
  }

  const successMessage = await getValidationTranslation("accountCreatedSuccess");
  redirect("/auth/signin?message=" + encodeURIComponent(successMessage))
}