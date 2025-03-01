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
    
    # Check if the file contains our pattern
    if grep -q "let request[0-9]* = game.run()" "$FILE"; then
        # Split "let requestX = game.run()" into two lines
        perl -i -pe 's/(let (request\d+)) = (game\.run\(\))/$1\n$2 = $3/g' "$FILE"
        
        echo "Modified: $FILE"
        ((MODIFIED_COUNT++))
    fi
done

echo -e "\nTotal files modified: $MODIFIED_COUNT"
