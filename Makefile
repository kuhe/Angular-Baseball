.PHONY: test career serve

# Unit test the baseball engine.
test:
	(cd app/client && make test)

# alias for test.
career: test

# build everything and move to deployment location.
build:
	(cd app/client && make css deploy)
deploy: build

# run the app locally after having run "build".
serve:
	simplehttpserver .
