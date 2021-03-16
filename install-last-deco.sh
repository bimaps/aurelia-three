echo "Moving directory to aurelia-deco plugin"
cd ../
cd aurelia-deco
# READ LAST COMMIT HASH
read -r hash<.git/refs/heads/master
echo "Latest aurelia-deco git hash: $hash"
echo "Moving directory to aurelia-three plugin"
cd ../aurelia-three
echo "Updating package.json with latest git hash of aurelia-deco"
search='("aurelia-deco": ")(.*)#([a-z0-9]*)(")'
replace="\1\2#${hash}\4"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" -E "s/${search}/${replace}/g" "package.json"
else
  sed -i -E "s/${search}/${replace}/g" "package.json"
fi
sleep 1
echo "Remove ref to 'aurelia-deco' in 'package-lock.json'"
echo "`jq 'del(.dependencies."aurelia-deco")' package-lock.json`" > package-lock.json
echo "Remove 'aurelia-resources' in node_modules"
rm -rf node_modules/aurelia-resources
echo "Remove 'aurelia-deco' in node_modules"
rm -rf node_modules/aurelia-deco
echo "npm install to pull in the latest version of aurelia-deco"
npm install
git add package.json package-lock.json
git commit -m "Bump aurelia-deco dependency"
git push origin
