for card in $(ls echo/)
do
    if test ! -e "../res/echo/${card}"
    then
        cp "echo/$card" ../res/echo/
    fi
done
