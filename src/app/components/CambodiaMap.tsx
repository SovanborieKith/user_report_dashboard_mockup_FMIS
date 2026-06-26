"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Globe2, Search } from "lucide-react";

type Metric = "users" | "sites" | "queries";

import { provinces } from "../data/provinces";

const METRIC_CONFIG: Record<Metric, { color: string; label: string; icon: React.ReactNode; gradientFrom: string; gradientTo: string }> = {
  users: { color: "#0ea5e9", label: "Users", icon: <Users className="w-3.5 h-3.5" />, gradientFrom: "rgb(16,42,82)", gradientTo: "rgb(8,165,233)" },
  sites: { color: "#10b981", label: "Sites", icon: <Globe2 className="w-3.5 h-3.5" />, gradientFrom: "rgb(6,46,30)", gradientTo: "rgb(16,185,129)" },
  queries: { color: "#8b5cf6", label: "Queries", icon: <Search className="w-3.5 h-3.5" />, gradientFrom: "rgb(30,15,60)", gradientTo: "rgb(139,92,246)" },
};

function fmt(n: number): string {
  // if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  // if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return n.toString();
}

export default function CambodiaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<{ map: any; L: any } | null>(null);
  const circlesRef = useRef<any[]>([]);
  const [metric, setMetric] = useState<Metric>("users");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inject Leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (!mapRef.current || leafletRef.current) return;

      // Fix bundler icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: true,
      }).setView([12.5, 104.9], 7.5);

      // Light CartoDB tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      leafletRef.current = { map, L };
      drawDots(L, map, "users");
    });

    return () => {
      leafletRef.current?.map.remove();
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletRef.current) return;
    const { L, map } = leafletRef.current;
    drawDots(L, map, metric);
  }, [metric]);

  function drawDots(L: any, map: any, m: Metric) {
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    const max = Math.max(...provinces.map((p) => p[m]));
    const color = METRIC_CONFIG[m].color;

    provinces.forEach((p) => {
      const radius = 5 + (p[m] / max) * 26;
      const circle = L.circleMarker([p.lat, p.lng], {
        radius,
        fillColor: color,
        fillOpacity: 0.75,
        color: "#080d1a",
        weight: 1.5,
      }).addTo(map);

      // Popup styled to match your existing tooltip design
      circle.bindPopup(
        `<div style="background:#111c33;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;width:200px;font-family:inherit">
          <p style="color:#fff;font-weight:600;font-size:13px;margin:0 0 10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.1);font-family:'Inter',sans-serif">${p.name}</p>
          <div style="display:flex;flex-direction:column;gap:8px;font-family:'Inter',sans-serif">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="color:#38bdf8;font-size:12px">Users</span>
              <span style="color:#fff;font-size:12px;font-weight:600">${fmt(p.users)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="color:#34d399;font-size:12px">Sites</span>
              <span style="color:#fff;font-size:12px;font-weight:600">${fmt(p.sites)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="color:#a78bfa;font-size:12px">Queries</span>
              <span style="color:#fff;font-size:12px;font-weight:600">${fmt(p.queries)}</span>
            </div>
          </div>
        </div>`,
        {
          closeButton: false,
          className: "leaflet-popup-clean",
          offset: [0, -4],
        }
      );

      circlesRef.current.push(circle);
    });
  }

  const cfg = METRIC_CONFIG[metric];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Hide default Leaflet popup chrome */}
      <style>{`
        .leaflet-popup-clean .leaflet-popup-content-wrapper,
        .leaflet-popup-clean .leaflet-popup-tip-container {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-clean .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-clean .leaflet-popup-tip { display: none !important; }
        .leaflet-container { background: #e8edf2; }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div></div>

        {/* Metric toggles */}
        <div className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-lg border border-border/40">
          {(Object.entries(METRIC_CONFIG) as [Metric, typeof METRIC_CONFIG[Metric]][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${metric === key
                ? "font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                }`}
              style={metric === key ? { background: `${val.color}18`, color: val.color } : undefined}
            >
              <span>{val.icon}</span>
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <span>Low</span>
        <div
          className="w-24 h-1.5 rounded-full"
          style={{ background: `linear-gradient(to right, ${cfg.gradientFrom}, ${cfg.gradientTo})` }}
        />
        <span>High</span>
        <span className="text-foreground font-medium ml-1">{cfg.label}</span>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border" style={{ height: 420 }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
