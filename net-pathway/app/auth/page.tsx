import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { redirect } from "next/navigation";

export default function AuthPage() {
  redirect("/auth/login");
}