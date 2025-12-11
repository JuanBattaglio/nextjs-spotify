'use client';

import { useState } from 'react';

// Décadas disponibles con sus rangos de años
const DECADES = [
  { label: '1950s', value: '1950s', range: { min: 1950, max: 1959 }, franja: '50-59' },
  { label: '1960s', value: '1960s', range: { min: 1960, max: 1969 }, franja: '60-69' },
  { label: '1970s', value: '1970s', range: { min: 1970, max: 1979 }, franja: '70-79' },
  { label: '1980s', value: '1980s', range: { min: 1980, max: 1989 }, franja: '80-89' },
  { label: '1990s', value: '1990s', range: { min: 1990, max: 1999 }, franja: '90-99' },
  { label: '2000s', value: '2000s', range: { min: 2000, max: 2009 }, franja: '00-09' },
  { label: '2010s', value: '2010s', range: { min: 2010, max: 2019 }, franja: '10-19' },
  { label: '2020s', value: '2020s', range: { min: 2020, max: 2029 }, franja: '20-29' }
];

export default function DecadeWidget({ onSelect, selectedItems = [] }) {
  // Manejar selección/deselección
  const handleToggleDecade = (decadeValue) => {
    let newSelection;
    
    if (selectedItems.includes(decadeValue)) {
      // Deseleccionar
      newSelection = selectedItems.filter(d => d !== decadeValue);
    } else {
      // Seleccionar
      newSelection = [...selectedItems, decadeValue];
    }
    
    onSelect(newSelection);
  };

  // Seleccionar todas
  const handleSelectAll = () => {
    if (selectedItems.length === DECADES.length) {
      // Si todas están seleccionadas, deseleccionar todas
      onSelect([]);
    } else {
      // Seleccionar todas
      onSelect(DECADES.map(d => d.value));
    }
  };

  const handleClear = () => {
    onSelect([]);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          📅 Décadas Musicales
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {selectedItems.length === DECADES.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
          {selectedItems.length > 0 && selectedItems.length < DECADES.length && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* seleccion*/}
      <p className="text-gray-400 text-sm mb-4">
        {selectedItems.length === 0 
          ? 'Selecciona las décadas que prefieres'
          : `${selectedItems.length} década${selectedItems.length !== 1 ? 's' : ''} seleccionada${selectedItems.length !== 1 ? 's' : ''}`
        }
      </p>

      {/* decadas*/}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DECADES.map(decade => {
          const isSelected = selectedItems.includes(decade.value);
          
          return (
            <button
              key={decade.value}
              onClick={() => handleToggleDecade(decade.value)}
              className={`relative p-4 rounded-lg transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#1DB954] to-[#1ed760] text-white shadow-lg shadow-[#1DB954]/30 scale-105'
                  : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E] hover:scale-102'
              }`}
            >

              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Emoji */}
              <div className="text-3xl mb-2">
                {decade.franja}
              </div>

              {/* Label */}
              <div className="font-bold text-lg">
                {decade.label}
              </div>

              {/* años*/}
              <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {decade.range.min} - {decade.range.max}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sinformacion*/}
      {selectedItems.length > 0 && (
        <div className="mt-4 p-3 bg-[#282828] rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Décadas seleccionadas:</p>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(decadeValue => {
              const decade = DECADES.find(d => d.value === decadeValue);
              return (
                <span
                  key={decadeValue}
                  className="bg-[#1DB954] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  {decade?.franja} {decade?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}