# Etapa de build
FROM python:3.11-alpine AS build

# Instalar dependências necessárias para o build
RUN apk add --no-cache \
    build-base \
    bash \
    curl

# Instalar bibliotecas Python necessárias
RUN pip install --no-cache-dir beautifulsoup4 requests pandas

# Copiar os scripts para o contêiner
COPY scrape.sh /app/
COPY processar_taxas_cambio.py /app/

# Etapa final de produção
FROM python:3.11-alpine

# Instalar apenas dependências mínimas para o runtime
RUN apk add --no-cache \
    bash \
    curl

# Instalar as bibliotecas Python necessárias no ambiente final
RUN pip install --no-cache-dir beautifulsoup4 requests pandas

# Copiar os arquivos da etapa de build
COPY --from=build /app /app

# Definir o diretório de trabalho
WORKDIR /app

# Executar o scrape e, em seguida, processar as taxas de câmbio
CMD bash -c "bash scrape.sh && python3 processar_taxas_cambio.py"
