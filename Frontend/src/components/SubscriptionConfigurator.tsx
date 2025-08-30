import React, { useState } from "react";
import type { CarType } from "../types/cars";

type SubscriptionConfiguratorProps = {
  form: {
    engagementIndex: number;
    mileageIndex: number;
    insuranceIndex: number;
    driversCount: number; // total drivers (min 1)
  };
  setForm: (form: Partial<SubscriptionConfiguratorProps["form"]>) => void;
  car: CarType;
};

const SELECT_BTN =
  "flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 flex flex-col items-center justify-center min-w-[120px] min-h-[54px] transition-all cursor-pointer text-gray-900 font-medium text-lg focus:outline-none";
const SELECT_BTN_SELECTED =
  "ring-2 ring-[#232a38] bg-[#232a38] text-white shadow-md font-bold scale-105 z-10";
const DROPDOWN_BTN =
  "rounded-xl border border-gray-300 bg-white px-4 py-3 flex items-center justify-between w-full cursor-pointer transition-all text-lg font-semibold text-gray-900 focus:outline-none";
const DROPDOWN_BTN_ACTIVE = "ring-2 ring-[#232a38] z-10 shadow-md";

const formatEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n || 0);

export default function SubscriptionConfigurator({
  form,
  setForm,
  car,
}: SubscriptionConfiguratorProps) {
  const [activeDropdown, setActiveDropdown] = useState<
    "engagement" | "mileage" | "insurance" | "drivers" | null
  >(null);

  const engagements = car.subscriptionOptions?.engagement || [];
  const mileages = car.subscriptionOptions?.mileage || [];
  const insurances = car.subscriptionOptions?.insurance || [];
  const additionalDriverPrice = car.subscriptionOptions?.additionalDriverPrice || 0;

  // Valeurs dérivées
  const totalDrivers = Math.max(1, form.driversCount ?? 1);
  const additionalDrivers = Math.max(0, totalDrivers - 1);

  // Sélection avec clamp d'index + fermeture du dropdown
  const handleSelect = (
    key: "engagementIndex" | "mileageIndex" | "insuranceIndex",
    idx: number
  ) => {
    const len =
      key === "engagementIndex"
        ? engagements.length
        : key === "mileageIndex"
        ? mileages.length
        : insurances.length;

    if (len === 0) return;
    const clamped = Math.min(Math.max(idx, 0), len - 1);
    setForm({ [key]: clamped });
    setActiveDropdown(null);
  };

  // Conducteurs (min 1)
  const handleDriverChange = (delta: number) => {
    const nextTotal = Math.max(1, (form.driversCount ?? 1) + delta);
    setForm({ driversCount: nextTotal });
  };

  const iconChevron = (
    <svg width="20" height="20" className="ml-2" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 8l4 4 4-4" />
    </svg>
  );

  function CardSelect({
    label,
    value,
    onClick,
    isActive,
  }: {
    label: string;
    value: React.ReactNode;
    onClick: () => void;
    isActive: boolean;
  }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-gray-600 font-medium text-sm mb-1">{label}</label>
        <button
          className={`${DROPDOWN_BTN} ${isActive ? DROPDOWN_BTN_ACTIVE : ""}`}
          onClick={onClick}
          type="button"
        >
          <span>{value}</span>
          {iconChevron}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-[#f4f5f7] shadow border border-gray-200 p-4 md:p-6 flex flex-col gap-6">
      {/* Ligne de cards select : Engagement, KM, Assurance, Conducteurs additionnels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CardSelect
          label="Engagement (mois)"
          value={engagements[form.engagementIndex]?.months ?? "—"}
          onClick={() =>
            setActiveDropdown(activeDropdown === "engagement" ? null : "engagement")
          }
          isActive={activeDropdown === "engagement"}
        />

        <CardSelect
          label="Kilométrage (km/mois)"
          value={mileages[form.mileageIndex]?.km ?? "—"}
          onClick={() => setActiveDropdown(activeDropdown === "mileage" ? null : "mileage")}
          isActive={activeDropdown === "mileage"}
        />

        <CardSelect
          label="Franchise de l'assurance"
          value={
            insurances[form.insuranceIndex]?.franchiseAmount != null
              ? `${insurances[form.insuranceIndex]?.franchiseAmount}€`
              : "—"
          }
          onClick={() =>
            setActiveDropdown(activeDropdown === "insurance" ? null : "insurance")
          }
          isActive={activeDropdown === "insurance"}
        />

        <CardSelect
          label="Conducteurs additionnels"
          value={additionalDrivers}
          onClick={() => setActiveDropdown(activeDropdown === "drivers" ? null : "drivers")}
          isActive={activeDropdown === "drivers"}
        />
      </div>

      {/* Dropdown Engagement */}
      {activeDropdown === "engagement" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mt-2 z-20">
          <div className="mb-3 font-semibold text-gray-700">Choisissez votre engagement</div>
          <div className="flex gap-4 flex-wrap">
            {engagements.map((opt, idx) => (
              <button
                key={idx}
                className={`${SELECT_BTN} ${
                  form.engagementIndex === idx ? SELECT_BTN_SELECTED : ""
                }`}
                onClick={() => handleSelect("engagementIndex", idx)}
                type="button"
              >
                <div>{opt.months === 0 ? "Sans engagement" : `${opt.months} mois`}</div>
                <div className="mt-2 text-base font-bold">{formatEUR(opt.monthlyPrice)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Kilométrage */}
      {activeDropdown === "mileage" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mt-2 z-20">
          <div className="mb-3 font-semibold text-gray-700">Choisissez votre kilométrage</div>
          <div className="flex gap-4 flex-wrap">
            {mileages.map((opt, idx) => (
              <button
                key={idx}
                className={`${SELECT_BTN} ${
                  form.mileageIndex === idx ? SELECT_BTN_SELECTED : ""
                }`}
                onClick={() => handleSelect("mileageIndex", idx)}
                type="button"
              >
                <div>{opt.km} km/mois</div>
                <div className="mt-2 text-base font-bold">
                  {opt.additionalPrice > 0 ? `+${formatEUR(opt.additionalPrice)}/mois` : "Compris"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Assurance */}
      {activeDropdown === "insurance" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mt-2 z-20">
          <div className="mb-3 font-semibold text-gray-700">Choisissez votre assurance</div>
          <div className="flex gap-4 flex-wrap">
            {insurances.map((opt, idx) => (
              <button
                key={idx}
                className={`${SELECT_BTN} w-44 min-w-[140px] ${
                  form.insuranceIndex === idx ? SELECT_BTN_SELECTED : ""
                }`}
                onClick={() => handleSelect("insuranceIndex", idx)}
                type="button"
              >
                <div className="font-semibold">{opt.type}</div>
                <div className="text-sm text-gray-400">Franchise de {formatEUR(opt.franchiseAmount)}</div>
                <div className="mt-2 text-base font-bold">
                  {opt.additionalPrice > 0 ? `+${formatEUR(opt.additionalPrice)}/mois` : "Compris"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Conducteurs additionnels */}
      {activeDropdown === "drivers" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mt-2 z-20 flex flex-col items-center">
          <div className="mb-3 font-semibold text-gray-700 text-center">
            Ajoutez des conducteurs additionnels
          </div>
          <div className="flex items-center justify-center gap-8 mb-2">
            <button
              onClick={() => handleDriverChange(-1)}
              disabled={additionalDrivers <= 0} // ne peut pas descendre sous 0 additionnels
              className={`rounded-full w-10 h-10 text-2xl font-bold flex items-center justify-center
                ${additionalDrivers <= 0 ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#f74e6c] text-white"}`}
              type="button"
              aria-label="Retirer un conducteur additionnel"
            >
              –
            </button>

            <span className="text-3xl font-bold">{additionalDrivers}</span>

            <button
              onClick={() => handleDriverChange(1)}
              className="rounded-full bg-[#f74e6c] text-white w-10 h-10 text-2xl font-bold flex items-center justify-center"
              type="button"
              aria-label="Ajouter un conducteur additionnel"
            >
              +
            </button>
          </div>
          <div className="text-center text-gray-700 text-base">
            {additionalDriverPrice > 0
              ? `+${formatEUR(additionalDriverPrice)}/mois par conducteur additionnel`
              : "Conducteurs additionnels inclus"}
          </div>
        </div>
      )}
    </div>
  );
}
