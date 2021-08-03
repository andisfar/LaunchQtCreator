#!/usr/bin/env bash
script=`basename $0`
# update vsix package and move previous file to Releases
old_names=$(ls ./latest/)

test -d ./Releases || mkdir ./Releases

for name in ${old_names[@]}; do
    test "./latest/${name}" == "./latest/${new_name}" && {
        echo "remove old file with same name..."
        rm -f ${name}
     } ||{
        echo "move previous file to ./Releases"
        mv -f ./latest/${name} ./Releases
     }
done

echo -n "generating new package..."
vsce package &> /dev/null
echo "done"

echo -n "publishing..."
cat ../.extensions | vsce publish &> /dev/null
echo "done"

echo -n "move new package into latest..."
mv *.vsix ./latest/
echo "done"

exit 0
