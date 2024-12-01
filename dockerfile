# Usar uma imagem base do Node.js
FROM node:16

# Criar e definir o diretório de trabalho no container
WORKDIR /app

# Copiar apenas os arquivos necessários
COPY package*.json ./
COPY firebase-key.json ./ 

# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta da aplicação
EXPOSE 3000

# Definir o comando para rodar a aplicação
CMD ["node", "app.js"]
