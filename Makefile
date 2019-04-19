.PHONY: test career serve

test:
	(cd app/client && make test)

career: test

serve:
	simplehttpserver .
