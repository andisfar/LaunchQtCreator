#!/usr/bin/env bash
script=`basename $0`
# update vsix package and move previous file to Releases
old_names=$(ls ./latest/)

test -d ./Releases || mkdir ./Releases

for name in ${old_names}; do
    test "./latest/${name}" == "./latest/${new_name}" && {
        echo "remove old file with same name..."
        rm -f ${nme}
     } ||{
        echo "move previous file to ./Releases"
        mv -f ./latest/${name} ./Releases
     }
done

echo "generating new package..."
vsce package
# echo "publishing..."
cat ../.extensions | vsce publish
echo "move new package into latest..."
mv *.vsix ./latest/
exit 0
