pack:
  npm run build
  npm run build:types
  rm -rf pub
  mkdir pub
  cp -r dist pub
  cp package.json pub
  cp README.md pub
  cp LICENSE pub
  cp CONTRIBUTING.md pub
  cp CODE_OF_CONDUCT.md pub
  cp SECURITY.md pub
  cd pub && npm pack

publish: pack
  cd pub && npm publish
