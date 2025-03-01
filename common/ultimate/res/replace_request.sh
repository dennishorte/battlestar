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
    
    # Check if the file contains any requestX
    if grep -q "request[0-9]" "$FILE"; then
        # Add "let request" at the beginning of the file, before any other code
        # Only if it doesn't already have it
        if ! grep -q "let request" "$FILE"; then
            # Create a temporary file with "let request" at the top
            TEMP_FILE=$(mktemp)
            # Find the proper insertion point (first non-comment, non-empty line)
            LINE_NUM=$(grep -n -m 1 -v "^\s*\/\/" "$FILE" | cut -d: -f1)
            
            if [ -z "$LINE_NUM" ]; then
                # If no non-comment line found, just put it at the top
                echo "let request" > "$TEMP_FILE"
                cat "$FILE" >> "$TEMP_FILE"
            else
                # Insert at the determined position
                head -n $((LINE_NUM-1)) "$FILE" > "$TEMP_FILE"
                echo "let request" >> "$TEMP_FILE"
                tail -n +$LINE_NUM "$FILE" >> "$TEMP_FILE"
            fi
            
            mv "$TEMP_FILE" "$FILE"
        fi
        
        # Replace "let requestX =" with "request ="
        perl -i -pe 's/let request\d+ =/request =/g' "$FILE"
        
        # Replace all other instances of requestX with request
        perl -i -pe 's/request\d+/request/g' "$FILE"
        
        echo "Modified: $FILE"
        ((MODIFIED_COUNT++))
    fi
done

echo -e "\nTotal files modified: $MODIFIED_COUNT"
