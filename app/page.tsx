import { redirect } from "next/navigation"
import LoginScreen from "./components/login-screen"

export default function Home() {
  // For now, we'll use a simple boolean to simulate auth
  // Later this can be replaced with proper authentication
  const isAuthenticated = false

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return <LoginScreen />
}

