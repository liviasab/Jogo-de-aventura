# Usar a imagem base do Node.js
FROM node:latest

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta em que o backend está rodando
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["node", "server.js"]
