// src/components/DropDown.tsx
import React from "react";
import { ArrowRight } from "lucide-react";

export interface DropdownItem {
  label: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
  active?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  className = "",
}) => {
  return (
    <div
      className={[
        "w-full rounded-2xl bg-white shadow-xl border border-gray-200/70",
        "px-4 py-4",
        className,
      ].join(" ")}
      role="menu"
      aria-orientation="vertical"
    >
      <div className="flex flex-col divide-y divide-gray-100">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            role="menuitem"
            className={[
              "group flex items-start gap-4 px-5 py-5 text-left rounded-xl",
              "hover:bg-gray-50 transition-colors",
              item.active ? "bg-gray-100" : "",
            ].join(" ")}
          >
            <div className="shrink-0">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 shadow-sm">
                {item.icon}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-gray-900 truncate">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.desc && (
                <p className="mt-1 text-sm leading-snug text-gray-500">
                  {item.desc}
                </p>
              )}
            </div>

            <ArrowRight className="mt-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
