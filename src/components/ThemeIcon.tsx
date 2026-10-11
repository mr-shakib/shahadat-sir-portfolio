import type { IconType } from "react-icons";
import {
  LuBookOpen,
  LuBrain,
  LuChartScatter,
  LuCpu,
  LuFlaskConical,
  LuGlobe,
  LuLightbulb,
  LuNetwork,
  LuShieldCheck,
  LuUsers,
} from "react-icons/lu";
import type { ThemeIconKey } from "@/content/types";

export const themeIcons: Record<ThemeIconKey, IconType> = {
  users: LuUsers,
  chart: LuChartScatter,
  brain: LuBrain,
  shield: LuShieldCheck,
  book: LuBookOpen,
  globe: LuGlobe,
  cpu: LuCpu,
  network: LuNetwork,
  flask: LuFlaskConical,
  lightbulb: LuLightbulb,
};

export function ThemeIcon({ icon, className = "size-5" }: { icon: ThemeIconKey; className?: string }) {
  const Icon = themeIcons[icon] ?? LuLightbulb;
  return <Icon className={className} aria-hidden />;
}
