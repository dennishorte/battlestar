#!/bin/bash

# Check if a directory argument was provided
if [ $# -lt 1 ]; then
    echo "Usage: $0 directory [file_extensions]"
    echo "Example: $0 /path/to/directory 'test.js'"
    exit 1
fi

DIRECTORY="$1"
FILE_EXTENSIONS=""

# Check if file extensions were provided
if [ $# -gt 1 ]; then
    FILE_EXTENSIONS=$(echo "$2" | tr ',' '|')
    FILE_EXTENSIONS="\.(${FILE_EXTENSIONS})$"
fi

# Counter for modified files
MODIFIED_COUNT=0

# Find files
if [ -z "$FILE_EXTENSIONS" ]; then
    FILES=$(find "$DIRECTORY" -type f)
else
    FILES=$(find "$DIRECTORY" -type f | grep -E "$FILE_EXTENSIONS")
fi

for FILE in $FILES; do
    # Skip binary files
    if file "$FILE" | grep -q "binary"; then
        continue
    fi
    
    # Check if the file contains lines with "this.expansion ="
    if grep -q "this\.expansion = \`" "$FILE"; then
        # Replace only if the value is not already "usee"
        perl -i -pe 's/(this\.expansion = \`)(?!usee\`)(.*?\`)/$1usee\`/g' "$FILE"
        
        # Check if any replacements were made
        if [ $? -eq 0 ]; then
            echo "Modified: $FILE"
            ((MODIFIED_COUNT++))
        fi
    fi
done

echo -e "\nTotal files modified: $MODIFIED_COUNT"
