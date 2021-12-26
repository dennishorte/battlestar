rm dev/arti/*
rm dev/base/*
rm dev/city/*
rm dev/echo/*
rm dev/figs/*

node bin/compile_cards.js dev/cards_artifacts.txt dev/arti
node bin/compile_cards.js dev/cards_base_set.txt dev/base
node bin/compile_cards.js dev/cards_cities.txt dev/city
node bin/compile_cards.js dev/cards_echoes.txt dev/echo
node bin/compile_cards.js dev/cards_figures.txt dev/figs
