import "./globals.css";
import { TransitionProvider } from "@/app/providers/TransitionProvider";
import SmoothScroll from "@/app/components/SmoothScroll";
import CanvasLayer from "@/app/components/CanvasLayer";
import Nav from "@/app/components/Nav";

export const metadata = {
  title: "ADDED — Where ideas take digital form",
  description:
    "Concept site for ADDED, a digital studio & Webflow agency in Stockholm. Persistent WebGL canvas with 3D page transitions, built with Next.js + React Three Fiber.",
};

export const viewport = {
  themeColor: "#06060b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider>
          <SmoothScroll>
            <CanvasLayer />
            <div className="scrim" aria-hidden />
            <Nav />
            <main className="content">{children}</main>
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}
