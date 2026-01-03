# #!/usr/bin/env bash

# set -e

# FRONTEND_DIR="frontend"

# echo "🚀 Iniciando build do frontend..."

# # Verifica se o diretório existe
# if [ ! -d "$FRONTEND_DIR" ]; then
#   echo "❌ Diretório '$FRONTEND_DIR' não encontrado."
#   exit 1
# fi

# # Carrega o NVM
# export NVM_DIR="$HOME/.nvm"

# if [ -s "$NVM_DIR/nvm.sh" ]; then
#   # shellcheck source=/dev/null
#   . "$NVM_DIR/nvm.sh"
# else
#   echo "❌ NVM não encontrado em $NVM_DIR"
#   exit 1
# fi

# # Entra no frontend
# cd "$FRONTEND_DIR"

# # Verifica .nvmrc
# if [ ! -f ".nvmrc" ]; then
#   echo "❌ Arquivo .nvmrc não encontrado em $(pwd)"
#   exit 1
# fi

# NODE_VERSION=$(cat .nvmrc)
# echo "🔧 Usando Node.js: $NODE_VERSION"

# nvm install "$NODE_VERSION"
# nvm use "$NODE_VERSION"

# echo "🧩 Node ativo: $(node -v)"
# echo "📦 NPM ativo: $(npm -v)"

# # Instala dependências (opcional, mas recomendado em CI)
# if [ ! -d "node_modules" ]; then
#   echo "📥 node_modules não encontrado, instalando dependências..."
#   npm install
# fi

# # Executa build
# echo "🏗️ Executando npm run build..."
# npm run build

# echo "✅ Build do frontend finalizado com sucesso!"

#!/usr/bin/env bash

set -e

FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
DIST_DIR="$FRONTEND_DIR/dist"
STATIC_DIR="$BACKEND_DIR/static"
TEMPLATES_DIR="$BACKEND_DIR/templates"

echo "🚀 Iniciando build e deploy do frontend para Flask..."

# -----------------------------
# Valida diretórios
# -----------------------------
for DIR in "$FRONTEND_DIR" "$BACKEND_DIR" "$STATIC_DIR" "$TEMPLATES_DIR"; do
  if [ ! -d "$DIR" ]; then
    echo "❌ Diretório '$DIR' não encontrado."
    exit 1
  fi
done

# -----------------------------
# Carrega NVM
# -----------------------------
export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
else
  echo "❌ NVM não encontrado."
  exit 1
fi

# -----------------------------
# Build frontend
# -----------------------------
cd "$FRONTEND_DIR"

if [ ! -f ".nvmrc" ]; then
  echo "❌ .nvmrc não encontrado."
  exit 1
fi

NODE_VERSION=$(cat .nvmrc)
echo "🔧 Node.js: $NODE_VERSION"

nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"

[ ! -d "node_modules" ] && npm install

echo "🏗️ Executando build..."
VITE_CONF="vite.config.js"
# Verifica e descomenta temporariamente a opção `base` somente se estiver comentada
ORIGINAL_BASE_COMMENTED=0
if [ -f "$VITE_CONF" ]; then
  if grep -qE '^[[:space:]]*//[[:space:]]*base:' "$VITE_CONF"; then
    ORIGINAL_BASE_COMMENTED=1
    echo "🔧 Habilitando 'base' em $VITE_CONF (temporário)..."
    # remove apenas o leading // antes do base
    sed -i.bak -E 's|^[[:space:]]*//[[:space:]]*(base:[[:space:]]*"[^"]*",?)|  \1|' "$VITE_CONF" || true
  fi
fi

npm run build

# Após o build, restaura o comentário se originalmente estava comentado
if [ "$ORIGINAL_BASE_COMMENTED" = "1" ] && [ -f "$VITE_CONF" ]; then
  echo "🔧 Restaurando comentário de 'base' em $VITE_CONF..."
  sed -i.bak -E 's|^[[:space:]]*(base:[[:space:]]*"[^"]*",?)|// \1|' "$VITE_CONF" || true
  # remove arquivo de backup gerado pelo sed
  rm -f "$VITE_CONF.bak"
fi

cd ..

# -----------------------------
# Limpa destinos antigos
# -----------------------------
echo "🧹 Limpando arquivos antigos..."
rm -rf "$STATIC_DIR/assets"
rm -f "$TEMPLATES_DIR/index.html"

# -----------------------------
# Copia assets
# -----------------------------
echo "📁 Copiando assets..."
cp -R "$DIST_DIR/assets" "$STATIC_DIR/"

# -----------------------------
# Copia index.html
# -----------------------------
echo "📄 Copiando index.html..."
cp "$DIST_DIR/index.html" "$TEMPLATES_DIR/index.html"

# -----------------------------
# Ajusta paths para Flask
# -----------------------------
echo "🔧 Ajustando caminhos para Flask (url_for)..."

# sed -i \
#   -e "s|/assets/|{{ url_for('static', filename='assets/') }}|g" \
#   "$TEMPLATES_DIR/index.html"

echo "✅ Build e deploy concluídos com sucesso!"
