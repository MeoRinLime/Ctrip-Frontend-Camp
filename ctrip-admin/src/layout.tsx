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
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button";



import { useAuth } from './providers/auth-provider';

function BasicLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <div>
      <div className="flex w-full">
        <div className="flex-1" />
        <NavigationMenu>
          <NavigationMenuList className="ml-auto flex">
            <NavigationMenuItem>
              <Button variant="ghost" className="text-lg">
                ...(Role)
              </Button>
            </NavigationMenuItem>
            {isAuthenticated ? (
              <NavigationMenuItem>
                <Button variant="ghost" className="text-lg" onClick={() => signOut(() => navigate('/login'))}>
                    Sign Out
                </Button>
              </NavigationMenuItem>
            ) : null}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Outlet />
    </div>
  );
}

export default BasicLayout;
