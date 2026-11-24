import {
  createRootRoute,
  Link,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import '#/styles.css';
import { Card, CardContent } from '#/common/components/ui/card';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '#/common/components/ui/navigation-menu';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <Navigate to="/" replace />,
});

function RootComponent() {
  return (
    <div className="max-w-5xl mx-auto">
      <header>
        <NavigationMenu className="my-2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={
                  <Link to="/" activeOptions={{ exact: true }}>
                    About
                  </Link>
                }
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link to="/contacts">Contacts</Link>}
              />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main>
        <Card>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
