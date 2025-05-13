import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

import { useAuth } from './providers/auth-provider';

function BasicLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut, signIn } = useAuth();

  return (
    <div>
      {/* NavBar */}
      <div
        className="flex w-full bg-white shadow-md px-8 py-6 mb-6 items-center"
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div className="flex-1">
          <span className="font-bold text-2xl">后台管理系统</span>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="ml-auto flex">
            {isAuthenticated ? (
              <>
                <NavigationMenuItem>
                  <Button variant="ghost" className="text-lg">
                    角色：管理员/审核员
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className="text-lg"
                    onClick={() => signOut()}
                  >
                    登出
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              // <>
              // <NavigationMenuItem>
              //   <Button
              //     variant="ghost"
              //     className="text-lg"
              //     onClick={() => signIn(() => navigate('/login'))}
              //   >
              //     管理员/审核员登录
              //   </Button>
              // </NavigationMenuItem>
              // </>
              null
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Outlet />
    </div>
  );
}

export default BasicLayout;
