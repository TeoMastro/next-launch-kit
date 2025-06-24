"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useTranslations } from "next-intl"
import { Fragment } from "react"

export function DynamicBreadcrumb() {
  const [isHydrated, setIsHydrated] = useState(false)
  const pathname = usePathname()
  const t = useTranslations("Menu")
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Split pathname and filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean)
  
  // Function to format segment names and translate them
  const formatSegmentName = (segment: string) => {
    const formatted = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    
    if (!isHydrated) return formatted
    
    // Try to translate the segment, fallback to formatted name if no translation
    try {
      return t(segment) || formatted
    } catch {
      return formatted
    }
  }

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  // If we're on /dashboard, show only Dashboard as current page
  if (pathname === "/dashboard") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{t("home")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">{t("home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/")
          const isLast = index === pathSegments.length - 1
          const displayName = formatSegmentName(segment)
          
          return (
            <Fragment key={`breadcrumb-${segment}-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
