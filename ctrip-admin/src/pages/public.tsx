import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"

function Public() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      })

      // Handle success — maybe store token or redirect
      console.log("Login success:", response.data)
      // For example:
      // localStorage.setItem("token", response.data.token)
      // router.push("/dashboard")

    } catch (err: any) {
      console.error("Login error:", err)
      setError(err?.response?.data?.message || "登录失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md p-2">
        <CardHeader className="pt-4 pb-0">
          <CardTitle>管理员/审核员登录</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Public
