from fastapi import FastAPI, Request# type: ignore
from fastapi.responses import StreamingResponse # type: ignore
from pydantic import BaseModel# type: ignore

# import os
# os.add_dll_directory("C:/Program Files/NVIDIA GPU Computing Toolkit/CUDA/v11.8/bin")

import warnings
warnings.filterwarnings("ignore", message="Failed to build CUDA kernels for upfirdn2d.*", category=UserWarning)
import torch# type: ignore
import numpy as np# type: ignore
import dnnlib
import legacy
import io
from torchvision.utils import save_image# type: ignore
from fastapi.middleware.cors import CORSMiddleware# type: ignore
from torchvision.transforms.functional import to_pil_image

# Cargar el modelo
 #if torch.cuda.is_available() else 'cpu'
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')  # Usa 'cuda' si tienes soporte
with dnnlib.util.open_url("network-snapshot-000200.pkl") as f:
    G = legacy.load_network_pkl(f)["G_ema"].to(device) # type: ignore

app = FastAPI()

# Permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Cors configurado correctamente")

class InputData(BaseModel):
    arreglo_binario: list[int]  # La lista de enteros que recibirás del frontend

def ordenarCaracteristicas(data: InputData):
    arregloInicial = data.arreglo_binario
    # # arregloPosiciones = [4, 8, 9, 11, 17, 5, 28, 30, 32, 33,
    #                      12, 6, 7, 22, 1, 3, 0,  23, 24, 27,  
    #                      19, 26, 25, 31, 13, 14, 15, 36, 39, 20]

    # arregloFinal = [0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
    #                 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    #                 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    #                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    # for i in range(len(arregloPosiciones)):
    #     pos = arregloPosiciones[i]
    #     if arregloInicial[i] == 1:
    #         arregloFinal[pos] = 1
    return arregloInicial

@app.post("/generar-imagen/")
def generar_imagen(data: InputData):
    # Procesar entrada y generar vector condicional
    arregloBinario = ordenarCaracteristicas(data)
    class_vector = torch.tensor(arregloBinario, dtype=torch.float32, device=device).unsqueeze(0)

    # Generar latente z y generar imagen
    seed = np.random.randint(0, 99999)
    z = torch.from_numpy(np.random.RandomState(seed).randn(1, G.z_dim)).to(device)
    img = G(z, class_vector, truncation_psi=0.8, noise_mode='const')
    img = (img + 1) * 0.5  # De [-1,1] a [0,1]

    # Convertir a imagen PIL y guardar en buffer como JPG
    img_pil = to_pil_image(img.squeeze(0).cpu())
    img_pil = img_pil.convert("RGB")  # Asegurar modo RGB (sin canal alfa)

    buffer = io.BytesIO()
    img_pil.save(buffer, format="JPEG")
    buffer.seek(0)

    # Forzar nombre del archivo al descargar
    headers = {
        "Content-Disposition": 'attachment; filename="retrato.jpg"'
    }

    return StreamingResponse(buffer, media_type="image/jpeg", headers=headers)


