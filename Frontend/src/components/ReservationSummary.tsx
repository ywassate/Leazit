import React from 'react';
import type { CarType } from '../types/cars';

type FormLite = {
  prenom: string;
  nom: string;
  type: string;
  engagementIndex?: number;
  mileageIndex?: number;
  insuranceIndex?: number;
  driversCount?: number;
  assuranceRisque?: boolean;
};

interface ReservationSummaryProps {
  car?: CarType;
  form: FormLite;
  /** optionnel : si tu veux forcer un prix calculé ailleurs (backend/util) */
  price?: number;
}

const formatEUR = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);

const clamp = (i: number, min: number, max: number) => Math.min(Math.max(i, min), max);

function safePick<T>(arr: T[] | undefined, index?: number, fallbackIndex = 0): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  const i = index === undefined ? fallbackIndex : clamp(index, 0, arr.length - 1);
  return arr[i];
}

function computePrice(car: CarType, form: FormLite) {
  const engagements = car.subscriptionOptions?.engagement ?? [];
  const mileages = car.subscriptionOptions?.mileage ?? [];
  const insurances = car.subscriptionOptions?.insurance ?? [];
  const addDriverPrice = car.subscriptionOptions?.additionalDriverPrice ?? 0;

  const engagement =
    form.engagementIndex !== undefined
      ? safePick(engagements, form.engagementIndex)
      : engagements.length
      ? // si pas d’index, on prend l’option la moins chère
        engagements.reduce((min, cur) => (cur.monthlyPrice < (min?.monthlyPrice ?? Infinity) ? cur : min), engagements[0])
      : undefined;

  const mileage = safePick(mileages, form.mileageIndex);
  const insurance = safePick(insurances, form.insuranceIndex);

  const basePrice = engagement?.monthlyPrice ?? 0;
  const kmSupp = mileage?.additionalPrice ?? 0;
  const assuranceActive = !!form.assuranceRisque;
  const assuranceSupp = assuranceActive ? insurance?.additionalPrice ?? 0 : 0;
  const franchise = insurance?.franchiseAmount ?? 0;

  const drivers = Math.max(1, form.driversCount ?? 1);
  const additionalDrivers = Math.max(0, drivers - 1);
  const driversSupp = additionalDrivers * addDriverPrice;

  const totalPrice = Math.max(0, basePrice + kmSupp + assuranceSupp + driversSupp);

  return {
    engagement,
    mileage,
    insurance,
    basePrice,
    kmSupp,
    assuranceSupp,
    franchise,
    drivers,
    driversSupp,
    totalPrice,
  };
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ car, form, price }) => {
  if (!car) {
    return (
      <div className="bg-white border rounded-lg shadow p-6">
        <p>Aucune voiture sélectionnée.</p>
      </div>
    );
  }

  const {
    engagement,
    mileage,
    insurance,
    basePrice,
    kmSupp,
    assuranceSupp,
    franchise,
    drivers,
    driversSupp,
    totalPrice,
  } = computePrice(car, form);

  const finalPrice = price ?? totalPrice; // si un prix est fourni en prop, on l’affiche

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <img
            src={car.image}
            alt={car.name}
            className="h-24 w-36 object-contain rounded-lg bg-white p-1"
          />
          <div className="text-right ml-4 flex-1">
            <h1 className="text-2xl font-bold mb-1">{car.name}</h1>
            <div className="text-sm opacity-90 mb-3">{car.category}</div>
            <div className="text-3xl font-bold">{formatEUR(finalPrice)}</div>
            <div className="text-sm opacity-80">Prix mensuel (TTC)</div>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Votre abonnement</h2>

        <div className="grid grid-cols-2 gap-2 mb-4 w-full">
          {/* Engagement */}
          <div className="border border-gray-200 rounded-md p-2 text-center w-full bg-white">
            <div className="text-xs text-gray-600">Engagement</div>
            <div className="text-lg font-bold text-gray-800">
              {engagement?.months ?? '--'} <span className="text-xs">mois</span>
            </div>
          </div>
          {/* Kilométrage */}
          <div className="border border-gray-200 rounded-md p-2 text-center w-full bg-white">
            <div className="text-xs text-gray-600">Kilométrage</div>
            <div className="text-lg font-bold text-gray-800">
              {mileage?.km ?? '--'} <span className="text-xs">km/mois</span>
            </div>
            {kmSupp > 0 && (
              <div className="text-[10px] text-gray-500 mt-1">+{formatEUR(kmSupp)}</div>
            )}
          </div>
          {/* Franchise */}
          <div className="border border-gray-200 rounded-md p-2 text-center w-full bg-white">
            <div className="text-xs text-gray-600">Franchise</div>
            <div className="text-lg font-bold text-gray-800">
              {formatEUR(franchise)}
            </div>
            {assuranceSupp > 0 && (
              <div className="text-[10px] text-gray-500 mt-1">
                Supplément +{formatEUR(assuranceSupp)}/mois
              </div>
            )}
          </div>
          {/* Assurance */}
          <div className="border border-gray-200 rounded-md p-2 text-center w-full bg-white">
            <div className="text-xs text-gray-600">Assurance</div>
            <div className="text-lg font-bold text-gray-800">
              {insurance?.label || 'Standard'}
            </div>
            {assuranceSupp > 0 && (
              <div className="text-[10px] text-gray-500 mt-1">+{formatEUR(assuranceSupp)}/mois</div>
            )}
          </div>

          {/* Conducteurs additionnels */}
          <div className="border border-gray-200 rounded-md p-2 text-center w-full bg-white">
            <div className="text-xs text-gray-600">Conducteurs<br/>additionnels</div>
            <div className="text-lg font-bold text-gray-800">{drivers - 1}</div>
            {driversSupp > 0 && (
              <div className="text-[10px] text-gray-500 mt-1">+{formatEUR(driversSupp)}/mois</div>
            )}
          </div>
        </div>

        {/* Résumé */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Résumé de votre abonnement</h3>

          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-gray-800 font-medium">Prix de base</span>
              {engagement && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {engagement.label || `Engagement ${engagement.months} mois`}
                </span>
              )}
            </div>
            <span className="text-lg font-bold text-gray-800">{formatEUR(basePrice)}</span>
          </div>

          {kmSupp > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Supplément kilométrage</span>
              <span className="text-gray-700">+{formatEUR(kmSupp)}</span>
            </div>
          )}

          {assuranceSupp > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Supplément assurance</span>
              <span className="text-gray-700">+{formatEUR(assuranceSupp)}</span>
            </div>
          )}

          {driversSupp > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Conducteurs additionnels</span>
              <span className="text-gray-700">+{formatEUR(driversSupp)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xl font-bold text-blue-600">Prix mensuel</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600 ">{formatEUR(finalPrice)}</div>
                <div className="text-sm text-gray-500">TTC</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReservationSummary;
