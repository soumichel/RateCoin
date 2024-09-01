#!/bin/bash

# URL da página que será baixada
url="http://www.ipeadata.gov.br/ExibeSerie.aspx?stub=1&serid=38590&module=M"

# Nome do arquivo onde o conteúdo será salvo
output_file="ipeadata_taxas_cambio.html"

# Baixa o conteúdo da página e salva no arquivo
curl -o $output_file $url

echo "Download concluído: $output_file"
