rm arti/*
rm base/*
rm city/*
rm echo/*
rm figs/*

node compile_cards.js cards_artifacts.txt arti
node compile_cards.js cards_base_set.txt base
node compile_cards.js cards_cities.txt city
node compile_cards.js cards_echoes.txt echo
node compile_cards.js cards_figures.txt figs
