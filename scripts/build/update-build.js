const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// --- CONFIGURATION ---
const REPO = "MagincyanGames/PokemonLayout"; 
const TEMP_ZIP = "release_temp.zip";

const PATHS_TO_CLEAN = [
    './frontend/dist',
    './backend/dist',
    './backend/package.json'
];

const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO}/releases/latest`,
    headers: { 'User-Agent': 'NodeJS-Script' }
};

console.log("🔍 Buscando última release estable...");

https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const release = JSON.parse(data);
        if (!release.assets) {
            console.error("❌ Error: No se pudo acceder a la release. Revisa el nombre del repo o el token.");
            return;
        }
        
        const asset = release.assets.find(a => a.name.endsWith('.zip'));
        if (!asset) {
            console.error("❌ No se encontró un archivo .zip en la release.");
            return;
        }

        console.log(`📥 Descargando: ${asset.name}...`);
        const file = fs.createWriteStream(TEMP_ZIP);
        
        downloadFile(asset.browser_download_url, file, () => {
            console.log("🧹 Limpiando contenido anterior...");
            
            PATHS_TO_CLEAN.forEach(p => {
                if (fs.existsSync(p)) {
                    // rmSync con recursive borra carpetas; si es archivo, simplemente lo borra
                    fs.rmSync(p, { recursive: true, force: true });
                    console.log(`   - Borrado: ${p}`);
                }
            });

            console.log("📦 Aplicando nueva build...");
            try {
                // Extraemos el zip en la raíz
                execSync(`tar -xf ${TEMP_ZIP} -C ./`);
                console.log("✨ Estructura actualizada y limpia.");
            } catch (err) {
                console.error("❌ Error al descomprimir:", err.message);
            } finally {
                if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
            }
        });
    });
});

function downloadFile(url, file, callback) {
    https.get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
            downloadFile(res.headers.location, file, callback);
        } else {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                callback();
            });
        }
    });
}