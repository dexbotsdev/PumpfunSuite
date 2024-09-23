import { Router } from "../Router";
import { ThemeProvider } from "./ThemeProvider";
import { MantineProvider } from "@mantine/core";
                                                                                                                                                                                                                                                                                                                                                                                  import { KindeProvider } from "@kinde-oss/kinde-auth-react";

export default function App() {
  return (
    <ThemeProvider>
      <KindeProvider
            clientId="3199bc25f44e4db78ac6fb4cc352c61f"
            domain="https://radialdapps.kinde.com"
            redirectUri="http://13.70.206.19:5050/app"
            logoutUri="http://13.70.206.19:5050/"
        >
            <Router />
        </KindeProvider> 
    </ThemeProvider>
  );
}
 