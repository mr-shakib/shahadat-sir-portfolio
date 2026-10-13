#!/usr/bin/env bash
# Nightly backup of the site's database. Photos and PDFs uploaded in the admin are stored in
# Postgres too, so this one dump holds all edited content.
#
# BACKUP_DIR and BACKUP_RETENTION_DAYS (default 14) can be set in the environment.
#
#   crontab -e:  30 2 * * * /home/shakib/shahadat-portfolio/deploy/backup.sh >> /home/shakib/shahadat-backup.log 2>&1
#
# Restore a dump into the running stack (replaces the current content):
#   docker compose -f deploy/docker-compose.prod.yml exec -T db \
#     pg_restore -U portfolio -d portfolio --clean --if-exists < /var/backups/shahadat-portfolio/<file>.dump

set -euo pipefail
cd "$(dirname "$0")"

DIR="${BACKUP_DIR:-/var/backups/shahadat-portfolio}"
KEEP_DAYS="${BACKUP_RETENTION_DAYS:-14}"
FILE="$DIR/shahadat-$(date +%Y%m%d-%H%M%S).dump"
trap 'rm -f "$FILE.partial"' EXIT
compose() { docker compose -f docker-compose.prod.yml "$@"; }
log() { echo "$(date '+%F %T')  $*"; }

compose exec -T db pg_dump -U portfolio -d portfolio -Fc > "$FILE.partial"
# A dump pg_restore can't list is broken; keep the previous ones and fail loudly.
compose exec -T db pg_restore --list < "$FILE.partial" > /dev/null
mv "$FILE.partial" "$FILE"
log "wrote $FILE ($(du -h "$FILE" | cut -f1))"

pruned="$(find "$DIR" -maxdepth 1 -name 'shahadat-*.dump' -mtime "+$KEEP_DAYS" -print -delete | wc -l)"
log "pruned $pruned backup(s) older than $KEEP_DAYS days; $(find "$DIR" -maxdepth 1 -name 'shahadat-*.dump' | wc -l) kept"
