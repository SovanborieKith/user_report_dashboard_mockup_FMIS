"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { provinces } from "../data/provinces";

type Theme = "light" | "dark";

const THEME_CONFIG: Record<
  Theme,
  {
    pointColor: string;
    gradientFrom: string;
    gradientTo: string;
    tileUrl: string;
    tileOpacity: number;
    boundaryColor: string;
    boundaryFill: string;
    boundaryFillOpacity: number;
    shellBg: string;
    dotBg: string;
    labelColor: string;
    labelShadow: string;
    zoomBg: string;
    zoomColor: string;
    zoomHoverBg: string;
  }
> = {
  light: {
    pointColor: "#0d9488",
    gradientFrom: "#99f6e4",
    gradientTo: "#0d9488",
    tileUrl: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    tileOpacity: 0.9,
    boundaryColor: "#e9ac1dff",
    boundaryFill: "#f0fdfa",
    boundaryFillOpacity: 0.35,
    shellBg:
      "radial-gradient(circle at 50% 50%, rgba(13,148,136,0.06), transparent 45%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    dotBg: "#ffffff",
    labelColor: "#0f766e",
    labelShadow:
      "0 0 4px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.9)",
    zoomBg: "#ffffff",
    zoomColor: "#0d9488",
    zoomHoverBg: "#f0fdfa",
  },
  dark: {
    pointColor: "#E5CB90",
    gradientFrom: "rgb(8,47,73)",
    gradientTo: "rgb(34,211,238)",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    tileOpacity: 0.42,
    boundaryColor: "#e9ac1dff",
    boundaryFill: "#0f2f38",
    boundaryFillOpacity: 0.55,
    shellBg:
      "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.10), transparent 45%), linear-gradient(180deg, #07191f 0%, #041116 100%)",
    dotBg: "#dffdf8",
    labelColor: "#e7b019ff",
    labelShadow:
      "0 0 5px rgba(0,0,0,0.9), 0 0 8px rgba(34,211,238,0.6), 0 0 16px rgba(20,184,166,0.35)",
    zoomBg: "#0b1f26",
    zoomColor: "#22d3ee",
    zoomHoverBg: "#0f2f38",
  },
};

