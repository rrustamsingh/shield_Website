import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CyberLoader } from "./components/CyberUI";
import { SiteChrome } from "./components/SiteChrome";
import Home from "./pages/Home";
import { About, Domains, Events, Team } from "./pages/PublicPages";
import Apply from "./pages/Apply";
import Status from "./pages/Status";
import Contact from "./pages/Contact";
import Management from "./pages/Management";
import NotFound from "./pages/NotFound";

function Router() {
  return <SiteChrome><Switch>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/domains" component={Domains} />
    <Route path="/team" component={Team} />
    <Route path="/events" component={Events} />
    <Route path="/apply" component={Apply} />
    <Route path="/status" component={Status} />
    <Route path="/contact" component={Contact} />
    <Route path="/management" component={Management} />
    <Route component={NotFound} />
  </Switch></SiteChrome>;
}

function Application() {
  const [booting, setBooting] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setBooting(false), 950); return () => window.clearTimeout(timer); }, []);
  if (booting) return <CyberLoader />;
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default Application;
