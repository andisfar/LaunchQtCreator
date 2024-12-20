#!/usr/bin/env bash
script=`basename $0`
# update vsix package and move previous file to Releases
old_names=$(ls ./latest/)

test -d ./Releases || mkdir ./Releases

for name in ${old_names[@]}; do
    echo "move previous file to ./Releases"
    mv -f ./latest/${name} ./Releases
done

echo -n "generating new package..."
vsce package &> /dev/null
echo "done"

echo "publishing..."
cat .extensions | vsce publish
echo "done"

echo -n "move new package into latest..."
mv *.vsix ./latest/
echo "done"

exit 0
