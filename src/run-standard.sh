extract_script_section_to_new_file() {
  line_start=$(grep -n '<script lang="ts">' "$1" | cut -d : -f 1)
  line_end=$(grep -n '</script>' "$1" | cut -d : -f 1)

  awk "FNR>=$(($line_start+1)) && FNR<=$(($line_end-1))" "$1" > "$1.temp.ts"
}

find src -iname "*.vue" | while read file; do extract_script_section_to_new_file "$file"; done

npx ts-standard
exit_code=$?

find src -iname "*.vue.temp.ts" -delete

exit $exit_code
