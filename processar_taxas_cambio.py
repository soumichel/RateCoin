import pandas as pd
from bs4 import BeautifulSoup
import requests
import json

# Ler o conteúdo da página salva pelo script Bash
with open('ipeadata_taxas_cambio.html', 'r', encoding='utf-8') as file:
    page_content = file.read()

# Usar BeautifulSoup para processar o HTML
soup = BeautifulSoup(page_content, 'html.parser')

# Encontrar a tabela com os dados de taxas de câmbio
table = soup.find('table', {'id': 'grd_DXMainTable'})

if table:
    # Extrair todas as linhas de dados na tabela
    rows = table.find_all('tr', id=lambda x: x and x.startswith('grd_DXDataRow'))

    # Processar cada linha para extrair as colunas
    data = []
    for row in rows:
        cols = row.find_all('td')

        # Verificar se a linha contém dados
        if len(cols) >= 2:
            date_str = cols[0].text.strip()
            exchange_rate_str = cols[1].text.strip().replace(',', '.')

            # Verificar se ambos os campos contêm dados
            if date_str and exchange_rate_str:
                try:
                    # Converter a data para datetime
                    date = pd.to_datetime(date_str, format='%d/%m/%Y')

                    # Filtrar para incluir apenas datas a partir de 2020
                    if date.year >= 2020:
                        # Adicionar os dados à lista com o nome da coluna especificado
                        data.append({
                            'Data': date.isoformat(),  # Convertendo para formato ISO 8601
                            'Taxa de câmbio - R$ / US$': float(exchange_rate_str)
                        })
                except ValueError:
                    # Ignorar linhas com formato de data ou taxa de câmbio inválido
                    continue

    if data:
        # Enviar o dataset para o servidor Node.js
        server_url = 'http://node_server:3000/dados'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(server_url, headers=headers, data=json.dumps(data))

        if response.status_code == 200:
            print("Dataset enviado com sucesso para o servidor.")
        else:
            print(f"Falha ao enviar o dataset. Status code: {response.status_code}")
    else:
        print("Nenhum dado válido encontrado para enviar.")

else:
    print("Tabela não encontrada.")
