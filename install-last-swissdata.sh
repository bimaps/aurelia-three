echo "Moving directory to aurelia-swissdata plugin"
cd ../
cd aurelia-swissdata
# READ LAST COMMIT HASH
read -r hash<.git/refs/heads/master
echo "Latest aurelia-swissdata git hash: $hash"
echo "Moving directory to aurelia-three plugin"
cd ../aurelia-three
echo "Updating package.json with latest git hash of aurelia-swissdata"
search='("aurelia-swissdata": ")(.*)#([a-z0-9]*)(")'
replace="\1\2#${hash}\4"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" -E "s/${search}/${replace}/g" "package.json"
else
  sed -i -E "s/${search}/${replace}/g" "package.json"
fi
sleep 1
echo "npm install to pull in the latest version of aurelia-swissdata"
rm -rf node_modules/aurelia-resources
rm -rf node_modules/aurelia-deco
rm -rf node_modules/aurelia-swissdata
rm package-lock.json
npm install
git add package.json package-lock.json
git commit -m "Bump aurelia-swissdata dependency"
git push origin
