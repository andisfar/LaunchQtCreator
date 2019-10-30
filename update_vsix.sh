#!/usr/bin/env bash
script=`basename $0`
# update vsix package and move previous file to Releases
new_name=$1
old_names=$(ls ./latest/)

test -d ./Releases || mkdir ./Releases

for name in ${old_names}; do
    test "./latest/${name}" == "${new_name}" && {
        echo "remove old file with same name..."
        rm -f ${nme}
     } ||{
        echo "move previous file to ./Releases"
        mv ./latest/${name} ./Releases
     }
done

[ "${new_name}xx" == "xx" ] && {
    echo "specify new name";
    exit -1
}|| {
    echo "generating new package: '${new_name}'"
    vsce package -o ${new_name}
}
exit 0
