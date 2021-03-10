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
echo "npm install to pull in the latest version of aurelia-deco"
rm -rf node_modules/aurelia-resources
rm -rf node_modules/aurelia-deco
rm package-lock.json
npm install
git add package.json package-lock.json
git commit -m "Bump aurelia-deco dependency"
git push origin
