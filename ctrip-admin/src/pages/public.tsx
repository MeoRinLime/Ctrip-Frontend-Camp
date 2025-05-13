import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/auth-provider';

function Public() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Manual check for username and password === "1"
    if (username === '1' && password === '1') {
      setLoading(false);
      // Simulate login success (you can add redirect or token logic here)
      console.log('Login success: manual admin');
      // For example:
      // localStorage.setItem("token", "manual-token")
      // navigate("/dashboard")
      signIn({ username, password }, () => {
        navigate(from, { replace: true });
      });
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      signIn(response.data, () => {
        // Redirect or perform any action after successful login
        console.log('User logged in:', response.data);
        navigate(from, { replace: true });
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.response?.data?.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/protected" replace />;
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
              {loading ? '登录中...' : '登录'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Public;
