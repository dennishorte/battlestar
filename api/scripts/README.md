# API Scripts

This directory contains various utility scripts for the API.

## Card Processing Scripts

### fetch_scryfall_cards.js

Downloads the latest card data from Scryfall and processes it for use in the application.

Usage:
```
node fetch_scryfall_cards.js [--use-cache]
```

Arguments:
- `--use-cache`: Use the latest cached file instead of downloading from Scryfall

### process_card.js

Processes a single card JSON file using the card formatting logic.

Usage:
```
node process_card.js <input_file> [output_file]
```

Arguments:
- `input_file`: Path to JSON file containing a single card object
- `output_file`: (Optional) Path to write the processed card JSON. If not provided, output is written to stdout.

### process_custom_cards.js

Processes a collection of custom cards, ensuring they are formatted consistently with Scryfall cards.

Usage:
```
node process_custom_cards.js [input_file] [output_file]
```

Arguments:
- `input_file`: (Optional) Path to JSON file containing custom cards. Default is './cards.json'
- `output_file`: (Optional) Path to write the processed cards JSON. Default is './processed_cards.json'

This script is useful for processing custom cards that need to be formatted in the same way as cards from Scryfall. It ensures all necessary fields are present and correctly formatted.

## Testing

The card processing logic can be tested using the test suite located in `tests/scripts/fetch_scryfall_cards.test.js`. The tests load test fixtures from disk rather than embedding test data in the files, which allows for testing with large, real-world card data.

To run the tests:

```
npm test tests/scripts/fetch_scryfall_cards.test.js
```

### Test Fixtures

The `test_fixtures` directory contains example card data for testing:

- `basic_card.json`: A simple card (Lightning Bolt)
- `double_faced_card.json`: A double-faced card (Delver of Secrets)
- `filtered_card.json`: A card that should be filtered out (Art Series)
- `basic_card_expected.json`: Expected output after processing the basic card
- `double_faced_card_expected.json`: Expected output after processing the double-faced card

### Creating Your Own Tests

You can create your own test fixtures by:

1. Creating a JSON file with the input card data
2. Running the processing utility to generate the expected output
3. Comparing the two files

Example workflow:
```
# First create your input card JSON file
# Then run the processor to generate the expected output
node process_card.js test_fixtures/my_card.json test_fixtures/my_card_expected.json

# Add a test in tests/scripts/fetch_scryfall_cards.test.js that loads and compares these files
```

You can also use real card data from the Scryfall API for more thorough testing.

## Card Processing Logic

The card processing pipeline consists of several stages:

1. **Pre-filtering**: Removes cards that don't meet initial criteria (non-English, art cards, etc.)
2. **Cleaning**: Processes card data for consistency (adjusting faces, cleaning image URIs, etc.)
3. **Post-filtering**: Removes cards that don't meet final criteria (cards with 'Card' in the type line, etc.)
4. **Formatting**: Adds metadata for database storage

Each step can be tested individually by importing the specific functions from `fetch_scryfall_cards.js`. 