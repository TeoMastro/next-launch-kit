"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Calendar, Mail, Shield } from "lucide-react";
import { UserViewProps } from "@/types/user";

export function UserView({ user }: UserViewProps) {
    const router = useRouter();
    const tUser = useTranslations("User");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/admin/user")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {tUser("viewUser")}
                    </h1>
                </div>
                <Button
                    onClick={() => router.push(`/admin/user/${user.id}/update`)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </div>

            {/* User Information Card */}
            <Card>
                <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    {tUser("userId")}
                                </label>
                                <p className="text-lg font-mono">#{user.id}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    {tUser("fullName")}
                                </label>
                                <p className="text-lg">
                                    {user.first_name} {user.last_name}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                                    <Mail className="h-4 w-4" />
                                    <span>{tUser("email")}</span>
                                </label>
                                <p className="text-lg">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                                    <Shield className="h-4 w-4" />
                                    <span>{tUser("role")}</span>
                                </label>
                                <div className="mt-1">
                                    <Badge 
                                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                                        className="text-sm"
                                    >
                                        {user.role === "ADMIN" ? tUser("adminRole") : tUser("userRole")}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    {tUser("status")}
                                </label>
                                <div className="mt-1">
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        {tUser("active")}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{tUser("createdAt")}</span>
                            </label>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(user.created_at).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{tUser("updatedAt")}</span>
                            </label>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(user.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
