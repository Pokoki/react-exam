import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import "../index.css";

export const Route = createRootRoute({
  component: () => (
    <>
        <div>
        <Link to="/">Eco-companies board</Link>
        <Link to="/travel-carbon-simulator">Travel carbon simulator</Link>
      </div>
        <Outlet />
    </>
),
});