set -eu

indb="$1"
outdir="$2"

# for chunked mode, we need to know the database size in bytes beforehand
bytes="$(stat -f "%z" "$indb")"
# set chunk size to 10MiB (needs to be a multiple of the `pragma page_size`!)
serverChunkSize=$((10 * 1024 * 1024))
# serverChunkSize=$((5 * 4096 * 1024))
# serverChunkSize=$((1 * 10240 * 1024))
suffixLength=3
rm -f "$outdir/db.sqlite3"*
gsplit "$indb" --bytes=$serverChunkSize "$outdir/db.sqlite3." --suffix-length=$suffixLength --numeric-suffixes
# gsplit "$indb" --suffix-length=$suffixLength -d -b $serverChunkSize "$outdir/db.sqlite3."

# set request chunk size to match page size
requestChunkSize="$(sqlite3 "$indb" 'pragma page_size')"

# write a json config
echo '
{
    "serverMode": "chunked",
    "requestChunkSize": '$requestChunkSize',
    "databaseLengthBytes": '$bytes',
    "serverChunkSize": '$serverChunkSize',
    "urlPrefix": "db.sqlite3.",
    "suffixLength": '$suffixLength'
}
' > "$outdir/config.json"
