"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function signUpAction(formData: FormData) {
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
  if (!first_name || !last_name || !email || !password || !confirmPassword) {
    redirect("/auth/signup?error=" + encodeURIComponent("All fields are required"))
  }

  // Trim whitespace
  const trimmedFirstName = first_name.trim()
  const trimmedLastName = last_name.trim()
  const trimmedEmail = email.trim().toLowerCase()

  // Name validation
  if (trimmedFirstName.length < 2) {
    redirect("/auth/signup?error=" + encodeURIComponent("First name must be at least 2 characters long"))
  }

  if (trimmedLastName.length < 2) {
    redirect("/auth/signup?error=" + encodeURIComponent("Last name must be at least 2 characters long"))
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    redirect("/auth/signup?error=" + encodeURIComponent("Please enter a valid email address"))
  }

  // Enhanced password validation
  if (password.length < 8) {
    redirect("/auth/signup?error=" + encodeURIComponent("Password must be at least 8 characters long"))
  }

  if (password !== confirmPassword) {
    redirect("/auth/signup?error=" + encodeURIComponent("Passwords don't match"))
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    redirect("/auth/signup?error=" + encodeURIComponent("Password must contain at least one lowercase letter"))
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    redirect("/auth/signup?error=" + encodeURIComponent("Password must contain at least one number"))
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    redirect("/auth/signup?error=" + encodeURIComponent("Password must contain at least one special character"))
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    })

    if (existingUser) {
      redirect("/auth/signup?error=" + encodeURIComponent("User already exists with this email"))
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
    redirect("/auth/signup?error=" + encodeURIComponent("Something went wrong"))
  }

  redirect("/auth/signin?message=" + encodeURIComponent("Account created successfully"))
}