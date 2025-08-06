from flask import Flask, render_template, request, jsonify
import pandas as pd
import folium
from geopy.geocoders import Nominatim
import time
import os
import openrouteservice
from openrouteservice import convert

app = Flask(__name__)

# ------------------------------
# Carrega datasets
# ------------------------------
df = pd.read_csv('dataset - Página1.csv')
df_postos = pd.read_csv('dataset - locali.csv')

# ------------------------------
# Inicializa o geolocalizador
# ------------------------------
geolocator = Nominatim(user_agent="meu_app_fortaleza")

# ------------------------------
# Inicializa o cliente OpenRouteService
# ------------------------------
ors_client = openrouteservice.Client(key='5b3ce3597851110001cf6248201be611b1b6437281f2e6c2ac4a7145')

# ------------------------------
# Função auxiliar: geocodifica endereço
# ------------------------------
def get_lat_lon(endereco):
    try:
        location = geolocator.geocode(endereco)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"Erro ao geocodificar: {endereco} -> {e}")
    return None, None

# ------------------------------
# Adiciona lat/lon se necessário
# ------------------------------
if 'latitude' not in df_postos.columns or 'longitude' not in df_postos.columns:
    df_postos['latitude'] = None
    df_postos['longitude'] = None

    for i, row in df_postos.iterrows():
        lat, lon = get_lat_lon(row['endereco'])
        df_postos.at[i, 'latitude'] = lat
        df_postos.at[i, 'longitude'] = lon
        time.sleep(1)  # evita bloqueio por muitas requisições

    df_postos.to_csv('dataset - locali.csv', index=False)  # salva coordenadas para reutilização futura

# ------------------------------
# Cria dicionário: especialidade -> lista de postos
# ------------------------------
postos_por_especialidade = {}
for _, row in df_postos.iterrows():
    especialidades = str(row.get('especialidades', '')).split(',')
    for esp in especialidades:
        esp = esp.strip().lower()
        if esp:
            if esp not in postos_por_especialidade:
                postos_por_especialidade[esp] = []
            postos_por_especialidade[esp].append({
                'nome': row.get('nome', 'Desconhecido'),
                'endereco': row.get('endereco', ''),
                'latitude': row.get('latitude'),
                'longitude': row.get('longitude')
            })

# ------------------------------
# Função: cálculo de compatibilidade
# ------------------------------
def calcular_compatibilidade(sintomas_usuario):
    sintomas_usuario = [s.strip().upper() for s in sintomas_usuario if s.strip()]
    resultados = []

    for _, row in df.iterrows():
        sintomas_doenca = [s.strip().upper() for s in str(row['SINTOMAS']).split(',')]
        sintomas_comuns = set(sintomas_usuario).intersection(set(sintomas_doenca))

        if sintomas_comuns:
            percentual = (len(sintomas_comuns) / len(sintomas_doenca)) * 100
            resultados.append({
                'doenca': row['DOENCA'],
                'descricao': row['DESCRICAO'],
                'tratamento': row['TRATAMENTO'],
                'percentual': round(percentual, 1)
            })

    resultados = sorted(resultados, key=lambda x: x['percentual'], reverse=True)
    return resultados

# ------------------------------
# Rota principal com mapa
# ------------------------------
@app.route('/')
def index():
    latitude_centro = -3.7319
    longitude_centro = -38.5267
    mapa = folium.Map(location=[latitude_centro, longitude_centro], zoom_start=12)

    for esp, postos in postos_por_especialidade.items():
        for posto in postos:
            lat = posto['latitude']
            lon = posto['longitude']
            if pd.notnull(lat) and pd.notnull(lon):
                popup_text = f"<b>{posto['nome']}</b><br>{posto['endereco']}<br><i>Especialidade:</i> {esp.capitalize()}"
                folium.Marker(
                    [lat, lon],
                    popup=folium.Popup(popup_text, max_width=300),
                    tooltip=posto['nome'],
                    icon=folium.Icon(color='red', icon='plus-sign')
                ).add_to(mapa)

    mapa_html = mapa.get_root().render()
    return render_template('index.html', mapa_html=mapa_html, postos=postos_por_especialidade)

# ------------------------------
# Rota para buscar doenças por sintomas
# ------------------------------
@app.route('/buscar', methods=['POST'])
def buscar():
    data = request.json
    sintomas = data.get('sintomas', [])
    resultados = calcular_compatibilidade(sintomas)
    return jsonify(resultados)

# ------------------------------
# Rota para traçar rota entre endereços
# ------------------------------
@app.route('/rota', methods=['POST'])
def rota():
    data = request.json
    endereco_origem = data.get('origem')
    endereco_destino = data.get('destino')

    lat1, lon1 = get_lat_lon(endereco_origem)
    lat2, lon2 = get_lat_lon(endereco_destino)

    if None in [lat1, lon1, lat2, lon2]:
        return jsonify({'erro': 'Não foi possível geocodificar um ou ambos os endereços.'}), 400

    coords = [[lon1, lat1], [lon2, lat2]]
    
    try:
        rota = ors_client.directions(
            coordinates=coords,
            profile='driving-car',  
            format='geojson'
        )
        
        rota_coords = rota['features'][0]['geometry']['coordinates']
        rota_coords = [(coord[1], coord[0]) for coord in rota_coords]  # Invertendo lat/lon
        
        return jsonify({'rota': rota_coords})
    except Exception as e:
        print(f"Erro ao traçar rota: {e}")
        return jsonify({'erro': 'Erro ao traçar a rota.'}), 500

# ------------------------------
# Execução da aplicação
# ------------------------------
if __name__ == '__main__':
    app.run(debug=True)

