
# RateCoin

Este projeto é uma aplicação que extrai dados do site do Ipeadata sobre a Taxa de câmbio comercial para compra: real (R$) / dólar americano (US$). É possível visualizar essas informações em um gráfico além de permitir que os usuários se inscrevam para receber notificações por e-mail sobre variações diárias da taxa de câmbio.

## Estrutura do Projeto

- **Extração de Dados**: Utiliza Bash para realizar scraping dos dados de câmbio do site do Ipeadata.
- **Limpeza de Dados**: Usa um script em Python para limpar e filtrar os dados extraídos.
- **Servidor Node.js**: Recebe os dados limpos, exibe um gráfico e gerencia as inscrições dos usuários para notificações.
- **Docker**: Utilizado para criar e gerenciar dois containers (um para extração e limpeza de dados, e outro para o servidor Node.js).
- **Docker Compose**: Gerencia a comunicação entre os containers.

## Como Executar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/soumichel/RateCoin.git
   cd RateCoin
   ```

2. **Configurar .env**
   - Edite o arquivo `.env` e forneça suas próprias credenciais e informações necessárias para o funcionamento do sistema.

3. **Construir e iniciar os containers**
   ```bash
   docker-compose up --build
   ```

4. **Acessar a aplicação**
   - Acesse a visualização dos dados em gráficos em [http://localhost:3000/](http://localhost:3000/)
   - Inscreva-se para notificações em [http://localhost:3000/notify](http://localhost:3000/notify)

## Requisitos do sistema

- Docker
- Docker Compose

---

Projeto desenvolvido para a disciplina Sistemas Distribuídos, realizada na Universidade Federal de Lavras.
