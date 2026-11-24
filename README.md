# Invitacion de boda

Pagina estatica para la invitacion de Rober y Eli.

## Archivos principales

- `index.html`: portada con el tocadiscos.
- `Inicio.html`: invitacion principal.
- `assets/css/`: hojas de estilo separadas.
- `assets/js/`: logica JavaScript separada.
- `assets/images/`: fotografias e imagenes.
- `assets/media/`: musica.
- `assets/support/`: archivos auxiliares conservados del sitio original.

## Vista local

```bash
python -m http.server 8080
```

Luego abre <http://localhost:8080/>.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` publica el sitio automáticamente en cada push a `main`.

URL: <https://cristian23988.github.io/invitaciones/>

El despliegue incluye las dos páginas, el calendario y los directorios CSS, imágenes, JavaScript y música. Los archivos auxiliares de `assets/support/` no se publican.