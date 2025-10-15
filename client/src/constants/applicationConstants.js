import { CheckCircle, AlertCircle, Briefcase, Clock } from "lucide-react";

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  card: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  },
};

// Status filter options
export const STATUS_FILTERS = ["all", "accepted", "pending"];

// Status configuration for UI styling
export const getStatusConfig = (status) => {
  switch (status) {
    case "Accepted":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        icon: CheckCircle,
        glow: "shadow-emerald-500/20",
      };

    default:
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/20",
        icon: AlertCircle,
        glow: "shadow-amber-500/20",
      };
  }
};

// Stats configuration for the dashboard
export const STATS_CONFIG = [
  {
    label: "Total Applications",
    valueKey: "total",
    icon: Briefcase,
    color: "from-slate-600 to-slate-700",
  },
  {
    label: "Accepted",
    valueKey: "accepted",
    icon: CheckCircle,
    color: "from-emerald-600 to-emerald-700",
  },
  {
    label: "Pending",
    valueKey: "pending",
    icon: Clock,
    color: "from-amber-600 to-amber-700",
  },
];