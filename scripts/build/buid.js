const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Función auxiliar para ejecutar comandos y ver la salida en consola
const run = (command) => {
  console.log(`>> Ejecutando: ${command}`);
  execSync(command, { stdio: "inherit" });
};

// Función para copiar archivos/carpetas creando directorios si no existen
const copy = (src, dest) => {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Directorio creado: ${destDir}`);
  }

  // Si es una carpeta (dist), usamos cp con recursividad
  if (fs.lstatSync(src).isDirectory()) {
    // En Node 16.7+ podemos usar fs.cpSync, pero para máxima compatibilidad:
    if (process.platform === "win32") {
      execSync(`xcopy /E /I /Y "${src}" "${dest}"`, { stdio: "ignore" });
    } else {
      execSync(`cp -r ${src} ${dest}`);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
  console.log(`Copiado: ${src} -> ${dest}`);
};

try {
  console.log("--- Iniciando proceso de Build ---\n");

  // 1. Ejecutar builds de NPM
  run("npm run build --prefix frontend");
  run("npm run build --prefix backend");

  console.log("\n--- Organizando archivos en /Build ---");

  copy("frontend/dist", "Build/frontend/dist");
  copy("backend/dist", "Build/backend/dist");

  // 3. Copiar archivos específicos
  copy("backend/package.json", "Build/backend/package.json");
  copy("scripts/build/package.json", "Build/package.json");
  copy("scripts/build/proxy.js", "Build/proxy.js");

  console.log("\n¡Proceso finalizado con éxito! 🎉");
} catch (error) {
  console.error("\n❌ Error durante el build:", error.message);
  process.exit(1);
}
