'use client';

import { useState, useEffect } from 'react';

// Categorías predefinidas de popularidad
const POPULARITY_CATEGORIES = [
  {
    id: 'mainstream',
    name: 'Mainstream',
    description: 'Hits actuales y muy conocidos',
    range: { min: 80, max: 100 },
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'popular',
    name: 'Popular',
    description: 'Conocidas pero no top',
    range: { min: 50, max: 80 },
    color: 'from-yellow-500 to-green-500'
  },
  {
    id: 'underground',
    name: 'Underground',
    description: 'Joyas ocultas y descubiertas',
    range: { min: 0, max: 50 },
    color: 'from-purple-500 to-blue-500'
  }
];

export default function PopularityWidget({ onSelect, selectedItems = {} }) {
  // Inicializar con valores por defecto o los recibidos
  const [mode, setMode] = useState(selectedItems.mode || 'slider'); // 'slider' o 'category'
  const [sliderValue, setSliderValue] = useState(selectedItems.min ?? 0);
  const [selectedCategory, setSelectedCategory] = useState(selectedItems.category || null);

  // Emitir cambios al padre
  useEffect(() => {
    if (mode === 'slider') {
      onSelect({
        mode: 'slider',
        min: sliderValue,
        max: 100
      });
    } else if (selectedCategory) {
      const category = POPULARITY_CATEGORIES.find(c => c.id === selectedCategory);
      onSelect({
        mode: 'category',
        category: selectedCategory,
        ...category.range
      });
    }
  }, [mode, sliderValue, selectedCategory, onSelect]);

  // Cambiar a modo slider
  const switchToSlider = () => {
    setMode('slider');
    setSelectedCategory(null);
  };

  // Seleccionar categoría
  const handleCategorySelect = (categoryId) => {
    setMode('category');
    setSelectedCategory(categoryId);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl">
          Popularidad
        </h3>
        <button
          onClick={() => {
            setMode('slider');
            setSliderValue(0);
            setSelectedCategory(null);
          }}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Elige entre hits mainstream o descubrimientos underground
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={switchToSlider}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'slider'
              ? 'bg-[#1DB954] text-white'
              : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E]'
          }`}
        >
          Slider Personalizado
        </button>
        <button
          onClick={() => setMode('category')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'category'
              ? 'bg-[#1DB954] text-white'
              : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E]'
          }`}
        >
          Categorías
        </button>
      </div>


      {mode === 'slider' && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-white text-sm font-medium">Popularidad mínima</p>
              <span className="text-white font-bold text-lg bg-[#282828] px-3 py-1 rounded-full">
                {sliderValue}
              </span>
            </div>


            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-2 bg-[#282828] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, 
                  #1DB954 0%, 
                  #1DB954 ${sliderValue}%, 
                  #282828 ${sliderValue}%, 
                  #282828 100%)`
              }}
            />


            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 (Underground)</span>
              <span>100 (Mainstream)</span>
            </div>
          </div>

          {/* Informacion */}
          <div className="p-3 bg-[#282828] rounded-lg">
            <p className="text-gray-400 text-sm">
              Se buscarán canciones con popularidad de <span className="text-white font-medium">{sliderValue}</span> a <span className="text-white font-medium">100</span>
            </p>
          </div>
        </div>
      )}

      {/* categoria*/}
      {mode === 'category' && (
        <div className="space-y-3">
          {POPULARITY_CATEGORIES.map(category => {
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r ' + category.color + ' text-white scale-105'
                    : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{category.name}</h4>
                    <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {category.description}
                    </p>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-white/60' : 'text-gray-600'}`}>
                      Rango: {category.range.min} - {category.range.max}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* seleccion*/}
      <div className="mt-6 p-4 bg-[#282828] rounded-lg">
        <p className="text-gray-400 text-sm mb-1">Configuración actual:</p>
        {mode === 'slider' ? (
          <p className="text-white text-sm">
            Popularidad: <span className="font-medium">{sliderValue} - 100</span>
          </p>
        ) : selectedCategory ? (
          <p className="text-white text-sm">
            Categoría: <span className="font-medium">
              {POPULARITY_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </span>
          </p>
        ) : (
          <p className="text-gray-500 text-sm">Selecciona una categoría</p>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1DB954;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1DB954;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .slider:hover::-webkit-slider-thumb {
          transform: scale(1.2);
        }

        .slider:hover::-moz-range-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}