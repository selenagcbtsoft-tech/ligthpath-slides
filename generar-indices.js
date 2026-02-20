const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
// Listamos el directorio actual
const items = fs.readdirSync(rootDir, { withFileTypes: true });

// Excluimos carpetas ocultas (como .git, .gemini) o carpetas no relevantes
const directories = items.filter(item =>
    item.isDirectory() &&
    !item.name.startsWith('.') &&
    item.name !== 'node_modules'
);

// Generamos index para cada carpeta
directories.forEach(dir => {
    const dirPath = path.join(rootDir, dir.name);
    const dirItems = fs.readdirSync(dirPath, { withFileTypes: true });

    // Obtenemos todos los archivos HTML dentro de esta carpeta (excluyendo el propio index.html que vamos a crear)
    const htmlFiles = dirItems.filter(item =>
        item.isFile() &&
        item.name.endsWith('.html') &&
        item.name !== 'index.html'
    );

    // Si hay archivos HTML, creamos un index.html interno
    if (htmlFiles.length > 0) {
        let links = htmlFiles.map(file => {
            // Formateamos el nombre del archivo para que se vea más bonito
            let name = file.name.replace('.html', '').replace(/_/g, ' ');
            return `
            <a href="${file.name}" class="list-item">
                <div class="icon-container">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <span>${name}</span>
            </a>`;
        }).join('\n');

        let htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Archivos en ${dir.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: #0d1117; color: #c9d1d9; line-height: 1.6; padding: 2rem; min-height: 100vh;}
        .container { max-width: 800px; margin: 0 auto; }
        .back-link { display: inline-flex; align-items: center; color: #58a6ff; text-decoration: none; margin-bottom: 2rem; transition: color 0.3s; font-weight: 600; padding: 0.5rem 1rem; background: rgba(88, 166, 255, 0.1); border-radius: 8px; border: 1px solid rgba(88, 166, 255, 0.2);}
        .back-link:hover { color: #fff; background: rgba(88, 166, 255, 0.2); }
        .back-link svg { width: 20px; height: 20px; margin-right: 8px; }
        h1 { font-size: 2.5rem; font-weight: 600; color: #fff; margin-bottom: 2rem; display: flex; align-items: center; gap: 12px;}
        .list { display: flex; flex-direction: column; gap: 1rem; }
        .list-item { display: flex; align-items: center; padding: 1.25rem; background: #161b22; border: 1px solid #30363d; border-radius: 12px; color: #c9d1d9; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .list-item:hover { transform: translateX(8px); background: #21262d; border-color: #58a6ff; box-shadow: 0 4px 20px rgba(88,166,255,0.15); color: #fff;}
        .icon-container { padding: 10px; background: rgba(88, 166, 255, 0.1); border-radius: 8px; margin-right: 16px; color: #58a6ff; transition: all 0.3s; }
        .list-item:hover .icon-container { background: #58a6ff; color: #fff; }
        .icon-container svg { width: 24px; height: 24px; display: block;}
        .list-item span { font-size: 1.1rem; text-transform: capitalize; }
        
        /* Gradient bg */
        .bg-mesh { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; background: radial-gradient(circle at 0% 0%, rgba(88, 166, 255, 0.08), transparent 40%); pointer-events: none;}
    </style>
</head>
<body>
    <div class="bg-mesh"></div>
    <div class="container">
        <a href="../index.html" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver al Menú Principal
        </a>
        <h1>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            Carpeta: ${dir.name}
        </h1>
        <div class="list">
            ${links}
        </div>
    </div>
</body>
</html>`;
        fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent);
    }
});

// Ahora generamos el index de la raíz (el menú principal)
let folderCards = directories.map(dir => {
    return `
            <a href="${dir.name}/" class="card">
                <div class="card-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                </div>
                <div class="card-content">
                    <h2>${dir.name}</h2>
                    <p>Accede para explorar las lecciones y archivos HTML dentro.</p>
                </div>
                <div class="card-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </a>`;
}).join('\n');

const rootHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Índice de Carpetas - Repositorio General</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0d1117; --accent-color: #58a6ff; --text-color: #c9d1d9; --text-title: #ffffff;
            --card-bg: #161b22; --card-border: #30363d; --card-hover-border: #8b949e; --card-hover-bg: #21262d;
            --transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background-color: var(--bg-color); color: var(--text-color); min-height: 100vh; overflow-x: hidden; position: relative; }
        
        .bg-gradient { 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; 
            background: radial-gradient(circle at 15% 50%, rgba(88, 166, 255, 0.12), transparent 30%), 
                        radial-gradient(circle at 85% 30%, rgba(163, 113, 247, 0.12), transparent 30%); 
            animation: gradientMove 15s ease-in-out infinite alternate; pointer-events: none;
        }
        @keyframes gradientMove { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; width: 100%; }
        
        header { margin-bottom: 5rem; text-align: center; }
        header h1 { color: var(--text-title); font-size: 3.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 1.5rem; background: linear-gradient(90deg, #58a6ff, #a371f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; }
        header p { font-size: 1.2rem; max-width: 600px; margin: 0 auto; color: var(--text-color); opacity: 0.85; font-weight: 300; line-height: 1.6;}
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        
        .card { background-color: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 2.5rem 2rem; text-decoration: none; color: var(--text-color); display: flex; flex-direction: column; position: relative; overflow: hidden; transition: var(--transition); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
        .card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, #58a6ff, #a371f7); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
        .card:hover { transform: translateY(-8px); background-color: var(--card-hover-bg); border-color: var(--card-hover-border); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4); }
        .card:hover::before { transform: scaleX(1); }
        
        .card-icon { width: 56px; height: 56px; background: rgba(88, 166, 255, 0.1); color: var(--accent-color); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; transition: var(--transition); }
        .card-icon svg { width: 28px; height: 28px; }
        .card:hover .card-icon { background: var(--accent-color); color: #fff; transform: scale(1.1) rotate(-5deg); box-shadow: 0 8px 16px rgba(88,166,255,0.3);}
        
        .card-content h2 { color: var(--text-title); font-size: 1.6rem; font-weight: 600; margin-bottom: 0.75rem; text-transform: capitalize; }
        .card-content p { font-size: 1rem; line-height: 1.5; color: #8b949e; }
        
        .card-arrow { position: absolute; bottom: 2.5rem; right: 2rem; color: var(--accent-color); opacity: 0; transform: translateX(-15px); transition: var(--transition); }
        .card-arrow svg { width: 24px; height: 24px; }
        .card:hover .card-arrow { opacity: 1; transform: translateX(0); }
        
        .instructions { margin-top: 6rem; padding-top: 4rem; border-top: 1px dashed var(--card-border); text-align: center; }
        .instructions h3 { color: var(--text-title); margin-bottom: 1rem; font-weight: 600; font-size: 1.5rem;}
        .instructions p { color: #8b949e; font-size: 1rem; margin-bottom: 2rem; max-width: 650px; margin-left: auto; margin-right: auto; line-height: 1.6;}
        .alert { display: inline-flex; align-items: center; gap: 12px; padding: 1rem 1.5rem; background: rgba(88, 166, 255, 0.1); border-left: 4px solid #58a6ff; border-radius: 0 8px 8px 0; color: #c9d1d9; text-align: left; margin-bottom: 2rem; }
        .alert svg { color: #58a6ff; }
        .code-block { background: #010409; border: 1px solid var(--card-border); border-radius: 8px; padding: 1.25rem 2rem; display: inline-block; font-family: monospace; color: #7ee787; font-size: 1.1rem; box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);}
        
        /* Empty state */
        .empty-state { text-align: center; padding: 4rem 0; color: #8b949e; }
        .empty-state svg { width: 64px; height: 64px; margin-bottom: 1rem; color: #30363d; }
    </style>
</head>
<body>
    <div class="bg-gradient"></div>
    <main class="container">
        <header>
            <h1>Repositorio General</h1>
            <p>Explora el directorio de todas las carpetas del repositorio. Haz clic en cualquiera de ellas para ver sus HTMLs y lecciones disponibles.</p>
        </header>
        
        ${folderCards.length > 0 ?
        '<div class="grid" id="folder-grid">\n' + folderCards + '\n</div>' :
        '<div class="empty-state">\n<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>\n<h2>No hay carpetas todavía</h2>\n<p>Crea carpetas con archivos HTML dentro para que aparezcan aquí.</p>\n</div>'}

        <div class="instructions">
            <h3>¿Cómo actualizar este índice?</h3>
            <div class="alert">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Hay un script automático llamado <strong>generar-indices.js</strong> en esta carpeta.</span>
            </div>
            <p>Cada vez que agregues una nueva carpeta o añadas nuevos archivos HTML a las existentes, ejecuta el script en tu terminal. Esto regenerará este índice y los índices internos automáticamente:</p>
            <div class="code-block">
                node generar-indices.js
            </div>
        </div>
    </main>
</body>
</html>`;

fs.writeFileSync(path.join(rootDir, 'index.html'), rootHtml);
console.log('¡Índices generados correctamente! Abre index.html para ver el resultado.');
