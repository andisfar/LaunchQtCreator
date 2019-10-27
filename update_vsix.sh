#!/usr/bin/env bash
script=`basename $0`
# update vsix package and move previous file to Releases
new_name=$1
old_names=$(ls ./latest/)

for name in ${old_names}; do
    mv ./latest/${name} ./Releases
done

[ "${new_name}xx" == "xx" ] && { 
    echo "specify new name"; 
    exit -1
}|| {
    vsce package -o ${new_name}
}
exit 0