function fmt(n: number): string {
  return n.toString();
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function CambodiaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<{ map: any; L: any } | null>(null);
  const markersRef = useRef<any[]>([]);
  const boundaryRef = useRef<any | null>(null);
  const tileLayerRef = useRef<any | null>(null);

  const [theme, setTheme] = useState<Theme>("light");
  const themeRef = useRef<Theme>(theme);
  themeRef.current = theme;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (!mapRef.current || leafletRef.current) return;

      const cfg = THEME_CONFIG[themeRef.current];

      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        minZoom: 6,
        maxZoom: 12,
      }).setView([12.55, 104.95], 7.35);

      const tileLayer = L.tileLayer(cfg.tileUrl, {
        subdomains: "abcd",
        maxZoom: 19,
        opacity: cfg.tileOpacity,
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      L.control.zoom({ position: "bottomright" }).addTo(map);

      leafletRef.current = { map, L };

      fetch("/data/cambodia-outline.geojson")
        .then((res) => {
          if (!res.ok) throw new Error("Cambodia outline file not found");
          return res.json();
        })
        .then((geojson) => {
          if (!leafletRef.current) return;

          boundaryRef.current = L.geoJSON(geojson, {
            style: {
              color: cfg.boundaryColor,
              weight: 2,
              opacity: 0.7,
              fillColor: cfg.boundaryFill,
              fillOpacity: cfg.boundaryFillOpacity,
            },
          }).addTo(map);

          map.fitBounds(boundaryRef.current.getBounds(), {
            padding: [18, 18],
          });

          drawDots(L, map, themeRef.current);
        })
        .catch(() => {
          // Fallback if GeoJSON is not available.
          drawDots(L, map, themeRef.current);
        });

      setTimeout(() => map.invalidateSize(), 150);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      boundaryRef.current?.remove();
      boundaryRef.current = null;

      tileLayerRef.current = null;

      leafletRef.current?.map.remove();
      leafletRef.current = null;
    };
  }, []);

  // Swap tile layer, boundary style, and dots whenever theme changes
  useEffect(() => {
    if (!leafletRef.current) return;
    const { L, map } = leafletRef.current;
    const cfg = THEME_CONFIG[theme];

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const tileLayer = L.tileLayer(cfg.tileUrl, {
      subdomains: "abcd",
      maxZoom: 19,
      opacity: cfg.tileOpacity,
    }).addTo(map);
    tileLayer.bringToBack();
    tileLayerRef.current = tileLayer;

    if (boundaryRef.current) {
      boundaryRef.current.setStyle({
        color: cfg.boundaryColor,
        fillColor: cfg.boundaryFill,
        fillOpacity: cfg.boundaryFillOpacity,
      });
    }

    drawDots(L, map, theme);
  }, [theme]);

  function drawDots(L: any, map: any, currentTheme: Theme) {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const cfg = THEME_CONFIG[currentTheme];
    const max = Math.max(...provinces.map((p: any) => Number(p.users || 0)));

    provinces.forEach((p: any, index: number) => {
      const value = Number(p.users || 0);
      const normalized = max > 0 ? value / max : 0;

      const size = 30 + normalized * 50;
      const dotSize = 7 + normalized * 7;
      const blinkDelay = ((index % 7) * 0.22 + normalized * 0.4).toFixed(2);

      const name = escapeHtml(p.name);
      const sites = fmt(Number(p.sites || 0));
      const users = fmt(Number(p.users || 0));

      const html = `
        <div 
          class="fmis-neon-point"
          style="
            --point-color:${cfg.pointColor};
            --point-size:${size}px;
            --dot-size:${dotSize}px;
            --blink-delay:${blinkDelay}s;
            --dot-bg:${cfg.dotBg};
            --label-color:${cfg.labelColor};
            --label-shadow:${cfg.labelShadow};
          "
        >
          <span class="fmis-ring fmis-ring-one"></span>
          <span class="fmis-ring fmis-ring-two"></span>
          <span class="fmis-ring fmis-ring-three"></span>
          <span class="fmis-dot"></span>
          <span class="fmis-map-label">${name}</span>
        </div>
      `;

      const icon = L.divIcon({
        className: "fmis-neon-div-icon",
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([p.lat, p.lng], {
        icon,
        riseOnHover: true,
      }).addTo(map);

      marker.bindTooltip(
        `
        <div class="fmis-tooltip-card" data-theme="${currentTheme}">
          <p class="fmis-tooltip-title">${name}</p>

          <div class="fmis-tooltip-row">
            <span style="color:${cfg.pointColor}">Sites: ការដ្ឋានសរុប</span>
            <strong>${sites}</strong>
          </div>

          <div class="fmis-tooltip-row">
            <span style="color:${cfg.pointColor}">Users: អ្នកប្រើប្រាស់សរុប</span>
            <strong>${users}</strong>
          </div>
        </div>
        `,
        {
          sticky: true,
          opacity: 1,
          className: "leaflet-tooltip-clean",
          offset: [14, 0],
        }
      );

      markersRef.current.push(marker);
    });
  }

  const cfg = THEME_CONFIG[theme];

  return (
    <div
      className="bg-card border border-border rounded-xl p-5"
      data-fmis-theme={theme}
    >
      <style>{`
        .fmis-map-shell {
          position: relative;
          height: 510px;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid rgba(13, 148, 136, 0.22);
          background: ${cfg.shellBg};
          transition: background 0.3s ease;
        }

        .fmis-map-shell::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 500;
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.05) 1px, transparent 1px);
          background-size: 70px 70px;
          mix-blend-mode: ${theme === "dark" ? "screen" : "multiply"};
        }

        .leaflet-container {
          background: ${theme === "dark" ? "#06151a" : "#f1f5f9"} !important;
          font-family: Hanuman, sans-serif;
        }

        .leaflet-control-zoom {
          border: 1px solid rgba(13, 148, 136, 0.25) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important;
        }

        .leaflet-control-zoom a {
          background: ${cfg.zoomBg} !important;
          color: ${cfg.zoomColor} !important;
        }

        .leaflet-control-zoom a:hover {
          background: ${cfg.zoomHoverBg} !important;
        }

        .leaflet-tile {
          filter: saturate(1.05) contrast(1);
        }

        .leaflet-tooltip-clean {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        .leaflet-tooltip-clean::before {
          display: none !important;
        }

        .fmis-neon-div-icon {
          background: transparent !important;
          border: none !important;
        }

        .fmis-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 0.5rem;
          border: 1px solid rgba(13, 148, 136, 0.3);
          background: transparent;
          color: #0d9488;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .fmis-theme-toggle:hover {
          background: rgba(13, 148, 136, 0.1);
        }

        @keyframes fmisPulseRing {
          0% {
            opacity: var(--ring-opacity-low);
            transform: scale(var(--ring-start));
          }
          45% {
            opacity: var(--ring-opacity-high);
            transform: scale(var(--ring-mid));
          }
          100% {
            opacity: 0;
            transform: scale(var(--ring-end));
          }
        }

        @keyframes fmisBlinkDot {
          0%, 100% {
            opacity: 0.85;
            box-shadow:
              0 0 4px #ffffff,
              0 0 8px var(--point-color),
              0 0 16px rgba(13,148,136,0.5);
          }
          50% {
            opacity: 1;
            box-shadow:
              0 0 6px #ffffff,
              0 0 14px var(--point-color),
              0 0 28px rgba(13,148,136,0.6);
          }
        }

        @keyframes fmisLabelGlow {
          0%, 100% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
        }

        .fmis-neon-point {
          position: relative;
          width: var(--point-size);
          height: var(--point-size);
          border-radius: 999px;
        }

        .fmis-ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 2px solid var(--point-color);
          opacity: var(--ring-opacity-low);
          box-shadow: 0 0 12px rgba(13,148,136,0.35);
          animation: fmisPulseRing 2.6s ease-in-out infinite;
          animation-delay: calc(var(--blink-delay, 0s) + var(--ring-delay, 0s));
          transform: scale(var(--ring-start));
          will-change: transform, opacity;
        }

        .fmis-ring-one {
          --ring-start: 0.62;
          --ring-mid: 0.88;
          --ring-end: 1.08;
          --ring-opacity-low: 0.18;
          --ring-opacity-high: 0.45;
          --ring-delay: 0s;
        }

        .fmis-ring-two {
          --ring-start: 0.86;
          --ring-mid: 1.18;
          --ring-end: 1.42;
          --ring-opacity-low: 0.12;
          --ring-opacity-high: 0.28;
          --ring-delay: 0.38s;
        }

        .fmis-ring-three {
          --ring-start: 1.1;
          --ring-mid: 1.48;
          --ring-end: 1.74;
          --ring-opacity-low: 0.06;
          --ring-opacity-high: 0.16;
          --ring-delay: 0.76s;
        }

        .fmis-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--dot-size);
          height: var(--dot-size);
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: var(--dot-bg);
          border: 2px solid var(--point-color);
          box-shadow:
            0 0 4px #ffffff,
            0 0 10px var(--point-color);
          animation: fmisBlinkDot 1.7s ease-in-out infinite;
          animation-delay: var(--blink-delay, 0s);
          will-change: opacity, box-shadow;
        }

        .fmis-dot::after {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: 999px;
          background: var(--point-color);
          opacity: 0.9;
        }

        .fmis-map-label {
          position: absolute;
          left: 50%;
          top: -8px;
          transform: translate(-50%, -100%);
          white-space: nowrap;
          color: var(--label-color);
          font-family: Hanuman, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: -0.2px;
          text-shadow: var(--label-shadow);
          pointer-events: none;
          animation: fmisLabelGlow 2.2s ease-in-out infinite;
          animation-delay: var(--blink-delay, 0s);
        }

        @media (prefers-reduced-motion: reduce) {
          .fmis-ring,
          .fmis-dot,
          .fmis-map-label {
            animation: none !important;
          }
        }

        .fmis-tooltip-card {
          width: 250px;
          padding: 14px;
          border-radius: 14px;
          font-family: Hanuman, sans-serif;
          backdrop-filter: blur(10px);
        }

        .fmis-tooltip-card[data-theme="light"] {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(13, 148, 136, 0.25);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 0 20px rgba(13,148,136,0.08);
        }

        .fmis-tooltip-card[data-theme="dark"] {
          background: rgba(7, 25, 31, 0.96);
          border: 1px solid rgba(20, 184, 166, 0.28);
          box-shadow: 0 12px 40px rgba(0,0,0,0.45), 0 0 28px rgba(20,184,166,0.12);
        }

        .fmis-tooltip-title {
          font-size: 13px;
          font-weight: 700;
          margin: 0 0 10px;
          padding-bottom: 8px;
        }

        .fmis-tooltip-card[data-theme="light"] .fmis-tooltip-title {
          color: #0f172a;
          border-bottom: 1px solid rgba(15,23,42,0.1);
        }

        .fmis-tooltip-card[data-theme="dark"] .fmis-tooltip-title {
          color: #ffffff;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .fmis-tooltip-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          margin-top: 8px;
        }

        .fmis-tooltip-card[data-theme="light"] .fmis-tooltip-row {
          color: #334155;
        }

        .fmis-tooltip-card[data-theme="dark"] .fmis-tooltip-row {
          color: #cbd5e1;
        }

        .fmis-tooltip-card[data-theme="light"] .fmis-tooltip-row strong {
          color: #0f172a;
          font-weight: 700;
        }

        .fmis-tooltip-card[data-theme="dark"] .fmis-tooltip-row strong {
          color: #ffffff;
          font-weight: 700;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "Hanuman" }}
          >
            Cambodia FMIS Coverage Map - ផែនទីគ្របដណ្តប់ FMIS
          </h2>
          <p
            className="text-xs text-muted-foreground mt-1"
            style={{ fontFamily: "Hanuman" }}
          >
            បង្ហាញតាមរាជធានី-ខេត្តដោយផ្អែកលើចំនួនអ្នកប្រើប្រាស់ និងការដ្ឋាន
          </p>
        </div>

        <button
          type="button"
          className="fmis-theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label="Toggle map theme"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <span>Low</span>
        <div
          className="w-24 h-1.5 rounded-full"
          style={{
            background: `linear-gradient(to right, ${cfg.gradientFrom}, ${cfg.gradientTo})`,
            boxShadow: `0 0 12px rgba(13,148,136,0.25)`,
          }}
        />
        <span>High</span>
        <span className="text-foreground font-medium ml-1">
          Users: អ្នកប្រើប្រាស់សរុប
        </span>
      </div>

      {/* Map */}
      <div className="fmis-map-shell">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
