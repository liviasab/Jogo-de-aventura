# Usamos uma imagem oficial do Node.js como base
FROM node:18-alpine 

# Definimos o diretório de trabalho dentro do container
WORKDIR /app

# Copiamos os arquivos package.json e package-lock.json para o container
COPY package*.json ./

# Instalamos as dependências
RUN npm install 

# Copiamos o restante dos arquivos do projeto para dentro do container
COPY . .

# Compilamos o projeto para produção
RUN npm run build 

# Usamos o servidor Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copiamos os arquivos compilados para a pasta de hospedagem do Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Expomos a porta 80 para acesso ao frontend
EXPOSE 80

# Iniciamos o Nginx
CMD ["nginx", "-g", "daemon off;"]
