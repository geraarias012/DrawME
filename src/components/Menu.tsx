import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/Menu.css";

interface MenuProps {
  onGenerateImage: (selectedArray: number[]) => void;
}

//Definir incompatibilidad
const incompatibilities: { [feature: string]: string[] } = {
  "Cabello negro": [
    "Cabello rubio",
    "Cabello castaño",
    "Cabello canoso",
    "Calvo",
  ],
  "Cabello rubio": [
    "Cabello negro",
    "Cabello castaño",
    "Cabello canoso",
    "Calvo",
  ],
  "Cabello castaño": [
    "Cabello negro",
    "Cabello rubio",
    "Cabello canoso",
    "Calvo",
  ],
  "Cabello canoso": [
    "Cabello negro",
    "Cabello rubio",
    "Cabello castaño",
    "Calvo",
  ],
  Calvo: [
    "Cabello negro",
    "Cabello rubio",
    "Cabello castaño",
    "Cabello canoso",
    "Flequillo",
    "Patillas",
    "Cabello ondulado",
    "Cabello lacio",
  ],
  Flequillo: ["Calvo"],
  "Cabello lacio": ["Cabello ondulado"],
  "Cabello ondulado": ["Cabello lacio"],
};

function Menu({ onGenerateImage }: MenuProps) {
  const [selected, setSelected] = useState<{
    [category: string]: { [feature: string]: boolean };
  }>({
    Cabello: {
      Calvo: false,
      "Cabello negro": false,
      "Cabello rubio": false,
      "Cabello castaño": false,
      "Cabello canoso": false,
      Flequillo: false,
      Entradas: false,
      Patillas: false,
      "Cabello lacio": false,
      "Cabello ondulado": false,
    },
    "Rasgos faciales": {
      "Cejas pobladas": false,
      "Labios grandes": false,
      "Nariz grande": false,
      Bigote: false,
      "Cejas arqueadas": false,
      Ojeras: false,
      "Barba incipiente": false,
      "Ojos rasgados": false,
      "Sin barba": false,
      "Nariz puntiaguda": false,
    },
    "Piel y Expresión": {
      "Pómulos altos": false,
      "Piel pálida": false,
      "Rostro ovalado": false,
      Sonriendo: false,
    },
    Otros: {
      Gordo: false,
      Papada: false,
      Lentes: false,
      "Usando lápiz labial": false,
      Joven: false,
      Masculino: false,
      negro: false,
    },
  });

  // Manejo del cambio en los switches
  const handleToggle = (category: string, feature: string) => {
    setSelected((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));

      // Alternar el estado de la característica seleccionada
      const isSelected = !prevState[category][feature];
      newState[category][feature] = isSelected;

      // Si se selecciona una característica, deshabilitar las incompatibles
      if (isSelected && incompatibilities[feature]) {
        incompatibilities[feature].forEach((incompatibleFeature) => {
          Object.keys(newState).forEach((cat) => {
            if (newState[cat][incompatibleFeature] !== undefined) {
              newState[cat][incompatibleFeature] = false; // Deshabilitar
            }
          });
        });
      }

      return newState;
    });
  };

  // 🔹 Convertir el estado en un arreglo de 0 y 1
  const getSelectedArray = (): number[] => {
    const binaryArray: number[] = [];
    Object.keys(selected).forEach((category) => {
      Object.keys(selected[category]).forEach((feature) => {
        binaryArray.push(selected[category][feature] ? 1 : 0);
      });
    });
    return binaryArray;
  };

  // 🔹 Generar Imagen
  // Retornar arreglo de caracteristicas
  const handleGenerateImage = () => {
    const selectedArray = getSelectedArray();
    console.log("Arreglo de características seleccionadas:", selectedArray);
    onGenerateImage(selectedArray);
  };

  return (
    <div className=" mt-4 text-center fondo-menu">
      <h3 className="h3-menu">CARACTERISTICAS</h3>
      <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
        {Object.keys(selected).map((category) => (
          <div key={category}>
            <button
              type="button"
              className="btn btn-light dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {category}
            </button>
            <ul className="dropdown-menu p-3 ul-dropdown-menu justify-content-center flex-wrap">
              {Object.keys(selected[category]).map((feature) => (
                <li
                  key={feature}
                  className="d-flex justify-content-between p-1"
                >
                  {feature}
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selected[category][feature]}
                      onChange={() => handleToggle(category, feature)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4">
        <button
          type="button"
          className=" btn-generar"
          onClick={handleGenerateImage}
        >
          Generar Imagen
        </button>
      </div>
    </div>
  );
}

export default Menu;
