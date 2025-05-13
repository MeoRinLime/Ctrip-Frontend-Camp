import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

import { useAuth } from '../providers/auth-provider';

function NavBar() {
  const { isAuthenticated, signOut } = useAuth();

  return (
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
                <Button variant="ghost" className="text-lg" disabled>
                  角色：管理员/审核员
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="ghost" className="text-lg" onClick={() => signOut()}>
                  登出
                </Button>
              </NavigationMenuItem>
            </>
          ) : null}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default NavBar;
